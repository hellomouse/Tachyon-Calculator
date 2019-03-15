/* Unit utilities */

'use strict';

const TIME_RANGES = [
    ['ns', 1e-9], ['us', 1e-6], ['ms', 1e-3], ['s', 1],
    ['min', 60], ['hr', 3600], ['day', 3600 * 24],
    ['year', 3600 * 24 * 365], ['decade', 3600 * 24 * 365 * 10],
    ['century', 3600 * 24 * 365 * 100]
]

module.exports = {
    selectBestTimeUnit: function(val) {
        /* Time too small, use nanoseconds since that's
         * the most reasonable SI prefix everyone knows */
        if (val < 1e-9) return 'ns';  

        for (let i = TIME_RANGES.length - 1; i >= 0; i--) {
            let range = TIME_RANGES[i];
            let fract = val / range[1];

            if (fract > 1 && fract < 1e3) return range[0];
        }

        /* Max out times at years (good base unit) */
        return 'years';
    }
};