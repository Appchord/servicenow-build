'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_app_module',
            'roles=NULL',
            'Found modules without role assigned');
}