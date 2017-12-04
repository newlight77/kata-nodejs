'use strict';

var winston = require('winston');
var querystring = require('querystring');
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
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      winston.info(response.body);
      httpResponse.send(response);
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
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      winston.info(response.body);
      httpResponse.send(response);
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
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      winston.info('body', response.body);
      httpResponse.send(response.body);
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
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      winston.info(response.body);
      httpResponse.send(response.body);
    });
  });

  app.post("/unirest/attach/upload", function(httpRequest, httpResponse) {
    winston.info('/unirest/attach/upload');
    unirest.post('http://localhost:8080/upload?filename=header.jpg')
    // .headers({'Content-Type': 'multipart/form-data'})
    .header('Accept', 'application/json')
    .attach('file', 'http://localhost:8000/header.jpg')
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      console.log(response.body);
      httpResponse.send("Successfully uploaded!");
    });
  });

  //KO
  app.post("/unirest/multipart/upload", function(httpRequest, httpResponse) {
    winston.info('/unirest/multipart/upload');
    unirest("POST", "http://localhost:8080/upload/multipart")
    // .header({
    //   "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    // })
    .headers({'Content-Type': 'multipart/form-data'})
    .multipart([{
      "body": fs.createReadStream("./fs.gz")
    }])
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      winston.info(response.body);
      // httpResponse.send(res);
      httpResponse.send("Successfully uploaded!");
    });
  });

  //KO
  app.post("/unirest/multipart/field/upload", function(httpRequest, httpResponse) {
    winston.info('/unirest/multipart/field/upload');
    unirest("POST", "http://localhost:8080/upload/multipart")
    // .header({
    //   "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    // })
    // .headers({'Content-Type': 'multipart/form-data'})
    .header('Accept', 'application/json')
    .field({
      files: fs.createReadStream("./fs.gz")
    })
    .end(function (response) {
      if (response.error) {
        throw new Error(response.error);
      }
      winston.info(response.body);
      // httpResponse.send(response);
      httpResponse.send("Successfully uploaded!");
    });
  });

};

module.exports.initRoutes = initRoutes;
