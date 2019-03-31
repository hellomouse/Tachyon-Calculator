/* Runs the finalized command in the current input box */
/* global configMathNumber:true */

'use strict';

const math = require('mathjs');
const state = require('./state.js');
const util = require('./util');

const formatAnswer = util.output.formatAnswer;
const formatError = util.output.formatError;

/* Custom packages */
const mathFix = require('mathjs-fix'); // Custom modifications to mathjs
require('other-fix');   // Patching for numbers.js and other modules

math.import(require('numbers'), { wrap: true, silent: true });
math.import(require('numeric'), { wrap: true, silent: true });
math.import(require('calc-func'), { wrap: true, silent: true, override: true });

require('add-units');  // Adds more units  */
require('add-constants'); // Add more constants

// Add toggleable trig mode
mathFix.modifyMathTrigToggle(state);

configMathNumber('BigNumber');

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
        let ans = math.format(math.eval(command.replace(
            /* Replaces Ans with the value, don't use the scope argument 
             * as it doesn't properly handle units and other non-number types */
            /.*?(^|[^\w])Ans($|[^\w]).*?/gm, state.ans)), state.format);
        state.ans = ans;
        return '<span class="output-item">' + formatAnswer(command, ans) + '</span>';
    } catch(e) {
        return formatError(command, e.name, e.message);
    }
};