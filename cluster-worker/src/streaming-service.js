
'use strict';

const fs = require('fs');
const jsonStream = require('JSONStream');
const color = require('chalk');

const util = require('./util');

let maxSize = 1000;

let readFromFile = function (file) {
      return new Promise(function(resolve, reject) {
          console.log(`readFromFile ${color.yellow(file)}`);

          var processed = 0;
          var startTime = Date.now();
          let jsonfile = fs.createReadStream(file, {encoding: 'utf8'})
          .on('error', function (err) {
              reject(err);
          })
          .on('end', function () {
            util.metrics(file, startTime, processed);
            resolve();
          });

          let readStream = jsonfile.pipe(jsonStream.parse('*'));

          readStream.on('data', function(row) {
              if (processed < maxSize) {
                // row = Object.entries(row).filter(attribute => attribute !== null);
                let value = JSON.stringify(row);
                console.log(`row ${color.yellow(value)}`);

                // todo process json

                if (processed%100 == 0) {
                  util.metrics(file, startTime, processed);
                }
                processed++;
              } else {
                jsonfile.pause();
                util.metrics(file, startTime, processed);
                resolve();
                throw `${color.red("MaxSize reached! please set a higher maxSize in ")} ${color.yellow("config.json")}`;
              }
          });

      });
}


module.exports.readFromFile = readFromFile;
