/* Patching for numerics.js
 * THIS FILE IS CURRENTLY UNUSED */

'use strict';

const numeric = require('numeric');

/* Remove numeric all and any */
delete numeric.all;
delete numeric.any;

/* Removal of unnecessary functions */
for (let key of Object.keys(numeric)) {
    if (key.endsWith('eq') ||  // These functions are like +=, useless
        key === 'T' ||         // Don't override tesla
        key.endsWith('seq') || // Sequence functions
        key.endsWith('seqV') ||
        key.endsWith('V') ||
        key.endsWith('VS') ||
        key.endsWith('eqS') ||
        key.endsWith('MM'))   
        delete numeric[key];
}