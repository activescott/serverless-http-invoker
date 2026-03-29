[![npm version](https://badge.fury.io/js/serverless-http-invoker.svg)](https://www.npmjs.com/package/serverless-http-invoker)
[![npm downloads](https://img.shields.io/npm/dt/serverless-http-invoker.svg?logo=npm)](https://www.npmjs.com/package/serverless-http-invoker)
[![Build Status](https://github.com/activescott/serverless-http-invoker/workflows/build/badge.svg)](https://github.com/activescott/serverless-http-invoker/actions)
[![Coverage Status](https://coveralls.io/repos/github/activescott/serverless-http-invoker/badge.svg)](https://coveralls.io/github/activescott/serverless-http-invoker)
[![License](https://img.shields.io/github/license/activescott/serverless-http-invoker.svg)](https://github.com/activescott/serverless-http-invoker/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/activescott/serverless-http-invoker.svg?style=social)](https://github.com/activescott/serverless-http-invoker)

# serverless-http-invoker

Locally invoke [Serverless](https://github.com/serverless/serverless) functions via their HTTP event as specified in Serverless.yml.

It makes it easy to test not only your handler logic, but also ensures that you have your http events setup properly in serverless.yml without deploying.

> **Note on Serverless Framework & Node.js version support:** This project currently supports **Serverless Framework v3** and **Node.js 20** (the `nodejs20.x` Lambda runtime). Supporting the `nodejs22.x` Lambda runtime [requires upgrading to Serverless Framework v4](https://github.com/serverless/serverless/issues/12922#issuecomment-2563870220), which I haven't done yet. I maintain a number of open source projects and want to dedicate my time to the ones people are actively using. If you'd like to see support for Serverless v4 and Node.js 22, please [open an issue](https://github.com/activescott/serverless-http-invoker/issues) requesting it or submit a pull request — I'm happy to support it! — _Scott Willeke_

<!-- TOC -->

- [Usage / Quick Start](#usage--quick-start)
- [Prerequisites / Usage Requirements](#prerequisites--usage-requirements)
- [Install](#install)
- [Features](#features)
- [Contributing 🤝](#contributing-🤝)
- [Show your support](#show-your-support)
- [Release Process (Deploying to NPM)](#release-process-deploying-to-npm)
- [License 📝](#license-📝)

<!-- /TOC -->

## Usage / Quick Start

Use it in tests of Serverless functions to test your HTTP endpoints along with the handler code. For example, you can write the following to test a Serverless function:

    it('should invoke simple path', function () {
      let response = invoker.invoke('GET api/hello')
      return expect(response).to.eventually.have.property('statusCode', 200)
    })

The test above is a test of a Serverless function defined in a `Serverless.yml` as follows:

    functions:
      hello:
        handler: handler.hello
        events:
          - http:
              path: api/hello
              method: get

Some of the more common use cases are demonstrated in the basic tests at [the basic test cases](examples/basic/basic.spec.js).
An exhaustive list of what is supported in Some of the more common use cases are demonstrated in the basic tests at [the comprehensive test cases](examples/comprehensive/comprehensive.spec.js).

## Prerequisites / Usage Requirements

Requires Node.js 20 ([tested](https://github.com/activescott/serverless-http-invoker/actions)).

Requires Serverless Framework v3.
If you are new to the Serverless Framework, check out the [Serverless Framework Getting Started Guide](https://serverless.com/framework/docs/getting-started/).

## Install

npm (`npm install serverless-http-invoker --save-dev`) or yarn (`yarn add serverless-http-invoker --dev`)

## Features

- Simple to reference your handler
- Tests the serverless route is configured in serverless.yml as well as your handler code
- Test Framework agnostic (mocha, jest, etc.)

## Contributing 🤝

This is a community project. We invite your participation through issues and pull requests! You can peruse the [contributing guidelines](.github/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## Release Process (Deploying to NPM)

We use [semantic-release](https://github.com/semantic-release/semantic-release) to consistently release [semver](https://semver.org/)-compatible versions. This project deploys to multiple [npm distribution tags](https://docs.npmjs.com/cli/dist-tag). Each of the below branches correspond to the following npm distribution tags:

| branch | npm distribution tag |
| ------ | -------------------- |
| main   | latest               |
| beta   | beta                 |

To trigger a release use a Conventional Commit following [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) on one of the above branches.

## License 📝

Copyright © 2017 [Scott Willeke](https://github.com/activescott).

This project is [MIT](https://github.com/activescott/serverless-http-invoker/blob/main/LICENSE) licensed.
