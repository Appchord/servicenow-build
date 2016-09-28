'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_properties',
            'description=NULL',
            'Found system properties without description');
}