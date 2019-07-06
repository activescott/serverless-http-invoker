[![npm version](https://badge.fury.io/js/serverless-http-invoker.svg)](https://badge.fury.io/js/serverless-http-invoker)
[![License](https://img.shields.io/github/license/activescott/serverless-http-invoker.svg)](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/activescott/serverless-http-invoker.svg?branch=master)](https://travis-ci.org/activescott/serverless-http-invoker)
[![Coverage Status](https://coveralls.io/repos/github/activescott/serverless-http-invoker/badge.svg?branch=misc-updates)](https://coveralls.io/github/activescott/serverless-http-invoker?branch=misc-updates)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub stars](https://img.shields.io/github/stars/activescott/serverless-http-invoker.svg?style=social)](https://github.com/activescott/serverless-http-invoker)

# serverless-http-invoker

Locally invoke [Serverless](https://github.com/serverless/serverless) functions via their HTTP event as specified in Serverless.yml.

It makes it easy to test not only your handler logic, but also ensures that you have your http events setup properly in serverless.yml without deploying.

<!-- TOC -->

- [Usage / Quick Start](#usage--quick-start)
- [Prerequisites / Usage Requirements](#prerequisites--usage-requirements)
- [Install](#install)
- [Features](#features)
- [Contributing 🤝](#contributing-🤝)
- [Show your support](#show-your-support)
- [License 📝](#license-📝)

<!-- /TOC -->

## Usage / Quick Start

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

## Prerequisites / Usage Requirements

Requires Node.js v6.x or greater (through v12 is tested) and Serverless Framework >=1.27.3.
If you are new to the Serverless Framework, check out the [Serverless Framework Getting Started Guide](https://serverless.com/framework/docs/getting-started/).

## Install

yarn (`yarn add serverless-http-invoker --dev`) or npm (`npm install serverless-http-invoker --save-dev`)

## Features

- Simple to reference your handler
- Tests the serverless route is configured in serverless.yml as well as your handler code
- Test Framework agnostic (mocha, jest, etc.)

## Contributing 🤝

This is a community project. We invite your participation through issues and pull requests! You can peruse the [contributing guidelines](.github/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## License 📝

Copyright © 2017 [scott@willeke.com](https://github.com/activescott).

This project is [MIT](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE) licensed.
