/* Adds additional units to math.js */

'use strict';

const math = require('mathjs');

/*
 * Array of all units
 * [name (string), definition (string), aliases (array), offset (number), prefixes (string), override (boolean)]
 * For example, ['ampere', '1 C/s', ['A', 'amp']]
 * 
 * 3rd argument can be left empty if there are no aliases
 * 4th argument can be left empty if there is no offset (not a direct multiplier)
 * 5th argument determines what prefixes to accept
 * 6th argument can be used to override pre-existing units
 * 
 * See https://mathjs.org/docs/datatypes/units.html
 * for more informaton
 * 
 * Units should be grouped by categories such as
 * distance, time, etc...
 */
const unitArr = [
    /* Distance Units */
    ['nauticalMile', '1852 m', ['NM', 'nmi', 'nautical-mile']],
    ['line', '0.0021166667 m'],
    ['lightYear', '9.4554541e15 m', ['l.y', 'ly', 'light-year']],
    ['AU', '149597870700 m', ['astronomical unit', 'astronomical-unit']],
    ['parsec', '30860000000000000 m'],

    /* Russian distance units */
    ['verst', '1066.8 m'],
    ['tochka', '0.000254 m'],
    ['liniya', '0.00254 m'],
    ['dyuim', '0.0254 m'],
    ['vershok', '0.04445 m'],
    ['piad', '0.1778 m', ['chetvert']],
    ['fut', '0.3048 m'],
    ['arshin', '0.7112 m'],
    ['sazhen', '2.1336 m'],
    ['milia', '7467.6 m'],

    /* Obscure distance units */
    ['thou', '0.0000254 m'],
    ['fathom', '1.829 m'],
    ['cana', '1.5708 m'],
    ['cubit', '0.5186 m'],
    ['barleycorn', '0.008466666666666666666666666667 m'],
    ['span', '0.2286 m'],
    ['rope', '6.0960 m'],
    ['pole', '5.0292 m'],
    ['palm', '0.0762 m'],
    ['pace', '0.7620 m'],
    ['nail', '0.057150 m'],
    ['league', '4828.02 m'],
    ['furlong', '201.168 m'],
    ['ell', '1.143 m'],
    ['cable', '219.45600 m'],
    ['mickey', '0.000127 m'],
    ['footballField', '109.7 m', ['football-fields', 'football-field']],
    ['hair', '0.00008 m', ['hairs']],
    ['rack', '0.04445 m', ['U']],
    ['hand', '0.1016 m', ['hands']],
    ['sirometer', '149597870700000000 m'],
    ['lightNanosecond', '0.299792458 m', ['light-nanosecond', 'l.nm']],
    ['potrzebie', '0.002263348517438173216473 m'],
    ['beardSecond', '1e-8 m', ['beard-second']],
    ['altuve', '1.65 m'],
    ['smoot', '1.7 m'],
    ['sheppey', '1400 m'],
    ['wiffle', '0.089 m'],
    ['bloit', '1072.89333333 m'],
    ['point', '0.0003514500774850564533982731902 m'],
    ['shaku', '0.3030303030 m'],
    ['spat', '1000000000000 m'],
    ['twip', '0.00001763888888888888888888888889 m'],
    ['xUnit', '1.0021e-13 m', ['siegbahn']],

    /* Information units */
    ['crumb', '2 b', ['quad', 'quarter', 'tayste', 'tydbit', 'seminibble', 'semi-nibble']],
    ['triad', '3 b', ['triade']],
    ['nibble', '4 b'],
    ['declet', '10 b', ['decle', 'deckle', 'dyme']],
    ['wyde', '16 b', ['dobulet', 'plate', 'playte', 'chomp', 'chawmp', 'word']],
    ['quadlet', '32 b', ['dinner', 'dynner', 'gawble']],
    ['octlet', '64 b'],
    ['hexlet', '128 b', ['paragraph']],
    
    /* Time units */
    ['jiffy', '3E-24 s'],
    ['wink', '3.333333333333333333333333333E-10 s'],
    ['shake', '1E-8 s', ['svedberg']],
    ['halfAMinute', '30 s'],
    ['moment', '90 s', ['moments']],
    ['ke', '864 s'],
    ['pentand', '432000 s', ['pentands']],
    ['fortnight', '1209600 s', ['fortnights']],
    ['lunarNonth', '2548800.0 s', ['lunarMonths']],
    ['season', '7884000 s', ['seasons']],
    ['tropicalYear', '31556925.21600 s', ['tropicalYears']],
    ['gregorianYear', '31556952.0000 s', ['gregorianYears']],
    ['julianYear', '31557600.00 s', ['julianYears']],
    ['siderealYear', '31558149.763545600 s', ['siderealYears']],
    ['leapYear', '31622400 s', ['leapYears']],
    ['biennium', '63072000 s', ['bienniums']],
    ['triennium', '94608000 s', ['trienniums']],
    ['olympiad', '126144000 s', ['olympiads']],
    ['lustrum', '157680000 s'],
    ['indiction', '473040000 s'],
    ['jubilee', '1576800000 s', ['jubilees']],
    ['megaannum', '31536000000000 s', ['megaannums']],
    ['galacticYear', '7253280000000000 s', ['galacticYears']],
    ['gigaannum', '31536000000000000 s', ['gigaannums']],
    ['petaannum', '31536000000000000000000 s', ['petaannums']],
    ['eon', '31540000000000000.000 s', ['eons']],
    ['friedman', '15768000 s', ['friedmans']],
    ['auTime', '2.418884254E-17 s'],
    ['helek', '3.333333333333333333333333333 s'],
    ['sigma', '0.000001 s'],
    ['zuckerman', '3.333333333333333333333333333E-7 s'],
    ['octaeteris', '252460800.0000 s'],

    /* Degrees */
    ['turn', '360 deg', ['revolution', 'fullCircle', 'rotation']],
    ['quadrant', '90 deg', ['right angle']],
    ['sextant', '60 deg'],
    ['hexacontade', '6 deg'],
    ['binaryDegree', '1.40625 deg'],
    ['clock', '30 deg', ['clock Position', 'sign']],
    ['hourAngle', '15 deg'],
    ['wind', '11.25 deg'],
    ['pechus', '2.5 deg'],
    ['octant', '45 deg'],
    ['diameterPart', '0.954929959 deg'],
    ['minuteOfArc', '0.01666666666666666666666666667 deg', ['minuteArc', 'arcMinute',]],
    ['secondOfArc', '0.0002777777777777777777777777778 deg', ['secondArc', 'arcSecond']],

    /* Mass and weight */
    ['slug', '14600 g', ['sl']],
    ['solarMass', '1.990000000000000000000000000E+30 g'],
    ['pdl', '1355.81839575 g', ['poundals']],
    ['bag', '60000 g'],
    ['barge', '20411656.65 g'],
    ['carat', '0.2 g', ['ct']],
    ['clove', '3628.73896 g'],
    ['crith', '0.0899349 g'],
    ['dalton', '1.660538921E-24 g', ['da']],
    ['grave', '1000 g'],
    ['apothecary', '3.8879346 g'],
    ['cental', '45359.237000 g', ['sh cwt']],
    ['mark', '248.8278144 g'],
    ['mite', '0.0032399455 g'],
    ['metricMite', '0.050 g'],
    ['pennyweight', '1.55517384 g', ['dwt', 'pwt']],
    ['metricPound', '500 g', ['livre', 'pfund']],
    ['quintal', '100000 g'],
    ['scurple', '1.2950782 g', ['s ap']],
    ['sheet', '0.6479891 g'],
    ['weight', '88904.10452000 g'],
    ['load', '1111301.30650000 g'],
    ['last', '1835000 g'],
    ['picul', '60478.982000 g'],
    ['kait', '604.78982 g', ['catty']],
    ['tael', '37.79936375 g'],
    ['wey', '114305.27724000 g'],
];

for (let unit of unitArr) {
    if (!unit[2]) unit[2] = [];
    if (!unit[3]) unit[3] = 0;
    if (!unit[4]) unit[4] = 'none';
    if (!unit[5]) unit[5] = false;

    math.createUnit(unit[0], { definition: unit[1], aliases: unit[2],
        offset: unit[3], prefixes: unit[4], 
        override: unit[5] });
}