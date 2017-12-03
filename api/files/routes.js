'use strict';

var winston = require('winston');

var zipfiles = require('./zip-files');
var senderbusboy = require('./storage-busboy');
var sendermulter = require('./storage-multer');
var senderrequest = require('./sender-request');
var senderunirest = require('./sender-unirest');

var initRoutes = function (app) {
  zipfiles.init();
  winston.info('./api/files/zip-files.js');
  senderbusboy.initRoutes(app);
  winston.info('./api/files/upload-consumer-busboy.js');
  sendermulter.initRoutes(app);
  winston.info('./api/files/upload-consumer-multer.js');
  senderrequest.initRoutes(app);
  winston.info('./api/files/upload-producer-request.js');
  senderunirest.initRoutes(app);
  winston.info('./api/files/upload-producer-unirest.js');
};

module.exports.initRoutes = initRoutes;
