'use strict';

const request = require('superagent');
const context = require('./application.context');

function DataProvider() {}

DataProvider.prototype.get = function(url) {
    return new Promise((resolve, reject) => {
        try {
            let credentials = {
                environment: context.environment,
                user: context.user,
                password: context.password
            };
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
    return this.get(url)
        .then(function(res) {
            return res || [];
        },
        function(err) {
            throw err;
        });
};

DataProvider.prototype.getAggregateRecords = function(table, params) {
    let url = 'api/now/v1/stats/' + table + parseAggregateParams(params);
    return this.get(url)
        .then(function(res) {
            return res || [];
        }, function(err) {
            throw err;
        });
};

function parseParams(params) {
    let query = '?sysparm_exclude_reference_link=true';
    
    if (!params) {
        return query;
    }

    if (params.query) {
        query += '&sysparm_query=' + params.query;
    }

    if (params.fields) {
        query += '&sysparm_fields=' + params.fields;
    }

    if (params.limit) {
        query += '&sysparm_limit=' + params.limit;
    }

    if (params.offset) {
        query += '&sysparm_offset=' + params.offset;
    }

    return query;
}

function parseAggregateParams(params) {
    let query = '?sysparm_count=true';

    if (!params) {
        return query;
    }

    if (params.query) {
        query += '&sysparm_query=' + params.query;
    }

    if (params.groupBy) {
        query += '&sysparm_group_by=' + params.groupBy;
    }

    if (params.having) {
        query += '&sysparm_having=' + params.having;
    }

    return query;
}

module.exports = DataProvider;