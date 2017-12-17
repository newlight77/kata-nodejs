
const color = require('chalk');
const streamingService = require('./streaming-service');

function handlerMessage(file) {
  console.log(`handling file : ${color.blue(file)}`);
  streamingService.readFromFile(file)
    .then(() => process.send('done'));
}

module.exports.handlerMessage = handlerMessage;
