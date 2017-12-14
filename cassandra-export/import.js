const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const cassandraService = require('./cassandra-service');
const importService = require('./import-service');

let config = require('./config.js');

let shouldImport = function (table) {
  let onlytables;
  let excludetables;
  if (config.onlytables) {
    onlytables = config.onlytables.split(',');
  }
  if (config.excludetables) {
    excludetables = config.excludetables.split(',');
  }
  if ((onlytables == undefined || onlytables.length == 0 || onlytables.includes(table))
    && (excludetables == undefined || excludetables.length == 0 || !excludetables.includes(table))) {
    return true;
  }
}

let alives = function () {
  let count = 0;
  for (const id in cluster.workers) {
    if (!cluster.workers[id].isDead()) {
      console.log('woprker is alive', id);
      count++;
    }
  }
  return count;
}

function messageHandler(table, tableInfo) {
  importService.importSingleTable(table, tableInfo)
  .then(function resolve() {
    console.log('success importing table :', table);
    process.send('done');
  }, function error() {
    console.log('Error importing table :', table);
  });
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  setInterval(() => {
    let nbAlives = alives();
    console.log('nbAlives=', nbAlives);
    if (nbAlives == 0) {
      process.exit();
    }
  }, 3000);

  cassandraService.listTables()
  .then(function (tables) {
      console.log('list tables', tables.join(', '));
      tables = ['cron', 'access', 'role', 'temp', 'dbversion'];
      tables.forEach( table => {
        if (shouldImport(table)) {
          cassandraService.getTableInfo(table)
          .then( tableInfo => {
            if (tableInfo) {
                cluster.fork().send({table: table, tableInfo:tableInfo});
            }
          });
          // cluster.fork().send(table);
        }
      });
  });

  cluster.on('fork', () => {
    console.log('a worker has been forked');
  });

  cluster.on('setup', () => {
    console.log('cluster is setting up');
  });

  cluster.on('message', (worker, message, handle) => {
    console.log(`message: worker=${worker.process.pid} message=${message} handle=${handle} args=${arguments.length}`);
    if (message === 'done') {
      console.log('received done message');
      worker.disconnect();
    }
  });

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('death', function(worker) {
    console.log(`worker ${worker.process.pid} died`);
  });

  cluster.on('exit', (worker, code, signal) => {
    importService.gracefulShutdown();
    cassandraService.gracefulShutdown();
    console.log('Closing connection of systemClient');
    console.log(`worker ${worker.process.pid} died`);
  });

} else {
  console.log(`Worker ${process.pid} started`);
  process.on('message', (message) => {
    console.log(`Worker ${process.pid} received table :`, message.table);
    messageHandler(message.table, message.tableInfo);
  });

  process.on("disconnect", function() {
    console.log("worker shutdown");
  });
}
