
'use strict';

var cassandra = require('cassandra-driver');
let config = require('./config.js');

let authProvider;

if (config.user && config.password) {
    authProvider = new cassandra.auth.PlainTextAuthProvider(config.user, config.password);
}

var systemClient = new cassandra.Client({
    contactPoints: [config.host],
    authProvider: authProvider,
    protocolOptions: {port: [config.port]}
});

var listTables = function () {
  return systemClient.connect()
      .then(function (){
          var systemQuery = "SELECT columnfamily_name as table_name FROM system.schema_columnfamilies WHERE keyspace_name = ?";
          if (systemClient.metadata.keyspaces.system_schema) {
              systemQuery = "SELECT table_name FROM system_schema.tables WHERE keyspace_name = ?";
          }

          console.log('Finding tables in keyspace: ' + config.keyspace);
          return systemClient.execute(systemQuery, [config.keyspace]);
      })
      .then(function (result){
          console.log('Completed exporting all tables from keyspace: ' + config.keyspace);

          return new Promise(resolve => {
              var tables = [];
              for(var i = 0; i < result.rows.length; i++) {
                  tables.push(result.rows[i].table_name);
              }
              console.log('resolve tables : ', tables.join(', '));
              console.log('Retrieved tables from keyspace : ' + config.keyspace);
              resolve(tables);
          });
      })
      .catch(function (err){
          console.log(err);
      });
}

var gracefulShutdown = function() {
  systemClient.shutdown()
      .then(function (){
          process.exit();
      })
      .catch(function (err){
          console.log(err);
          process.exit(1);
      });
}

module.exports.listTables = listTables;
module.exports.gracefulShutdown = gracefulShutdown;
