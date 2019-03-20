/* Stat Test functions */

'use strict';

const distriprob = require('distriprob');
const math = require('mathjs');

/* Let renderer load first */
let renderer;
setTimeout(() => { renderer = require('../../../../renderer.js'); }, 1000);

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
    
}   