'use strict';

const request = require('superagent');

function DataProvider() {
}

DataProvider.prototype.get = function(url, callback) {
    var credentials = readCredentials();
    let fullUrl = 'https://' + credentials.environment + url;
    console.log(fullUrl);
    let req = request.get(fullUrl);
    req
        .auth(credentials.user, credentials.password)
        .end(function(err, response) {
            if (err) {
                // No records found
                if (response && response.notFound && (response.header['content-type'] && response.header['content-type'].indexOf('application/json') !== -1)) {
                    return callback(null);
                }
                throw new Error(err);
            }

            // No records found
            if (!response.body.result) {
                return callback(null);
            }

            if (response.body.result.length <= 0) {
                return callback(null);
            }

            callback(response.body.result);
        });
};

DataProvider.prototype.getRecords = function(table, params, callback) {
    let url = '/api/now/table/' + table + parseParams(params);
    return this.get(url, function(res) {
        callback(res || []);
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

    return {
        environment: environment,
        user: user,
        password: password
    }
}

module.exports = DataProvider;