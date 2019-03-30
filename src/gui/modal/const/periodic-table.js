/* Periodic table selector for element masses
 * NOT the periodic table page */

'use strict';

const Modal = require('../../modal.js');
const periodicTable = require('../../../data/periodic-table.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Periodic Table</h2>

    <div class="periodic-table-container">
        ${
    periodicTable.map(x => `
        <button onclick="require('./src/gui').modal.const.element.show(${x.number})"
            class="element" style="grid-column: ${x.xpos}; grid-row: ${x.ypos}" title="${x.name}">
            ${x.symbol}
        </button>            
        `).join('\n')}
    </div>

    <br>
    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>

</div>`, [-1, 'auto']);

module.exports = modal;