'use strict'
const assert = require('assert')

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  }

  callback(null, response)
}

module.exports.throwWorld = (event, context, callback) => {
  throw new Error('throw world')
}

module.exports.errorWorld = (event, context, callback) => {
  callback(new Error('throw world'), null)
}

module.exports.with_querystring_params = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'QueryStringParams on prop',
      queryStringParameters: event.queryStringParameters,
      input: event
    })
  }

  callback(null, response)
}

module.exports.env = (event, context, callback) => {
  assert(process.env.MY_SIMPLE === 'simple value')

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'process.env.MY_SIMPLE==' + process.env.MY_SIMPLE,
      input: event
    })
  }

  callback(null, response)
}

module.exports.postit = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'postit:' + event.body
    })
  }

  callback(null, response)
}
