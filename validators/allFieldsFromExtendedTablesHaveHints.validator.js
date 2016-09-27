'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

const context = require('./../helpers/application.context');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_documentation',
            'nameNOT LIKE' + context.scope + '^elementISNOTEMPTY^hintISEMPTY',
            'Found fields without hints');
}