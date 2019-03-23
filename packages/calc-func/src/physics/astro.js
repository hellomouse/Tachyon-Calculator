/* Astrophysics functions */

'use strict';

const normalize = require('../util/normalize-unit.js');
const units = require('../util/unit.js');
const math = require('mathjs');

module.exports = {
    // TODO newton's laws, escape velocity, orbital period, etc...

    timeDilation: function (t, v, c = 299792458) {
        /* Normalize units */
        t = normalize.toNumber(t, 's');
        v = normalize.toNumber(v, 'm/s');
        c = normalize.toNumber(c, 'm/s');

        let ans = t / math.sqrt(1 - (v / c) * (v / c));
        let unit = units.selectBestTimeUnit(ans);

        return math.unit(ans, 's').to(unit);
    }
};