'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

const _ = require('lodash');

exports.execute = execute;

function execute() {
    return new Promise((resolve, reject) => {
        Promise.all([loadScopeTables(), loadTableACLs()])
            .then(function(res) {
                let tables = _.filter(res[0], function(table) {
                    return !_.find(res[1], function (acl) {
                        return acl.groupby_fields[0].value === table.name;
                    });
                });

                _.each(tables, function(table) {
                    utils.logError('Table ' + table.name + ' has no table-level ACL specified');
                });

                if (tables.length) {
                    reject('Found ' + tables.length + ' table(s) without table-level ACL specified');
                } else {
                    resolve();
                }
            }, function(err) {
                reject(err);
            });
    });

    function loadScopeTables() {
        return dataProvider.getRecords('sys_db_object',
            {
                query: 'sys_scope=' + context.applicationId,
                fields: 'name'
            });
    }

    function loadTableACLs() {
        return dataProvider.getAggregateRecords('sys_security_acl_role',
            {
                query: 'sys_security_acl.active=true^sys_security_acl.type=record^sys_security_acl.nameNOT LIKE.^sys_security_acl.sys_scope=' + context.applicationId,
                groupBy: 'sys_security_acl.name'
            });
    }
}