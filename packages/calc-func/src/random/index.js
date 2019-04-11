/* Random number generation */

'use strict';

const math = require('mathjs');
const crypto = require('crypto');
const distriprob = require('distriprob');

/**
 * Generate random integers
 * @param {number} a     Low
 * @param {number} b     High
 * @param {number} count Number to generate
 */
function randInt(a, b, count=1) {
    /* @help Generate a random integer(s) from a to b inclusive */
    count = math.number(count);
    a = math.number(a);
    b = math.number(b);

    if (count <= 0 || Math.floor(count) !== count)
        throw new Error('Count must be an integer greater than 0');
    if (count > 50)
        throw new Error('Too many random numbers to generate, must < 51');

    if (count === 1) return math.floor((b - a + 1) * Math.random() + a);
    return new Array(count).fill(0).map(() => math.floor((b - a + 1) * Math.random() + a));
}

module.exports = {
    randInt: randInt,
    randomInt: randInt,
    uniform: function(low, high) {
        /* @help Generate a random float number between low and high */
        low = math.number(low);
        high = math.number(high);
        return Math.random() * (high - low) + low;
    },
    randIntNoReplacement: function(a, b, count) {
        /* @help Generate a random integer(s) from a to b inclusive without replacement */
        count = math.number(count);
        a = math.number(a);
        b = math.number(b);

        if (count <= 0 || Math.floor(count) !== count)
            throw new Error('Count must be an integer greater than 0');
        if (count > 50)
            throw new Error('Too many random numbers to generate, must < 51');
        if (b - a + 1 < count)
            throw new Error('Not enough unique integers in range');

        if (count === 1) return math.floor((b - a + 1) * Math.random() + a);
        let final = [];
        while (final.length < count) {
            let rand = math.floor((b - a + 1) * Math.random() + a);
            if (!final.includes(rand))
                final.push(rand);
        }
        return final;
    },
    shuffle: function(arr) {
        /* @help Shuffle a copy of an array */
        let newarr = arr.slice();
        let rand, i, temp;

        for(i = newarr.length - 1; i > 0; i--) {
            rand = Math.floor(Math.random() * (i + 1));
            temp = newarr[i];
            newarr[i] = newarr[rand];
            newarr[rand] = temp;
        }
        return newarr;
    },
    randomBytes: function(encoding='hex') {
        /* @help Generate random byte string */
        return crypto.randomBytes(32).toString(encoding);
    },
    randNorm: function(count=1) {
        /* @help Generate random number(s) by a normal distribution */
        count = math.number(count);
        if (count <= 0 || Math.floor(count) !== count)
            throw new Error('Count must be an integer greater than 0');
        if (count > 50)
            throw new Error('Too many random numbers to generate, must < 51');
        let temp = distriprob.normal.randomSync(count);
        return count === 1 ? temp[0] : temp;
    },
    randBin: function(trials, prob, numSims) {
        /* @help Simulate binomial trials, estimating an expected value */
        trials = math.number(trials);
        prob = math.number(prob);
        numSims = math.number(numSims);

        if (numSims <= 0 || Math.floor(numSims) !== numSims)
            throw new Error('NumSims must be an integer greater than 0');
        if (numSims > 50)
            throw new Error('Too many simulations, must < 51');
        if (prob < 0 || prob > 1)
            throw new Error('Prob must be between 0 and 1 inclusive');
        if (trials < 1 || trials > 10000 || Math.floor(trials) !== trials)
            throw new Error('Trials must be an integer between 1 and 10000 inclusive');

        let temp = [];
        for (let i = 0; i < numSims; i++) {
            let tempArr = [];
            for (let i = 0; i < trials; i++)
                tempArr.push(Math.random());
            temp.push(tempArr.filter(x => x < prob).length);
        }
        return numSims === 1 ? temp[0] : temp;
    },
    randMat: function(row, col) {
        /* @help Generate a random matrix */
        return math.random([row, col]);
    },
    randPoly: function(variable, degree) {
        /* @help Generate a random polynomial */
        if (typeof variable !== 'string' || variable.length !== 1)
            throw new Error('Variable must be a string of length 1');
        degree = math.number(degree);
        if (degree < 0 || degree > 99 || Math.floor(degree) !== degree)
            throw new Error('Degree must be an int from 0-99 inclusive');
        let vars = [];
        for (let i = 0; i <= degree; i++) {
            let x = i === 0 ? '' : (i === 1 ? 'x' : 'x<sup>' + i + '</sup>');
            vars.push(Math.floor(Math.random() * 9 + 1) + x);
        }
        let string = vars[0];
        for (let i = 1; i < vars.length; i++)
            string += ` ${(Math.random() < 0.5 ? '-' : '+')} ${vars[i]}`;
        return string;
    },
    randBool: function() {
        /* @help Generate a random boolean */
        return Math.random() < 0.5 ? true : false;
    }
};
