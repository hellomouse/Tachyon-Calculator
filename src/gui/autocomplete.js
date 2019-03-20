/* Update the autocomplete bar */
'use strict';

const math = require('mathjs');
const getFunctionArguments = require('get-function-arguments');

const input = document.getElementById('main-input');
const autocompleteArea = document.getElementById('autocomplete-area');

const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$';
const functionNames = Object.keys(math)
    .filter(x => x[0] !== '_' && !/[^a-z\d_$]/i.test(x));

function updateAutocompleteArea() {
    input.focus();

    let val = input.value;
    let ss = input.selectionStart;

    /* Count backwards from selection to last non-variable char character */
    let index = 0;
    for (let i = ss - 1; i >= 0; i--) {
        if (!allowedChars.includes(val.substring(i, i + 1))) {
            index = i + 1;
            break;
        }
    }

    let fragment = val.substring(index, ss).toLowerCase();

    if (fragment.length < 3) {
        autocompleteArea.style.display = 'none';
        return;
    }

    // todo binary search this shit
    // display function args
    // press tab to autocomplete
    // save current autocomplete options in variable
    // uo down to go through autocomplete, enter to select button (use .focus)
    // make optional in state
    // filter some autocomplete shit
    // tab cycle

    let html = '';
    let secondaryHTML = '';

    const space = ' &nbsp; ';
    const wrapButton = f => {
        let isFunc = math[f] instanceof Function;
        return`<button 
        class="${isFunc ? 'function' : 'constant'}"
        onclick="removeChunk(${index}, ${index + fragment.length}); 
                 addCharAt('${f}${isFunc ? '(~)' : ''}', ${ index }); hideAutocompleteArea(); ">${f}</button>`;
    }

    /* Autocomplete for function names */
    for (let f of functionNames) {
        /* Sort functions that start with the search first */
        if (f.toLowerCase().startsWith(fragment))
            html += wrapButton(f) + space;
        else if (f.toLowerCase().includes(fragment))
            secondaryHTML += wrapButton(f) + space;
    }

    if (html.length > 0 || secondaryHTML.length > 0) {
        autocompleteArea.style.display = 'block';
        autocompleteArea.innerHTML = html + secondaryHTML;
    } else {
        autocompleteArea.style.display = 'none';
    }
}

module.exports = updateAutocompleteArea;