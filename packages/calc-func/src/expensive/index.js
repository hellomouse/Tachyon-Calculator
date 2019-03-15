/* Functions that can be computationally expensive */

'use strict';

const math = require('mathjs');
const errors = require('../util/errors.js');
const state = require('../../../../src/state.js');
const primes = require('../util/primes.js');

/* Let renderer load first */
let renderer;
setTimeout(() => { renderer = require('../../../../renderer.js'); }, 1000);

const powMod = math.typed('powMod', {
    'number, number, number': function (base, exponent, modulus) {
        if (base < 1 || exponent < 0 || modulus < 1)
            return -1;
        let result = 1;
        while (exponent > 0) {
            if ((exponent % 2) === 1)
                result = (result * base) % modulus;
            base = (base * base) % modulus;
            exponent = exponent >> 1;
        }
        return result;
    },

    'BigNumber, BigNumber, BigNumber': function (base, exponent, modulus) {
        if (base.lessThan(1) || exponent.lessThan(0) || modulus.lessThan(1))
            return math.bignumber(-1);
        let result = math.bignumber(1);
        while (exponent.greaterThan(0)) {
            if ((exponent.mod(2)).equals(1))
                result = result.multiply(base).mod(modulus);
            base = base.multiply(base).mod(modulus);
            exponent = math.floor(exponent.div(2));
        }
        return result;
    }
});

/* Prime factorization formatter */
function formatPrimeFactorization(vals) {
    let counts = {};
    for (let val of vals)
        counts[val] = counts[val] ? counts[val] + 1 : 1;
    
    let ans = [];
    for (let key of Object.keys(counts))
        ans.push(`${key}<sup>${counts[key]}</sup>`);
    return ans.join(' ⋅ ');
}

/* Prime factorization, override */
const primeFactors = math.typed('factorization', {
    'number': function (num) {
        if (num === 0) return [];

        /* Precision check */
        if (num > Number.MAX_SAFE_INTEGER)
            throw new errors.PrecisionError('Number is too large and will lose precision; this function cannot return an accurate value (Consider using BigNumber?)');

        /* Iterate all primes from 1-7000 ish
         * until number is equal to 1, covers most
         * prime factors */
        let factors = [];
        for (let prime of primes) {
            if (num === 1) break;
            while (num % prime === 0) {
                factors.push(prime);
                num /= prime;
            }
        }
        /* Number contains large prime factors */
        if (num !== 1) {
            let startTime = new Date();
            for (let prime = primes[primes.length - 1]; prime < math.sqrt(num); prime += 2) {
                if (num === 1) break;
                if (new Date() - startTime > state.maxFuncRunTime)
                    throw new errors.TimeoutError('Calculation timed out, factors so far are<br>' +
                        formatPrimeFactorization(factors));

                while (num % prime === 0) {
                    factors.push(prime);
                    num /= prime;
                }
            }
            /* Number itself is prime */
            if (num !== 1) factors.push(num);
        }
        renderer.addData(formatPrimeFactorization(factors), true);
        return factors;
    },

    'BigNumber': function (num) {
        if (num.equals(0)) return [];

        /* Same as above function */
        let factors = [];
        for (let prime of primes) {
            if (num.equals(1)) break;
            while (num.mod(prime).equals(0)) {
                factors.push(prime);
                num = num.div(prime);
            }
        }
        if (!num.equals(1)) {
            let startTime = new Date();
            for (let prime = math.bignumber(primes[primes.length - 1]); prime.lessThan(math.sqrt(num)); prime.add(2)) {
                if (num.equals(1)) break;
                if (new Date() - startTime > state.maxFuncRunTime)
                    throw new errors.TimeoutError('Calculation timed out, factors so far are<br>' + 
                        formatPrimeFactorization(factors));

                while (num.mod(prime).equals(0)) {
                    factors.push(prime);
                    num = num.div(prime);
                }
            }
            if (!num.equals(1)) factors.push(num);
        }
        renderer.addData(formatPrimeFactorization(factors), true);
        return factors;
    }
});

module.exports = {
    powMod: powMod,

    factorization: primeFactors,
    primeFactors: primeFactors,
    primeFactorization: primeFactors
}