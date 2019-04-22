'use strict';

const guiUtil = require('../gui-utils.js');
const Modal = require('../modal.js');

const pages = {
    test: {
        '=': 'Check equality',
        '!=': 'Check inequality',
        '>': 'Check greater than',
        '<': 'Check less than',
        '>=': 'Check greater or equal than',
        '<=': 'Checck less or equal than'
    },
    logic: {
        and: 'Check both inputs are true',
        or: 'Check either input is true',
        xor: 'Check only 1 input is true',
        not: 'Negate the input',
        bitAnd: 'Check if the bits are both true',
        bitOr: 'Check if either bit is true',
        bitXor: 'Check if only 1 bit is true',
        bitNot: 'Invert a bit'
    }
};

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Logic</h2>

    ${guiUtil.generateTabsFromPage(pages, '100px')}

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);
modal.tabs = Object.keys(pages).length;
module.exports = modal;