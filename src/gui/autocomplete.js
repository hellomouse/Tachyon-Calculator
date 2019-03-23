/*global addCharAt removeChunk:true*/

/* Update the autocomplete bar */
'use strict';

const math = require('mathjs');
const state = require('../state.js');

const funcData = require('mathjs-fix').allFunctions;
const helpDocs = require('mathjs-fix').helpDocs;
const getFunctionArguments = require('get-function-arguments');

/* HTML elements */
const input = document.getElementById('main-input');
const autocompleteArea = document.getElementById('autocomplete-area');
const functionHelp = document.getElementById('function-help');

/* Misc constants */
const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$';
const functionNames = Object.keys(math)
    .filter(x => x[0] !== '_' && !/[^a-z\d_$]/i.test(x))
    .slice(22);  // First 22 keys in mathjs are not useful functions or constants

const space = '';  // ' &nbsp; '
const wrapButton = (i, f, index) => {
    let isFunc = math[f] instanceof Function;
    return `<button 
        class="${isFunc ? 'function' : 'constant'}" id="autocomplete-btn-${i}"
        onclick="removeChunk(${index}, ${index} + require('./src/gui/autocomplete.js').current.length); 
                 addCharAt('${f}${isFunc ? '(~)' : ''}', ${index}); hideAutocompleteArea(); ">${f}</button>`;
};

/* Misc variables */
let current = {
    suggestions: [],  // Current list of suggestions
    index: 0,         // Current index to suggest
    length: 0,        // Current length added
    cursor: 0,        // Current cursor
    orgStr: ''        // Original string before autocomplete was added
};

/**
 * Generate help html output
 * @param {string} name Name of function to get help for
 */
function generateHelpText(name) {
    let func = funcData[name] ? funcData[name] : math[name];

    if (func instanceof Function) {
        /* Wrapper, builtin math.js function */
        
        /* If it's a builtn function, maybe we can get some documentation
         * using math.help (Which throws an error if name doesn't exist) */
        let helpText = '';
        try { helpText = math.help(name).doc.description; } 
        catch(e) { helpText = helpDocs[name] ? helpDocs[name] : ''; }

        if (helpText) helpText = `<span class="help-doc">${helpText}</span<`;

        if (func.toString().includes('generic.apply') || func.toString().includes('fn.apply'))
            return `<span class="function">Ƒ&nbsp;&nbsp;</span> <b>${name}</b>: [Unknown arguments]${helpText}`;

        let help = getFunctionArguments(func);
        return `<span class="function">Ƒ&nbsp;&nbsp;</span> <b>${name}</b>: ${help.join(', ')}${helpText}`;
    }
    else if (math.type.isUnit(func)) {
        return `<span class="constant">&#1008;&nbsp;&nbsp;</span> <b>${name}</b>: ${func.value} ${func.units.map(x => x.prefix.name 
            + x.unit.name + (x.power !== 1 ? ` <sup>${x.power}</sup>` : '')).join(' · ')}`;
    }
    else if (typeof func === 'number')
        return `<span class="constant">&#1008;&nbsp;&nbsp;</span> <b>${name}</b>: ${func}`;
    else if (func && func.toString)
        return `<span class="constant">&#1008;&nbsp;&nbsp;</span> <b>${name}</b>: ${func.toString()}`;
    return '';
}

/**
 * Updates the HTML for the help text
 * @param {string} name Name of function to get help for
 */
function updateHelpText(name) {
    functionHelp.innerHTML = generateHelpText(name);
}

/**
 * Display the help for constants if
 * autocomplete has 1 suggestion and it
 * is not a function
 */
function displayConstantHelp() {
    /* Display help if variable */
    functionHelp.style.display = 'none';
    if (current.suggestions.length === 1 && autocompleteArea.innerHTML.includes('class="constant"')) {
        autocompleteArea.style.display = 'none';
        functionHelp.style.display = 'block';
        updateHelpText(current.suggestions[0]);
    } 
}

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
        functionHelp.style.display = 'none';

        /* Count backwards from the last (, if it matches a function
         * name try to display the help. 
         *
         * Ie if the current value is
         * test(0, 1|), it will count backwards from the cursor (|),
         * returning the substring 'test' */
        let startIndex = -1;
        let index = 0;

        for (let i = ss - 1; i >= 0; i--) {
            let char = val.substring(i, i + 1);

            if (char === '(' && allowedChars.includes(val.substring(i - 1, i)))
                startIndex = i;
            else if (startIndex !== -1 && !allowedChars.includes(val.substring(i, i + 1))) {
                index = i + 1;
                break;
            }
        }
        
        if (startIndex !== -1) {
            functionHelp.style.display = 'block';
            updateHelpText(val.substring(index, startIndex));
        }

        return;
    } else if (/^\d+$/g.test(fragment)) // Only number shouldn't be autocompleted
        return;

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
    
    html = current.suggestions.map((x, i) => wrapButton(i, x, index)).join(space);

    if (html.length > 0) {
        autocompleteArea.style.display = 'block';
        autocompleteArea.innerHTML = html;
        displayConstantHelp();
    } else {
        autocompleteArea.style.display = 'none';
        functionHelp.style.display = 'none';
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
    functionHelp.style.display = 'none';
    displayConstantHelp();

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

    /* Update help text */
    updateHelpText(current.suggestions[0]);

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
    current: current,
    updateHelpText: updateHelpText
};