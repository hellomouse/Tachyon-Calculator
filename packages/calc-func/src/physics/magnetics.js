'use strict';

const math = require('mathjs');
const normalize = require('../util/normalize-unit.js');

module.exports = {
    magneticConstant: math.unit(math.eval('4e-7 * pi'), 'H / m'),

    infMagneticLineField: function(current, distance, angle=null) {
        /* 2e-7 H / m is exactly magnetic constant / 2 pi */
        current = normalize.appendUnit(current, 'A');
        distance = normalize.appendUnit(distance, 'm');
        return math.eval(`2e-7 H / m * ${current} / ${distance} * ${angle ? `Math.sin(${angle})` : '1'}`);
    }
};