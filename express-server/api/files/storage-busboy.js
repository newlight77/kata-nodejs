'use strict';

var winston = require('winston');
var fs = require('fs');
var Busboy = require('busboy');

var initRoutes = function (app) {

  app.post('/consumer/busboy', function (httpRequest, httpResponse) {
    var busboy = new Busboy({
      headers: httpRequest.headers
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.pipe(fs.createWriteStream('uploads/'+filename));
    });
    busboy.on('finish', function() {
      httpResponse.writeHead(200, {
        'Connection': 'close'
      });
      httpResponse.end("That's all folks!");
    });
    return httpRequest.pipe(busboy);
    httpResponse.writeHead(404);
    httpResponse.end();
  });
};

module.exports.initRoutes = initRoutes;
