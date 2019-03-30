/* Numeric constants, as found in math js (type = number) */

'use strict';

const Modal = require('../../modal.js');
const math = require('mathjs');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>View Matrix</h2>
    <div id="matrix-viewer-matrix-div"></div>
    <br>
    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Close</button>
    <br>
</div>`, [-1, 'auto']);

const formatMatrix = matrix => '<table class="matrix-table">' + matrix.map(y =>
    y.map(x => `<td>${+math.number(x).toFixed(4)}</td>`).join('')).map(x => `<tr>${x}</tr>`).join('') + '</table>';
const show = modal.show;

modal.formatMatrix = formatMatrix;

/* Overwrite the show method */
modal.show = matrix => {
    show.call(modal);
    document.getElementById('matrix-viewer-matrix-div').innerHTML = formatMatrix(matrix) + `<br>
<b>Size: </b> ${matrix.length} x ${matrix[0].length} Matrix${
    matrix.length === matrix[0].length ? `&nbsp; &nbsp; <b>Det:</b> ${math.det(matrix)}` : ''}`;
};

module.exports = modal;