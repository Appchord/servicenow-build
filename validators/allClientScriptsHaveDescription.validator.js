'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .execute('sys_script_client',
            'sys_scope=58458eaa4f5a7100b722a5017310c7f2^description=NULL',
            'Found client scripts without description');
}