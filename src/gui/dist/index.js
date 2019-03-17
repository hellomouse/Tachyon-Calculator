'use strict';

const statFuncs = require('calc-func').stat.dist;
const template = require('./template.js');

let objs = {
    menu: require('./menu.js'),
    invNorm: require('./invNorm.js'),
    invT: require('./invT.js'),
};

/* Auto-generate modals for functions that do
 * not have one explicitly defined */
for (let name of Object.keys(statFuncs)) {
    if ((name.endsWith('pdf') || name.endsWith('cdf')) && !objs[name])
        objs[name] = template.pdfCdfTemplate(statFuncs[name]);
}

module.exports = objs;