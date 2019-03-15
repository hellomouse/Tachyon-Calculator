'use strict';

const getFunctionArguments = require('get-function-arguments');
const Modal = require('../modal.js');
const functions = require('calc-func').stat.dist;

/* Generate the function list by sorting the
 * list of functions into distributions */

/**
 * Format function names for sorting. Sorting priority
 * goes <first 3 letters of name of function> then
 * pdf, cdf and inv. 
 * 
 * Exceptions to this are normal, T
 * and binomial, which are sorted more firstly in that order
 * due to their common use
 * 
 * @param {string} x Func name
 */
const stripPDFCDFInv = x => {
    let t = x.toLowerCase();
    let suffix = '';

    if (x.endsWith('pdf')) {
        t = t.substring(0, t.length - 3);
        suffix = 'A';
    }
    else if (x.endsWith('cdf')) {
        t = t.substring(0, t.length - 3);
        suffix = 'B';
    }
    else if (x.startsWith('inv')) {
        t = t.substring(3);
        suffix = 'C';
    }

    t = t.substring(0, 3);

    /* Special cases: normal, T and binomial */
    if (t === 'nor') t = 'aaaaa';
    else if (t === 't') t = 'aaaab';
    else if (t === 'bin') t = 'aaaac';

    return t + suffix;
}

let keys = Object.keys(functions).sort((a, b) => { return stripPDFCDFInv(a) > stripPDFCDFInv(b) ? 1 : -1; });
let htmlList = keys.map(x => {
    return `<li onclick="require('./src/gui').dist['${x}'].show()">
    ${x} 
    <span class="item-desc">${getFunctionArguments(functions[x]).join(', ')}</span></li>`;
}).join('\n');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px; height: 100%">
    <h2>Distribution</h2>
    <ul class="modal-menu-list">
        ${htmlList}
    </ul>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>
`);

module.exports = modal;