var Mocha = require('mocha');

var mocha = new Mocha({});

// TODO iterate all js files

mocha.addFile('./test/calc-func/test-calc.js');

mocha.run()
    .on('test', function(test) {
        console.log('Test started: '+test.title);
    })
    .on('test end', function(test) {
        //console.log('Test done: '+test.title);
    })
    .on('pass', function(test) {
        console.log('Test passed');
        console.log(test);
    })
    .on('fail', function(test, err) {
        console.log('Test fail');
        console.log(test);
        console.log(err);
    })
    .on('end', function() {
        //console.log('All done');
    });