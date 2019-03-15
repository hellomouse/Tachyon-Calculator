/* Make sure a number is of a given unit,
 * if a unit was not defined */

'use strict';

const math = require('mathjs');

module.exports = {
    toUnit: function(val, unit) {
        if (val instanceof math.type.Unit)
            return val.to(unit);
        return math.unit(val, unit);
    },
    toNumber: function(val, unit) {
        if (val instanceof math.type.Unit)
            return math.number(val, unit);
        if (typeof val === 'string')
            return math.eval(val).value;
        return val;
    }
}