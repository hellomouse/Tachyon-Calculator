/* Random number generation */

'use strict';

const math = require('mathjs');
const crypto = require('crypto');

/* TODO

all the dist shit -> populate an array too

ti-randint
ti-randint-predictor

*/

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

    if (count <= 0 || Math.floor(count) != count)
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

        if (count <= 0 || Math.floor(count) != count)
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
    }
};
