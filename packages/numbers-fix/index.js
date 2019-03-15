/* Fix for numbers.js, where some functions are 
* not properly imported into mathjs */

const numbers = require('numbers');

module.exports = {
    /**
     * This function is imported as "simple" 
     * in mathjs, this renames it.
     * 
     * @param {number} n Number to test if prime
     */
    isPrime: function(n) {
        return numbers.prime.simple(n);
    }
}

