'use strict';

var winston = require('winston');
var fs = require('fs');
var unirest = require('unirest');
var request = require('request');

var initRoutes = function(app) {

  app.post("/post/request", function() {
    fs.createReadStream('/Users/kong/Downloads/justificatif.pdf').pipe(request.post('http://localhost:8080/upload?filenanme=test.js'));
  });


  app.post('/post/request/consumer/busboy', function(httpRequest, httpResponse) {
    var options = {
      method: 'POST',
      url: 'http://localhost:8000/consumer/busboy',
      headers: {
        'postman-token': '7bd5b181-f90a-f6a5-6c38-d171b0c9e149',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData: {
        file: {
          value: fs.createReadStream("/Users/kong/Downloads/justificatif.pdf"),
          options: {
            filename: 'justificatif.pdf',
            contentType: null
          }
        }
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        throw new Error(error);
      }
      winston.info(body);
      httpResponse.end();
    });
  });

  app.post('/post/request/consumer/multer', function(httpRequest, httpResponse) {
    var options = {
      method: 'POST',
      // url: 'http://localhost:8080/upload/fileupload',
      url: 'http://localhost:8000/consumer/multer',
      headers: {
        'postman-token': '7bd5b181-f90a-f6a5-6c38-d171b0c9e149',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData: {
        file: {
          value: fs.createReadStream("/Users/kong/Downloads/justificatif.pdf"),
          options: {
            filename: 'justificatif.pdf',
            contentType: null
          }
        }
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        throw new Error(error);
      }
      winston.info(body);
      httpResponse.end();
    });
  });

  // post on an instance of https://github.com/newlight77/gs-uploading-files
  app.post('/post/request/fileupload', function(httpRequest, httpResponse) {
    var options = {
      method: 'POST',
      url: 'http://localhost:8080/upload/multipart',
      headers: {
        'postman-token': '7bd5b181-f90a-f6a5-6c38-d171b0c9e149',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData: {
        file: {
          value: fs.createReadStream("/Users/kong/Downloads/justificatif.pdf"),
          options: {
            filename: 'justificatif.pdf',
            contentType: null
          }
        }
      }
    };

    request(options, function(error, response, body) {
      if (error) {
        throw new Error(error);
      }
      winston.info(body);
      httpResponse.end();
    });
  });

  // post on an instance of https://github.com/newlight77/gs-uploading-files
  app.post('/post/request/fileupload', function(httpRequest, httpResponse) {
    var options = {
      method: 'POST',
      url: 'http://localhost:8080/upload/fileupload',
      headers: {
        'postman-token': '7bd5b181-f90a-f6a5-6c38-d171b0c9e149',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
      formData: {
        file: {
          value: fs.createReadStream("/Users/kong/Downloads/justificatif.pdf"),
          options: {
            filename: 'justificatif.pdf',
            contentType: null
          }
        }
      }
    };

    request(options, function(error, response, body) {
      if (error) {
        throw new Error(error);
      }
      winston.info(body);
      httpResponse.end();
    });
  });
};

module.exports.initRoutes = initRoutes;
