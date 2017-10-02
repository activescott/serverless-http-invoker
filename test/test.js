/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */
'use strict'
require('./support/setup.js')
const expect = require('chai').expect

const ServerlessInvoker = require('../index')

const path = require('path')

describe('serverless-http-invoker', function () {
  let sls = new ServerlessInvoker(path.join(__dirname, 'data/basic'))

  it('should invoke simple path', function () {
    let response = sls.invoke('GET api/hello')
    return expect(response).to.eventually.have.property('statusCode', 200)
  })

  it('should invoke path with params', function () {
    let response = sls.invoke('GET api/hello/world')
    return expect(response).to.eventually.have.property('statusCode', 200)
  })

  it('should invoke path with shorthand', function () {
    let response = sls.invoke('GET api/shorthand')
    return expect(response).to.eventually.have.property('statusCode', 200)
  })

  it('should invoke path with multiple params', function () {
    let response = sls.invoke('GET api/res1/1111/res2/2222')
    return expect(response).to.eventually.have.property('statusCode', 200)
  })

  it('should parse json response body', function () {
    let response = sls.invoke('GET api/hello')
    expect(response).to.eventually.have.property('statusCode', 200)
    return expect(response).to.eventually.have.deep.nested.property('body.message', 'Go Serverless v1.0! Your function executed successfully!')
  })

  it('should load environment', function () {
    let response = sls.invoke('GET api/env')
    expect(response).to.eventually.have.property('statusCode', 200)
    return expect(response).to.eventually.have.deep.nested.property('body.message', 'process.env.MY_SIMPLE==simple value')
  })

  it('should pass data to POST', function () {
    let response = sls.invoke('POST api/postit', {body: 'boo'})
    return expect(response).to.eventually.have.deep.property('body', {message: 'postit:boo'})
  })

  it('should pass pathParameters with values when present', function () {
    let response = sls.invoke('GET api/res1/xxx/res2/yyy')
    return response.then(resp => {
      return expect(resp.body.input).to.have.deep.property('pathParameters', {
        res1ID: 'xxx',
        res2ID: 'yyy'
      })
    })
  })

  it('should pass pathParameters along with existing event too', function () {
    let response = sls.invoke('GET api/res1/xxx/res2/yyy', {requestPayload: 'boo'})
    return response.then(resp => {
      expect(resp.body).to.have.property('input')
      expect(resp.body.input).to.have.deep.property('pathParameters', {
        res1ID: 'xxx',
        res2ID: 'yyy'
      })
      expect(resp.body.input).to.have.property('requestPayload', 'boo')
    })
  })

  it('should pass pathParameters empty when not present', function () {
    let response = sls.invoke('GET api/hello')
    return response.then(resp => {
      return expect(resp.body.input).to.have.deep.property('pathParameters', {})
    })
  })

  it('should pass greedy path params', function () {
    let response = sls.invoke('GET api/greedy/blah/blah/blah')
    return response.then(resp => {
      return expect(resp.body.input).to.have.deep.property('pathParameters', {
        'money': 'blah/blah/blah'
      })
    })
  })

  it('should pass queryStringParameters with values when present', function () {
    let response = sls.invoke('GET api/with_querystring_params?p1=val1&p2=val2')
    return response.then(resp => {
      return expect(resp.body.input).to.have.deep.property('queryStringParameters', {
        p1: 'val1',
        p2: 'val2'
      })
    })
  })

  it('should pass queryStringParameters even when not present', function () {
    let response = sls.invoke('GET api/with_querystring_params')
    return response.then(resp => {
      return expect(resp.body.input).to.have.deep.property('queryStringParameters', {})
    })
  })

  it('should match urls with query strings and path params in url', function () {
    let response = sls.invoke('GET api/with_querystring_params_and_pathparams/ppvalue?qs1=qsval1')
    return response.then(resp => {
      expect(resp.body.input).to.have.deep.property('queryStringParameters', {qs1: 'qsval1'})
      return expect(resp.body.input).to.have.deep.property('pathParameters', {pathparam1: 'ppvalue'})
    })
  })

})
