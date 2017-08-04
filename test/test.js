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
    return expect(response).to.eventually.have.deep.property('body', {message: 'Go Serverless v1.0! Your function executed successfully!'})
  })

  it('should load environment', function () {
    let response = sls.invoke('GET api/env')
    expect(response).to.eventually.have.property('statusCode', 200)
    return expect(response).to.eventually.have.deep.property('body', {message: 'process.env.MY_SIMPLE==simple value'})
  })

  it('should pass data to POST', function () {
    let response = sls.invoke('POST api/postit', {body: 'boo'})
    return expect(response).to.eventually.have.deep.property('body', {message: 'postit:boo'})
  })
})
