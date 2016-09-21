'use strict';

const util = require('util');

const DataProvider = require('./../../helpers/data.provider');
let dataProvider = new DataProvider();

exports.execute = execute;

function execute(table, query, errorDescription) {
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