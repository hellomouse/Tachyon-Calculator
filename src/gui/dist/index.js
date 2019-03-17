'use strict';

const statFuncs = require('calc-func').stat.dist;
const template = require('./template.js');

let objs = {
    menu: require('./menu.js')
};

/* Auto-generate modals for functions that do
 * not have one explicitly defined */
for (let name of Object.keys(statFuncs)) {
    if ((name.endsWith('pdf') || name.endsWith('cdf')) && !objs[name])
        objs[name] = template.pdfCdfTemplate(statFuncs[name]);
    else if (name.startsWith('inv') && !objs[name])
        objs[name] = template.invTemplate(statFuncs[name]);
}

module.exports = objs;