'use strict';

const color = require('chalk');

function metrics(table, startTime, processed) {
  var elapsedTime = (Date.now() - startTime) / 1000;
  var rate = elapsedTime ? processed / elapsedTime : 0.00;
  console.log(`imported into table : ${color.yellow(table)} , processed : ${color.blue(processed)} , timeElapsed : ${color.blue(elapsedTime.toFixed(2))} sec , rate : ${color.blue(rate.toFixed(2))} rows/s`);
}

function alives (cluster) {
  let count = 0;
  for (const id in cluster.workers) {
    if (!cluster.workers[id].isDead()) {
      console.log(`Worker ${color.blue(id)} is alive `);
      count++;
    }
  }
  return count;
}

module.exports.metrics = metrics;
module.exports.alives = alives;
