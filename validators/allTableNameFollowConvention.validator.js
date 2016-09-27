'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

const _ = require('lodash');

exports.execute = execute;

function execute() {
    return new Promise((resolve, reject) => {
        dataProvider.getRecords('sys_db_object',
            {
                query: 'sys_scope=' + context.applicationId,
                fields: 'name'
            })
            .then(function (tables) {
                let hasError = false;
                _.each(tables, function (table) {
                    if (!table.name.startsWith(context.scope)) {
                        utils.logError('Table ' + table.name + ' does not follow naming convention. It should start with ' + context.scope);
                        hasError = true;
                    }
                });
                if (hasError) {
                    reject('Found tables with incorrect name');
                } else {
                    resolve();
                }
            }, function(err) {
                reject(err);
            });
    });
}