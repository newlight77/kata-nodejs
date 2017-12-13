
'use strict';

const fs = require('fs');
const jsonStream = require('JSONStream');
const cassandra = require('cassandra-driver');

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

let createJsonFile = function (table) {
  let jsonFile = fs.createWriteStream('data/' + table + '.json');
  jsonFile.on('error', function (err) {
      console.log('err ' + err);
      reject(err);
  });
  return jsonFile;
}

let exportSingleTable = function (table) {
      return new Promise(function(resolve, reject) {
          console.log('exportSingleTable : ', table);

          let processed = 0;
          let startTime = Date.now();

          let jsonFile = createJsonFile(table);

          let writeStream = jsonStream.stringify('[', ',', ']');
          writeStream.pipe(jsonFile);

          client.stream('SELECT * FROM "' + table + '"', [], { prepare : true , fetchSize : 1000 })
          .on('readable', function () {
            let row;
            while (row = this.read()) {
              let rowObject = {};
              row.forEach(function(value, key){
                  rowObject[key] = value;
              });
              writeStream.write(rowObject);
              processed++;
            }
          })
          .on('end', function () {
            console.log('Finalizing writes into: ' + table + '.json');
            let timeTaken = (Date.now() - startTime) / 1000;
            let rate = timeTaken ? processed / timeTaken : 0.00;
            console.log('export done with table, rate: ' + rate.toFixed(2) + ' rows/s');
            writeStream.end();
            resolve();
          })
          .on('error', function (err) {
            reject(err);
          });
      });
}

const gracefulShutdown = function() {
  client.shutdown()
      .then(function (){
          process.exit();
      })
      .catch(function (err){
          console.log(err);
          process.exit(1);
      });
}

module.exports.exportSingleTable = exportSingleTable;
module.exports.gracefulShutdown = gracefulShutdown;
