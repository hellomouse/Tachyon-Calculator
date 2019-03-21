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
};

let keys = Object.keys(functions).sort((a, b) => { return stripPDFCDFInv(a) > stripPDFCDFInv(b) ? 1 : -1; });
let htmlList = keys.map((x, i) => {
    return `<li id="modal-list-item-${i}" onclick="require('./src/gui').dist['${x}'].show()">
    ${x} 
    <span class="item-desc">${getFunctionArguments(functions[x]).join(', ')}</span></li>`;
}).join('\n');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Distribution</h2>

    <input id="modal-search" oninput="require('./src/state.js').modal.onsearch()" 
        class="modal-input" autofocus placeholder="Search" style="width: calc(100% - 100px)"></input>
    <label style="font-size: 32px; margin-left: 10px">	&#8981;</label>

    <ul class="modal-menu-list">
        ${htmlList}
    </ul>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`);

modal.onsearch = function() {
    let search = document.getElementById('modal-search').value.toLowerCase();

    for (let i = 0; i < keys.length; i++) {
        let item = document.getElementById('modal-list-item-' + i);

        /* There is a <span>, so check if input exists before that */
        if (!item.innerHTML.split('<')[0].toLowerCase().includes(search))
            item.style.display = 'none';
        else item.style.display = 'block';
    }
};

module.exports = modal;