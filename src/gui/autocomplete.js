/* Update the autocomplete bar */
'use strict';

const math = require('mathjs');
const state = require('../state.js');
const getFunctionArguments = require('get-function-arguments');

/* HTML elements */
const input = document.getElementById('main-input');
const autocompleteArea = document.getElementById('autocomplete-area');

/* Misc constants */
const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$';
const functionNames = Object.keys(math)
    .filter(x => x[0] !== '_' && !/[^a-z\d_$]/i.test(x))
    .slice(22);  // First 22 keys in mathjs are not useful functions or constants

const space = ' &nbsp; ';
const wrapButton = (i, f, index, fragment) => {
    let isFunc = math[f] instanceof Function;
    return `<button 
        class="${isFunc ? 'function' : 'constant'}" id="autocomplete-btn-${i}"
        onclick="removeChunk(${index}, ${index} + require('./src/gui/autocomplete.js').current.length); 
                 addCharAt('${f}${isFunc ? '(~)' : ''}', ${index}); hideAutocompleteArea(); ">${f}</button>`;
}

/* Misc variables */
let current = {
    suggestions: [],  // Current list of suggestions
    index: 0,         // Current index to suggest
    length: 0,        // Current length added
    cursor: 0,        // Current cursor
    orgStr: ''        // Original string before autocomplete was added
};

/**
 * Updates the autocomplete area with suggestions, 
 * this should be run when the input changes (oninput)
 */
function updateAutocompleteArea() {
    /* Autocomplete is disabled */
    if (!state.enableAutocomplete)
        return;

    input.focus();
    current.suggestions = []; // Reset on any update to avoid old autocompletes working

    let val = input.value;
    let ss = input.selectionStart;

    /* Count backwards from selection to last non-variable char character
     * This will be the search query for the autocomplete */
    let index = 0;
    for (let i = ss - 1; i >= 0; i--) {
        if (!allowedChars.includes(val.substring(i, i + 1))) {
            index = i + 1;
            break;
        }
    }

    let fragment = val.substring(index, ss).toLowerCase();

    if (fragment.length < 2) {
        autocompleteArea.style.display = 'none';
        return;
    }

    // todo binary search the function names or index with buckets
    //      or some way to make searching a 800 item list more efficent
    // display function args if the fragment matches a name exactly

    current.index = 0;
    current.length = fragment.length;
    current.cursor = index;
    current.orgStr = fragment;

    /* Autocomplete for function names */
    let suggestions1 = []; // Suggestions that start with search query
    let suggestions2 = []; // Suggestions not in suggestions1 and contain the query
    let html;              // HTML for new buttons

    for (let f of functionNames) {
        /* Sort functions that start with the search first */
        if (f.toLowerCase().startsWith(fragment))
            suggestions1.push(f);
        else if (f.toLowerCase().includes(fragment))
            suggestions2.push(f);
    }

    /* Sort by name, longest first */
    suggestions1.sort((a, b) => b.length - a.length);
    suggestions2.sort((a, b) => b.length - a.length);

    current.suggestions = suggestions1.concat(suggestions2);
    html = current.suggestions.map((x, i) => wrapButton(i, x, index, fragment)).join(space);

    if (html.length > 0) {
        autocompleteArea.style.display = 'block';
        autocompleteArea.innerHTML = html;
    } else {
        autocompleteArea.style.display = 'none';
    }
}

/**
 * Executes when the tab key is pressed (tab complete)
 * Cycles through current suggestions
 * 
 * @param {boolean} reverseOrder Go backwards?
 */
function onTab(reverseOrder=false) {
    if (current.suggestions.length === 0)
        return;

    autocompleteArea.style.display = 'block';

    /* Note: -- is not used as the index is incremented
     * AFTER TAB is pressed, so there will be a pause */
    if (reverseOrder) {
        current.index -= 2;

        // Negative mod fix, since js can return negative values for %
        if (current.index < 0) current.index = current.suggestions.length - 1;
    }

    /* Wrap index around */
    current.index = current.index % current.suggestions.length;

    /* Functions get a ( ) in the autocomplete */
    let f = current.suggestions[current.index];
    if (math[f] instanceof Function)
        f += '(~)';

    /* Remove old autocomplete and add new one */
    removeChunk(current.cursor, current.cursor + current.length);
    addCharAt(f, current.cursor);

    /* Highlight the current autocomplete button */
    for (let i = 0; i < current.suggestions.length; i++) {
        let btn = document.getElementById(`autocomplete-btn-${i}`);
        if (i === current.index) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            btn.classList.add('highlight');
        }
        else
            btn.classList.remove('highlight');
    }

    current.length = f.length;
    current.index++;
}

module.exports = {
    update: updateAutocompleteArea,
    onTab: onTab,
    current: current
}