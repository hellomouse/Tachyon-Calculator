/* Calculus functions */

'use strict';

const math = require('mathjs');
const state = require('../../../../src/state.js');

/* Let renderer load first */
let renderer;
setTimeout(() => {
    renderer = require('../../../../renderer.js');
});

const derivativeSymbolic = math.derivative;

/**
 * Compute a derivative
 * @param {string} expression Expression, ie 'x^2'
 * @param {string} variable   Variable to diff with respect to, ie 'x'
 * @param {*}      point      Point to evaluate at (null for indefinite derivative)
 * @param {number} level      Depth of the derivative (default: 1st)
 */
function derivative(expression, variable='x', point=null, level=1) {
    /* @help Compute the nth derivative, optionally at a point */
    let start = new Date();
    for (let i = 0; i < level; i++) {
        if (new Date() - start > state.maxFuncRunTime) {
            renderer.addData(`<span class="error-msg"><b>Error: </b>Function timed out, only could compute ${i} th derivative</span>`, true);
            break;
        }
        expression = derivativeSymbolic(expression, variable);
    }
    if (point === null || point === undefined) return expression;

    let ctx = {};
    /* Quick way to check if point is an object. If it
     * is set the context to point directly */
    if (typeof point === 'object') ctx = point;
    else ctx[variable] = point;
    
    /* Multivariable functions need an object as the context */
    try { return math.eval(expression.toString(), ctx); } 
    catch(e) {
        if (e.message.includes('Unexpected type of argument in function compile') ||
            e.message.includes('Undefined symbol'))
            throw new Error('Multivariable functions require an object for the point, ie { x : 1, y : 1 }');
        throw e;
    }
}

/**
 * Compute the gradient vector of an expression at an optional point
 * @param {string} expression Expression, ie 'x^2'
 * @param {*}      point      Point to evaluate at (null for indefinite derivative), an obj, ie { x : 1, y : 1 }
 * @param {array } variables  Variables to diff to, in order
 */
function gradient(expression, point=null, variables=['x','y','z']) {
    /* @help Compute the gradient vector, optionally at a point */
    let gradient = [];
    for (let v of variables)
        gradient.push(derivative(expression, v, point));
    return gradient;
}

/**
 * Compute limit of a function
 * @param {string} expression Expression, ie 'x^2'
 * @param {number} point      X value to evaluate
 * @param {string} dir        Direction: 'left', 'middle' or 'right' 
 */
function limit(expression, point, dir='middle') {
    /* @help Approximate the limit at a point, dir can be 'left', 'middle' or 'right' */
    try { 
        const SMALL_NUMBER = math.bignumber('1e-15');
        point = math.bignumber(point);

        if (dir === 'middle' || dir === 'mid') {
            let s1 = math.eval(expression.toString(), { x: point.sub(SMALL_NUMBER) });
            let s2 = math.eval(expression.toString(), { x: point.add(SMALL_NUMBER) });

            if (math.abs(s1.sub(s2)).greaterThan(math.EPSILON))
                throw new Error(`Limit does not converge from both sides: x<sup>-</sup> = ${s1.toExponential()} while x<sup>+</sup> = ${s2.toExponential()}`);

            return math.eval(`(${s1} + ${s2}) / 2`); 
        }
        let displacement = dir === 'left' ? -SMALL_NUMBER : SMALL_NUMBER;
        return math.eval(expression.toString(), { x : point.add(displacement) });
    }
    catch (e) {
        if (e.message.includes('Unexpected type of argument in function compile') ||
            e.message.includes('Undefined symbol'))
            throw new Error('Function must be in terms of the variable x');
        throw e;
    }
}

/**
 * Generate a taylor series expansion
 * @param {string} expression Expression, ie 'x^2'
 * @param {number} center     Center of the expansion
 * @param {number} terms      Number of terms in the series
 * @param {number} point      Point to evaluate at, set as null for the general series
 */
function taylorSeries(expression, center=0, terms=6, point=null) {
    /* @help Get a centered taylor series optionally evaluated at a point */
    let coeff = [];
    let start = new Date();

    center = math.number(center);
    terms = math.number(terms);

    for (let i = 0; i < terms; i++) {
        if (new Date() - start > state.maxFuncRunTime) {
            renderer.addData(`<span class="error-msg"><b>Error: </b>Function timed out, only could compute ${coeff.length} terms</span>`, true);
            break;
        }

        try { 
            coeff.push(math.number(math.eval(expression, { x : center })));
            expression = derivativeSymbolic(expression, 'x').toString();
        }
        catch (e) {
            if (e.message.includes('Unexpected type of argument in function compile') ||
                e.message.includes('Undefined symbol'))
                throw new Error('Function must be in terms of the variable x');
            throw e;
        }
    }

    if (point === undefined || point === null) {
        let output = '';
        let h = center !== 0 ? `(x - ${center})` : 'x';
        for (let i = 0; i < coeff.length; i++) {
            if (coeff[i] === 0) continue;

            /* Determine next non-zero coefficent */
            let nextCoeff = false;
            for (let j = i + 1; j < coeff.length; j++) {
                if (coeff[j] !== 0) {
                    nextCoeff = coeff[j];
                    break;
                }
            }

            output += `${math.abs(coeff[i]) !== 1 || i === 0 ? +coeff[i].toFixed(4) : coeff[i].toString().replace('1', '')}
                       ${i !== 0 ? `${h}<sup>${i !== 1 ? i : ''}</sup>${i > 1 ? ' / ' + i + '!' : ''}` : ''} 
                       ${nextCoeff && nextCoeff.toString().includes('-') ? '' : ' + '}`;
        }
        return output + ' ...';
    }

    /* Evaluate at the point */
    let h = point - center;
    let sum = 0;
    for (let i = 0; i < coeff.length; i++)
        sum += coeff[i] * Math.pow(h, i) / math.factorial(i);
    return sum;
}

/**
 * Sum a series
 * @param {string} expression Expression, ie 'x^2'
 * @param {number} start      Start value
 * @param {number} end        End value
 * @param {number} inc        Increment value
 */
function summation(expression, start, end, inc=1) {
    /* @help Sum a series from start to end with increment */
    let sum = math.bignumber(0);
    let startTime = new Date();

    start = math.number(start);
    end = math.number(end);
    inc = math.number(inc);

    for (let i = start; i <= end; i += inc) {
        if (new Date() - startTime > state.maxFuncRunTime) {
            renderer.addData(`<span class="error-msg"><b>Error: </b>Function timed out, only could compute up to x = ${i}</span>`, true);
            break;
        }
        sum = sum.add(math.bignumber(math.eval(expression, { x : i })));
    }
    return sum;
}


// integral sum alias
// indefinite integral
// line integral
// reieman sums
// largrange error bound
// min/max of function (override with array)

module.exports = {
    derivative: derivative,
    gradient: gradient,
    limit: limit,
    taylorSeries: taylorSeries,
    summation: summation
};
