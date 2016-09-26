'use strict';

const request = require('superagent');
const minimist = require('minimist');

function DataProvider() {}

DataProvider.prototype.get = function(url) {
    return new Promise((resolve, reject) => {
        try {
            var credentials = readCredentials();
            let fullUrl = credentials.environment + url;

            let req = request.get(fullUrl);

            req
                .auth(credentials.user, credentials.password)
                .end(function(err, response) {
                    if (err) {
                        // No records found
                        if (response && response.notFound && (response.header['content-type'] && response.header['content-type'].indexOf('application/json') !== -1)) {
                            resolve(null);
                            return;
                        }
                        reject(err);
                        return;
                    }

                    // No records found
                    if (!response.body.result) {
                        resolve(null);
                        return;
                    }

                    if (response.body.result.length <= 0) {
                        resolve(null);
                        return;
                    }

                    resolve(response.body.result);
                });
        } catch (e) {
            reject(e);
        }
    });
};

DataProvider.prototype.getRecords = function(table, params) {
    let url = 'api/now/table/' + table + parseParams(params);
    return this.get(url).then(function(res) {
        return res || [];
    });
};

function parseParams(params) {
    if (!params) {
        return '';
    }
    let query = '';
    if (params.query) {
        addDelimiter();
        query += 'sysparm_query=' + params.query;
    }
    if (params.fields) {
        addDelimiter();
        query += 'sysparm_fields=' + params.fields;
    }

    if (params.limit) {
        addDelimiter();
        query += 'sysparm_limit=' + params.limit;
    }

    if (params.offset) {
        addDelimiter();
        query += 'sysparm_offset=' + params.offset;
    }

    return query;

    function addDelimiter() {
        query += query ? '&' : '?';
    }
}

function readCredentials() {

    let options = minimist(process.argv.slice(2));
    let environment = options['sn-env'];
    let user = options['sn-user'];
    let password = options['sn-pwd'];

    if (!environment || !user || !password) {
        throw new Error('Required credentials are not provided');
    }

    if (!environment.startsWith('https://')) {
        environment = 'https://' + environment;
    }

    if (!environment.endsWith('/')) {
        environment += '/';
    }

    return {
        environment: environment,
        user: user,
        password: password
    }
}

module.exports = DataProvider;