'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_rest_message',
            'description=NULL',
            'Found REST messages without description');
}