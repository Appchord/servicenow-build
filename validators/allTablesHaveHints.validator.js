'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_documentation',
            'element=NULL^hint=NULL',
            'Found tables without hints');
}