'use strict';

const Modal = require('../modal.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>InvNorm</h2>
    <div id="modal-dist-page-1">
        <table width="100%">
            <tr>
                <td>Area</td>
                <td><input oninput="require('./src/state.js').modal.updateState()" type="number" class="modal-input" id="modal-x"></input></td>
            </tr>
            <tr>
                <td>μ</td>
                <td><input oninput="require('./src/state.js').modal.updateState()" type="number" class="modal-input" value="0" id="modal-u"></input></td>
            </tr>
            <tr>
                <td>σ</td>
                <td><input oninput="require('./src/state.js').modal.updateState()" type="number" class="modal-input" value="1" id="modal-s"></input></td>
            </tr>

            <tr>
                <td>Direction</td>
                <td style="padding-left: 6px">
                    <button onclick="require('./src/state.js').modal.changeButton(1)" id="modal-btn-dist-1" class="modal-img-btn multi-active">
                        <img src="./public/img/stat/cdf-below.png">
                    </button>
                    <button onclick="require('./src/state.js').modal.changeButton(2)" id="modal-btn-dist-2" class="modal-img-btn">
                        <img src="./public/img/stat/cdf-above.png">
                    </button>
                    <button onclick="require('./src/state.js').modal.changeButton(3)" id="modal-btn-dist-3" class="modal-img-btn">
                        <img src="./public/img/stat/cdf-between.png">
                    </button>
                    <button onclick="require('./src/state.js').modal.changeButton(4)" id="modal-btn-dist-4" class="modal-img-btn">
                        <img src="./public/img/stat/cdf-outside.png">
                    </button>
                </td>
            </tr>
        </table>
    </div>
    <div id="modal-dist-page-2">
    </div>

 

    <br><br>
    <button class="modal-btn" id="cancel"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>

    <button class="modal-btn" id="submit" disabled
            onclick="require('./src/state.js').modal.addTextAndClose()">
        Calculate</button>
    <br>
</div>
`, [-1, 'auto']);

modal.createText = function() {
    let x = document.getElementById('modal-x').value;
    let u = document.getElementById('modal-u').value;
    let s = document.getElementById('modal-s').value;
    let returned = `invNorm(${x}, ${u}, ${s})`;
    let dirButton = 1;

    for (let i = 1; i < 5; i++) {
        if (document.getElementById('modal-btn-dist-' + i).classList.contains('multi-active')) {
            dirButton = i;
            break;
        }
    }

    if (dirButton === 2) // Right to left
        return `invNorm(1 - ${x}, ${u}, ${s})`;
    if (dirButton === 3) // Inside, only for symmetrical distributions
        return `invNorm(0.5 + (${x}) / 2, ${u}, ${s})`;
    if (dirButton === 4) // Outside, only for symmetrical distributions
        return `invNorm(0.5 - (${x}) / 2, ${u}, ${s})`;
    return returned;
}

modal.changeButton = function(id) {
    for (let i = 1; i < 5; i++)
        document.getElementById('modal-btn-dist-' + i).classList.remove('multi-active');
    document.getElementById('modal-btn-dist-' + id).classList.add('multi-active');
}

modal.updateState = function() {
    let x = document.getElementById('modal-x').value;
    let u = document.getElementById('modal-u').value;
    let s = document.getElementById('modal-s').value;

    if (!x || !u || !s)
        document.getElementById("submit").disabled = true;
    else document.getElementById("submit").disabled = false;
}

module.exports = modal;