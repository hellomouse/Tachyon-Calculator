/* Basic math functions */

'use strict';

const math = require('mathjs');

const percentDifference = math.typed('percentDifference', {
    'number, number': function(trueVal, experimental) {
        return Math.abs(trueVal - experimental) / trueVal;
    },
    'BigNumber, BigNumber': function (trueVal, experimental) {
        return math.abs(trueVal.sub(experimental)).div(trueVal);
    },
});

module.exports = {
    percentDifference: percentDifference,
    perDiff: percentDifference,
    percentDiff: percentDifference,
}