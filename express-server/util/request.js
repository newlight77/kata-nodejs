'use strict';

const winston = require('winston');
const unirest = require('unirest');

var request = request || {};

request.get = function(url, headers) {
  winston.info("Post : url ", data);
  return new Promise(function(resolve, reject) {
    unirest.get(url)
    .type('json')
    .headers(headers)
    .send(data)
    .end(function (response) {
      // always resolve, even on error -> unirest
      resolve(response.body);
      if (response.status != 200) {
        winston.error("post: headers ", response.headers);
        winston.error("post: status ", response.status);
        winston.error("post: body ", response.body);
      }
    });
  });
};

request.post = function(url, headers, data) {
  winston.info("Post : url ", data);
  winston.info("Post : url ", headers);
  return new Promise(function(resolve, reject) {
    unirest.post(url)
    .type('json')
    .headers(headers)
    .send(data)
    .end(function (response) {
      // always resolve, even on error -> unirest
      resolve(response.body);
    });
  });
};

request.delete = function(url, headers) {
  winston.info("Post : url ", data);
  return new Promise(function(resolve, reject) {
    unirest.delete(url)
    .type('json')
    .headers(headers)
    .send(data)
    .end(function (response) {
      // always resolve, even on error -> unirest
      resolve(response.body);
      if (response.status != 200) {
        winston.error("post: headers ", response.headers);
        winston.error("post: status ", response.status);
        winston.error("post: body ", response.body);
      }
    });
  });
};

request.put = function(url, headers, data) {
  winston.info("Post : url ", data);
  return new Promise(function(resolve, reject) {
    unirest.put(url)
    .type('json')
    .headers(headers)
    .send(data)
    .end(function (response) {
      // always resolve, even on error -> unirest
      resolve(response.body);
      if (response.status != 200) {
        winston.error("post: headers ", response.headers);
        winston.error("post: status ", response.status);
        winston.error("post: body ", response.body);
      }
    });
  });
};


module.exports = request;
