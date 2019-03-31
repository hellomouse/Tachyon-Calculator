'use strict';

const Modal = require('../../modal.js');
const xssFilters = require('xss-filters');
const planets = require('../../../data/solar-system.js');

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2 id="planet-selector-title"></h2>

    <ul class="modal-menu-list" style="max-height: 180px" id="planet-selector-list"></ul>

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Close</button>

    <button class="modal-btn"
            onclick="openModal('modal.const.solarSystem')">
        Back to Solar System</button>
    <br>
</div>`, [-1, 'auto']);

const show = modal.show;

/* Overwrite the show method */
modal.show = id => {
    const p = planets[id];

    show.call(modal);
    document.getElementById('planet-selector-title').innerHTML = xssFilters.inHTMLData(`(${p.symbol}) ${p.name}`);
    document.getElementById('planet-selector-list').innerHTML = 
            Object.keys(p).filter(x => !['name', 'symbol'].includes(x))
                .map(key => `<li onclick="addChar('${p[key]}'); require('./src/state').modal.hide();">
            ${key}<span class="item-desc">${p[key]}</span></li>`).join('\n');

};

module.exports = modal;