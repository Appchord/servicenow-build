'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

const colors = require('colors/safe');
const util = require('util');

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

function fail(err) {
    let msg = util.inspect(err, null);
    console.log(colors.red(msg));
    throw new Error(msg);
}

gulp.task('validate:connection', function (cb) {
    dataProvider.getRecords('sys_update_set', {limit: 1})
        .then(function() {
            cb();
        },
        function(err) {
            fail(err);
        });
});

gulp.task('validate:validators', launchValidators);

function launchValidators(cb) {
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

        let validator = require('./../validators/' + testFile.replace('.validator.js', '.validator'));
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

    Promise.all(promises).then(function() {
        if (result.failed) {
            console.error('%s test(s) failed', result.failed);
            result.errors.forEach(function(error) {
                console.log(colors.red(util.inspect(error, null)));
            });
            throw new Error('Tests are not passed');
        }
        cb();
    });
}

gulp.task('validate', function(cb) {
    sequence('validate:connection', 'validate:validators', cb);
});