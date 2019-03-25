/* Functions that can be computationally expensive */

'use strict';

const math = require('mathjs');
const errors = require('../util/errors.js');
const state = require('../../../../src/state.js');
const primes = require('../util/primes.js');

/* Let renderer load first */
const renderer = require('../../../../renderer.js');

const powMod = math.typed('powMod', {
    'number, number, number': function (base, exponent, modulus) {
        /* @help Fast calculation for base ^ exponent % modulus */
        if (exponent <= -1) return Math.pow(base, exponent) % modulus;
        if (exponent === 0) return 1 % modulus;
        if (exponent < 1)
            return math.powerMod(base, Math.pow(exponent, -1), modulus);

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
        /* @help Fast calculation for base ^ exponent % modulus */
        if (exponent.lessThanOrEqualTo(-1)) return base.pow(exponent).mod(modulus);
        if (exponent.equals(0)) return math.bignumber(1).mod(modulus);
        if (exponent.lessThan(1))
            return math.powerMod(base, math.bignumber(1).div(exponent), modulus);

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

/* Prime factorization */
function primeFactorsNum(num, disp = true) {
    /* @help Return an array of prime factors. disp=true shows formatted answer */
    if (num === 0) return [];
    if (num === 1) return [1];

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
    /* Number contains large prime factors. */
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
    if (disp) renderer.addData(formatPrimeFactorization(factors), true);
    return factors;
}

function primeFactorsBigNum(num, disp = true) {
    /* @help Return an array of prime factors. disp=true shows formatted answer */
    if (num.equals(0)) return [];
    if (num.equals(1)) return [math.bignumber(1)];

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
    if (disp) renderer.addData(formatPrimeFactorization(factors), true);
    return factors;
}

/* Prime factorization, override */
const primeFactors = math.typed('factorization', {
    'number': primeFactorsNum,
    'number, boolean': primeFactorsNum,
    'BigNumber': primeFactorsBigNum,
    'BigNumber, boolean': primeFactorsBigNum
});

/* Counts number of divisors of number, including
 * 1 and itself */
const divisorCount = math.typed('divisorCount', {
    'number': function (num) {
        /* @help Count the number of divisors, including 1 and itself */
        /* Get prime exponents */
        if (num === 0) return NaN;
        if (num === 1) return 1;

        let counts = {};
        let vals = math.primeFactors(num, false);
        for (let val of vals)
            counts[val] = counts[val] ? counts[val] + 1 : 1;

        let sum = 1;
        for (let key of Object.keys(counts))
            sum *= counts[key] + 1;
        return sum;
    },

    'BigNumber': function (num) {
        /* @help Count the number of divisors, including 1 and itself */
        if (num.equals(0)) return NaN;
        if (num.equals(1)) return math.bignumber(1);

        let counts = {};
        let vals = math.primeFactors(num, false);
        for (let val of vals)
            counts[val] = counts[val] ? counts[val] + 1 : 1;

        let sum = math.bignumber(1);
        for (let key of Object.keys(counts))
            sum = sum.mul(math.bignumber(counts[key] + 1));
        return sum;
    }
});

/* Sum divisors of number, including
 * 1 and itself */
const divisorSum = math.typed('divisorSum', {
    'number': function (num) {
        /* @help Sum of the divisors, including 1 and itself */
        /* Get prime exponents */
        if (num === 0) return 0;
        if (num === 1) return 1;

        let counts = {};
        let vals = math.primeFactors(num, false);
        for (let val of vals)
            counts[val] = counts[val] ? counts[val] + 1 : 1;

        let sum = 1;
        for (let key of Object.keys(counts))
            sum *= (key ** (counts[key] + 1) - 1) / (key - 1);
        return sum;
    },

    'BigNumber': function (num) {
        /* @help Sum of the divisors, including 1 and itself */
        if (num.equals(0)) return math.bignumber(0);
        if (num.equals(1)) return math.bignumber(1);

        let counts = {};
        let vals = math.primeFactors(num, false);
        for (let val of vals)
            counts[val] = counts[val] ? counts[val] + 1 : 1;

        let sum = math.bignumber(1);
        for (let key of Object.keys(counts)) {
            key = math.bignumber(key);
            sum = sum.mul((key.pow(math.bignumber(counts[key]).add(1)).sub(1)) / (key.sub(1)));
        }
        return sum;
    }
});

/* Calculates the sum of a geometric sequence mod m, 
 * where the sequence is defined as a * (1 + b + b^2 ... b^(n-1)) 
 *
 * Algorithim uses repeated squaring method for
 * fast runtime, taken from https://stackoverflow.com/a/42033401
 */
const geoSumMod = math.typed('geoSumMod', {
    'number, number, number': function (n, b, m) {
        /* @help Fast mod for geometric sum a + ab + ... ab^(n-1) % m */
        /* Input checking */
        if (n < 0) throw new RangeError('n (value = ' + n + ') must be nonnegative');
        if (m <= 0) throw new RangeError('m (value = ' + m + ') must be positive');
        n = Math.floor(n);

        let T = 1;
        let e = b % m;
        let total = 0;
        while (n > 0) {
            if (n & 1 === 1)
                total = (e * total + T) % m;
            T = ((e + 1) * T) % m;
            e = (e * e) % m;
            n = Math.floor(n / 2);
        }
        return total;
    },

    'BigNumber, BigNumber, BigNumber': function (n, b, m) {
        /* @help Fast mod for geometric sum a + ab + ... ab^(n-1) % m */
        if (n.lessThan(0)) throw new RangeError('n (value = ' + n + ') must be nonnegative');
        if (m.lessThanOrEqualTo(0)) throw new RangeError('m (value = ' + m + ') must be positive');
        n = math.floor(n);

        let T = math.bignumber(1);
        let e = b.mod(m);
        let total = math.bignumber(0);
        while (n.greaterThan(0)) {
            if (n.mod(2).equals(1))
                total = (e.mul(total).plus(T)).mod(m);
            T = ((e.plus(1)).mul(T)).mod(m);
            e = e.mul(e).mod(m);
            n = math.floor(n.div(2));
        }
        return total;
    }
});

module.exports = {
    powMod: powMod,
    powerMod: powMod,

    factorization: primeFactors,
    primeFactors: primeFactors,
    primeFactorization: primeFactors,

    divisorCount: divisorCount,
    factorCount: divisorCount,
    
    divisorSum: divisorSum,
    factorSum: divisorSum,

    geoSumMod: geoSumMod
};