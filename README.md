[![npm version](https://badge.fury.io/js/serverless-http-invoker.svg)](https://www.npmjs.com/package/serverless-http-invoker)
[![npm](https://img.shields.io/npm/dt/serverless-http-invoker.svg?logo=npm)](https://www.npmjs.com/package/serverless-http-invoker)
[![Build Status](https://travis-ci.org/activescott/serverless-http-invoker.svg)](https://travis-ci.org/activescott/serverless-http-invoker)
[![Coverage Status](https://coveralls.io/repos/github/activescott/serverless-http-invoker/badge.svg)](https://coveralls.io/github/activescott/serverless-http-invoker)
[![License](https://img.shields.io/github/license/activescott/serverless-http-invoker.svg)](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE)
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

Requires Node.js latest, LTS, and v10 ([tested](https://travis-ci.org/activescott/serverless-http-invoker)).

If you need Node.js v6.x - v9.x support you can use [serverless-http-invoker@0.8.6](https://www.npmjs.com/package/serverless-http-invoker/v/0.8.6).

Requires Serverless Framework v1.x.
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

## Release Process (Deploying to NPM)

To deploy a **pre-release version** to NPM, tag a commit in master branch with a semver-compatible git tag and **postfixed with** an NPM distribution tag of `next`. For example:

    git tag 1.0.1-next

To deploy a **production** version to NPM, tag a commit in master branch with a semver-compatible git tag **WITHOUT** a NPM distribution tag. For example:

    git tag 1.0.1

In this case, since no NPM distribution tag is provided the `latest` tag will be used making it a normal production release.

NOTE: To get the tag to GitHub push it with `git push --tags`.

NOTE: If you want to move the git tag that was already pushed to the remote (GitHub) to a different commit you must delete it on the remote like `git push --delete origin 0.8.7-next` and then push it with `git push --tags`. Or do the abbreviated from by force-pushing it like `git push --tags -f`.

## License 📝

Copyright © 2017 [scott@willeke.com](https://github.com/activescott).

This project is [MIT](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE) licensed.
