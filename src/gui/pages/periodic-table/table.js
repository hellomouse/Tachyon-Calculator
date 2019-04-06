/* Periodic table modal - renders the entire table 
 * (not individual element properties) */

'use strict';

const Page = require('../../page.js');
const elements = require('../../../data/periodic-table.js');

module.exports = new Page('Periodic Table', `
<div style="margin: 30px">
    <div class="periodic-table-container">
        ${elements.map(x => `
        <button onclick="require('./src/gui').modal.const.element.show(${x.number})"
            class="element-large" style="grid-column: ${x.xpos}; grid-row: ${x.ypos}" title="${x.name}">
            <small style="float: right">${x.number}</small><br>
            <h3 style="margin: 0">${x.symbol}</h3>
        </button>            
        `).join('\n')}
    </div>
</div>`);