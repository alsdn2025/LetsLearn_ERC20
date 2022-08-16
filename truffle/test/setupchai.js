"use strict";
var chai = require("chai");
const BN = web3.utils.BN; // Big Number
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

module.exports = chai; // chai 객체를 리턴해준다. 