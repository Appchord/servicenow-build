'use strict';

const DataProvider = require('./../helpers/data.provider');
let dataProvider = new DataProvider();

exports.execute = execute;
const query = 'sys_scope=58458eaa4f5a7100b722a5017310c7f2^element!=NULL^nameNOT LIKEimport^hint=NULL^elementNOT LIKEsys_';

function execute() {
    return new Promise((resolve, reject) => {
        dataProvider.getRecords('sys_documentation',
            {
                query: query,
                limit: 1
            })
            .then(function(records) {
                if (records.length) {
                    reject(new Error('Found fields without hints. query: ' + query));
                }
                resolve();
            }, function(err) {
                reject(err);
            })
    });
}