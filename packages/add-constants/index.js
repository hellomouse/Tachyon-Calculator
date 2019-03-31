/* Add some constants to math js */
'use strict';

const math = require('mathjs');

math.import({
    // Physical constants
    solarLuminosity: math.unit(3.828e26, 'W'),
    solarRadius: math.unit(696000, 'km'),
    earthMass: math.unit(5.972e24, 'kg'),
    earthRadius: math.unit(6.3781e6, 'm'),
    solarConstant: math.unit(1.361, 'kW / m^2'),

    // Aliases
    G: math.gravitationConstant,
    // c: math.speedOfLight, // Breaks derivative()

    // Numeric constants
    silverRatio: 1 + math.sqrt(2)
});