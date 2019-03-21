/* Current calculator state */

let state = {
    modal: null,  // Current modal object
    page: 'main', // Current page name

    latexPrint: false,
    dispMode: 'normal', // normal, sci, frac
    numMode: 'number',  // number, BigNumber, Fraction, complex
    degMode: 'rad',     // rad, deg or grad

    fractionType: 'normal', // normal, mixed

    maxFuncRunTime: 1000, // Max runtime for some functions that are computationally expensive
                          // does not apply to all functions
    maxHistoryItems: 1000,

    enableAutocomplete: true,

    /* Command history (Not saved) */
    history: [],
    ans: 0,
    historyIndex: 0, 
};

module.exports = state;