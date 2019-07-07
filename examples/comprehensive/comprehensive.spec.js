"use strict"
require("../../test/support/setup")
const path = require("path")
const expect = require("chai").expect
const ServerlessInvoker = require("../../index")

let sls = null

beforeEach(function() {
  process.chdir(path.join(__dirname))
  sls = new ServerlessInvoker(path.join(__dirname))
})

it("should work with callbacks too", function() {
  const response = sls.invoke("GET api/callback")
  return expect(response).to.eventually.have.property("statusCode", 200)
})

it("should invoke path with params", function() {
  const response = sls.invoke("GET api/hello/world")
  return expect(response).to.eventually.have.property("statusCode", 200)
})

it("should invoke path with shorthand", function() {
  const response = sls.invoke("GET api/shorthand")
  return expect(response).to.eventually.have.property("statusCode", 200)
})

it("should invoke path with multiple params", function() {
  const response = sls.invoke("GET api/res1/1111/res2/2222")
  return expect(response).to.eventually.have.property("statusCode", 200)
})

it("should parse json response body", function() {
  const response = sls.invoke("GET api/hello")
  expect(response).to.eventually.have.property("statusCode", 200)
  return expect(response).to.eventually.have.deep.nested.property(
    "body.message",
    "Go Serverless v1.0! Your function executed successfully!"
  )
})

it("should load environment", function() {
  const response = sls.invoke("GET api/env")
  expect(response).to.eventually.have.property("statusCode", 200)
  return expect(response).to.eventually.have.deep.nested.property(
    "body.message",
    "process.env.MY_SIMPLE==simple value"
  )
})

it("should pass data to POST", function() {
  const response = sls.invoke("POST api/postit", { body: "boo" })
  return expect(response).to.eventually.have.deep.property("body", {
    message: "postit:boo"
  })
})

it("should pass pathParameters with values when present", function() {
  const response = sls.invoke("GET api/res1/xxx/res2/yyy")
  return response.then(resp => {
    return expect(resp.body.input).to.have.deep.property("pathParameters", {
      res1ID: "xxx",
      res2ID: "yyy"
    })
  })
})

it("should pass pathParameters along with existing event too", function() {
  const response = sls.invoke("GET api/res1/xxx/res2/yyy", {
    requestPayload: "boo"
  })
  return response.then(resp => {
    expect(resp.body).to.have.property("input")
    expect(resp.body.input).to.have.deep.property("pathParameters", {
      res1ID: "xxx",
      res2ID: "yyy"
    })
    expect(resp.body.input).to.have.property("requestPayload", "boo")
  })
})

it("should pass pathParameters empty when not present", function() {
  const response = sls.invoke("GET api/hello")
  return response.then(resp => {
    return expect(resp.body.input).to.have.deep.property("pathParameters", {})
  })
})

it("should pass greedy path params", function() {
  const response = sls.invoke("GET api/greedy/blah/blah/blah")
  return response.then(resp => {
    return expect(resp.body.input).to.have.deep.property("pathParameters", {
      money: "blah/blah/blah"
    })
  })
})

it("should pass queryStringParameters with values when present", function() {
  const response = sls.invoke("GET api/with_querystring_params?p1=val1&p2=val2")
  return response.then(resp => {
    return expect(resp.body.input).to.have.deep.property(
      "queryStringParameters",
      {
        p1: "val1",
        p2: "val2"
      }
    )
  })
})

it("should pass queryStringParameters even when not present", function() {
  const response = sls.invoke("GET api/with_querystring_params")
  return response.then(resp => {
    return expect(resp.body.input).to.have.deep.property(
      "queryStringParameters",
      {}
    )
  })
})

it("should match urls with query strings and path params in url", function() {
  const response = sls.invoke(
    "GET api/with_querystring_params_and_pathparams/ppvalue?qs1=qsval1"
  )
  return response.then(resp => {
    expect(resp.body.input).to.have.deep.property("queryStringParameters", {
      qs1: "qsval1"
    })
    return expect(resp.body.input).to.have.deep.property("pathParameters", {
      pathparam1: "ppvalue"
    })
  })
})

it("should marshal raw lambda exceptions back as http responses", function() {
  const response = sls.invoke("GET api/throwWorld")
  return expect(response).to.eventually.have.property("statusCode", 502)
})

it("should marshal raw handled lambda errors back as http responses", function() {
  const response = sls.invoke("GET api/errorWorld")
  return expect(response).to.eventually.have.property("statusCode", 502)
})

it("should error if path isn't found", function() {
  const response = sls.invoke("GET api/DOES_NOT_EXIST")
  return expect(response).to.eventually.be.rejectedWith(
    /^Serverless http event not found for HTTP request/
  )
})

it("should try to find service path in same dir", function() {
  process.chdir(path.join(__dirname))
  const localSls = new ServerlessInvoker()
  expect(localSls.servicePath).to.match(/examples\/comprehensive$/)
})

it("should try to find service path in parent dir", function() {
  process.chdir(path.join(__dirname, "./subdir"))
  const localSls = new ServerlessInvoker()
  expect(localSls.servicePath).to.match(/examples\/comprehensive$/)
})

it("should fail if serverless.yml not found", function() {
  process.chdir(path.join(__dirname, "../../test-data/no-serverless-found"))
  expect(() => new ServerlessInvoker()).to.throw(
    /^Cannot find serverless.yml. Started search in working directory/
  )
})
