'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .execute('sys_documentation',
            'nameNOT LIKEx_mobi_c^elementISNOTEMPTY^sys_scope=58458eaa4f5a7100b722a5017310c7f2^hintISEMPTY',
            'Found fields without hints');
}