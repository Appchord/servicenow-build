'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .execute('sys_dictionary',
            'virtual=true^sys_scope=58458eaa4f5a7100b722a5017310c7f2^nameNOT LIKEx_mobi_c_',
            'Found custom calculated attributes in system tables');
}
