'use strict';
var globby = require("globby");
// var glob = require("glob");
// var fs = require( 'fs' );
// var path = require( 'path' );

var winston = require('winston');

var initRoutes = function (app) {

  globby( ['./api/**/routes.js'])
      .then(files => {
          files.forEach( function( file, index ) {
              winston.info(file);
              require(file).initRoutes(app);
          });
       });

    //  globby( ['./datasets/**/routes.js'])
    //      .then(function(files) {
    //          files.forEach( function( file, index ) {
    //              winston.info(file);
    //              var dataset = require('../' + file);
    //              dataset.initRoutes(app);
    //          });
    //       });

    //
    //
    // glob( './datasets/**/routes.js', function( err, files ) {
    //     if( err ) {
    //         winston.error( "Could not list the directory.", err );
    //         exit( 1 );
    //     }
    //
    //     files.forEach( function( file, index ) {
    //         winston.info(file);
    //         // var dataset = require('../' + file);
    //         // dataset.initRoutes(app);
    //     });
    // });

};

module.exports.initRoutes = initRoutes;
