/* Main calculator JS utilities 
 * This file is loaded directly, not required */

/* exported d3 winFunc addCharAt removeChunk addCharAt addChar2nd clearInput hideAutocompleteArea removeEnd removeChunk openModal configMathNumber cycleAngleMode*/
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[d3|winFunc]" }] */

'use strict';

/* Load the title bar buttons */
const d3 = require('d3');
const winFunc = require('./public/js/taskbar.js');


/* Variables */
/* "Hidden" variables, to avoid namespace pollution */
let _hidden = {};
_hidden.state = require('./src/state.js');
_hidden.degModes = Object.keys(_hidden.state.degTypes);
_hidden.currentAngleModeIndex = _hidden.degModes.indexOf(_hidden.state.degMode) - 1; // -1 for initial setting
_hidden.btns = [];

let secondPressed = false;
let autocompleteFuncParen = true;

/** 
 * Code to modify the input boxes used
 * by some of the buttons. Use a ~ to
 * mark new cursor position (optional)
 * 
 * Recommended to only add 1 character, but you can
 * technically add any length string
 * 
 * @param {string} string String to add
 * @param {number} selectionShift Displacement to place the cursor 
 */
function addChar(string, selectionShift = 0) {
    let input = document.getElementById('main-input');

    /* Ensure input is focused so selection start will return
     * an accurate result */
    input.focus();

    let val = input.value;
    let ss = input.selectionStart + selectionShift;

    if (autocompleteFuncParen && string.endsWith('(') && !string.includes('~'))
        string += '~)';

    input.value = val.substring(0, ss) + string.replace('~', '') + val.substring(ss);

    let l = string.indexOf('~') != -1 ? string.indexOf('~') : string.length;
    input.setSelectionRange(ss + l, ss + l);

    if (secondPressed) toggle2nd();
}

/**
 * Insert a string (recommended to be a char) at the
 * given location in the input (String index, not based
 * on current cursor location)
 * 
 * @param {string} char  String to add
 * @param {number} index Index to add at
 */
function addCharAt(char, index) {
    let input = document.getElementById('main-input');
    let val = input.value;
    let l = char.indexOf('~') != -1 ? char.indexOf('~') : char.length;

    input.value = val.substring(0, index) + char.replace('~', '') + val.substring(index);
    input.focus();
    input.setSelectionRange(index + l, index + l);
}

/**
 * Add a string depending on if the 2nd button is pressed
 * @param {string} a String to add if 2nd is not pressed
 * @param {string} b String to add if 2nd is pressed
 */
function addChar2nd(a, b) {
    if (!secondPressed) addChar(a);
    else addChar(b);
}

/**
 * Clears the input box, or if the input box is empty,
 * clears the output-area. Used by the AC button
 */
function clearInput() {
    if (document.getElementById('main-input').value === '')
        document.getElementById('output-area').innerHTML = '';
    document.getElementById('main-input').value = '';
}

/**
 * Hides the autocomplete bar
 */
function hideAutocompleteArea() {
    document.getElementById('autocomplete-area').style.display = 'none';
    document.getElementById('function-help').style.display = 'none';
}

/**
 * Remove a string of length from the input, starting from the current
 * cursor location.
 * 
 * @param {number} length         Num. of characters to remove
 * @param {number} selectionShift Shift for the selection when done removing.
 */
function removeEnd(length = 1, selectionShift = 0) {
    let input = document.getElementById('main-input');

    input.focus(); // Ensure accurate selectionStart value

    let val = input.value;
    let ss = input.selectionStart - 1;

    input.value = val.substring(0, ss - length + 1) + val.substring(ss + 1);
    input.setSelectionRange(ss + selectionShift, ss + selectionShift);
}

/**
 * Remove a string chunk from start index to end index
 * from the input
 * 
 * @param {number} start Start index
 * @param {number} end   End index
 */
function removeChunk(start, end) {
    let input = document.getElementById('main-input');
    let val = input.value;
    input.value = val.substring(0, start) + val.substring(end);
}

/**
 * Toggle the 2nd button. Updates secondPressed variable, and
 * toggles some CSS classes.
 */
function toggle2nd() {
    secondPressed = !secondPressed;

    // Toggle 2nd label active
    let labels = document.getElementsByClassName('second-label');
    Array.from(labels).forEach(el => el.classList.toggle('second-label-active'));

    // Toggle primary button
    labels = document.getElementsByClassName('has-second-btn');
    Array.from(labels).forEach(el => el.classList.toggle('has-second-btn-active'));

    // Toggle 2nd button active
    document.getElementById('2nd-btn').classList.toggle('second-btn-active');
}

/**
 * Open a modal depending on if the 2nd button is pressed.
 * Modal is a string and must point to a Modal object in src/gui
 * 
 * For example, if I wanted to open gui.dist.menu, I would
 * input 'dist.menu' as the parameter.
 * 
 * @param {string} firstModal  First modal path
 * @param {string} secondModal Second modal path
 */
function openModal(firstModal, secondModal) {
    let modal = firstModal;
    let current = require('./src/gui');

    if (secondPressed && secondModal) {
        modal = secondModal;
        toggle2nd();
    }

    for (let key of modal.split('.'))
        current = current[key];
    current.show();
}

/**
 * Set the type of number to use in math
 * @param {string} type Type of number
 */
function configMathNumber(type) {
    const math = require('mathjs');

    if (type === 'BigNumber')
        math.config({ number: 'BigNumber', precision: require('./src/state.js').precision });
    else if (type === 'number')
        math.config({ number: 'number' });
    else if (type === 'Fraction')
        math.config({ number: 'Fraction' });
    else throw new TypeError(`Unknown config type ${type}`);

    require('./src/state.js').numType = type;
}

/**
 * Cycle through angle settings
 */
function cycleAngleMode() {
    const state = _hidden.state;

    _hidden.currentAngleModeIndex = (_hidden.currentAngleModeIndex + 1) % _hidden.degModes.length;
    state.degMode = _hidden.degModes[_hidden.currentAngleModeIndex];
    
    document.getElementById('angle-btn').innerHTML = state.degMode.toUpperCase();
    document.getElementById('degModeLabel').innerHTML = state.degMode === 'deg' ?
        state.degMode.toUpperCase() + 'REES' : state.degMode.toUpperCase() + 'IANS';
}
