const cp = require('child_process');
const color = require('chalk');
const globby = require("globby");

let alives = 0;
globby( ['./data/**.json'])
    .then(files => {
        files.forEach( function( file, index ) {
            console.log(`file : ${color.blue(file)}`);
            const sp = cp.fork(`${__dirname}/src/subprocess.js`);
            sp.on('message', (m) => {
              console.log('PARENT got message:', m);
              alives--;
              console.log(`alives : ${color.blue(alives)}`);
              if (alives < 1) {
                process.exit();
              }
            });
            sp.send(file);
            alives++;

            console.log(`alives : ${color.blue(alives)}`);
        });
     });
