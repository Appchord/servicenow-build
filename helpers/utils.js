'use strict';

const colors = require('colors/safe');
const util = require('util');

module.exports = {
    fail: fail,
    logInfo: logInfo,
    logSuccess: logSuccess,
    logWarning: logWarning,
    logError: logError,
    stopRunning: stopRunning
};

function fail(err) {
    logError(err);
    stopRunning();
}

function logInfo(message) {
    console.log(colors.blue(message));
}

function logSuccess(message) {
    console.log(colors.green(message));
}

function logWarning(message) {
    console.log(colors.yellow(message));
}

function logError(error) {
    console.log(colors.red(util.inspect(error, null)));
}

function stopRunning() {
    process.exit(1);
}