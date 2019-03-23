/* Fixes and modifications to math js */
'use strict';

const math = require('mathjs');
const digits = require(require.resolve('mathjs').replace('index.js', '') + 'src/utils/number').digits;
const getFunctionArguments = require('get-function-arguments');

/* Ignore the error for implict conversions from number
 * to BigNumber, where precision is lost, as all calculator
 * functions that do not have a big number varient should not
 * be viewed as precise anyways */
math.typed.conversions[0].convert = function (x) {
    if (digits(x) > 100)
        throw new TypeError('Cannot implicitly convert a number with >100 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
    return new math.type.BigNumber(x);
};

/* Alias for log: ln */
math.import({ ln: math.log });

/* Alias for log base 2: lg */
math.import({ lg: math.log2 });

/* Hack to add a reference to the original function
 * when adding a typed function to mathjs */
let allFunctions = {}; // Dir of original function reference
let typedFunctions = {}; // Dir of typed functions

/**
 * Add a function to all functions. If a function is typed
 * it handles alias references when importing
 *
 * @param {string}   name Name of the function
 * @param {function} func The function
 */
function addFunction(name, func) {
    /* Name checks */
    if (func instanceof Function && func.name !== 'anonymous'
        && !func.name.startsWith('_') && func.name) {

        /* Check if function was already added to mathjs (in which case)
        * the arguments should be named arg1, arg2 */
        let fString = func.toString();
        if (fString.includes('arguments') && fString.includes('return generic.apply')) {
            if (typedFunctions[func.name]) {
                allFunctions[name] = typedFunctions[func.name];
                return true;
            }
            return false;
        }
        allFunctions[name] = func;
        return true;
    }
    return false;
}

const wrapMathTyped = function(fn) {
    return function() {
        /* Add the function to a universial array
         * of all math js functions */
        if (arguments.length > 1) {
            let temp = arguments[1];
            temp = temp ? temp[Object.keys(temp)[1]] : false;

            if (temp && !arguments[0].startsWith('_')) {
                allFunctions[arguments[0]] = temp;
                typedFunctions[arguments[0]] = temp;
            }
        }
        return fn.apply(this, arguments);
    };
};
math.typed = wrapMathTyped(math.typed);

const iterateObjToAddFunc = function(obj) {
    for (let key of Object.keys(obj)) {
        if (addFunction(key, obj[key]))
            undefined; // Do nothing
        else if (typeof obj[key] === 'object')
            iterateObjToAddFunc(obj[key]);
    }
};
const wrapMathImport = function(fn) {
    return function() {
        /* Add imported functions to math array ONLY
         * if it a vanilla js function (not typed) */
        if (arguments.length > 0) iterateObjToAddFunc(arguments[0]);
        return fn.apply(this, arguments);
    };
};
math.import = wrapMathImport(math.import);

module.exports = allFunctions;