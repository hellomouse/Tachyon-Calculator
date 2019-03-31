'use strict';

const Modal = require('../../modal.js');
const planets = require('../../../data/solar-system.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Solar System</h2>

    <ul class="modal-menu-list">
${planets.map((x, i) => `<li onclick="require('./src/gui').modal.const.planet.show(${i})">
<div style="width: 20px; display: inline-block">${x.symbol}</div> ${x.name}</li>`).join('\n')}
    </ul>
    <br>    
    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Close</button>
    <br>
</div>`, [-1, 'auto']);

module.exports = modal;