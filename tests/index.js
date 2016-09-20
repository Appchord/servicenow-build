(function() {
    'use strict';

    let fs = require('fs');

    let tests = fs.readdirSync('./tests');

    var result = {
        tests: 0,
        finished: 0,
        failed: 0,
        errors: []
    };

    tests.forEach(function (testFile) {
        if (testFile.endsWith('.test.js')) {
            let test = require('./' + testFile.replace('.test.js', '.test'));
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
}());