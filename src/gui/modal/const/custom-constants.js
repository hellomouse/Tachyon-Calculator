/* Menu for constants */

'use strict';

const Modal = require('../../modal.js');
const state = require('../../../state.js');
const xssFilters = require('xss-filters');

const keys = Object.keys(state.customConstants).filter(xssFilters.inHTMLData);
const html = keys.length > 0 ?
    keys.map(x => `<li onclick="addChar('${x}'); require('./src/state').modal.hide();">
        ${x} <span class="item-desc">${xssFilters.inHTMLData(state.customConstants[x])}</span></li>`).join('\n') :
    '<div style="padding: 10px">No custom constants</div>';

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Custom Constants</h2>

    <ul class="modal-menu-list">${html}</ul>
    <br>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);

module.exports = modal;