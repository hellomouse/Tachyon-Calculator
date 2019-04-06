'use strict';

const math = require('mathjs');
const getNumberName = require('number-name');
const humanizeDuration = require('humanize-duration');
const MAX_DENOM_TO_TEST = 10000;

/* Let renderer load first */
let renderer;
setTimeout(() => {
    renderer = require('../../../../renderer.js');
});

/**
 * Get the best numerator and denominator for a 
 * decimal to fraction conversion
 * 
 * @param {number} decimal A decimal number
 * @param {number} maxError max acceptable error
 * @see https://stackoverflow.com/a/23575730
 */
function calcOptimalFraction(decimal, maxError) {
    decimal = math.number(decimal);
    let best = { n : 1, d : 1, err: 1e99 };

    for (let testd = 1; best.err > 0 && testd <= MAX_DENOM_TO_TEST; testd++) {
        let numer = Math.round(decimal * testd);
        let err = Math.abs(decimal - numer / testd);

        if (err < best.err && err < maxError) {
            best.n = numer;
            best.d = testd;
            best.err = err;
        }
    }
    return best.err === 1e99 ? null : best;
}

module.exports = {
    toFract: function(num, maxError = 0.01) {
        /* @help Convert a decimal to a fraction string, that's accurate within maxError */
        let frac = calcOptimalFraction(num, maxError) || math.fraction(num);
        return `${frac.n} / ${frac.d}`;
    },
    toMixedFract: function (num, maxError = 0.01) {
        /* @help Convert a decimal to a mixed fraction string, that's accurate within maxError */
        let frac = calcOptimalFraction(num, maxError) || math.fraction(num);
        let intPart = math.floor(math.abs(num));
        let numerator = frac.n - frac.d * math.floor(num);

        intPart = intPart === 0 ? '' : intPart;

        return `${(num < 0 ? '-' : '')}${intPart}${intPart !== '' && numerator !== 0 ? ' ' : ''}${numerator !== 0 ? `${numerator} / ${frac.d}` : ''}`;
    },
    DMS: function(angle) {
        /* @help Convert angle (in degrees) to a DMS string */
        if (angle instanceof math.type.Unit)
            angle = math.number(angle, 'deg');
        else if (typeof angle === 'string') {
            try { angle = math.number(angle); }
            catch(e) { angle = math.number(math.unit(angle), 'deg'); }
        }

        let deg = math.floor(angle);
        let min = math.floor(60 * (angle - deg));
        let sec = (((60 * (angle - deg) - min)) * 60).toFixed(5);
        return `${deg}° ${min}' ${sec}"`;
    },
    numberName: function(num) {
        /* @help Name a number, ie '1000' becomes 'one thousand' */
        num = math.number(num);

        if (num > Number.MAX_SAFE_INTEGER)
            renderer.addData('<span class="error-msg"><b>Warning: </b>Number exceeds max safe value, precision will be lost!</span><br>', true);
        return getNumberName(num);
    },
    formatSeconds: function(seconds) {
        /* @help Humanize a number of seconds */
        return humanizeDuration(math.number(seconds) * 1000);
    },
};