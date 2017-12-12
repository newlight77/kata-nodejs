const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
var cassandraService = require('./cassandra-service');
var exportService = require('./export-service');
let config = require('./config.js');

var alive = false;

var shouldExport = function (table) {
  var onlytables = config.onlytables.split(',');
  var excludetables = config.excludetables.split(',');
  if ((onlytables.length == 0 || onlytables.includes(table))
    && (excludetables.length == 0 || !excludetables.includes(table))) {
    return true;
  }
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  setInterval(() => {
    console.log('is alive=', alive);
    if (!alive) {
      process.exit();
    }
  }, 3000);

  cluster.on('message', (worker, message, handle) => {
    console.log('cluster received message=', message);
  });

  cassandraService.listTables()
  .then(function (tables){
      console.log('list tables', tables.join(', '));
      tables = ['cron', 'access', 'role', 'temp', 'dbversion'];
      tables.forEach( table => {
        if (shouldExport(table)) {
          const worker = cluster.fork();
          worker.send(table);
        }
      });
  })

  cluster.on('exit', (worker, code, signal) => {
    exportService.gracefulShutdown();
    cassandraService.gracefulShutdown();
    console.log('Closing connection of systemClient');

    for (const id in cluster.workers) {
      if (!cluster.workers[id].isDead()) {
        alive = true;
      }
    }

    console.log(`worker ${worker.process.pid} died`);
  });
} else {

  process.on('message', (table) => {
    console.log(`Worker ${process.pid} received table :`, table);

    exportService.exportSingleTable(table)
      .then(function resolve() {
        console.log('success exporting table :', table);
        process.send('success exporting table: ' + table);
      }, function error() {
        console.log('Error exporting table :', table);
      });

  });

  console.log(`Worker ${process.pid} started`);
}
