'use strict';

const Mocha = require('mocha');
const mocha = new Mocha({});

const renderer = require('../renderer.js');

// TODO iterate all js files

mocha.addFile('./test/calc-func/test-calc.js');

let successes = [];
let fails = [];

mocha.run()
    /* .on('test', function (test) {
        //renderer.test.start(test.parent.title);
    })
    .on('test end', function (test) {
        // renderer.test.end(test.title);
    }) */
    .on('pass', function (test) {
        successes.push(test);
    })
    .on('fail', function (test, err) {
        fails.push([test, err]);
    })
    .on('end', function () {
        const total = successes.length + fails.length;
        renderer.addData('Test Results<br>');
        renderer.test.addAllPasses(successes, total);
        renderer.test.addAllFails(fails, total);
        renderer.test.summary(successes, fails, total);
    });