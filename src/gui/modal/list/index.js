'use strict';

const Modal = require('../../modal.js');

/* These are mostly builtins so no function arguments
 * can be extracted directly. */
const functionsOps = [
    'concat', 'sort', 'dim',
    'filter', 'map', 'mapreduce', 'range',
    'fill', 'cumSum', 'deltaList'
];
const funcOpsHelp = {
    concat: 'Concatenate lists. By default, the matrices are concatenated by the',
    sort: 'Sort the items in a list. Compare can be a string "asc", "desc", "natural", or a custom sort function.',
    dim: 'Get the dimensions of a list',
    filter: 'Filter items in a list',
    map: 'Map items in a list',
    mapreduce: 'Map and reduce items in a list',
    range: 'Get a list of numbers in a range',
    fill: 'Fill a list with numbers',
    cumSum: 'Cumulative sum list of a list',
    deltaList: 'Difference between consecutive elements of a list'
};
const functionsMath = [
    'min', 'max', 'mean', 'median', 'mode', 'sum', 'product',
    'standardDev', 'var'
];
const funcMathHelp = {
    min: 'Compute min of a list',
    max: 'Compute max of a list',
    mean: 'Get mean of a list',
    median: 'Get median of a list',
    mode: 'Get mode of a list',
    sum: 'Compute the sum of all values.',
    product: 'Compute the product of all values',
    standardDev: 'Compute the standard deviation',
    var: 'Compute the variance'
};

let keys1 = functionsOps.sort();
let htmlList1 = keys1.map((x, i) => {
    return `<li id="modal-list-item-${i}" onclick="addChar('${x}('); require('./src/state').modal.hide();">
    ${x} 
    <span class="item-desc">${funcOpsHelp[x]}</span></li>`;
}).join('\n');

let keys2 = functionsMath.sort();
let htmlList2 = keys2.map((x, i) => {
    return `<li id="modal-list-item-${i}" onclick="addChar('${x}('); require('./src/state').modal.hide();">
    ${x} 
    <span class="item-desc">${funcMathHelp[x]}</span></li>`;
}).join('\n');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>List</h2>

    <button class="modal-btn active-btn" style="width: 150px" id="modal-btn-1"
    onclick="require('./src/state.js').modal.setActiveTab(1);">Edit</button>
    <button class="modal-btn" style="width: 150px" id="modal-btn-2"
    onclick="require('./src/state.js').modal.setActiveTab(2);">Ops</button>
    <button class="modal-btn" style="width: 150px"
    id="modal-btn-3" onclick="require('./src/state.js').modal.setActiveTab(3);">Math</button>

    <ul class="modal-menu-list" style="display: block" id="modal-page-1">
        ${htmlList1}
    </ul>

    <ul class="modal-menu-list" style="display: none" id="modal-page-2">
        ${htmlList1}
    </ul>

    <ul class="modal-menu-list" style="display: none" id="modal-page-3">
        ${htmlList2}
    </ul>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`);
modal.tabs = 3;

module.exports = modal;