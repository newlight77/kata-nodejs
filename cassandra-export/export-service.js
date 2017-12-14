
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

let createJsonFile = function (table) {
  let jsonFile = fs.createWriteStream('data/' + table + '.json');
  jsonFile.on('error', function (err) {
      console.log('err ' + err);
      reject(err);
  });
  jsonFile.on('end', function () {
      console.log('jsonFile end ');
  });
  return jsonFile;
}

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

let exportSingleTable = function (table) {
      return new Promise(function(resolve, reject) {
          console.log('exportSingleTable : ', table);

          let processed = 0;
          let startTime = Date.now();
          let maxSize = getMaxSize(table);

          let writeStream = jsonStream.stringify('[', ',', ']');
          writeStream.pipe(createJsonFile(table));

          client.stream('SELECT * FROM "' + table + '"', [], { prepare : true , fetchSize : 1000 })
          .on('readable', function () {
            let row;
            let self = this;
            while (row = this.read()) {
              if (processed < maxSize) {
                let rowObject = {};
                row.forEach(function(value, key){
                    rowObject[key] = value;
                });
                writeStream.write(rowObject);
                if (processed%100 == 0) {
                  var elapsedTime = (Date.now() - startTime) / 1000;
                  var rate = elapsedTime ? processed / elapsedTime : 0.00;
                  console.log(`exported from table : ${color.blue(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
                }
                processed++;
              } else {
                var elapsedTime = (Date.now() - startTime) / 1000;
                var rate = elapsedTime ? processed / elapsedTime : 0.00;
                console.log(`exported from table : ${color.blue(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
                throw `${color.red("reached max")}`;
              }
            }
          })
          .on('end', function () {
            console.log('Ending writes to : ' + table + '.json');
            var elapsedTime = (Date.now() - startTime) / 1000;
            var rate = elapsedTime ? processed / elapsedTime : 0.00;
            console.log(`exported from table : ${color.blue(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
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
