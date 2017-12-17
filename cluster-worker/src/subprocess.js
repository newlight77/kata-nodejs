const color = require('chalk');
const streamingService = require('./streaming-service');

process.on('message', (file) => {
  console.log(`received file : ${color.blue(file)}`);
  streamingService.readFromFile(file)
    .then(() => process.send('done'));
});
