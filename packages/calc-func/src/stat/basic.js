/* Basic stat functions */

'use strict';

module.exports = {
    zScore: function(x, mean, sigma) {
        /* @help Return z score for x for given normal dist. */
        return (x - mean) / sigma;
    }
};