/* Basic math functions */

'use strict';

const math = require('mathjs');
const path = require('path');
const nerdamer = require(path.dirname(require.resolve('nerdamer')) + '/all.js');
const state = require('../../../../src/state.js');
const angleTotals = state.degTypes;

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
 * Converts radians to current degMode
 * @param {number} rad Radians
 */
function convertToCurrentDegType(rad) {
    return convertAngle(rad, 'rad', state.degMode);
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

/**
 * Fill an array or matrix with a value
 * @param {array} arr    Array or matrix
 * @param {number} value Value to fill
 */
function fill(arr, value) {
    /* @help Fill a matrix or list with a value */
    return math.map(arr, () => value);
}

/**
 * Cumulative sum array of an array
 * @param {array} arr Array of numbers
 */
function cumSum(arr) {
    /* @help Cumulative sum list */
    let curSum = 0;
    let ans = [];

    arr.forEach(num => {
        if (Number.isNaN(num))
            throw new TypeError('All elements of list must be a number');
        curSum += math.number(num);
        ans.push(curSum);
    });
    return ans;
}

/**
 * Difference between consecutive elements array of an array
 * @param {array} arr Array of numbers
 */
function deltaList(arr) {
    /* @help Get difference between consecutive terms */
    let ans = [];
    if (!Array.isArray(arr))
        arr = arr.toArray();

    arr.forEach((num, i) => {
        if (Number.isNaN(num))
            throw new TypeError('All elements of list must be a number');
        if (i === 0) return;
        ans.push(math.number(num) - math.number(arr[i - 1]));
    });
    return ans;
}

module.exports = {
    percentDifference: percentDifference,
    perDiff: percentDifference,
    percentDiff: percentDifference,

    convertAngle: convertAngle,
    degrees: degrees,
    radians: radians,

    propToExpected: propToExpected,

    /* Conversions */
    rectToPolar: function(x, y) {
        /* @help Convert (x, y) to polar (r, theta) */
        if (math.type.isComplex(x)) {
            y = x.im;
            x = x.re;
        }
        return [math.sqrt(x * x + y * y), convertToCurrentDegType(math.atan2(y, x))];
    },
    polarToRect: function(r, theta) {
        /* @help Convert (r, theta) to rect (x, y) */
        return [r * math.cos(theta), r * math.sin(theta)];
    },
    angle: function(num) {
        /* @help Get the angle of a complex number */
        return convertToCurrentDegType(math.atan2(num.im, num.re));
    },
    complexFromPolar: function(r, theta) {
        /* @help Create a complex number from polar */
        return math.type.Complex.fromPolar(r, theta);
    },
    fill: fill,
    cumSum: cumSum,
    deltaList: deltaList,
    fPart: function(x) {
        /* @help Get the fractional part of a number */
        return math.abs(x) - math.floor(math.abs(x));
    },
    solve: function(eq, variable) {
        /* @help Solve an equation for variable, or a system (Pass a list of equations) */
        if (!Array.isArray(eq))
            eq = eq.toArray();
        if (!variable)
            return nerdamer.solveEquations(eq).map(x => `${x[0]} = ${x[1]}`).join('<br>');
        return nerdamer.solveEquations(eq, variable).join(', ');
    }
};