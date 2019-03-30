/* Menu for constants */

'use strict';

const Modal = require('../../modal.js');

const categories = [
    {
        symbol: 'π',
        name: 'Numeric Constants',
        modal: 'modal.const.numericConst'
    },
    {
        symbol: 'λ',
        name: 'Physical Constants',
        modal: 'modal.const.physicalConst'
    },
    {
        symbol: '🜨',
        name: 'Solar System',
        modal: 'modal.const.solarSystem'
    },
    {
        symbol: 'H',
        name: 'Periodic Table',
        modal: 'modal.const.ptable'
    },
    {
        symbol: 'K',
        name: 'Custom Constants',
        modal: 'modal.const.customConstants'
    }
];

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Constants</h2>

    <ul class="modal-menu-list" style="max-height: 180px">
${categories.map(x => `<li onclick="openModal('${x.modal}')">
    <div style="width: 30px; display: inline-block"><i><b>${x.symbol} </b></i></div> ${x.name}</li>`).join('\n')}
    </ul>
    <br>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);

module.exports = modal;