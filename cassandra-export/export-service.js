
'use strict';

var fs = require('fs');
var jsonStream = require('JSONStream');
var cassandra = require('cassandra-driver');
let config = require('./config.js');

let authProvider;

if (config.user && config.password) {
    authProvider = new cassandra.auth.PlainTextAuthProvider(config.user, config.password);
}

if (!fs.existsSync(config.exportdir)){
    fs.mkdirSync(config.exportdir);
}

var client = new cassandra.Client({
  contactPoints: [config.host],
  keyspace: config.keyspace,
  authProvider: authProvider,
  protocolOptions: {port: [config.port]}
});

var createJsonFile = function (table) {
  var jsonFile = fs.createWriteStream('data/' + table + '.json');
  jsonFile.on('error', function (err) {
      console.log('err ' + err);
      reject(err);
  });
  return jsonFile;
}

var exportSingleTable = function (table) {
      return new Promise(function(resolve, reject) {
          console.log('exportSingleTable : ', table);

          var processed = 0;
          var startTime = Date.now();

          var jsonFile = createJsonFile(table);

          var writeStream = jsonStream.stringify('[', ',', ']');
          writeStream.pipe(jsonFile);

          client.stream('SELECT * FROM "' + table + '"', [], { prepare : true , fetchSize : 1000 })
          .on('readable', function () {
            var row;
            while (row = this.read()) {
              var rowObject = {};
              row.forEach(function(value, key){
                  rowObject[key] = value;
              });
              writeStream.write(rowObject);
              processed++;
            }
          })
          .on('end', function () {
            console.log('Finalizing writes into: ' + table + '.json');
            var timeTaken = (Date.now() - startTime) / 1000;
            var rate = timeTaken ? processed / timeTaken : 0.00;
            console.log('dxport done with table, rate: ' + rate.toFixed(2) + ' rows/s');
            writeStream.end();
            resolve();
          })
          .on('error', function (err) {
            reject(err);
          });
      });
}

var gracefulShutdown = function() {
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
