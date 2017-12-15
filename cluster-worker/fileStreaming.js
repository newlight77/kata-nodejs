const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const color = require('chalk');
const globby = require("globby");

const streamingService = require('./streaming-service');
const util = require('./util');

function messageHandler(file) {
  console.log(`handling file : ${color.blue(file)}`);
  streamingService.readFromFile(file);
  process.send('done');
}

if (cluster.isMaster) {
  console.log(`Master ${color.blue(process.pid)} is running`);

  setInterval(() => {
    let nbAlives = util.alives(cluster);
    console.log(`nbAlives : ${color.blue(nbAlives)}`);
    if (nbAlives == 0) {
      process.exit();
    }
  }, 3000);

  globby( ['./data/**.json'])
      .then(files => {
          files.forEach( function( file, index ) {
              console.log(`file : ${color.blue(file)}`);
              cluster.fork().send(file);
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
    console.log(`worker ${worker.process.pid} died`);
  });

} else {
  console.log(`Worker ${process.pid} started`);
  process.on('message', (file) => {
    console.log(`Worker ${color.blue(process.pid)} received file : ${color.yellow(file)}`);
    messageHandler(file);
  });

  process.on("disconnect", function() {
    console.log("worker shutdown");
  });
}
