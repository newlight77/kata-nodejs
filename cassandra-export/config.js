'use strict';

let config = require('./config.json');

let host = process.env.HOST || '127.0.0.1';
let port = process.env.PORT || 9042;
let keyspace = process.env.KEYSPACE;
let user = process.env.USER;
let password = process.env.PASSWORD;

if (process.env.KEYSPACE) {
  config.keyspace = process.env.KEYSPACE;
}
if (process.env.HOST) {
  config.host = process.env.HOST;
}

if (process.env.PORT) {
  config.host = process.env.PORT;
}

if (process.env.USER) {
  config.user = process.env.USER;
}

if (process.env.PASSWORD) {
  config.password = process.env.PASSWORD;
}

if (process.env.ONLY_TABLES) {
  config.onlytables = process.env.ONLY_TABLES;
}

if (process.env.EXCLUDED_TABLES) {
  config.excludetables = process.env.EXCLUDED_TABLES;
}

if (process.env.EXPORT_DIR) {
  config.exportdir = process.env.EXPORT_DIR;
}

module.exports = config;
