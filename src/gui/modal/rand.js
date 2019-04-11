'use strict';

const guiUtil = require('../gui-utils.js');
const Modal = require('../modal.js');

const items = {
    random: 'Generate a random number from 0 to 1',
    uniform: 'Generate a random uniform number',
    randInt: 'Generate random int(s) from a to b',
    randNorm: 'Generate a random normally distributed number',
    randBin: 'Simulate binomial trials and estimate expected value',
    randIntNoReplacement: 'Generate random int(s) with no replacement',
    randomBytes: 'Generate a random byte string',
    pickRandom: 'Pick random item from a list',
    shuffle: 'Shuffle an array',
    randMat: 'Generate a random matrix',
    randPoly: 'Generate a random polynomial',
    randBool: 'Generate a random boolean'
};

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Rand</h2>

    <ul class="modal-menu-list">
    ${guiUtil.generateListHTML(items)}
    </ul>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);
module.exports = modal;