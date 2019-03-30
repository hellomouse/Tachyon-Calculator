'use strict';

const Modal = require('../../modal.js');
const xssFilters = require('xss-filters');
const elements = require('../../../data/periodic-table.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2 id="element-selector-title"></h2>

    <ul class="modal-menu-list" style="max-height: 180px" id="element-selector-list"></ul>

    <span style="float: right">Undefined values are not displayed</span><br><br>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Close</button>

    <button class="modal-btn"
            onclick="openModal('modal.const.ptable')">
        Back to Table</button>
    <br>
</div>`, [-1, 'auto']);

const show = modal.show;
const elemKeys = ['atomic_mass', 'boil', 'density', 'melt', 'molar_heat', 'number', 'period', 'shells', 'electron_affinity', 'electronegativity_pauling'];
const elemKeyUnits = [' atomicMass', ' K', ' g/L', ' K', ' J / (mol * K)', '', '', '', ' kJ / mol', ''];

/* Overwrite the show method */
modal.show = id => {
    const element = elements[id - 1];
    const toAdd = (x, i) => xssFilters.inHTMLData(JSON.stringify(element[x])) + elemKeyUnits[i];

    show.call(modal);
    document.getElementById('element-selector-title').innerHTML = xssFilters.inHTMLData(`(${element.symbol}) ${element.name}`);
    document.getElementById('element-selector-list').innerHTML = 
        elemKeys.filter(x => element[x]).map((x, i) => `<li onclick="addChar('${toAdd(x, i)}'); require('./src/state').modal.hide();">
        ${x.split('_').map(x => x[0].toUpperCase() + x.substring(1)).join(' ')} 
            <span class="item-desc">${toAdd(x, i)}
            </span></li>`).join('\n'); // xssFilters.inHTMLData(
};


module.exports = modal;