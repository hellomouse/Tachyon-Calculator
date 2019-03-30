/* Basic math functions */

'use strict';

const math = require('mathjs');
const angleTotals = require('../../../../src/state.js').degTypes;

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

/**
 * Convert one angle unit to another
 * @param {*} x            Input mathjs type
 * @param {string} unit2   Name of unit2 (To)
 * @param {string} unit1   Name of unit1 (From)
 */
function convertAngle(x, unit1, unit2) {
    /* @help Convert value x from unit1 to unit2 (where units are deg, rad, grad) */
    if (x instanceof math.type.Unit)
        return x.to(unit2);
    return math.eval(`${x}/${angleTotals[unit1]}*${angleTotals[unit2]}`);
}

/**
 * Convert radians to degrees
 * @param {*} x Input mathjs type
 */
function degrees(x) {
    /* @help Convert radians to degrees */
    return convertAngle(x, 'rad', 'deg');
}

/**
 * Convert degrees to radians
 * @param {*} x Input mathjs type
 */
function radians(x) {
    /* @help Convert degrees to radians */
    return convertAngle(x, 'deg', 'rad');
}

/**
 * Convert an array of proportions into expected
 * population totals
 * 
 * @param {number} total      Total in population
 * @param {array} proportions Array of proportions
 */
function propToExpected(total, proportions) {
    /* @help Convert array of proportions into expected totals */
    total = math.number(total);
    if (!Array.isArray(proportions))
        throw new TypeError('Proportions must be an array');
    return proportions.map(x => x * total);
}

module.exports = {
    percentDifference: percentDifference,
    perDiff: percentDifference,
    percentDiff: percentDifference,

    convertAngle: convertAngle,
    degrees: degrees,
    radians: radians,

    propToExpected: propToExpected
};