'use strict';

var winston = require('winston');
var fs = require('fs');
var unirest = require('unirest');
var request = require('request');


var headers = {
  "cache-control": "no-cache",
  "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
};

var multipart = {
  "body": fs.createReadStream("/Users/kong/Downloads/justificatif.pdf")
};

var initRoutes = function (app) {
  app.post("/post/unirest/multipart/consumer/busboy", function(httpRequest, httpResponse) {
    winston.info('/post/unirest/consumer/busboy');
    unirest("POST", "http://localhost:8000/consumer/busboy")
    .headers(headers)
    .field({
      name: 'kong'
    })
    .multipart([multipart])
    .end(function (res) {
      if (res.error) {
        throw new Error(res.error);
      }
      winston.info(res.body);
      httpResponse.send(res);
    });
  });

  //KO
  app.post("/post/unirest/multipart/consumer/multer", function(httpRequest, httpResponse) {
    winston.info('/post/unirest/multipart/consumer/multer');
    unirest("POST", "http://localhost:8000/consumer/multer")
    .header(headers)
    .field({
      name: 'kong'
    })
    .multipart([multipart])
    .end(function (res) {
      if (res.error) {
        throw new Error(res.error);
      }
      winston.info(res.body);
      httpResponse.send(res);
    });
  });

  app.post("/post/unirest/consumer/multer", function(httpRequest, httpResponse) {
    winston.info('/post/unirest/consumer/multer');
    unirest.post('http://localhost:8000/consumer/multer')
    .header('Accept', 'application/json')
    .field({
      name: 'kong'
    })
    .attach('file', '/Users/kong/Downloads/justificatif.pdf')
    // .attach('file', fs.createReadStream('/Users/kong/Downloads/justificatif.pdf'))  // Same as above.
    .end(function (res) {
      winston.info(res.body);
      httpResponse.send(res.body);
    });
  });

  app.post("/post/unirest/consumer/multer/streaming", function(httpRequest, httpResponse) {
    winston.info('/post/unirest/consumer/multer');
    unirest.post('http://localhost:8000/consumer/multer')
    .header('Accept', 'application/json')
    .field({
      name: 'kong'
    })
    .attach('file', 'https://cdn.pixabay.com/photo/2013/07/12/12/40/smiley-146093_1280.png')
    .end(function (res) {
      winston.info(res.body);
      httpResponse.send(res.body);
    });
  });

};

module.exports.initRoutes = initRoutes;
