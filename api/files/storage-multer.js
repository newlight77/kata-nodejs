'use strict';

var winston = require('winston');
var fs = require('fs');
var multer = require('multer');
var Loki = require('lokijs');
var lokiUtil = require('../../util/loki-util');
var filesDb = require('./files-db');

const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({
  dest: './uploads'
}); // multer configuration
const db = new Loki('uploads/d.json', {
  persistenceMethod: 'fs'
});

lokiUtil.cleanFolder(UPLOAD_PATH);

var initRoutes = function(app) {
  app.post('/consumer/multer', upload.single('file'), async (httpRequest, httpResponse) => {
    winston.info('receiving file', httpRequest.file);
    winston.info('Body', httpRequest.body);
    winston.info('file', httpRequest.file);
    winston.info('files', httpRequest.files);

    // let data = filesDb.save(httpRequest.file)
    // .then((data) => {
    //   winston.info('data ---- ', data);
    //   httpResponse.send({
    //     id: data.$loki,
    //     fileName: data.filename,
    //     originalName: data.originalname
    //   });
    //   winston.info('data ---- end');
    // }, (error) => {
    //   winston.error('error save file', httpRequest.file);
    //   httpResponse.sendStatus(400);
    // });

    try {
      let data = await filesDb.save(httpRequest.file);
      winston.info('data', httpRequest.files);
      httpResponse.send({
        id: data.$loki,
        fileName: data.filename,
        originalName: data.originalname
      });
    } catch (err) {
      winston.error('error save file', httpRequest.file);
      httpResponse.sendStatus(400);
    }
  });

  app.post('/consumer/multer/photos', upload.array('photos', 12), async(httpRequest, httpResponse) => {
    try {
      let data = await filesDb.save(httpRequest.files);

      httpResponse.send(data.map(x => ({
        id: x.$loki,
        fileName: x.filename,
        originalName: x.originalname
      })));
    } catch (err) {
      httpResponse.sendStatus(400);
    }
  });

  app.get('/images', async(httpRequest, httpResponse) => {
    try {
      let col = await filesDb.findAll();
      httpResponse.send(col.data);
    } catch (err) {
      winston.error('error while retrieving images');
      httpResponse.sendStatus(400);
    }
  });

  app.get('/images/:id', async(httpRequest, httpResponse) => {
    await filesDb.get(httpRequest.params.id, httpResponse);
  });

};

module.exports.initRoutes = initRoutes;
