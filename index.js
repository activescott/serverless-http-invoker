'use strict'
const path = require('path')
const fs = require('fs')
const Serverless = require('serverless')
const Promise = require('bluebird')
const { wrap } = require('lambda-wrapper')
const assert = require('assert')
const { URL } = require('url')
const querystring = require('querystring')

class ServerlessInvoker {
  /**
   * Initializes an instance of the class.
   * @param {*string} servicePath Path to the directory containing the serverless file.
   */
  constructor (servicePath) {
    this.servicePath = servicePath || this.findServicePath()
    this.serverless = null
    this.serverlessEvents = null
  }

  findServicePath () {
    let dir = process.cwd()
    while (dir !== '/' && !fs.existsSync(path.join(dir, 'serverless.yml'))) {
      console.log('dir:', dir)
      dir = path.dirname(dir)
    }
    if (dir === '/') {
      throw new Error('cannot find serverless.yml')
    }
    return dir
  }

  initializeServerless () {
    const config = {
      'servicePath': this.servicePath
    }
    if (!this.serverless) {
      const sls = new Serverless(config)
      return sls.init().then(() => {
        return sls.variables.populateService().then(() => {
          sls.service.setFunctionNames({})
          sls.service.mergeResourceArrays()
          sls.service.validate()
          this.serverless = sls
        })
      })
    } else {
      return Promise.resolve()
    }
  }

  /**
   * Invokes the serverless function bound to the HTTP event with the provided specification.
   * @param {*string} httpRequest A method+path like 'GET api/users/me'.
   * @param {*object} event The event that should be submitted to the http endpoint.
   * @param {*object} context The context passed to the lambda function
   */
  invoke (httpRequest, event, context) {
    // Read the serverless.yml file
    return this.initializeServerless()
      .then(() => this.loadServerlessEvents())
      .then(httpEvents => {
        // find the event that matches the specified httpRequest
        let httpEvent = httpEvents.find(e => e.test(httpRequest))
        if (!httpEvent) {
          throw new Error(`Serverless http event not found for HTTP request "${httpRequest}".`)
        }

        event = Object.assign({}, event, {
          pathParameters: ServerlessInvoker.parsePathParameters(httpEvent, httpRequest),
          queryStringParameters: ServerlessInvoker.parseQueryStringParameters(httpRequest)
        })

        return this.loadServerlessEnvironment().then(() => {
          return this.invokeWithLambdaWrapper(httpEvent, event, context).then(response => {
            if (response &&
                response.headers &&
                Object.keys(response.headers).includes('Content-Type') &&
                response.headers['Content-Type'] === 'application/json'
              ) {
              if (response.body && typeof response.body === 'string') {
                response.body = JSON.parse(response.body)
              }
            }
            return response
          })
        })
      })
  }

  static parsePathParameters (httpEvent, httpRequest) {
    let pathParamValues = httpEvent.matcher.exec(httpRequest) || []
    if (pathParamValues.length > 0) {
      pathParamValues = pathParamValues.slice(1)
    }
    const pathParametersMap = {}
    assert(httpEvent.pathParamNames.length === pathParamValues.length, `expected param names and param values to have same length, but were: \n\tnames: ${JSON.stringify(httpEvent.pathParamNames)}\n\t!==\n\tvalues: ${JSON.stringify(pathParamValues)}`)
    for (let i = 0; i < httpEvent.pathParamNames.length; i++) {
      let paramName = httpEvent.pathParamNames[i]
      pathParametersMap[paramName] = pathParamValues[i]
    }
    return pathParametersMap
  }

  static parseQueryStringParameters (requestUrl) {
    const myURL = new URL('https://fakehost.com/' + requestUrl.split(' ')[1])
    const search = myURL.search.length > 0 ? myURL.search.slice(1) : myURL.search
    return querystring.parse(search)
  }

  loadServerlessEnvironment () {
    return Promise.try(() => {
      let env = this.serverless.service.provider.environment
      Object.assign(process.env, env)
      return env
    })
  }

  invokeWithLambdaWrapper (httpEvent, event, context) {
    return Promise.try(() => {
      let handlerModule = require(path.join(this.servicePath, httpEvent.handlerPath))
      let lambda = wrap(handlerModule, {handler: httpEvent.handlerName})
      lambda = Promise.promisifyAll(lambda)
      return lambda.runHandler(event, context || {})
    })
  }

  loadServerlessEvents () {
    let funcs = this.serverless.service.getAllFunctions().map(fname => {
      let funcObj = this.serverless.service.getFunction(fname)
      let events = this.serverless.service.getAllEventsInFunction(fname) || []
      let f = {
        name: fname,
        handler: funcObj.handler,
        events: events.filter(e => Object.keys(e).includes('http') && e.http !== null)
      }
      return f
    })
    .filter(f => f.events.length > 0)
    .map(f => {
      f.events = f.events.map(evt => {
        // add a path parser regex:
        RegExp.escape = function (s) { // https://stackoverflow.com/a/3561711/51061
          return s.replace(/[-/\\^$*+?.()|[\]]/g, '\\$&')
        }
        let path = null
        let method = null
        if (typeof evt.http === 'object') {
          path = evt.http.path
          method = evt.http.method
        } else {
          assert(typeof evt.http === 'string', `Expected http event to have a type of object or string but was ${typeof evt.http}.`)
          method = evt.http.split(' ')[0]
          path = evt.http.split(' ')[1]
        }
        let pattern = RegExp.escape(path)
        // collect the pathParamNames:
        //  first the "greedy" path params like {pname+} (with a '+' postfix)
        let matchPathParamNamesPattern = pattern.replace(/\/\{[^}]*\+\}/gi, '/(.*)')
        //  then the normal path params
        matchPathParamNamesPattern = pattern.replace(/\/\{[^}]*\}/gi, '/([^/]*)')
        let matchPathParamNames = new RegExp(matchPathParamNamesPattern, 'gi')
        let pathParamNames = matchPathParamNames.exec(path).slice(1) // the first element is full matched text so slice it off
        // remove the surrounding bracket characters:
        pathParamNames = pathParamNames.map(p => p.replace(/^\{([^}]+)\}$/, '$1'))
        // remove the '+' postfix if it exists
        pathParamNames = pathParamNames.map(p => p.endsWith('+') ? p.substring(0, p.length - 1) : p)
        // console.log('pathParamNames:', pathParamNames, 'path:', path)
        // now collect the values for the params:
        let optionalQueryStringPattern = '(?:\\?.*)?$'
        // first match greedy, then the normal ones again:
        let matchPathParamValuesPattern = pattern.replace(/\/\{[^}]*\+\}/gi, '/(.+)')
        matchPathParamValuesPattern = matchPathParamValuesPattern.replace(/\/\{[^}]*\}/gi, '/([^/\\?]+)')
        let matcher = new RegExp('^' + method + '\\s+' + matchPathParamValuesPattern + optionalQueryStringPattern, 'i')
        // console.log('path:', path, 'matcher:', matcher)
        return Object.assign(evt.http, {
          matcher: matcher,
          pathParamNames: pathParamNames,
          test: request => {
            const result = matcher.test(request)
            // console.log(`${method} ${path}: ${request} == ${result} \n  pattern:${matcher.source}`)
            return result
          }
        })
      })
      return f
    })

    let events = []
    for (let f of funcs) {
      for (let e of f.events) {
        e.function = f.name
        e.handlerPath = f.handler.split('.')[0]
        e.handlerName = f.handler.split('.')[1]
        events.push(e)
      }
    }
    return Promise.resolve(events)
  }
}

module.exports = ServerlessInvoker
