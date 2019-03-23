/* Numeric constants, as found in math js (type = number) */

'use strict';

const Modal = require('../../modal.js');
const math = require('mathjs');

// PI and E are included as they are duplicated by pi and e
const notAConstant = ['largeArray', 'precision', 'NaN', 'undefined', 'E', 'PI', 'EPSILON', 'epsilon'];

let numberConst = [];
let bignumberConst = [];

for (let key of Object.keys(math)) {
    if (!notAConstant.includes(key)) {
        if (math.type.isNumber(math[key]))
            numberConst.push(key);
        else if (math.type.isBigNumber(math[key]))
            bignumberConst.push(key);
    }
}

numberConst.sort();
bignumberConst.sort();
const mathkeys = bignumberConst.concat(numberConst);

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Numeric Constants</h2>

     <input id="modal-search" oninput="require('./src/state.js').modal.onsearch()" 
        class="modal-input" autofocus placeholder="Search" style="width: calc(100% - 100px)"></input>
    <label style="font-size: 32px; margin-left: 10px">	&#8981;</label>

    <ul class="modal-menu-list">
${
    mathkeys
        .map((x, i) => {
            return `<li id="modal-list-item-${i}" onclick="addChar('${x}'); require('./src/state').modal.hide();">
            ${x} 
            <span class="item-desc">${math[x]}
            </span></li>`;
        }).join('\n')
}
    </ul>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`);

modal.onsearch = function () {
    let search = document.getElementById('modal-search').value.toLowerCase();

    for (let i = 0; i < mathkeys.length; i++) {
        let item = document.getElementById('modal-list-item-' + i);

        /* There is a <span>, so check if input exists before that */
        if (!item.innerHTML.split('<')[0].toLowerCase().includes(search))
            item.style.display = 'none';
        else item.style.display = 'block';
    }
};

module.exports = modal;