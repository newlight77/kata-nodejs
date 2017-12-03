'use strict';

var winston = require('winston');
var fs = require('fs');
var unirest = require('unirest');
var request = require('request');
var zlib = require('zlib');
var fstream = require('fstream');


var initRoutes = function (app) {
  app.post("/unirest/multipart/busboy", function(httpRequest, httpResponse) {
    winston.info('/unirest/busboy');
    unirest("POST", "http://localhost:8000/consumer/busboy")
    .headers({
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    })
    .multipart([{
      "body": fs.createReadStream("./fs.gz")
    }])
    .end(function (res) {
      if (res.error) {
        throw new Error(res.error);
      }
      winston.info(res.body);
      httpResponse.send(res);
    });
  });

  //KO
  app.post("/unirest/multipart/multer", function(httpRequest, httpResponse) {
    winston.info('/unirest/multipart/multer');
    unirest("POST", "http://localhost:8080/consumer/multer")
    .header({
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    })
    .multipart([{
      "body": fs.createReadStream("./fs.gz")
    }])
    .end(function (res) {
      if (res.error) {
        throw new Error(res.error);
      }
      winston.info(res.body);
      httpResponse.send(res);
    });
  });

  app.post("/unirest/attach/multer", function(httpRequest, httpResponse) {
    winston.info('/unirest/attach/multer');
    unirest.post('http://localhost:8000/consumer/multer')
    .header('Accept', 'application/json')
    .field({
      name: 'kong'
    })
    .attach('file', './fs.gz')
    // .attach('file', fs.createReadStream('./fs.gz'))  // Same as above.
    .end(function (res) {
      winston.info(res.body);
      httpResponse.send(res.body);
    });
  });

  app.post("/unirest/attach/multer/streaming", function(httpRequest, httpResponse) {
    winston.info('/unirest/attach/multer');
    unirest.post('http://localhost:8000/consumer/multer')
    .header('Accept', 'application/json')
    .field({
      name: 'kong'
    })
    .attach('file', 'http://localhost:8000/header.jpg')
    .end(function (res) {
      winston.info(res.body);
      httpResponse.send(res.body);
    });
  });

  //KO
  app.post("/unirest/multipart/upload", function(httpRequest, httpResponse) {
    winston.info('/unirest/multipart/upload');
    unirest("POST", "http://localhost:8080/upload/multipart")
    .header({
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    })
    .multipart([{
      "body": fs.createReadStream("./fs.gz")
    }])
    // .field({
    //   files: 'http://localhost:8000/header.jpg'
    // })
    .end(function (res) {
      if (res.error) {
        throw new Error(res.error);
      }
      winston.info(res.body);
      httpResponse.send(res);
    });
  });

  // KO
  app.post("/unirest/attach/upload", function(httpRequest, httpResponse) {
    winston.info('/unirest/attach/upload');
    unirest.post('http://localhost:8080/upload?filename=header.jpg')
    .headers({'Content-Type': 'multipart/form-data'})
    .attach('file', 'http://localhost:8000/header.jpg')
    .end(function (response) {
      console.log(response.body);
    });
  });
};

module.exports.initRoutes = initRoutes;
