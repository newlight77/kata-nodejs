
'use strict';

const fs = require('fs');
const jsonStream = require('JSONStream');
const cassandra = require('cassandra-driver');
const _ = require('lodash');

let config = require('./config.js');

let authProvider;

if (config.user && config.password) {
    authProvider = new cassandra.auth.PlainTextAuthProvider(config.user, config.password);
}

if (!fs.existsSync(config.exportdir)){
    fs.mkdirSync(config.exportdir);
}

let client = new cassandra.Client({
  contactPoints: [config.host],
  keyspace: config.keyspace,
  authProvider: authProvider,
  protocolOptions: {port: [config.port]}
});

function buildTableQueryForDataRow(tableInfo, row) {
    var queries = [];
    var isCounterTable = _.some(tableInfo.columns, function(column) {return column.type.code === 5;});
    row = _.omitBy(row, function(item) {return item === null});
    var query = 'INSERT INTO "' + tableInfo.name + '" ("' + _.keys(row).join('","') + '") VALUES (?' + _.repeat(',?', _.keys(row).length-1) + ')';
    var params = _.values(row);
    if (isCounterTable) {
        var primaryKeys = [];
        primaryKeys = primaryKeys.concat(_.map(tableInfo.partitionKeys, function(item){return item.name}));
        primaryKeys = primaryKeys.concat(_.map(tableInfo.clusteringKeys, function(item){return item.name}));
        var primaryKeyFields = _.pick(row, primaryKeys);
        var otherKeyFields = _.omit(row, primaryKeys);
        var setQueries = _.map(_.keys(otherKeyFields), function(key){
            return '"'+ key +'"="'+ key +'" + ?';
        });
        var whereQueries = _.map(_.keys(primaryKeyFields), function(key){
            return '"'+ key +'"=?';
        });
        query = 'UPDATE "' + tableInfo.name + '" SET ' + setQueries.join(', ') + ' WHERE ' + whereQueries.join(' AND ');
        params = _.values(otherKeyFields).concat(_.values(primaryKeyFields));
    }
    params = _.map(params, function(param){
        if (_.isPlainObject(param)) {
            if (param.type === 'Buffer') {
                return Buffer.from(param);
            }
            else {
                var omittedParams = _.omitBy(param, function(item) {return item === null});
                for (key in omittedParams) {
                    if (_.isObject(omittedParams[key]) && omittedParams[key].type === 'Buffer') {
                        omittedParams[key] = Buffer.from(omittedParams[key]);
                    }
                }
                return omittedParams;
            }
        }
        return param;
    });
    return {
        query: query,
        params: params,
    };
}

let importSingleTable = function (table, tableInfo) {
      return new Promise(function(resolve, reject) {
          console.log('importSingleTable : ', table);

          let jsonfile = fs.createReadStream('data/' + table + '.json', {encoding: 'utf8'})
          .on('error', function (err) {
              reject(err);
          })
          .on('end', function () {
            var timeTaken = (Date.now() - startTime) / 1000;
            var throughput = timeTaken ? processed / timeTaken : 0.00;
            console.log('Done with table, throughput: ' + throughput.toFixed(1) + ' rows/s');
            resolve();
          });

          let readStream = jsonfile.pipe(jsonStream.parse('*'));

          var processed = 0;
          var startTime = Date.now();
          readStream.on('data', function(row) {
              processed++;
              var query = buildTableQueryForDataRow(tableInfo, row);
              client.execute(query.query, query.params, { prepare: true})
              .then(function () {
                  console.log('Streaming ' + processed + ' rows to table: ' + table);
                  console.log('imported row : ', row);
              })
              .catch(function (err) {
                  reject(err);
              });
          });

      });
}

let gracefulShutdown = function() {
  client.shutdown()
      .then(function (){
          process.exit();
      })
      .catch(function (err){
          console.log(err);
          process.exit(1);
      });
}

module.exports.importSingleTable = importSingleTable;
module.exports.gracefulShutdown = gracefulShutdown;
