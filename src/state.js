/* Current calculator state */

let state = {
    modal: null,  // Current modal object
    page: 'main', // Current page name

    latexPrint: false,
    dispMode: 'normal', // normal, sci, frac
    numMode: 'number',  // number, BigNumber, Fraction
    degMode: 'rad',     // rad, deg or grad
    degTypes: { rad: '(2*pi)', deg: 360, grad: 400 },

    precision: 60,

    fractionType: 'normal', // normal, mixed

    maxFuncRunTime: 1000, /* Max runtime for some functions that are computationally expensive
                           * does not apply to all functions */
    minTimeToBeASlowFunc: 100, /* Functions slower than this will get a loading message */
    maxHistoryItems: 1000,
    displayDegTypeInHistory: true,

    enableAutocomplete: true,

    format: {
        notation: 'auto',
        precision: 59,   // Precision - 1
        fraction: 'ratio'
    },

    customConstants: {

    },

    /* Command history (Not saved) */
    history: [],
    ans: 0,
    historyIndex: 0, 
};

module.exports = state;