'use strict';

const winston = require('winston');
const querystring = require('querystring');
const request = require('../../util/request');
const unirest = require('unirest');

let userData = require('./data/user-template.json');

var initRoutes = function (app) {
  app.post('/user/post', function (httpRequest, httpResponse) {
    winston.info("POST /user/post");
    winston.info(httpRequest.body);
    request.post('http://localhost:8000/db/user', '{"Content-Type":"application/json"}', userData)
    .then(res => {
      winston.info(res);
      var result = JSON.stringify(res);
      winston.info(result);
      httpResponse.end(res);
    });
  });

  app.post('/user/post2', function (httpRequest, httpResponse) {
    winston.info("POST /user/post");
    winston.info(httpRequest.body);

    unirest.post('http://localhost:8000/db/user')
    .type('json')
    .headers('{"Content-Type":"application/json"}')
    .send(httpRequest.body)
    .end(function (response) {
      winston.info("post: response.body ", response.body);
      winston.info("post: response.status ", response.status);
      // always resolve, even on error -> unirest
      httpResponse.end(response.body);
      if (response.status != 200) {
        winston.error("post: headers ", response.headers);
        winston.error("post: status ", response.status);
        winston.error("post: body ", response.body);
      }
    });
  });
};

module.exports.initRoutes = initRoutes;
