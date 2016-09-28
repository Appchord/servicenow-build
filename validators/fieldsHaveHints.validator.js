'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_documentation',
            'element!=NULL^nameNOT LIKEimport^hint=NULL^elementNOT LIKEsys_',
            'Found fields without hints');
}