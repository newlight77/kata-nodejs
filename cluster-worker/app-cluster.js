const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const color = require('chalk');
const globby = require("globby");

const handler = require('./src/app-cluster-handler');
const util = require('./src/util');

if (cluster.isMaster) {
  console.log(`Master ${color.blue(process.pid)} is running`);

  globby( ['./data/**.json'])
      .then(files => {
          files.forEach( function( file, index ) {
              console.log(`file : ${color.blue(file)}`);
              cluster.fork().send(file);
          });
       });

  cluster.on('message', (worker, message, handle) => {
    console.log(`message: worker=${worker.process.pid} message=${message} handle=${handle} args=${arguments.length}`);
    if (message === 'done') {
      console.log('received done message');
      worker.disconnect();

      let nbAlives = util.alives(cluster);
      console.log(`nbAlives : ${color.blue(nbAlives)}`);
      if (nbAlives == 0) {
        process.exit();
      }
    }
  });


} else {
  console.log(`Worker ${process.pid} started`);
  process.on('message', (file) => {
    console.log(`Worker ${color.blue(process.pid)} received file : ${color.yellow(file)}`);
    handler.handlerMessage(file);
  });

}
