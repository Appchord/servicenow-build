'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

const _ = require('lodash');

exports.execute = execute;

function execute() {
    return new Promise((resolve, reject) => {
        Promise.all([loadScopeTables(), loadScopeDisplayFields()])
            .then(function(res) {
                let scopeTables = res[0];
                let tables = _.filter(scopeTables, function (entry) {
                    return !_.find(res[1], function (column) {
                        return column.name === entry.name;
                    });
                });
                let hasError = false;

                _.each(tables, function (table) {
                    if (table.super_class) {
                        let parentName = table['super_class.name'];
                        if (extendedFromGlobalTable(scopeTables, parentName)) {
                            return;
                        } else {
                            utils.logError('Table ' + table.name + ' has no display field. Inherited from; ' + parentName);
                        }
                    } else {
                        utils.logError('Table ' + table.name + ' has no display field');
                    }
                    hasError = true;
                });
                if (hasError) {
                    reject('Found tables without display fields');
                } else {
                    resolve();
                }
            }, function(err) {
                reject(err);
            });
    });

    function extendedFromGlobalTable(scopeTables, parentName) {
        let parent = _.find(scopeTables, function (entry) {
            return entry.name === parentName;
        });
        if (parent) {
            if (parent.super_class) {
                return extendedFromGlobalTable(scopeTables, parent['super_class.name']);
            } else {
                return false;
            }
        }
        return true;
    }

    function loadScopeTables() {
        return dataProvider.getRecords('sys_db_object',
            {
                query: 'sys_scope=' + context.applicationId,
                fields: 'name, super_class, super_class.name'
            });
    }

    function loadScopeDisplayFields() {
        return dataProvider.getRecords('sys_dictionary',
            {
                query: 'display=true^nameSTARTSWITH' + context.scope,
                fields: 'name'
            });
    }
}