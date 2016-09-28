'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

const _ = require('lodash');

exports.execute = execute;

function execute() {
    return new Promise((resolve, reject) => {
        dataProvider.getRecords('sys_dictionary',
            {
                query: 'nameNOT LIKE' + context.scope + '^sys_class_name=sys_dictionary^sys_scope=' + context.applicationId,
                fields: 'name, element'
            })
            .then(function (columns) {
                let hasError = false;
                _.each(columns, function (column) {
                    if (!column.element.startsWith(context.scope)) {
                        utils.logError('Column ' + column.element + ' from table ' + column.name + ' does not follow naming convention. It should start with ' + context.scope);
                        hasError = true;
                    }
                });
                if (hasError) {
                    reject('Found fields with incorrect name');
                } else {
                    resolve();
                }
            }, function(err) {
                reject(err);
            });
    });
}