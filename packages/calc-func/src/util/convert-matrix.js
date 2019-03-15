/* Auto-detect conversions between
 * math.js matrixes and arrays */

'use strict';

const math = require('mathjs');

/**
 * Forces an object to be of an array type
 * @param {object} arr Any object that can be converted to array 
 */
function forceArr(arr) {
    /* Argument is already an array */
    if (Array.isArray(arr))
        return arr;

    /* Argument is a math.js matrix */
    if (arr instanceof math.type.Matrix)
        return arr.toArray();

    /* Convert to a matrix then an array
     * (Let math.js deal with numbers and strings) */
    return math.matrix(arr).toArray();
}

/**
 * Forces an object to be of a matrix type
 * @param {object} arr Any object that can be converted to a Matrix 
 */
function forceMatrix(arr) {
    /* Argument is a math.js matrix */
    if (arr instanceof math.type.Matrix)
        return arr;
    
    /* Argument is an array */
    if (Array.isArray(arr))
        return math.matrix(arr);
    
    /* Convert to arr, then math.matrix */
    return math.matrix(forceArr(arr));
}

module.exports = {
    forceArr: forceArr,
    forceMatrix: forceMatrix
};