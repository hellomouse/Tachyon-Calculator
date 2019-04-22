'use strict';

const guiUtil = require('../gui-utils.js');
const Modal = require('../modal.js');

const pages = {
    General: {
        limit: 'Approximate a limit of a 1D function',
        derivative: 'Symbolic or numeric derivative of a function',
        integral: 'Definite or indefinite integral of a function',
        partfrac: 'Partial fraction decomposition',
        summation: 'Sum of a series',
        seriesProduct: 'Product of a series'
    },
    Approx: {
        fmin: 'Approximate the min of a unimodal function',
        fmax: 'Approximate the max of a unimodal function',
        newtonRaphson: 'Approximate roots with newton-raphson method',
        Riemann: 'Compute a 1D riemann sum',
        taylorSeries: 'Compute a taylor series, optionally at a point',
        lagrangeErrorBound: 'Get lagrange error bound of a function'
    },
    Multivariable: {
        gradient: 'Gradient vector of a function',
        curl: 'Curl of a vector field',
        div: 'Divergence of a vector field',
    },
};

/* The modal created */
const modal = new Modal(`
<div style="margin: 30px">
    <h2>Calculus</h2>

    ${guiUtil.generateTabsFromPage(pages, '150px')}

    <button class="modal-btn"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>
    <br>
</div>`, [-1, 'auto']);
modal.tabs = 3;
module.exports = modal;