/* Executed by the renderer process
* Handles main HTML code submission */

/*global hideAutocompleteArea removeChunk addCharAt cycleAngleMode _hidden:true*/

require('cache-require-paths');
require('app-module-path').addPath('./packages'); // Add 'packages' as alt folder for modules

const commandExec = require('./src/command-executer.js');
const state = require('./src/state.js');
const autocomplete = require('./src/gui/autocomplete.js');

const mouseTrap = require('mousetrap');

const outputDiv = document.getElementById('output-area');
const mainInput = document.getElementById('main-input');

/* Clear the loading screen */
outputDiv.innerHTML = '';

/**
 * Sends the current text in the textb2ox for input
 * and clears the text area. Updates history state.
 * Adds the current command added
 */
function sendData() {
    if (mainInput.value.trim().length === 0) return; // No empty inputs

    addData(`<small>${mainInput.value}
    ${state.displayDegTypeInHistory ? `<div class="mini-badge" style="float: right">${state.degMode.toUpperCase()}</div></small>` : ''}`);

    /* Reset the autocomplete */
    hideAutocompleteArea();
    autocomplete.current.suggestions = [];

    addData(commandExec(mainInput.value));
    mainInput.value = '';

    /* Reset history index */
    state.historyIndex = state.history.length; // Not -1 as history's length will increment when pressed
}

/**
 * Adds html output
 * @param {string} html    Html output to add
 * @param {boolean} format Format the output? It ignores if the input is empty,
 *                         and adds a wrapper to differentiate
 * @param {boolean} br     Add a <br> after the output?
 */
function addData(html, format = false, br = true) {
    if (format) {
        if (!html) return;
        html = `<div class="special-output">${html}</div>`;
    }

    // Add data and scroll to bottom
    outputDiv.innerHTML += html + (br ? '<br>' : '');
    outputDiv.scrollTop = outputDiv.scrollHeight - outputDiv.clientHeight;
}

/* Submit the input on enter, or on button */
mainInput.addEventListener('keyup', event => {
    event.preventDefault();

    // If new char is a number pulse the corresponding button
    let string = mainInput.value[mainInput.selectionEnd - 1];
    if (string && '0123456789'.includes(string)) {
        if (_hidden.btns.length === 0)
            _hidden.btns = Array.from(document.getElementsByClassName('num-btn')).sort((a, b) => a.innerText > b.innerText ? 1 : -1);
        _hidden.btns[+string].classList.add('btn-pulse');
        setTimeout(() => { _hidden.btns[+string].classList.remove('btn-pulse'); }, 1000); // 1000 is time for the animation
    }

    if (event.keyCode === 13) /* Enter key */
        sendData();
});

/* Autocomplete tab override */
mainInput.addEventListener('keydown', event => {
    if (event.keyCode === 9) { /* Tab key (autocomplete) */
        event.preventDefault();
        autocomplete.onTab(event.shiftKey);
    }
    else if (event.key === 'Escape' && autocomplete.current.suggestions.length > 0) {
        removeChunk(autocomplete.current.cursor, autocomplete.current.cursor + autocomplete.current.length);
        addCharAt(autocomplete.current.orgStr, autocomplete.current.cursor);
        hideAutocompleteArea();
    }
    
    /* History cycling */
    if (state.history.length > 0) {
        if (event.keyCode === 38 || event.keyCode === 40) {
            event.preventDefault();
        
            if (event.keyCode === 38) { /* Up key (history up) */
                state.historyIndex--;
                if (state.historyIndex < 0) state.historyIndex = state.history.length - 1;
            }
            else if (event.keyCode === 40) { /* Up key (history down) */
                state.historyIndex++;
                if (state.historyIndex > state.history.length - 1) state.historyIndex = 0;
            }

            mainInput.value = state.history[state.historyIndex];
            mainInput.focus();
            mainInput.setSelectionRange(mainInput.value.length, mainInput.value.length);
        }
    }
});

/* Autocomplete */
mainInput.addEventListener('input', event => {
    event.preventDefault();
    autocomplete.update();
});

/* Keep text area focused if on the 
 * main page, so if user clicks a button
 * it doesn't lose focus */
document.body.addEventListener('click', () => {
    if (state.currentPage === 'main')
        mainInput.focus();
});

/* Global key intercepts */
document.body.addEventListener('keyup', event => {
    if (event.key === 'Escape' && state.modal) /* Hide modals on escape */
        state.modal.hide();
});

/* Add keyboard shortcuts */
mouseTrap.bind(['ctrl+d', 'command+d'], cycleAngleMode);

module.exports = {
    sendData: sendData,
    addData: addData
};