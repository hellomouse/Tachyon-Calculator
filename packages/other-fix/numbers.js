/* Fix for numbers.js, where some functions are 
* not properly imported into mathjs */

const numbers = require('numbers');
const math = require('mathjs');
const mathjsFix = require('mathjs-fix').allFunctions;

/* Wrap all number functions to convert big numbers to
 * numbers as numbers does typeof checking */

/**
 * Wrap a function with a thing that replaces
 * all arguments with numbers
 * 
 * @param {function} fn Function to wrap
 */
function wrapNumType(fn) {
    return function() {
        let args = Array.from(arguments).map(x => math.number(x));
        return fn.apply(this, args);
    };
}

/**
 * Wraps all functions in the object
 * with the above wrapper
 * 
 * @param {obj} obj Numbers.js object
 */
function wrapAllFunctions(obj) {
    for (let key of Object.keys(obj)) {
        if (obj[key] instanceof Function) {
            /* Add to help function index */
            mathjsFix[key] = obj[key];
            obj[key] = wrapNumType(obj[key]);
        }
        else wrapAllFunctions(obj[key]);
    }
}

/* Rename prime.simple in numbers.js as isPrime */
numbers['isPrime'] = numbers.prime.simple;
delete numbers.prime.simple;

/* Add NCR as alias for binomial */
numbers['nCr'] = numbers.basic.binomial;
numbers['ncr'] = numbers.basic.binomial;

/* NPR function */
numbers['nPr'] = (n, k) => { return numbers.basic.factorial(k) * numbers.basic.binomial(n, k); };
numbers['npr'] = numbers.nPr;

/* Since numbers.js does type checking and is incompatiable
 * with big number and fraction modes, we'll do a little rounding */
wrapAllFunctions(numbers);