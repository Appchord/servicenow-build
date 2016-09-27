'use strict';

const util = require('util');

const utils = require('./../../helpers/utils');

const DataProvider = require('./../../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../../helpers/application.context');

module.exports = {
    execute: execute,
    executeInScope: executeInScope
};

function execute(table, query, errorDescription) {
    utils.logInfo(util.format('Executing query. Table: %s. Query: %s', table, query));
    
    return new Promise((resolve, reject) => {
        dataProvider.getRecords(table,
            {
                query: query,
                limit: 1
            })
            .then(function(records) {
                if (records.length) {
                    reject(new Error(util.format('%s. Table: %s. Query: %s', errorDescription, table, query)));
                }
                resolve();
            }, function(err) {
                reject(err);
            })
    });
}

function executeInScope(table, query, errorDescription) {
    return execute(table, '^sys_scope=' + context.applicationId + '^' + query, errorDescription)
}