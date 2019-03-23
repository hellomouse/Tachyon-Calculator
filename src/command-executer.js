/* Runs the finalized command in the current input box */

'use strict';

const math = require('mathjs');
const state = require('./state.js');

/* Custom packages */
require('mathjs-fix'); // Custom modifications to mathjs
require('other-fix');   // Patching for numbers.js and other modules

math.import(require('numbers'), { wrap: true, silent: true });
math.import(require('numeric'), { wrap: true, silent: true });
math.import(require('calc-func'), { wrap: true, silent: true, override: true });

require('add-units');  // Adds more units  */

math.config({ number: 'BigNumber', precision: 60 });

/**
 * Formats the command and answer together
 * for display
 * 
 * @param {string} command Command inputted
 * @param {string} answer Answer from mathjs
 */
function formatAnswer(command, answer) {
    /* Output was a mathjs function */
    if (answer.toString().includes('function') && !answer.toString().includes('Error')
        && answer.toString.includes('{'))
        answer = `[function ${command}]`;

    return answer;
}

/**
 * Formats the name and error of a message
 * for display
 * 
 * @param {string} command Command inputted
 * @param {string} name Name of the error
 * @param {string} msg  Message of the error
 */
function formatError(command, name, msg) {
    return formatAnswer(command, 
        `<span class="error-msg"><b>${name}</b> ${msg}</span>`);
}

/**
 * Execute the command sent. Returns
 * the command output as an HTML string
 * 
 * @param {string} command Command input
 */
module.exports = function(command) {
    /* Push the command to state history */
    state.history.push(command);
    if (state.history.length > state.maxHistoryItems)
        state.history = state.history.slice(state.history.length - state.maxHistoryItems);

    try {
        let ans = math.eval(command, { Ans: state.ans });
        state.ans = ans;
        return formatAnswer(command, ans);
    } catch(e) {
        return formatError(command, e.name, e.message);
    }
};