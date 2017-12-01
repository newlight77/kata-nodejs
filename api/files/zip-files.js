'use strict';

var winston = require('winston');
var fs = require('fs');
var zlib = require('zlib');
var fstream = require('fstream');
fs.createReadStream('README')
.pipe(zlib.createGzip())
.pipe(fs.createWriteStream('readme.gz'));

fstream.Reader({ 'path': './public', 'type': 'Directory' })
.pipe(zlib.createGzip())
.pipe(fs.createWriteStream('fs.gz'));

fstream.Reader({ 'path': './public', 'type': 'Directory' })
.pipe(zlib.Gzip())
.pipe(fstream.Writer({ 'path': 'fsstream.gz' }));

var init = function () {
  winston.info('created zip files');
};

module.exports.init = init;
