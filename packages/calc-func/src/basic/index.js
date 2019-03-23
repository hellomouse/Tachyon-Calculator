/* Basic math functions */

'use strict';

const math = require('mathjs');

const percentDifference = math.typed('percentDifference', {
    'number, number': function(experimental, trueVal) {
        /* @help Calculate percent difference between true value and experimental */
        return Math.abs(trueVal - experimental) / trueVal;
    },
    'BigNumber, BigNumber': function (experimental, trueVal) {
        /* @help Calculate percent difference between true value and experimental */
        return math.abs(trueVal.sub(experimental)).div(trueVal);
    },
});

module.exports = {
    percentDifference: percentDifference,
    perDiff: percentDifference,
    percentDiff: percentDifference,
};