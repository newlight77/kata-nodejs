
'use strict';

const fs = require('fs');
const jsonStream = require('JSONStream');
const cassandra = require('cassandra-driver');
const color = require('chalk');

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

let getMaxSize = function (table) {
  let max = Number.MAX_VALUE;
  let tables = Object.values(config.tables)
  .filter(entry => entry.name == table);
  // .map(entry => entry.maxSize);
  if (tables.length > 0) {
    max = tables.pop().maxSize;
    if (!max) {
      max = Number.MAX_VALUE;
    }
  }
  return max;
}

function buildQuery (tableInfo, keys) {
  let values = ',?'.repeat(keys.length-1);
  return 'INSERT INTO "' + tableInfo.name + '" ("' + keys.join('","') + '") VALUES (?' + values + ')';
}

function isPlainObject(o) {
  return !!o
  	&& typeof o === 'object'
  	&& Object.prototype.toString.call(o) === '[object Object]';
}

function bufferFrom(value) {
  if (value.type === 'Buffer') {
      return Buffer.from(value);
  }
  else {
      return values.forEach(columns => {
        console.log('columns[key].type ', columns[key].type );
        if (isPlainObject(column[key]) && columns[key].type === 'Buffer') {
            columns[key] = Buffer.from(columns[key]);
        }
      });
  }
}

function buildTableQueryForDataRow(tableInfo, row) {
    var queries = [];

    row = Object.entries(row).filter(column => column !== null);
    let keys = row.map(entry => entry[0]);
    let values = row.map(entry => entry[1]);
    let query = buildQuery(tableInfo, keys);
    let params = values.map(value => {
      if (isPlainObject(value)) {
          return bufferFrom(value);
      }
      return value;
    });

    return {
        query: query,
        params: params,
    };
}

let importSingleTable = function (table, tableInfo) {
      return new Promise(function(resolve, reject) {
          console.log('importSingleTable : ', table);

          var processed = 0;
          var startTime = Date.now();
          let maxSize = getMaxSize(table);

          let jsonfile = fs.createReadStream(config.exportdir + '/' + table + '.json', {encoding: 'utf8'})
          .on('error', function (err) {
              reject(err);
          })
          .on('end', function () {
            var elapsedTime = (Date.now() - startTime) / 1000;
            var rate = elapsedTime ? processed / elapsedTime : 0.00;
            console.log(`imported into table : ${color.blue(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
            resolve();
          });

          let readStream = jsonfile.pipe(jsonStream.parse('*'));

          readStream.on('data', function(row) {
              var query = buildTableQueryForDataRow(tableInfo, row);
              console.log('processed < maxSize', processed < maxSize);
              if (processed < maxSize) {
                client.execute(query.query, query.params, { prepare: true})
                // .then(function () {
                    if (processed%100 == 0) {
                      var elapsedTime = (Date.now() - startTime) / 1000;
                      var rate = elapsedTime ? processed / elapsedTime : 0.00;
                      console.log(`imported into table : ${color.blue(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
                    }
                    processed++;
                // })
                // .catch(function (err) {
                //     reject(err);
                // })
                ;
              } else {
                var elapsedTime = (Date.now() - startTime) / 1000;
                var rate = elapsedTime ? processed / elapsedTime : 0.00;
                console.log('testasst');
                console.log(`exported from table : ${color.blue(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
                resolve();
                throw `${color.red("reached max")}`;
              }
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
