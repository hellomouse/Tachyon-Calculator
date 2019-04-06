/* Patching for numerics.js */

'use strict';

const numeric = require('numeric');

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