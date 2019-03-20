/* Template generator for dist functions, removes the need
 * to create a seperate modal for each one. Note the following:
 * 
 * pdf: first input should be x value
 * cdf: first inputs should be "low", "high"
 * inv: first input is area
 */

const getFunctionArguments = require('get-function-arguments');
const assert = require('assert');
const Modal = require('../modal.js');

const variableReplace = {
    'u': 'μ',
    'sigma': 'σ',
    'dof1': 'dfNumer',
    'dof2': 'dfDenom',
    'alpha': 'α',
    'beta': 'β',
    'lambda': 'λ'
};

/* These functions are just, in general, symmetric not necessarily around 0 */
const symmetricalFunctions = ['normal', 't', 'norm', 'cauchy'];
const discreteFunctions = ['binomial', 'geometric', 'hypergeometric'];

/**
 * Formats a PDF, CDF or INV function for
 * titling. Assumes format like this:
 * - [something]pdf
 * - [something]cdf
 * - inv[Something]
 * 
 * @param {string} name Name of function
 */
function formatFunctionName(name) {
    name = name.toLowerCase();

    let baseName = name;
    if (name.endsWith('pdf') || name.endsWith('cdf'))
        baseName = baseName.substring(0, baseName.length -3);
    else if (name.startsWith('inv'))
        baseName = baseName.substring(3);

    /* Chi squared gets special character */
    baseName = baseName.replace('chi2', 'χ<sup>2</sup>');

    /* Title case */
    baseName = baseName.charAt(0).toUpperCase() + baseName.substring(1).toLowerCase();

    if (name.endsWith('pdf'))
        return `${baseName} PDF`;
    else if (name.endsWith('cdf'))
        return `${baseName} CDF`;
    else if (name.startsWith('inv'))
        return `Inv${baseName}`;
    return baseName;
}

/**
 * Generate the HTML for the input boxes. Parameter names
 * will be title-cased, and parameters named 'high' and 'low'
 * will have the option of inserting pos or negative infinity,
 * respectively.
 * 
 * @param {array} funcParams Array of function parameter names
 */
function generateInputs(funcParams) {
    let html = '';
    let i = 0;

    for (let name of funcParams) {
        /* Deal with defaults gracefully */
        let defaultHtml = '';
        if (name.includes('=')) {
            name = name.replace(/\s+/g, '');
            defaultHtml = 'value="' + name.split('=')[1] + '"';
            name = name.split('=')[0];
        }

        /* Deal with button HTML */
        let buttonHtml = '';
        if (name === 'high') {
            buttonHtml = `<button style="display: inline; width: 70px" class="modal-btn"
                    onclick="document.getElementById('modal-${i}').value = '1e99'; document.getElementById('modal-${i}').oninput();">+INF</button>`;
        }
        else if (name === 'low') {
            buttonHtml = `<button style="display: inline; width: 70px" class="modal-btn"
                    onclick="document.getElementById('modal-${i}').value = '-1e99'; document.getElementById('modal-${i}').oninput();">-INF</button>`;
        }

        let title = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
        html += `
        <tr>
            <td style="user-select: none;">${variableReplace[name] || title}</td>
            <td>
                <input oninput="require('./src/state.js').modal.updateState()" type="number" ${defaultHtml} class="modal-input" id="modal-${i}"></input>
                ${buttonHtml}
            </td>
        </tr>`;
        i++;
    }
    return html;
}

/**
 * Generate a modal object for a pdf / cdf
 * distribution function. Output is all the
 * arguments in order as a numeric input
 * 
 * @param {function} func Function to generate template for
 * @return {Modal}        Generated modal
 */
function pdfCdfTemplate(func) {
    let args = getFunctionArguments(func);

    /* CDF function that utilizes integer values */
    let cdfDirHtml = '';
    let isNonLowHighCdf = false;
    if (func.name.endsWith('cdf') && !args.includes('low') && !args.includes('high')) {
        cdfDirHtml = `<tr>
            <td>Direction</td>
            <td style="padding-left: 6px">
                <button onclick="require('./src/state.js').modal.changeButton(1)" id="modal-btn-dist-1" class="modal-img-btn multi-active">
                    P(≤ x)
                </button>
                <button onclick="require('./src/state.js').modal.changeButton(2)" id="modal-btn-dist-2" class="modal-img-btn">
                    P(< x)
                </button>
                <button onclick="require('./src/state.js').modal.changeButton(3)" id="modal-btn-dist-3" class="modal-img-btn">
                    P(≥ x)
                </button>
                <button onclick="require('./src/state.js').modal.changeButton(4)" id="modal-btn-dist-4" class="modal-img-btn">
                    P(> x)
                </button>
            </td>
        </tr>`;
        isNonLowHighCdf = true;
    }

    let modal = new Modal(`
<div style="margin: 30px">
    <h2>${formatFunctionName(func.name)}</h2>

    <div id="modal-dist-page-1" style="display: block">
        <table width="100%">
            ${generateInputs(args)}
            ${cdfDirHtml}
        </table>
    </div>
    <div id="modal-dist-page-2" style="display: none"></div>

    <br>
    <button class="modal-btn" id="cancel"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>

    <button class="modal-btn" id="submit" disabled
            onclick="require('./src/state.js').modal.addTextAndClose()">
        Calculate</button>

    <button class="modal-btn" id="toggle-graph" style="float: right" disabled
            onclick="require('./src/state.js').modal.toggleGraph()">
        Toggle Graph</button>
    <br>
</div>
`, [-1, 'auto']);

    modal.createText = new Function('createText', `
    let data = [];
    for (let i = 0; i < ${args.length}; i++)
        data.push(document.getElementById('modal-' + i).value);

    let beginning = '';

    ${isNonLowHighCdf ?
        `    
    let dirButton = 1;
    for (let i = 1; i < 5; i++) {
        if (document.getElementById('modal-btn-dist-' + i).classList.contains('multi-active')) {
            dirButton = i;
            break;
        }
    }
    
    let xIndex = ${args.indexOf('x')};
    if (dirButton === 2)
        data[xIndex] = data[xIndex] + ' - 1';
    else if (dirButton === 3) {
        data[xIndex] = data[xIndex] + ' - 1';
        beginning = '(1 - ';
    }
    else if (dirButton === 4)
        beginning = '(1 - ';`: ''
    }

    return beginning + '${func.name}(' + data.join(', ') + ')' + (beginning ? ')' : '');
    `);

    modal.func = func;
    modal.createGraph = function() {
        try {
            const state = require('../../state.js');
            const maxStartEnd = 10000;
            const graphDivisons = 1000;
            const arbitraryEnd = 10;

            /* Setup for graph sizes */
            const width = 500;
            const height = 80;

            /* This is an array of all the data in the modal's input */
            let data2 = [];
            for (let i = 0; i < args.length; i++)
                data2.push(+document.getElementById('modal-' + i).value);

            let data = [];  // Coordinates for line
            let shade = []; // Coordinates for shading

            /* Generate the function bounds and type
            *
            * We're making the following assumptions:
            * - any cdf function has same name, but cdf replaced with pdf
            *      ie normalpdf -> normalcdf, tpdf -> tcdf
            * - Function name ends with cdf or pdf */
            const funcBaseName = state.modal.func.name.substring(0, state.modal.func.name.length - 3);
            const isCDF = state.modal.func.name.endsWith('cdf');
            const func = require('calc-func').stat.dist[funcBaseName + 'pdf'];

            /* Get the index in the data2 array that should be replaced with the x
            * value when plotting each point. */
            let xIndex = args.indexOf('x') >= 0 ? args.indexOf('x') : args.indexOf('high');
            let orgX = data2[xIndex];

            /* CDF functions with 2 parameters for x1, x2 only need
            * one x value, since we're using pdf and not cdf */
            let low;
            if (args.includes('low')) {
                low = data2[args.indexOf('low')];    
                data2.splice(args.indexOf('low'), 1);
                xIndex -= 1;
            }

            /* Test inputs for any errors (RangeErrors, ie prob > 1) */
            let orgError;
            try { func(...data2); }
            catch(e) { orgError = e; } 

            const isSymmetric = symmetricalFunctions.includes(funcBaseName);
            const isDiscrete = discreteFunctions.includes(funcBaseName);

            /* Generate the end value, which is inputted x value (or high)
             * Use trials for binomial */
            let end = data2[xIndex];
            if (funcBaseName === 'binomial')
                end = data2[args.indexOf('trials')];

            /* If a low input exists, set start to that, otherwise: 
            * Symmetrical starts -end, end, others 0 to end */
            let start = 0;
            if (low !== null && low !== undefined && !isSymmetric) start = low;
            else if (isSymmetric)
                start = -end;

            /* Swap start and end if they're in the wrong direction */
            if (end < start) [start, end] = [end, start];

            /* Limit end and start so infinite values don't overextend the graph */
            if (end > maxStartEnd) end = maxStartEnd;
            else if (end < -maxStartEnd) end = -maxStartEnd;
            if (start < -maxStartEnd) start = -maxStartEnd;
            else if (start > maxStartEnd) start = maxStartEnd;

            /* Start and end are both 0, so extend by arbitrary number */
            if (start === 0 && end === 0) {
                start = isSymmetric ? -arbitraryEnd : 0;
                end = arbitraryEnd;
            }

            /* Compute low and high for shading */
            let shadeStart, shadeEnd;
            if (isCDF) {
                if (low !== null && low !== undefined) {
                    shadeStart = low;
                    shadeEnd = data2[xIndex];
                } else {
                    /* Determine direction of shade */
                    let dirButton = 1;
                    for (let i = 1; i < 5; i++) {
                        if (document.getElementById('modal-btn-dist-' + i).classList.contains('multi-active')) {
                            dirButton = i;
                            break;
                        }
                    }
                    switch (dirButton) {
                        case 1: // <=
                            shadeStart = start;
                            shadeEnd = data2[xIndex];
                            break;
                        case 2: // <
                            shadeStart = start;
                            shadeEnd = data2[xIndex] - 1;
                            break;
                        case 3: // >=
                            shadeStart = data2[xIndex];
                            shadeEnd = end;
                            break;
                        case 4: // >
                            shadeStart = data2[xIndex] + 1;
                            shadeEnd = end;
                            break;
                    }
                }
            }

            /* Discrete distributions get an integer inc, others non-integer */
            let inc = Math.abs((end - start) / graphDivisons);
            if (inc === 0) inc = 0.01;
            if (isDiscrete) inc = Math.ceil(inc);

            for (let i = start; i <= end; i += inc) {
                data2[xIndex] = i;
                let y;

                /* Some functions are undefined at certain values,
                * this try catch block should take care of it */
                try { 
                    y = func(...data2); 
                    assert(Number.isFinite(y));
                }
                catch (e) { continue; }

                /* Discrete distributions: make it flat across non-integers,
                * like a floor function by copying previous data point to 
                * current x-value */
                if (isDiscrete && data.length > 0)
                    data.push({ x: i, y: data[data.length - 1].y });
                data.push({ x: i, y: y });

                /* Add shade data */
                if (isCDF && i >= shadeStart && i <= shadeEnd) {
                    if (isDiscrete && data.length > 1)
                        shade.push({ x: i, y: data[data.length - 2].y });
                    shade.push({ x: i, y: y });
                }
            };

            /* Close off shaded polygon */
            if (isCDF && shade.length > 0) {
                shade.push({ x : shade[shade.length - 1].x, y: 0 });
                shade.push({ x : shade[0].x, y: 0 });
            }

            /* Verify data is all nice */
            for (let point of data) {
                if (!Number.isFinite(point.x) || !Number.isFinite(point.y))
                    throw new RangeError('Function could not be evaluated properly at (' 
                        + point.x + ', ' + point.y + ')');
            }
            if (data.length === 0)
                throw new Error('Function did not yield any valid points, check that all input parameters are valid'
                    + (orgError ? `<br><b>${orgError.name}</b> ${orgError.message}` : ''));

            /* Begin the graph */
            let x = d3.scaleLinear().rangeRound([0, width]);
            x.domain([start, end]).nice;

            let maxY = d3.max(data, function (i) { return i.y; });  // Max y
            let y = d3.scaleLinear()
                .domain([0, maxY])
                .range([height, 0]);

            /* Create graph svg */
            let svg = d3.select('#modal-dist-page-2')
                .append('svg')
                .attr('id', 'modal-dist-graph')
                .attr('width', width)
                .attr('height', height)
                .append('g')

            /* X-axis */
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x));

            /* Graph line */
            let line = d3.line()
                .x(function (i) { return x(i.x); })
                .y(function (i) { return y(i.y); });
            svg.append('path')
                .datum(data)
                .attr('class', 'graph-line')
                .attr('d', line);

            /* Shade graph */
            if (isCDF) {
                svg.append('path')
                    .datum(shade)
                    .attr('class', 'shaded-graph')
                    .attr('d', line);
            } else {
                data2[xIndex] = orgX;
                svg.append('path')
                    .datum([{ x : orgX, y : 0 }, { x : orgX, y : func(...data2) }])
                    .attr('class', 'graph-line')
                    .attr('d', line);
            }
        } catch (e) {
            /* An error has occured when graphing - output the error
             * to the graph display */
            document.getElementById('modal-dist-page-2').innerHTML = 
                `<span class="error-msg"><b>${e.name}</b> ${e.message}</span>`;
        }
    }

    modal.toggleGraph = function() {
        document.getElementById('modal-dist-page-2').innerHTML = '';
        require('../../state.js').modal.createGraph();

        document.getElementById('modal-dist-page-1').style.display = 
            document.getElementById('modal-dist-page-1').style.display === 'block' ? 'none' : 'block';
        document.getElementById('modal-dist-page-2').style.display =
            document.getElementById('modal-dist-page-2').style.display === 'block' ? 'none' : 'block';
            
    }

    modal.updateState = new Function('createText', `
    let allTrue = true;
    for (let i = 0; i < ${args.length}; i++) {
        if (!document.getElementById('modal-' + i).value) {
            allTrue = false; 
            break;
        }
    }
    if (allTrue) {
        document.getElementById('submit').disabled = false;
        document.getElementById('toggle-graph').disabled = false;
    }
    else {
        document.getElementById('submit').disabled = true;
        document.getElementById('toggle-graph').disabled = true;
    }
    `);

    modal.changeButton = function (id) {
        for (let i = 1; i < 5; i++)
            document.getElementById('modal-btn-dist-' + i).classList.remove('multi-active');
        document.getElementById('modal-btn-dist-' + id).classList.add('multi-active');
    }
    
    return modal;
}


/**
 * Generate a modal object for an inverse
 * distribution function. Output is all the
 * arguments in order as a numeric input
 *
 * @param {function} func Function to generate template for
 * @return {Modal}        Generated modal
 */
function invTemplate(func) {
    let args = getFunctionArguments(func);

    let modal = new Modal(`
<div style="margin: 30px">
    <h2>${formatFunctionName(func.name)}</h2>
    <table width="100%">
        ${generateInputs(args)}

        <tr>
            <td>Direction</td>
            <td style="padding-left: 6px">
                <button onclick="require('./src/state.js').modal.changeButton(1)" id="modal-btn-dist-1" class="modal-img-btn multi-active">
                    <img src="./public/img/stat/cdf-below.png">
                </button>
                <button onclick="require('./src/state.js').modal.changeButton(2)" id="modal-btn-dist-2" class="modal-img-btn">
                    <img src="./public/img/stat/cdf-above.png">
                </button>
                ${symmetricalFunctions.includes(func.name.substring(3).toLowerCase()) ? `
                <button onclick="require('./src/state.js').modal.changeButton(3)" id="modal-btn-dist-3" class="modal-img-btn">
                    <img src="./public/img/stat/cdf-between.png">
                </button>
                <button onclick="require('./src/state.js').modal.changeButton(4)" id="modal-btn-dist-4" class="modal-img-btn">
                    <img src="./public/img/stat/cdf-outside.png">
                </button>`: ''
                }
            </td>
        </tr>
    </table>

    <br>
    <button class="modal-btn" id="cancel"
            onclick="require('./src/state.js').modal.close()">
        Cancel</button>

    <button class="modal-btn" id="submit" disabled
            onclick="require('./src/state.js').modal.addTextAndClose()">
        Calculate</button>
    <br>
</div>
`, [-1, 'auto']);

    modal.createText = new Function('createText', `
    let data = [];
    for (let i = 0; i < ${args.length}; i++)
        data.push(document.getElementById('modal-' + i).value);

    let dirButton = 1;
    for (let i = 1; i < 5; i++) {
        if (document.getElementById('modal-btn-dist-' + i).classList.contains('multi-active')) {
            dirButton = i;
            break;
        }
    }
    
    let xIndex = ${args.indexOf('area')};
    switch(dirButton) {
        case 2:
            data[xIndex] = 1 - data[xIndex];
            break;
        case 3:
            data[xIndex] = data[xIndex] / 2 + 0.5;
            break;
        case 4:
            data[xIndex] = -data[xIndex] / 2 + 0.5;
            break;
    }

    return '${func.name}(' + data.join(', ') + ')';`);

    modal.func = func;

    modal.updateState = new Function('createText', `
    let allTrue = true;
    for (let i = 0; i < ${args.length}; i++) {
        if (!document.getElementById('modal-' + i).value) {
            allTrue = false; 
            break;
        } 
    }
    if (allTrue) document.getElementById('submit').disabled = false;
    else document.getElementById('submit').disabled = true;`);

    modal.changeButton = function (id) {
        for (let i = 1; i < args.length; i++)
            document.getElementById('modal-btn-dist-' + i).classList.remove('multi-active');
        document.getElementById('modal-btn-dist-' + id).classList.add('multi-active');
    }

    return modal;
}

module.exports = {
    pdfCdfTemplate: pdfCdfTemplate,
    invTemplate: invTemplate
};