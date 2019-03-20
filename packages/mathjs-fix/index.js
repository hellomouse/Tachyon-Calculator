/* Fixes and modifications to math js */
'use strict';

const math = require('mathjs');
const digits = require(require.resolve('mathjs').replace('index.js', '') + 'src/utils/number').digits;

/* Ignore the error for implict conversions from number
 * to BigNumber, where precision is lost, as all calculator
 * functions that do not have a big number varient should not
 * be viewed as precise anyways */
math.typed.conversions[0].convert = function (x) {
    if (digits(x) > 100)
        throw new TypeError('Cannot implicitly convert a number with >100 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
    return new math.type.BigNumber(x);
}

/* Alias for log: ln */
math.import({ ln: math.log });

/* Alias for log base 2: lg */
math.import({ lg: math.log2 });