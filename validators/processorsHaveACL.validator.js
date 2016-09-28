'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

const _ = require('lodash');

exports.execute = execute;

function execute() {
    return new Promise((resolve, reject) => {
        Promise.all([loadScopeProcessors(), loadProcessorACLs()])
            .then(function(res) {
                let processors = _.filter(res[0], function(processor) {
                    return !_.find(res[1], function (acl) {
                        return acl.groupby_fields[0].value === processor.name;
                    });
                });

                _.each(processors, function(processor) {
                    utils.logError('Processor ' + processor.name + ' has no ACL specified');
                });

                if (processors.length) {
                    reject('Found ' + processors.length + ' processor(s) without ACL specified');
                } else {
                    resolve();
                }
            }, function(err) {
                reject(err);
            });
    });

    function loadScopeProcessors() {
        return dataProvider.getRecords('sys_processor',
            {
                query: 'sys_scope=' + context.applicationId,
                fields: 'name'
            });
    }

    function loadProcessorACLs() {
        return dataProvider.getAggregateRecords('sys_security_acl',
            {
                query: 'active=true^type=processor^operation=execute^sys_scope=' + context.applicationId,
                groupBy: 'name'
            });
    }
}