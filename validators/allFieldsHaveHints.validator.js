'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .execute('sys_documentation',
            'sys_scope=58458eaa4f5a7100b722a5017310c7f2^element!=NULL^nameNOT LIKEimport^hint=NULL^elementNOT LIKEsys_',
            'Found fields without hints');
}