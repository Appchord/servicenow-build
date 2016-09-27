'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

const utils = require('./../helpers/utils');

gulp.task('app:validate:validators', launchValidators);

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
                    utils.logInfo('Validating ' + testFile + '... OK');
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
            utils.logError(result.failed + ' test(s) failed');
            result.errors.forEach(function(error) {
                utils.logError(error);
            });
            utils.stopRunning();
        }
        cb();
    });
}

gulp.task('app:validate', function(cb) {
    sequence('app:context', 'app:validate:validators', cb);
});