/* Menu for constants */

'use strict';

const Modal = require('../../modal.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Constants</h2>

        <button class="square-btn-large" onclick="openModal('modal.const.numericConst')">
            <img src="./public/img/const/numeric.png"><br>
            Numeric</button>
        <button class="square-btn-large" onclick="openModal('modal.const.physicalConst')">
            <img src="./public/img/const/physical.png"><br> 
            Physical</button>
        <button class="square-btn-large">
            <img src="./public/img/const/solar-system.png"><br>
            Solar System</button>
        <button class="square-btn-large">
            <img src="./public/img/const/periodic-table.png"><br>
            Periodic Table</button>
        <button class="square-btn-large">
            <img src="./public/img/const/custom.png"><br>
            Custom</button>

    <br><br>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);

module.exports = modal;