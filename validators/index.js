(function() {
    'use strict';

    let environment = '';
    let user = '';
    let password = '';

    process.argv.forEach((val, index) => {
        if (index < 2) {
            return;
        }
        switch (index) {
            case 2:
                environment = val;
                break;
            case 3:
                user = val;
                break;
            case 4:
                password = val;
                break;
        }
    });

    if (!environment || !user || !password) {
        throw new Error('Required credentials are not provided');
    }

    let fs = require('fs');

    let tests = fs.readdirSync('./validators');

    let result = {
        tests: 0,
        finished: 0,
        failed: 0,
        errors: []
    };

    tests.forEach(function (testFile) {
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

    //console.log(result);
}());