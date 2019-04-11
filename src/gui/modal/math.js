'use strict';

const guiUtil = require('../gui-utils.js');
const Modal = require('../modal.js');

/* These are mostly builtins so no function arguments
 * can be extracted directly. */
const pages = {
    Math: {
        nthRoot: 'Get the principle nth root of a number',
        fMin: 'TODO',
        fMax: 'TODO',
        derivative: 'Calculate the derivative of a function, optionally at a value',
        integrate: 'Calculate a definite or indefinite integral of a function',
        summation: 'Sum an expression from a to b',
        log: 'Calculate the logarithm, default base is e',
        solver: 'Solve an equation or a system of equations'
    },
    Num: {
        abs: 'Get absolute value of a number',
        round: 'Round a number to nearest integer',
        floor: 'Round number down to nearest integer',
        ceil: 'Round number up to nearest integer',
        fPart: 'Get float part of a number',
        min: 'Get min of a list of values',
        max: 'Get max of a list of values',
        lcm: 'Get lowest common multiple of 2 or more numbers',
        gcd: 'Get greatest common divisior of 2 or more numbers',
        mod: 'Get remainder after division'
    },
    Cmplx: {
        conj: 'Get the complex conjugate',
        re: 'Get real part of a number',
        im: 'Get imaginary part of a number',
        angle: 'Get angle of a complex number (polar)',
        rectToPolar: 'Convert complex number to polar',
        polarToRect: 'Convert r, theta to rectangular',
        complexFromPolar: 'Create a complex number from polar form'
    },
    Prob: {
        nPr: 'Get permutations of r out of n',
        nCr: 'Get combinations of r out of n',
        '!': 'Factorial of a number',
        random: 'Generate a random number from 0 to 1',
        randInt: 'Generate random int(s) from a to b',
        randNorm: 'Generate a random normally distributed number',
        randBin: 'Simulate binomial trials and estimate expected value',
        randIntNoReplacement: 'Generate random int(s) with no replacement',
    },
    Frac: {
        toFract: 'Convert decimal to fraction',
        toMixedFract: 'Convert decimal to mixed fraction'
    }
};

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Math</h2>

    ${guiUtil.generateTabsFromPage(pages, '100px')}

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`);
modal.tabs = Object.keys(pages).length;
module.exports = modal;