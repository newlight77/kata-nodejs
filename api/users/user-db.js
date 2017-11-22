'use strict';

const winston = require('winston');
var Loki = require('lokijs');
var lokiUtil = require('../../util/loki-util');
var userApi = require('./user-api');

const db = new Loki('uploads/users.json', {
  persistenceMethod: 'fs'
});

winston.info("./api/users/user-db.js");

var initRoutes = function (app) {
  app.post('/db/user', async(httpRequest, httpResponse) => {
    winston.info(httpRequest.body, 'Body');
    try {
      const col = await lokiUtil.loadCollection('users', db);
      var user = JSON.stringify(httpRequest.body);
      winston.info(user);
      const data = col.insert(JSON.parse(user));
      winston.info('data', data);
      winston.info('saveDatabase');
      db.saveDatabase();
      // httpResponse.send({
      //   id: data.$loki,
      //   body: data
      // });
      httpResponse.end();
    } catch (err) {
      httpResponse.sendStatus(400);
    }
  });

  app.get('/db/users', async(httpRequest, httpResponse) => {
    try {
      const col = await lokiUtil.loadCollection('users', db);
      httpResponse.send(col.data);
      httpResponse.end();
    } catch (err) {
      winston.error('error while retrieving images');
      httpResponse.sendStatus(400);
    }
  });
};

module.exports.initRoutes = initRoutes;
