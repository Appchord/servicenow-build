'use strict';

const gulp = require('gulp');
const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

const context = require('./../helpers/application.context');

const utils = require('./../helpers/utils');

gulp.task('app:context', function (cb) {
    dataProvider.getRecords('sys_app', {limit: 1, query: 'scope=' + context.scope})
        .then(function(records) {
                if (!records.length) {
                    utils.fail(new Error('Unable to find application ' + context.scope));
                }
                context.applicationId = records[0].sys_id;
                utils.logSuccess('======= VALIDATION CONTEXT =======');
                utils.logSuccess('ENVIRONMENT: ' + context.environment);
                utils.logSuccess('SCOPE: ' + context.scope);
                utils.logSuccess('==================================');

                dataProvider.getRecords('x_mobi_rm_validation_configuration', {limit: 1, query: 'application=' + context.applicationId})
                    .then(
                        function(records) {
                            if (records.length) {
                                let config = records[0];
                                context.validationConfiguration.scriptIncludesScope = config.script_includes_scope;
                            } else {
                                utils.logWarning('Validation configuration was not found. Default settings will be used');
                            }
                            cb();
                        },
                        function(err) {
                            utils.fail(err);
                        });
            },
            function(err) {
                utils.fail(err);
            });
});