'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

const _ = require('lodash');

exports.execute = execute;

function execute() {
    return new Promise((resolve, reject) => {
        Promise.all([loadTablePolicies(), loadCatalogItemPolicies(), loadVariableSetPolicies()])
            .then(function(res) {

                let hasError = false;
                _.each(res, function(policies, index) {
                    _.each(policies, function(policy) {
                        let message = 'Found ' + policy.stats.count + ' order duplicates in ';
                        switch (index) {
                            case 0:
                                message += 'Table UI policy: ';
                                break;
                            case 1:
                                message += 'Catalog item UI policy: ';
                                break;
                            case 2:
                                message += 'Variable set UI policy: ';
                                break;
                        }
                        _.each(policy.groupby_fields, function(field) {
                            message += field.field + ' = ' + field.value + '; ';
                        });
                        utils.logError(message);
                        hasError = true;
                    })
                });

                if (hasError) {
                    reject('Found order duplicates in UI policies');
                } else {
                    resolve();
                }
            }, function(err) {
                reject(err);
            });
    });

    function loadTablePolicies() {
        return dataProvider.getAggregateRecords('sys_ui_policy',
            {
                query: 'sys_class_name=sys_ui_policy^sys_scope=' + context.applicationId,
                groupBy: 'table,order',
                having: 'count^order^>^1'
            });
    }

    function loadCatalogItemPolicies() {
        return dataProvider.getAggregateRecords('catalog_ui_policy',
            {
                query: 'applies_to=item^sys_scope=' + context.applicationId,
                groupBy: 'catalog_item,order',
                having: 'count^order^>^1'
            });
    }

    function loadVariableSetPolicies() {
        return dataProvider.getAggregateRecords('catalog_ui_policy',
            {
                query: 'applies_to=set^sys_scope=' + context.applicationId,
                groupBy: 'variable_set,order',
                having: 'count^order^>^1'
            });
    }
}