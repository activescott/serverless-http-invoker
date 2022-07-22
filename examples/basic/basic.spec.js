"use strict"
require("../../test/support/setup")
const path = require("path")
const expect = require("chai").expect
const ServerlessInvoker = require("../../index")

describe("basic", function () {
  let sls = null
  beforeEach(function () {
    sls = new ServerlessInvoker(path.join(__dirname))
  })

  it("should invoke simple path", function () {
    const response = sls.invoke("GET api/hello")
    return expect(response).to.eventually.have.property("statusCode", 200)
  })

  it("should have event.httpMethod", function () {
    const response = sls.invoke("GET api/hello")
    return expect(response).to.eventually.have.deep.nested.property(
      "body.input.httpMethod",
      "GET"
    )
  })

  it("should have event.path", function () {
    const response = sls.invoke("GET api/hello")
    return expect(response).to.eventually.have.deep.nested.property(
      "body.input.path",
      "/api/hello"
    )
  })

  it("should have event.resource", function () {
    const response = sls.invoke("GET api/hello")
    return expect(response).to.eventually.have.deep.nested.property(
      "body.input.resource",
      "/api/hello"
    )
  })
})
