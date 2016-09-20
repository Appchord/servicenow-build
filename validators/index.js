(function() {
    'use strict';

    const DataProvider = require('./../helpers/data.provider');
    let dataProvider = new DataProvider();

    validateConnection(launchValidators);

    function validateConnection(callback) {
        dataProvider.getRecords('sys_update_set', {limit: 1}, callback);
    }

    function launchValidators() {
        const fs = require('fs');

        let result = {
            tests: 0,
            finished: 0,
            failed: 0,
            errors: []
        };

        fs.readdirSync('./validators').forEach(function (testFile) {
            if (testFile.endsWith('.validator.js')) {
                let test = require('./' + testFile.replace('.validator.js', '.validator'));
                if (typeof test.execute === 'function') {
                    result.tests++;
                    try {
                        test.execute();
                        result.finished++;
                    } catch (e) {
                        result.failed++;
                        result.errors.push({
                            fileName: testFile,
                            exception: e
                        });
                    }
                }
            }
        });

        console.log(result);
    }
}());