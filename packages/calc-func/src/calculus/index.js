/* Calculus functions */

'use strict';

const math = require('mathjs');
const integrate = require('integrate-adaptive-simpson');
const nerdamer = require('nerdamer');
const Algebrite = require('algebrite');
const numbers = require('numbers');
const mnr = require('modified-newton-raphson');
const state = require('../../../../src/state.js');

const INTEGRAL_ERROR = 1e-8;
const DERIVATIVE_H = 1e-15;
const SMALL_NUMBER = math.bignumber('1e-15');
const OPTIMIZATION_INTERMEDIATE_RATIO = 0.3819660112501051517954;

const compileFuncFromString = (func, variable) => {
    let temp = math.parse(func).compile();
    return x => {
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
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');
    
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
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');
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
    if (start !== undefined && (end === undefined || end === null))
        throw new Error('End value must be defined');
    if (!func || typeof func !== 'string')
        throw new Error('Function must be supplied as a string');

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
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');

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
 * @param {string} variable   Variable to increment
 */
function summation(expression, start, end, inc=1, variable='x') {
    /* @help Sum a series from start to end with increment */
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');

    let sum = math.bignumber(0);
    let startTime = new Date();

    start = math.number(start);
    end = math.number(end);
    inc = math.number(inc);

    if (inc === 0) throw new Error('Increment cannot be zero');
    if ((inc > 0 && end < start) ||
        (inc < 0 && end > start)) throw new Error('Sum does not converge');
    if (end < start && inc < 0) {
        let temp = end;
        end = start;
        start = temp;
        inc = Math.abs(inc);
    }

    for (let i = start; i <= end; i += inc) {
        if (new Date() - startTime > state.maxFuncRunTime) {
            renderer.addData(`<span class="error-msg"><b>Error: </b>Function timed out, only could compute up to x = ${i}</span>`, true);
            break;
        }
        let args = {};
        args[variable] = i;
        sum = sum.add(math.bignumber(math.eval(expression, args)));
    }
    return sum;
}

/**
 * Product a series
 * @param {string} expression Expression, ie 'x^2'
 * @param {number} start      Start value
 * @param {number} end        End value
 * @param {number} inc        Increment value
 * @param {string} variable   Variable to increment
 */
function seriesProduct(expression, start, end, inc = 1, variable = 'x') {
    /* @help product a series from start to end with increment */
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');

    let prod = math.bignumber(1);
    let startTime = new Date();

    start = math.number(start);
    end = math.number(end);
    inc = math.number(inc)

    if ((inc > 0 && end < start) ||
        (inc < 0 && end > start)) throw new Error('Product does not converge');
    if (end < start && inc < 0) {
        let temp = end;
        end = start;
        start = temp;
        inc = Math.abs(inc);
    }

    for (let i = start; i <= end; i += inc) {
        if (new Date() - startTime > state.maxFuncRunTime) {
            renderer.addData(`<span class="error-msg"><b>Error: </b>Function timed out, only could compute up to x = ${i}</span>`, true);
            break;
        }
        let args = {};
        args[variable] = i;
        prod = prod.mul(math.bignumber(math.eval(expression, args)));
    }
    return prod;
}

/**
 * Helper for cross product
 * @param {array} v1 Vector 1
 * @param {array} v2 vector 2
 */
function funcCrossProduct(v1, v2) {
    if (v1.length !== v2.length)
        throw new Error('Both vectors must be of the same length');
    if (![2,3].includes(v1.length) || ![2,3].includes(v2.length))
        throw new Error('Only 2D and 3D vector fields are supported');
    
    if (v1.length === 2) 
        return Algebrite.simplify(`${v1[0]} * ${v2[1]} - ${v1[1]} * ${v2[0]}`);

    return [
        Algebrite.simplify(`${v1[1]} * ${v2[2]} - ${v1[2]} * ${v2[1]}`),
        Algebrite.simplify(`${v2[0]} * ${v1[2]} - ${v1[0]} * ${v2[2]}`),
        Algebrite.simplify(`${v1[0]} * ${v2[1]} - ${v1[1]} * ${v2[2]}`)];
}

/**
 * Compute curl of vector field
 * @param {array} F Vector field
 * @param {array} point Point to eval at
 * @param {array} variables Variables
 */
function curl(F, point=null, variables=['x', 'y', 'z']) {
    /* @help Compute curl of vector field F, optionally at a point */
    if (!Array.isArray(F))
        F = F.toArray().map(x => x.toString());
    if (point !== null && !Array.isArray(point))
        point = point.toArray().map(x => x.toString());

    if (point !== null && point.length !== F.length)
        throw new Error('Point must be same length as vector field');

    let gr = [];
    for (let i = 0; i < F.length; i++)
        gr.push(derivative(F[i], variables[i]).toString());

    let result = funcCrossProduct(gr, F);
    if (point === null) return result;

    let scope = {};
    for (let i = 0; i < point.length; i++)
        scope[variables[i]] = math.number(point[i]);

    if (Array.isArray(result))
        return result.map(x => math.eval(x.toString(), scope));
    return math.eval(result.toString(), scope);
}

/**
 * Compute div of vector field
 * @param {array} F Vector field
 * @param {array} point Point to eval at
 * @param {array} variables Variables
 */
function div(F, point = null, variables = ['x', 'y', 'z']) {
    /* @help Compute divergence of vector field F, optionally at a point */
    if (!Array.isArray(F))
        F = F.toArray().map(x => x.toString());
    if (point !== null && !Array.isArray(point))
        point = point.toArray().map(x => x.toString());

    if (point !== null && point.length !== F.length)
        throw new Error('Point must be same length as vector field');

    let gr = [];
    for (let i = 0; i < F.length; i++)
        gr.push(derivative(F[i], variables[i]).toString());

    let stringToEval = gr.map((x, i) => `${x} * ${F[i]}`).join('+');
    let result = Algebrite.simplify(stringToEval);
    if (point === null) return result;

    let scope = {};
    for (let i = 0; i < point.length; i++)
        scope[variables[i]] = math.number(point[i]);
    return math.eval(result.toString(), scope);
}

/**
 * Estimate root using newton-Raphson method
 * @param {string} func     Expression
 * @param {number} guess    Initial guess
 * @param {string} variable Variable of func
 */
function newtonRaphson(func, guess, variable='x') {
    /* @help Estimate a root using the newton-raphson method */
    if (!func || typeof func !== 'string')
        throw new Error('Function must be supplied as a string');

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

/**
 * Minimize a 1D unimodal function on an interval
 * @param {string} expression Func to minimize
 * @param {number} start      Start x
 * @param {number} end        Start y
 * @param {string} variable   Variable of the function
 * @param {number} maxError   Max error allowed
 */
function fmin(expression, start, end, variable='x', maxError=0.0001) {
    /* @help Get x value where a 1D unimodal function has a min on an interval */
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');

    const f = compileFuncFromString(expression, variable);
    start = math.number(start);
    end = math.number(end);
    maxError = math.number(maxError);

    if (maxError <= 0)
        throw new Error('maxError must be a number greater than 0');
    if (end <= start)
        throw new Error('End bound needs to be greater than start');

    return optimizerHelper(f, start, end, maxError, true);
}

/**
 * Maximize a 1D unimodal function on an interval
 * @param {string} expression Func to maximize
 * @param {number} start      Start x
 * @param {number} end        Start y
 * @param {string} variable   Variable of the function
 * @param {number} maxError   Max error allowed
 */
function fmax(expression, start, end, variable = 'x', maxError = 0.0001) {
    /* @help Get x value where a 1D unimodal function has a max on an interval */
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');

    const f = compileFuncFromString(expression, variable);
    start = math.number(start);
    end = math.number(end);
    maxError = math.number(maxError);

    if (maxError <= 0)
        throw new Error('maxError must be a number greater than 0');
    if (end <= start)
        throw new Error('End bound needs to be greater than start');

    return optimizerHelper(f, start, end, maxError, false);
}

/**
 * Helper for fmin and fmax
 * @param {function} func Function
 * @param {number} start Start bound
 * @param {number} end End bound
 * @param {nunber} maxError Largest error
 * @param {number} min Minimize? (Or maximize)
 */
function optimizerHelper(func, start, end, maxError, min=true) {
    const size = end - start;
    if (size < maxError) return start;

    const a1 = size * OPTIMIZATION_INTERMEDIATE_RATIO + start;
    const b1 = end - size * OPTIMIZATION_INTERMEDIATE_RATIO;
    const f1 = func(a1);
    const f2 = func(b1);

    if (f1 === f2)
        return optimizerHelper(func, a1, b1, maxError, min);
    if (f1 > f2) {
        if (min) return optimizerHelper(func, a1, end, maxError, min);
        return optimizerHelper(func, start, b1, maxError, min);
    }
    else {
        if (min) return optimizerHelper(func, start, b1, maxError, min);
        return optimizerHelper(func, a1, end, maxError, min);
    }
} 

/**
 * Calculate the lagrange error bound
 * @param {string} func Function
 * @param {number} x x to eval at
 * @param {number} center Center of expansion
 * @param {number} degree Degree of polyonimal
 * @param {number} guess Guess between x and center
 */
function lagrangeErrorBound(func, x, center, degree, guess) {
    /* @help Calculate a lagrange error bound of a function in x */
    if (!func || typeof func !== 'string')
        throw new Error('Function must be supplied as a string');

    const f = compileFuncFromString(func, 'x');
    x = math.number(x);
    center = math.number(center);
    degree = math.number(degree);
    guess = math.number(guess);

    /* Make sure x < center */
    if (x > center) [x, center] = [center, x];
    
    /* Make sure degree is an integer >= 0 */
    if (Math.floor(degree) !== degree || degree < 0)
        throw new Error('Degree must be a non-negative integer');
    
    /* Make sure guess is between x and center */
    if (guess < x || guess > center)
        throw new Error('Guess must be between x and center');
    
    const d = degree + 1;
    return Math.abs(f(guess) * (x - center) ** d / math.number(math.factorial(d)));
}

/**
 * Get partial fraction decomposition
 * @param {string} expression Expr to eval
 * @param {string} variable Variable of expr
 */
function partfrac(expression, variable='x') {
    /* @help Partial fraction decomposition of a number */
    if (!expression || typeof expression !== 'string')
        throw new Error('Function must be supplied as a string');

    return nerdamer.partfrac(expression, variable).toString();
}

module.exports = {
    derivative: derivative,
    gradient: gradient,
    limit: limit,
    taylorSeries: taylorSeries,
    summation: summation,
    integral: integral,
    newtonRaphson: newtonRaphson,
    Riemann: Riemann,
    fmin: fmin,
    fmax: fmax,
    lagrangeErrorBound: lagrangeErrorBound,
    curl: curl,
    div: div,
    partfrac: partfrac,
    seriesProduct: seriesProduct
};
