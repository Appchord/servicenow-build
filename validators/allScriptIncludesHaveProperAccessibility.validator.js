'use strict';

const context = require('./../helpers/application.context');

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    let scope = context.validationConfiguration.scriptIncludesScope;
    if (scope === 'any') {
        return true;
    }

    let name = (scope === 'public' ? 'All application scopes' : 'This application scope only');

    return simpleQueryValidator
        .executeInScope('sys_script_include',
            'access!=' + scope,
            'Found script includes with incorrect Accessible from field value. It should be: ' + name);
}