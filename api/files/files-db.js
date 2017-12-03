'use strict';

var winston = require('winston');
var fs = require('fs');
var Loki = require('lokijs');
var lokiUtil = require('../../util/loki-util');

const DB_NAME = 'files-db.json';
const COLLECTION_NAME = 'files';
const UPLOAD_PATH = 'uploads';
const db = new Loki('uploads/files-db.json', {
  persistenceMethod: 'fs'
});

lokiUtil.cleanFolder(UPLOAD_PATH);

const save = async function (data) {
  winston.info(data, 'data');
  
  try {
    const col = await lokiUtil.loadCollection(COLLECTION_NAME, db);
    const result = col.insert(data);
    winston.info('saveDatabase');
    db.saveDatabase();

    if (Array.isArray(result) ) {
      return result.map(x => ({
        id: x.$loki,
        fileName: x.filename,
        originalName: x.originalname
      }));
    } else {
      return {
        id: result.$loki,
        fileName: result.filename,
        originalName: result.originalname
      };
    }
  } catch (err) {
    throw "unable to store data"
  }
  //httpResponse.send('good');
};

const findAll = async function() {
  try {
    const col = await lokiUtil.loadCollection(COLLECTION_NAME, db);
    return col.data;
  } catch (err) {
    winston.error('error while retrieving files');
  }
};

const get = async function (id, httpResponse) {
    try {
      const col = await lokiUtil.loadCollection(COLLECTION_NAME, db);
      const result = col.get(id);

      if (!result) {
        httpResponse.sendStatus(404);
        return;
      };

      httpResponse.setHeader('Content-Type', result.mimetype);
      fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(httpResponse);
    } catch (err) {
      httpResponse.sendStatus(400);
    }
};

module.exports.save = save;
module.exports.findAll = findAll;
module.exports.get = get;
