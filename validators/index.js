'use strict';

const async = require('async');
const colors = require('colors/safe');
const util = require('util');

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

module.exports = launch;

function launch() {
    async.series([
        function (callback) {
            validateConnection().then(function () {
                callback(null);
            }, function (error) {
                callback(error);
            });
        },
        function (callback) {
            launchValidators().then(function (result) {
                callback(null, result);
            });
        }
    ], function (err, result) {
        if (err) {
            console.log(colors.red(util.inspect(err, null)));
            process.exit(1);
            return;
        }
        let res = result[1];
        if (res && res.failed) {
            console.error('%s test(s) failed', res.failed);
            res.errors.forEach(function(error) {
                console.log(colors.red(util.inspect(error, null)));
            });
            process.exit(1);
        }
    });
}

function validateConnection() {
    return dataProvider.getRecords('sys_update_set', {limit: 1});
}

function launchValidators() {
    const fs = require('fs');

    let result = {
        tests: 0,
        finished: 0,
        failed: 0,
        errors: []
    };

    let promises = [];

    fs.readdirSync('./validators').forEach(function (testFile) {
        if (!testFile.endsWith('.validator.js')) {
            return;
        }

        let validator = require('./' + testFile.replace('.validator.js', '.validator'));
        if (typeof validator.execute !== 'function') {
            return;
        }

        result.tests++;
        let promise = new Promise((resolve, reject) => {
            try {
                let res = validator.execute();

                if (res && res.then) {
                    res.then(resolve, reject)
                } else {
                    resolve(res);
                }
            } catch (e) {
                reject(e);
            }
        });

        promises.push(promise
            .then(
                function () {
                    console.log(colors.blue('Validating ' + testFile + '... OK'));
                    result.finished++;
                },
                function(error) {
                    result.failed++;
                    result.errors.push({
                        fileName: testFile,
                        exception: error
                    });
                }
            ));
    });

    return Promise.all(promises).then(function() {
        return result;
    });
}