/* Calculus functions */

'use strict';

const math = require('mathjs');
const integrate = require('integrate-adaptive-simpson');
const Algebrite = require('algebrite');
const numbers = require('numbers');
const mnr = require('modified-newton-raphson');
const state = require('../../../../src/state.js');

const INTEGRAL_ERROR = 1e-8;
const DERIVATIVE_H = 1e-15;
const SMALL_NUMBER = math.bignumber('1e-15');

const compileFuncFromString = func => {
    let temp = math.parse(func).compile();
    return (x, variable) => {
        let scope = {};
        if (typeof variable === 'string')
            scope[variable] = x;
        else if (variable === undefined) scope['x'] = x;
        else scope = variable;

        return math.number(temp.eval(scope));
    };
};

/* Let renderer load first */
const renderer = require('../../../../renderer.js');
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

    if (!expression)
        throw new Error('Expression needs to be given');
    
    let ctx = {};
    /* Quick way to check if point is an object. If it
     * is set the context to point directly */
    if (point !== null && point !== undefined) {
        if (point[variable] !== undefined) ctx = point;
        else ctx[variable] = point;
    }

    let start = new Date();
    for (let i = 0; i < level; i++) {
        if (new Date() - start > state.maxFuncRunTime) {
            renderer.addData(`<span class="error-msg"><b>Error: </b>Function timed out, only could compute ${i} th derivative</span>`, true);
            break;
        }
        try {
            expression = derivativeSymbolic(expression, variable);
        } catch(e) {
            /* Expression should be a string since no derivative
             * was evaluated yet, so break the loop */
            break;
        }
    }

    if (typeof expression === 'string') {
        if (level === 1 && Object.keys(ctx).length > 0) {
            /* Function can be approximated by a limit */
            let initialX = math.number(ctx[variable]);

            ctx[variable] = initialX - DERIVATIVE_H;
            let f1 = math.number(math.eval(expression.toString(), ctx));
            ctx[variable] = initialX + DERIVATIVE_H;
            let f2 = math.number(math.eval(expression.toString(), ctx));

            return (f2 - f1) / (2 * DERIVATIVE_H);
        }
        throw new Error('Function ' + expression + '  is not supported by derivative, or a wrong number of arguments is passed');
    }
    if (point === null || point === undefined) return expression;

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
    if (!expression)
        throw new Error('Function must be supplied');
    if (!['left', 'middle', 'right'].includes(dir))
        throw new Error('Dir must be \'left\', \'middle\' or \'right\'');

    try { 
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
 * Calculate a definite or indefinite integral
 * @param {string} func     Function expression
 * @param {number} start    Low bound (Optional)
 * @param {number} end      High bound (Required if start is defined) 
 * @param {string} variable Variable to integrate with respect to
 */
function integral(func, start, end, variable='x') {
    /* @help Compute either a definite or indefinite integral */
    if (start && !end)
        throw new Error('End value must be defined');

    /* Definite integral */
    if (start && end) {
        start = math.number(start);
        end = math.number(end);
        func = compileFuncFromString(func, variable);
        
        return integrate(func, start, end, INTEGRAL_ERROR);
    }

    /* Indefinite integral */
    return Algebrite.integral(Algebrite.eval(func)).toString(); 
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

function funcCrossProduct(v1, v2) {
    // https://mathjs.org/docs/datatypes/matrices.html
    // subset
    
}

function curl(g, F) {
    /* Gradient(g) x F */
}

/**
 * Estimate root using newton-Raphson method
 * @param {string} func     Expression
 * @param {number} guess    Initial guess
 * @param {string} variable Variable of func
 */
function newtonRaphson(func, guess, variable='x') {
    /* @help Estimate a root using the newton-raphson method */
    func = compileFuncFromString(func, variable);
    return mnr(func, math.number(guess));
}

/**
 * Compute a riemann sum of a function
 * @param {string} expression  Expr to eval
 * @param {number} start       Start value
 * @param {number} end         End value
 * @param {number} divisions   Number of subdivisions
 * @param {string} corner      Corner to subdivide
 */
function Riemann(expression, start, end, divisions, corner='left') {
    /* @help Compute riemann sum of func of x, corner can be 'left', 'right' or 'middle' */
    const samplers = {
        left: undefined, // Default is left
        right: (a, b) => b,
        middle: (a, b) => (a + b) / 2
    };

    let func = compileFuncFromString(expression);
    return numbers.calculus.Riemann(func, start, end, divisions, samplers[corner]);
}

// largrange error bound
// min/max of function (override with array)
// curl and divergence
// runge kutta
// eulers method
// runge kutta

module.exports = {
    derivative: derivative,
    gradient: gradient,
    limit: limit,
    taylorSeries: taylorSeries,
    summation: summation,
    integral: integral,
    newtonRaphson: newtonRaphson,
    Riemann: Riemann
};
