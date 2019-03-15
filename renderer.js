/* Executed by the renderer process
 * Handles main HTML code submission */

require('cache-require-paths');
require('app-module-path').addPath('./packages'); // Add 'packages' as alt folder for modules

const commandExec = require('./src/command-executer.js');
const state = require('./src/state.js');

const outputDiv = document.getElementById('output-area');
const mainInput = document.getElementById('main-input');

/* Modal test */
state.modal = require('./src/gui').dist.menu;
state.modal.show();

/* Clear the loading screen */
outputDiv.innerHTML = '';


/**
 * Sends the current text in the textb2ox for input
 * and clears the text area. Updates history state.
 * Adds the current command added
 */
function sendData() {
    addData(`<small>${mainInput.value}</small>`);
    addData(commandExec(mainInput.value));
    mainInput.value = '';
}

/**
 * Adds html output
 * @param {string} html    Html output to add
 * @param {boolean} format Format the output? It ignores if the input is empty,
 *                         and adds a wrapper to differentiate
 */
function addData(html, format=false) {
    if (format) {
        if (!html) return;
        html = `<div class="special-output">${html}</div>`
    }

    // Add data and scroll to bottom
    outputDiv.innerHTML += html + '<br>';
    outputDiv.scrollTop = outputDiv.scrollHeight - outputDiv.clientHeight;
}

/* Submit the input on enter, or on button */
mainInput.addEventListener('keyup', event => {
        event.preventDefault();
        if (event.keyCode === 13) /* Enter key */
            sendData();
    });
document.getElementById('equals-btn').addEventListener('click', event => {
    sendData(); });

/* Keep text area focused if on the 
 * main page, so if user clicks a button
 * it doesn't lose focus */
document.body.addEventListener('click', event => {
    if (state.currentPage === 'main')
        mainInput.focus();
});

/* Global key intercepts */
document.body.addEventListener('keyup', event => {
    if (event.key === 'Escape') /* Hide modals on escape */
        state.modal.hide();
});

module.exports = {
    sendData: sendData,
    addData: addData
}