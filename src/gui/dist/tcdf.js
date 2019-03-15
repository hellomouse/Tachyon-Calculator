'use strict';

const Modal = require('../modal.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>T CDF</h2>
    <table width="100%">
        <tr>
            <td>Low</td>
            <td>
                <input oninput="require('./src/state.js').modal.updateState()" 
                type="number" class="modal-input" id="modal-1"></input>
                <button style="display: inline; width: 70px" class="modal-btn"
                    onclick="document.getElementById('modal-1').value = '-1e99'">-INF</button>
            </td>
        </tr>
        <tr>
            <td>High</td>
            <td>
                <input oninput="require('./src/state.js').modal.updateState()" 
                type="number" class="modal-input" id="modal-2"></input>
                <button style="display: inline; width: 70px" class="modal-btn"
                    onclick="document.getElementById('modal-2').value = '1e99'">+INF</button>
            </td>
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
    let a = document.getElementById('modal-1').value;
    let b = document.getElementById('modal-2').value;
    let u = document.getElementById('modal-u').value;
    return `tcdf(${a}, ${b}, ${u})`;
}

modal.updateState = function () {
    let a = document.getElementById('modal-1').value;
    let b = document.getElementById('modal-2').value;
    let u = document.getElementById('modal-u').value;

    if (!a || !b || !u)
        document.getElementById("submit").disabled = true;
    else document.getElementById("submit").disabled = false;
}

module.exports = modal;