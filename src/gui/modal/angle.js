/* Menu for angle stuff */

'use strict';

const Modal = require('../modal.js');

const keys = ['DMS', 'rectToPolar', 'polarToRect'];
const helpDocs = ['Format degrees to DMS', 'Convert (x, y) to (r, theta)', 'Convert (r, theta) to (x ,y)'];

const html = keys.map((x, i) => `<li onclick="addChar('${x}('); require('./src/state').modal.hide();">
        ${x} <span class="item-desc">${helpDocs[i]}</span></li>`).join('\n');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Angle</h2>

    <ul class="modal-menu-list" style="height: auto">${html}</ul>
    <br>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);

module.exports = modal;