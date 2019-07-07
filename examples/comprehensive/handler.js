"use strict"
const assert = require("assert")

module.exports.hello = async event => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  }
}

module.exports.callback = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        message: "Go Serverless v1.00! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  }
  callback(null, response)
}

module.exports.throwWorld = async () => {
  throw new Error("throw world")
}

module.exports.errorWorld = (event, context, callback) => {
  callback(new Error("throw world"), null)
}

module.exports.with_querystring_params = async event => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "QueryStringParams on prop",
      queryStringParameters: event.queryStringParameters,
      input: event
    })
  }
}

module.exports.env = async event => {
  assert(process.env.MY_SIMPLE === "simple value")

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "process.env.MY_SIMPLE==" + process.env.MY_SIMPLE,
      input: event
    })
  }
}

module.exports.postit = async event => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "postit:" + event.body
    })
  }
}
