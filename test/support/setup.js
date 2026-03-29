"use strict"
const chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
// chai-as-promised 8.x is ESM-only; require() returns a module namespace object
chai.use(chaiAsPromised.default || chaiAsPromised)
