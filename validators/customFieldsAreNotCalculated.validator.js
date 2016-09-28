'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

const context = require('./../helpers/application.context');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_dictionary',
            'virtual=true^nameNOT LIKE' + context.scope,
            'Found custom calculated attributes in system tables');
}
