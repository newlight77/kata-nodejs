var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var winston = require('winston');

var routes = require('./routes');

var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', express.static(path.join(__dirname, 'public')));

routes.initRoutes(app);

app.listen(8000, function () {
  winston.info('Le serveur est lancé sur le port 8000');
});
