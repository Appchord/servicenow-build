'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .execute('sys_app_module',
            'sys_scope=58458eaa4f5a7100b722a5017310c7f2^roles=NULL',
            'Found modules without role assigned');
}