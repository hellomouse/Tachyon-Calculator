'use strict';

const Modal = require('../modal.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>T PDF</h2>
    <table width="100%">
        <tr>
            <td>x</td>
            <td><input oninput="require('./src/state.js').modal.updateState()" type="number" class="modal-input" id="modal-x"></input></td>
        </tr>
        <tr>
            <td>df</td>
            <td><input oninput="require('./src/state.js').modal.updateState()" type="number" class="modal-input" id="modal-u"></input></td>
        </tr>
    </table>

    <br>
    <button class="modal-btn" id="cancel"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>

    <button class="modal-btn" id="submit" disabled
            onclick="require('./src/state.js').modal.addTextAndClose()">
        Calculate</button>
    <br>
</div>
`, [-1, 'auto']);

modal.createText = function () {
    let x = document.getElementById('modal-x').value;
    let u = document.getElementById('modal-u').value;
    return `tpdf(${x}, ${u})`;
}

modal.updateState = function () {
    let x = document.getElementById('modal-x').value;
    let u = document.getElementById('modal-u').value;

    if (!x || !u)
        document.getElementById("submit").disabled = true;
    else document.getElementById("submit").disabled = false;
}

module.exports = modal;