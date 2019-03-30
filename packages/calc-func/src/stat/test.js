/* Stat Test functions */

'use strict';

const distriprob = require('distriprob');
const math = require('mathjs');

/* Let renderer load first */
let renderer;
setTimeout(() => {
    renderer = require('../../../../renderer.js');
});

/**
 * Returns the symbol for the direction parameter
 * @param {string} direction Direciton in a test
 */
function getDirectionSymbol(direction) {
    let directionStr;
    if (direction === 'not')
        directionStr = '≠';
    else if (direction === 'less')
        directionStr = '<';
    else
        directionStr = '>';
    return directionStr;
}

module.exports = {
    TwoPropZTest: function(x1, n1, x2, n2, direction='not', showWork=true) {
        /* @help Conduct a Z-test on two independent proportions */
        /* Normalize numbers */
        x1 = math.number(x1);
        n1 = math.number(n1);
        x2 = math.number(x2);
        n2 = math.number(n2);

        /* Check direction type - p1 is <direction> than p2 */
        if (!['not', 'less', 'greater'].includes(direction))
            throw new TypeError(`Direction must be 'not', 'less', 'greater', got ${direction}`);
        /* Check all are integers */
        if (!Number.isInteger(x1) || !Number.isInteger(x2) || !Number.isInteger(n1) ||
            !Number.isInteger(n2))
            throw new TypeError(`x1, n1, x2 and n2 must be integers: ${x1} ${n1} ${x2} ${n2}`);
        
        let p1 = x1 / n1;
        let p2 = x2 / n2;
        let pc = (x1 + x2) / (n1 + n2);

        /* Check if proportions are between 0 and 1 */
        if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1)
            throw new RangeError(`Proportions must be between 0 and 1 inclusive (p1 = ${p1}, p2 = ${p2})`);

        let temp = Math.sqrt(pc * (1 - pc) * (1 / n1 + 1 / n2));
        let z = (p1 - p2) / temp;

        let returned;
        let result = distriprob.normal.cdfSync(z, 0, 1);

        if (direction === 'not') {
            let temp = 0;
            if (result < 0) temp = result - distriprob.normal.cdfSync(-1e99, 0, 1);
            else if (result > 0) temp = distriprob.normal.cdfSync(1e99, 0, 1) - result;
            returned = 2 * temp;
        } 
        else if (direction === 'less')
            returned = result - distriprob.normal.cdfSync(-1e99, 0, 1);
        else if (direction === 'greater')
            returned = distriprob.normal.cdfSync(1e99, 0, 1) - result;

        if (showWork) {
            /* Check normal condition */
            let error = '';
            if (x1 < 10 || n1 - x1 < 10 || x2 < 10 || n2 - x2 < 10)
                error = `<span class="error-msg"><b>Warning: </b>Normal condition is not satisfied!<br>
np ≥ 10 and n(1-p) ≥ 10 is not true for one or more of the proportions</span><br>`;

            renderer.addData(`${error}
p<sub>1</sub> ${getDirectionSymbol(direction)} p<sub>2</sub><br>
p<sub>1</sub> = ${p1}<br>
p<sub>2</sub> = ${p2}<br>
<small>p<sub>c</sub> = (${x1} + ${x2})&frasl;(${n1} + ${n2})</small><br>
p<sub>c</sub> = ${pc}
<br>
<small>z = (${p1.toFixed(3)} - ${p2.toFixed(3)}) &frasl; √((${pc.toFixed(3)})(1 - ${pc.toFixed(3)}) (1 / ${n1} + 1 / ${n2}))</small><br>
z  = ${z}<br>
p = ${returned}
            `, true);
        }
        return returned;
    },  

    chi2GOFTest: function(observedList, expectedList, df, showWork = true) {
        /* @help Perform a chi^2 goodness of fit test */
        /* Check array dimensions */
        if (observedList.length !== expectedList.length)
            throw new Error(`List dimensions do not match (${observedList.length} ≠ ${expectedList.length})`);

        let contributions = expectedList.map((x, i) => math.eval(`(${x} - ${observedList[i]})^2 / ${x}`));
        let sum = math.eval(`sum(${contributions})`);
        let pValue = distriprob.chi2.cdfSync(1e99, math.number(df)) - distriprob.chi2.cdfSync(math.number(sum), math.number(df));

        if (showWork) {
            let error = '';
            if (expectedList.some(x => x < 5))
                error = `<span class="error-msg"><b>Warning: </b>Large number condition not satisifed; all expected
values should be at least 5</span><br>`;
            renderer.addData(`${error}
<table>
<tr><td>χ<sup>2</sup></td><td>${+math.number(sum).toFixed(8)}</td></tr>
<tr><td>p</td><td>${pValue}</td></tr>
<tr><td>df</td><td> ${df}</td></tr>
<tr><td>Contrib &nbsp; &nbsp;</td><td>${contributions.map(x => +math.number(x).toFixed(8)).join(', ')}</td></tr>
</table>`, true);
        }

        return pValue;
    },

    chi2Test: function (observedMatrix, writeExpectedToMatrix = null, showWork = true) {
        /* @help Perform a chi^2 test */
        /* Check matrix is a valid grid */

        if (!Array.isArray(observedMatrix))
            observedMatrix = observedMatrix.toArray();

        if (!observedMatrix.every(x => x.length === observedMatrix[0].length))
            throw new Error('Matrix rows must all be the same length');

        const sumCol = (matrix, col) => matrix.map(x => x[col]).reduce((a, b) => a + b);
        const sumRow = (matrix, row) => matrix[row].reduce((a, b) => a + b);

        /* Create a x b matrix same size as observed but empty */
        let contribMatrix = [];
        let expectedMatrix = [];
        while (contribMatrix.push(new Array(observedMatrix[0].length).fill(0)) < observedMatrix.length);
        while (expectedMatrix.push(new Array(observedMatrix[0].length).fill(0)) < observedMatrix.length);

        /* Convert entire matrix to numbers */
        for (let y = 0; y < observedMatrix.length; y++) {
            for (let x = 0; x < observedMatrix[y].length; x++)
                observedMatrix[y][x] = math.number(observedMatrix[y][x]);
        }

        let totalSum = observedMatrix.map(x => x.reduce((a, b) => a + b)).reduce((a, b) => a + b);
        let df = (observedMatrix.length - 1) * (observedMatrix[0].length - 1);
        let error = '';

        /* Fill expected and contrib matrix */
        let sum = 0;

        for (let y = 0; y < observedMatrix.length; y++) {
            for (let x = 0; x < observedMatrix[y].length; x++) {
                let rowSum = sumRow(observedMatrix, y);
                let colSum = sumCol(observedMatrix, x);
                let expected = rowSum * colSum / totalSum;
                let contrib = (observedMatrix[y][x] - expected) ** 2 / expected;

                expectedMatrix[y][x] = expected;
                contribMatrix[y][x] = contrib;
                sum += contrib;

                if (expected < 5)
                    error = `<span class="error-msg"><b>Warning: </b>Large number condition not satisifed; all expected 
values should be at least 5</span><br>`;
            }
        }

        let pValue = distriprob.chi2.cdfSync(1e99, math.number(df)) - distriprob.chi2.cdfSync(math.number(sum), math.number(df));
        if (showWork) {
            renderer.addData(`${error}
<table>
<tr><td>χ<sup>2</sup></td><td>${+math.number(sum).toFixed(8)}</td></tr>
<tr><td>p</td><td>${pValue}</td></tr>
<tr><td>df</td><td> ${df}</td></tr>
<tr><td>Expected &nbsp; &nbsp;</td><td><span class="view-matrix-link" 
    onclick="require('./src/gui').modal.misc.matrix.show(${JSON.stringify(expectedMatrix)})">View Matrix</span></td></tr>
<tr><td>Contrib &nbsp; &nbsp;</td><td><span class="view-matrix-link" 
    onclick="require('./src/gui').modal.misc.matrix.show(${JSON.stringify(contribMatrix)})">View Matrix</span></td></tr>
</table>`, true);
        }

        if (writeExpectedToMatrix) {
            /* Deep clone expected matrix to write expected matrix */
            try {
                for (let y = 0; y < expectedMatrix.length; y++) {
                    for (let x = 0; x < expectedMatrix[y].length; x++)
                        writeExpectedToMatrix[y][x] = expectedMatrix[y][x];
                }
            } catch(e) {
                renderer.addData(`<span class="error-msg"><b>Error: </b>Failed to write to writeExpectedToMatrix<br>
Reason: ${e.name}: ${e.message}</span><br>`, true);
            }
        }

        return pValue;
    },
};