'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .execute('sys_rest_message',
            'sys_scope=58458eaa4f5a7100b722a5017310c7f2^description=NULL',
            'Found REST messages without description');
}