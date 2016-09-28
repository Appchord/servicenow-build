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
                query: 'super_class!=NULL^super_class.name!=sys_import_set_row^sys_scope=' + context.applicationId,
                fields: 'name, super_class.name'
            })
            .then(function (records) {
                let tables = _.filter(records, function (record) {
                    return extendedFromGlobalTable(records, record['super_class.name'])
                });
                var promises = [];
                _.each(tables, function(table) {
                    promises.push(loadTableColumns(table));
                });

                Promise.all(promises)
                    .then(function (res) {
                        let hasError = false;

                        _.each(res, function (fields) {
                            _.each(fields, function(field) {
                                if (!field.element.startsWith(context.scope) && !field.element.startsWith('sys_')) {
                                    hasError = true;
                                    utils.logError('Field ' + field.element + ' in table ' + field.name + ' does not follow naming convention');
                                }
                            })
                        });

                        if (hasError) {
                            reject('Found fields in extended tables with incorrect name');
                        } else {
                            resolve();
                        }
                    }, function (err) {
                        reject(err);
                    });
                //resolve(tables);
            }, function (err) {
                reject(err);
            });

    });

    function extendedFromGlobalTable(scopeTables, parentName) {
        let parent = _.find(scopeTables, function (entry) {
            return entry.name === parentName;
        });
        return parent ?
            extendedFromGlobalTable(scopeTables, parent['super_class.name']) :
            (!parentName.startsWith(context.scope));
    }

    function loadTableColumns(table) {
        return dataProvider.getRecords('sys_dictionary',
            {
                query: 'element!=NULL^name=' + table.name + '^sys_scope=' + context.applicationId,
                fields: 'name,element'
            });
    }
}