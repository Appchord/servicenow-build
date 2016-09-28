'use strict';

const minimist = require('minimist');

let options = minimist(process.argv.slice(2));
let environment = options['sn-env'];
let user = options['sn-user'];
let password = options['sn-pwd'];
let scope = options['sn-app'];

if (!environment || !user || !password) {
    throw new Error('Required credentials are not provided');
}

if (!environment.startsWith('https://')) {
    environment = 'https://' + environment;
}

if (!environment.endsWith('/')) {
    environment += '/';
}

if (!scope) {
    throw new Error('ServiceNow application is not provided');
}

module.exports = {
    environment: environment,
    user: user,
    password: password,
    scope: scope,
    validationConfiguration: {
        scriptIncludesScope: 'any'
    }
};