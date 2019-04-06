/* Stat utils */

'use strict';

const distr = require('distriprob');

const helpForInputData = 
`Numbers can be seperated by a comma, space, or newline. Coordinates can also be given
by wrapping each point with () or [] (ie (1, 2) or [3, 4]), or by seperating numbers
by a comma or space with each data point on its own line<br><br>
We do not recommend overly large datasets`;
const coordinateRegex = /([[(].*?[)\]])/gm;

/**
 * Return data as an array of coordinates (even single numbers will be
 * a length-1 array) formatted from the input string
 * 
 * @param {string} str Data input
 * @return             The data as a formatted array
 */
function parseString(str) {
    str = str.trim();

    /* Multline data, treat each line as a coordinate if there is more than 1 number */
    if (str.includes('\n'))
        return str.split('\n').map(line => line.split(/(\s|,)/g).map(x => +x).filter(x => !!x));

    /* Handle as a single line of data. */
    /* Data contains coordinates */
    if (str.includes('(') || str.includes('[')) {
        let matches = str.match(coordinateRegex);
        /* Strip the [] and () then convert all to numbers */
        return matches.map(x => x.substring(1, x.length - 1).split(',').map(y => +y));
    }

    /* Split by spaces or commas */
    return str.split(/(\s|,)/g).map(x => +x).filter(x => !!x).map(x => [x]);
}

/**
 * Run when one of the data inputs change
 */
function onInputChange() {
    let data = parseString(document.getElementById('stat-page-textarea-1').value);
    let freqList = parseString(document.getElementById('stat-page-textarea-2').value);
    
    /* Error checking: 
     * - Data not all same dimension
     * - Freq list not all integers */

    freqList = freqList.map(x => x[0]);

    const card1 = document.getElementById('stat-page-card-1'); // Stats
    const card2 = document.getElementById('stat-page-card-2'); // Graphs
    const card3 = document.getElementById('stat-page-card-3'); // Tests
    const card4 = document.getElementById('stat-page-card-4'); // Confidence intervals
    const card5 = document.getElementById('stat-page-card-5'); // Sorted

    
    let newhtml1 = '';
    let newhtml2 = '';

    for (let i = 0; i < data[0].length; i++) {
        /* Get each component of data */
        let _temp = [];
        for (let line of data)
            _temp.push(line[i]);

        let stats = computeBasicStats(_temp, freqList);

        /* Updates stat list */
        newhtml1 += `<p style="font-size: 16px; margin-top: 0"><b>${i < 3 ? 
            'XYZ'[i] : 'Data ' + (i + 1)} Stats</b></p>${generateHTML(stats)}\n<br>`;

        /* Confidence interval */
        let testStatZ = stats['σ (Pop.)'] / Math.sqrt(stats.n);
        let testStatT = stats['S<sub>x</sub> (Samp.)'] / Math.sqrt(stats.n);
    }
    card1.innerHTML = newhtml1;

    /* Graphs: Scatter, histogram, bargraph, normal prob plot */

    /* Sorted list */
    let sorted = data.sort((a, b) => a[0] - b[0]);
    card5.innerHTML = `<p style="font-size: 16px; margin-top: 0">Sorted Array</p>
    ${sorted.map(x => x.length === 1 ? x[0] : `(${x.join(', ')})`).join(', ')}`;
}

/**
 * Calculate stats for 1 var
 * @param {array} data     Data (single var)
 * @param {array} freqlist Frequency list (optional)
 * @return {object}    Calculated stats
 */
function computeBasicStats(data, freqlist = []) {
    data.sort((a, b) => a - b);

    if (freqlist.length === data.length) {
        let newdata = [];
        data.forEach((x, j) => { for (let i = 0; i < freqlist[j]; i++) newdata.push(x); });
        data = newdata;
    }

    let sum = data.reduce((a, b) => a + b);
    let mean = sum / data.length;
    let sumSquareDiff = data.map(x => (x - mean) ** 2).reduce((a, b) => a + b);
    let product = data.reduce((a, b) => a * b);
    let q1 = data[Math.floor(data.length * 0.25)];
    let q3 = data[Math.floor(data.length * 0.75)];
    let outlierRange = (q3 - q1) * 1.5;
    let outliers = data.filter(x => x < q1 - outlierRange || x > q3 + outlierRange);
    let MAD = data.map(x => Math.abs(x - mean) / data.length).reduce((a, b) => a + b);
    let skew = 3 * (mean - data[Math.floor(data.length * 0.5)]) / Math.sqrt(sumSquareDiff / data.length);

    let counts = {};
    for (let number of data)
        counts[number] = counts[number] ? counts[number] + 1 : 1;
    
    let counts2 = Object.keys(counts).sort((a, b) => counts[a] > counts[b] ? -1 : 1);
    let mode = counts[counts2[0]] > 1 ? +counts2[0] : null;

    return {
        Mean: mean,
        Median: data[Math.floor(data.length * 0.5)],
        Mode: mode,
        'Min, Max': data[0] + ', ' + data[data.length - 1],
        'Q1, Q3': q1 + ', ' + q3,
        SSE: sumSquareDiff,
        IQR: q3 - q1,
        Range: data[data.length - 1] - data[0],
        'σ<sup>2</sup>': sumSquareDiff / data.length,
        'σ (Pop.)': Math.sqrt(sumSquareDiff / data.length),
        'S<sub>x</sub><sup>2</sup>': sumSquareDiff / (data.length - 1),
        'S<sub>x</sub> (Samp.)': Math.sqrt(sumSquareDiff / (data.length - 1)),
        SkewCoeff: skew,
        'Σx': sum,
        'Σx<sup>2</sup>': data.map(x => x * x).reduce((a, b) => a + b),
        n: data.length,
        'Πx': product,
        Geomean: product ** (1 / data.length),
        Outliers: outliers.join(', '),
        MAD: MAD
    };
}

/**
 * Generate stat html table
 * @param {object}  stats  Stats for the data
 * @return {string}        HTML string
 */
function generateHTML(stats) {
    let keys = Object.keys(stats);
    return `
<table>
${keys.map(x => `<tr><td style="padding-right: 20px">${x}</td><td>${stats[x]}</td></tr>`).join('\n')}
</table>`;
}

module.exports = {
    helpForInputData: helpForInputData,
    parseString: parseString,
    computeBasicStats: computeBasicStats,
    onInputChange: onInputChange
};