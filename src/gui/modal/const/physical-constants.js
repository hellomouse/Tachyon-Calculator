/* Physical constants, as found in math js (type = Unit) */

'use strict';

const Modal = require('../../modal.js');
const math = require('mathjs');

const symbolMap = {
    'speedOfLight': 'c',
    'gravitationConstant': 'G',
    'planckConstant': 'h',
    'reducedPlanckConstant': 'ℏ',
    'magneticConstant': 'μ<sub>0</sub>',
    'electricConstant': 'ε<sub>0</sub>',
    'vacuumImpedance': 'Z<sub>0</sub>',
    'coulombsConstant': 'κ',
    'elementaryCharge': 'e',
    'bohrMagneton': 'μ<sub>B</sub>',
    'conductanceQuantum': 'G<sub>0</sub>',
    'inverseConductanceQuantum': 'G<sub>0</sub><sup>-1</sup>',
    'magneticFluxQuantum': 'ф<sub>0</sub>',
    'nuclearMagneton': 'μ<sub>N</sub>',
    'klitzing': 'R<sub>K</sub>',
    'bohrRadius': 'a<sub>0</sub>',
    'classicalElectronRadius': 'r<sub>e</sub>',
    'electronMass': 'm<sub>e</sub>',
    'fermiCoupling': 'G<sub>F</sub>',
    'fineStructure': 'α',
    'hartreeEnergy': 'Eh',
    'protonMass': 'm<sub>p</sub>',
    'deuteronMass': 'm<sub>d</sub>',
    'neutronMass': 'm<sub>n</sub>',
    'quantumOfCirculation': 'h/(2m<sub>e</sub>)',
    'rydberg': 'R<sub>∞</sub>',
    'atomicMass': 'm<sub>u</sub>',
    'avogadro': 'N<sub>A</sub>',
    'boltzmann': 'k',
    'faradayConstant': 'F',
    'firstRadiation': 'c<sub>1</sub>',
    'loschmidt': 'n<sub>0</sub>',
    'gasConstant': 'R',
    'molarPlanckConstant': 'N<sub>A</sub>h',
    'molarVolume': 'V<sub>m</sub>',
    'secondRadiation': 'c<sub>2</sub>',
    'stefanBoltzmann': 'σ',
    'wienDisplacement': 'b',
    'molarMass': 'M<sub>u</sub>',
    'molarMassC12': 'M(<sub>12</sub>C)',
    'gravity': 'g',
    'atm': 'atm',
    'planckLength': 'l<sub>p</sub>',
    'planckMass': 'm<sub>p</sub>',
    'planckTime': 't<sub>p</sub>',
    'planckCharge': 'p<sub>p</sub>',
    'planckTemperature': 'T<sub>p</sub>',
    'solarLuminosity': 'L<sub>☉</sub>',
    'solarRadius': 'R<sub>☉</sub>',
    'earthMass': 'M<sub>⊕</sub>',
    'earthRadius': 'R<sub>⊕</sub>',
    'solarConstant': 'G<sub>SC</sub>'
};
const junkConst = ['G', 'c']; // Duplicates
const mathkeys = Object.keys(math).filter(x => math.type.isUnit(math[x]) && !junkConst.includes(x));
mathkeys.sort();

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Physical Constants</h2>

     <input id="modal-search" oninput="require('./src/state.js').modal.onsearch()" 
        class="modal-input" autofocus placeholder="Search" style="width: calc(100% - 100px)"></input>
    <label style="font-size: 32px; margin-left: 10px">	&#8981;</label>

    <ul class="modal-menu-list">
${
    mathkeys
        .map((x, i) => {
            return `<li id="modal-list-item-${i}" onclick="addChar('${x}'); require('./src/state').modal.hide();">
            <div style="width: 60px; display: inline-block">${symbolMap[x] ? `<i><b>${symbolMap[x]} </b></i>` : '' }</div>
            ${x} 
            <span class="item-desc">
${math[x].value}
${
    math[x].units.map(x => x.prefix.name
        + x.unit.name + (x.power !== 1 ? ` <sup>${x.power}</sup>` : '')).join(' · ')
}
            </span></li>`;
        })
        .join('\n')
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
        if (!item.innerHTML.split('</div>')[1].toLowerCase().includes(search))
            item.style.display = 'none';
        else item.style.display = 'block';
    }
};

module.exports = modal;