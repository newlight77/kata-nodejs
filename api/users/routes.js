'use strict';

const winston = require('winston');

var userApi = require('./user-api');
var userDb = require('./user-db');

var initRoutes = function (app) {
  userApi.initRoutes(app);
  winston.info('./api/users/user-api.js');
  userDb.initRoutes(app);
  winston.info('./api/users/user-db.js');
};


module.exports.initRoutes = initRoutes;
