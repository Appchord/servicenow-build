'use strict';

const simpleQueryValidator = require('./generic/simpleQuery.validator');

exports.execute = execute;

function execute() {
    return simpleQueryValidator
        .executeInScope('sys_db_object',
            'access!=public^ORaccess=NULL',
            'Found tables with incorrect Accessible from field value. It should be: All application scopes');
}