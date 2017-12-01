'use strict';

var winston = require('winston');

var zipfiles = require('./zip-files');
var consumerbusboy = require('./upload-consumer-busboy');
var consumermulter = require('./upload-consumer-multer');
var producerrequest = require('./upload-producer-request');
var producerunirest = require('./upload-producer-unirest');

var initRoutes = function (app) {
  zipfiles.init();
  winston.info('./api/files/zip-files.js');
  consumerbusboy.initRoutes(app);
  winston.info('./api/files/upload-consumer-busboy.js');
  consumermulter.initRoutes(app);
  winston.info('./api/files/upload-consumer-multer.js');
  producerrequest.initRoutes(app);
  winston.info('./api/files/upload-producer-request.js');
  producerunirest.initRoutes(app);
  winston.info('./api/files/upload-producer-unirest.js');
};

module.exports.initRoutes = initRoutes;
