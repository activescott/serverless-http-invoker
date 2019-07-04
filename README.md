[![npm version](https://badge.fury.io/js/serverless-http-invoker.svg)](https://badge.fury.io/js/serverless-http-invoker)
[![license](https://img.shields.io/npm/l/serverless-http-invoker.svg)](https://www.npmjs.com/package/serverless-http-invoker)
[![Build Status](https://travis-ci.org/activescott/serverless-http-invoker.svg?branch=master)](https://travis-ci.org/activescott/serverless-http-invoker)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# serverless-http-invoker

Locally invoke [Serverless](https://github.com/serverless/serverless) functions via their HTTP event as specified in Serverless.yml.

It makes it easy to test not only your handler logic, but also ensures that you have your http events setup properly in serverless.yml without deploying.

# Usage

Use it in tests of Serverless functions to test your HTTP endpoints along with the handler code. For example, you can write the following to test a Serverless function:

    it('should invoke simple path', function () {
      let response = invoker.invoke('GET api/hello')
      return expect(response).to.eventually.have.property('statusCode', 200)
    })

The test above is a test of a Serverless function defined in Serverless.yml as follows:

    functions:
      hello:
        handler: handler.hello
        events:
          - http:
              path: api/hello
              method: get

Many more examples and exaustive list of what is supported in [the tests](https://github.com/activescott/serverless-http-invoker/blob/master/test/test.js). Some additional real-world examples are demonstrated in the [sheetmonkey-server project](https://github.com/activescott/sheetmonkey-server). See [PluginsHandler.js](https://github.com/activescott/sheetmonkey-server/blob/master/server/test/PluginsHandler.js) and [PluginAuthHandler.js](https://github.com/activescott/sheetmonkey-server/blob/master/server/test/PluginAuthHandler.js) among others.

# Installation

npm (`npm install serverless-http-invoker --save-dev`) or yarn (`yarn add serverless-http-invoker --dev`)
