'use strict'
const path = require('path')
const fs = require('fs')
const Serverless = require('serverless')
const Promise = require('bluebird')
const { wrap } = require('lambda-wrapper')
const assert = require('assert')

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
    this.serverless = new Serverless(config)
    return this.serverless.init().then(() => {
      this.serverless.variables.populateService().then(() => {
        this.serverless.service.setFunctionNames({})
        this.serverless.service.mergeResourceArrays()
        this.serverless.service.validate()
      })
    })
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
        let httpEvent = httpEvents.find(e => e.matcher.test(httpRequest))
        if (!httpEvent) {
          throw new Error(`Serverless http event not found for HTTP request "${httpRequest}".`)
        }
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
      f.events = f.events.map(e => {
        // add a path parser regex:
        RegExp.escape = function (s) { // https://stackoverflow.com/a/3561711/51061
          return s.replace(/[-/\\^$*+?.()|[\]]/g, '\\$&')
        }
        let path = null
        let method = null
        if (typeof e.http === 'object') {
          path = e.http.path
          method = e.http.method
        } else {
          assert(typeof e.http === 'string', `Expected http event to have a type of object or string but was ${typeof e.http}.`)
          method = e.http.split(' ')[0]
          path = e.http.split(' ')[1]
        }

        let pattern = RegExp.escape(path)
        pattern = pattern.replace(/\/\{[^}]*\}/gi, '/[^/]*')
        let r = new RegExp('^' + method + '\\s+' + pattern, 'gi')
        // console.log('path:', path, 'pattern:', pattern, 'r:', r)
        return Object.assign(e.http, { matcher: r })
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
