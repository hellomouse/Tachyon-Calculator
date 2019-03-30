'use strict';

/* Autocomplete has to be loaded after the main command executer is loaded
 * due to weird loading bug */
let generateHelpText;
setTimeout(() => { generateHelpText = require('../gui/autocomplete.js').generateHelpText; });

const gui = require('../gui');

const MIN_DIM_TO_BE_A_LARGE_MATRIX_Y = 6;
const MIN_DIM_TO_BE_A_LARGE_MATRIX_X = 24;

/**
 * Formats the command and answer together
 * for display
 *
 * @param {string} command Command inputted
 * @param {string} answer Answer from mathjs
 */
function formatAnswer(command, answer) {
    /* Numbers get displayed directly */
    if (typeof answer === 'number')
        return answer;
    if (typeof answer === 'string') {
        /* Output is undefined */
        if (answer === 'undefined' || answer.replace(/"/g, '').trim() === '')
            return '<span class="output-none">No output</span>';
        
        /* Output is null */
        if (answer === 'null')
            return '<span class="output-null">Null</span>';

        /* Remove quotes around string outputs */
        if ((answer[0] === '"' || answer[0] === '\'') &&
            (answer[answer.length - 1] === '"' || answer[answer.length - 1] === '\''))
            return `<span class="output-string">${answer.substring(1, answer.length - 1)}</span>`;

        /* Output is a function */
        if (answer === 'function')
            return `<span class="output-function">${generateHelpText(command)}</span>`;

        /* Output is an object or JSON, which are displayed
         * in a table (each row is key:value)
         *
         * Note this doesn't use JSON.parse as it can't handle undefined
         * and function values */
        if (answer.startsWith('{') && answer.endsWith('}') && answer.includes(':') && answer.includes(',')) {
            answer = answer.substring(1, answer.length - 1);
            answer = answer.split(',')
                .filter(x => x.includes(':'))
                .map(x => x.split(':').map(y => y.trim()));

            /* Note the x[0] substring as x[0] contains quotes around the key */
            return `<table>
                ${answer.map(x =>
        `<tr><td class="output-string">${x[0].substring(1, x[0].length - 1)} 
        &nbsp; &nbsp; </td><td>${x[1]}</td></tr>`).join('')}
            </table>`;
        }

        /* Output is a matrix object */
        if (answer.startsWith('[') && answer.endsWith(']') && answer.includes(',')) {
            try {
                answer = JSON.parse(answer); // Matrixes should only be numbers
                if (Array.isArray(answer) && Array.isArray(answer[0])) {
                    /* Large matrix gets a popup */
                    if (answer.length >= MIN_DIM_TO_BE_A_LARGE_MATRIX_Y ||
                        answer[0].length >= MIN_DIM_TO_BE_A_LARGE_MATRIX_X)
                        return `<span class="view-matrix-link" 
    onclick="require('./src/gui').modal.misc.matrix.show(${JSON.stringify(answer)})">View Matrix</span><br>`;

                    /* Display the matrix directly */
                    return gui.modal.misc.matrix.formatMatrix(answer);
                }
            } catch(e) { /* Not a matrix actually */ }
        }

        /* Default fallback */
        return answer;
    }
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


module.exports = {
    formatAnswer: formatAnswer,
    formatError: formatError
};