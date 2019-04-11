/* Test calculus functions */

/* global describe context it:true */
'use strict';

const calculus = require('../../packages/calc-func').calculus;
const expect = require('chai').expect;

describe('derivative()', function () {
    context('Derivative with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.derivative()).to.throw();
        });
    });
    context('Derivative of x^5 + 2x', function () {
        it('Should return 5x^4 + 2', function () {
            expect(calculus.derivative('x^5 + 2x').toString()).to.equal('5 * x ^ 4 + 2');
        });
    });
    context('Derivative of x^5 + 2x at x = 3', function () {
        it('Should return 407', function () {
            expect(calculus.derivative('x^5 + 2x', 'x', 3).toString()).to.equal('407');
        });
    });
    context('Derivative of x^5 + 2y with respect to y', function () {
        it('Should return 2', function () {
            expect(calculus.derivative('x^5 + 2y', 'y').toString()).to.equal('2');
        });
    });
    context('Second derivative of x^2', function () {
        it('Should return 2', function () {
            expect(calculus.derivative('x^2', 'x', null, 2).toString()).to.equal('2');
        });
    });
    context('Second derivative of x^2 at x = 3', function () {
        it('Should return 2', function () {
            expect(calculus.derivative('x^2', 'x', 3, 2).toString()).to.equal('2');
        });
    });
    context('Multi-variable derivative of x * y (respect to x) with only 1 value given', function () {
        it('Should throw an error', function () {
            expect(() => calculus.derivative('x * y', 'x', 3)).to.throw();
        });
    });
    context('Multi-variable derivative of x * y (respect to x) with x = 2 and y = 3', function () {
        it('Should return 3', function () {
            expect(calculus.derivative('x * y', 'x', { x : 2, y : 3 }).toString()).to.equal('3');
        });
    });
    context('Derivative with implict multiplication of variables with respect to x at x = 2 and y= 3', function () {
        it('Should return 3', function () {
            expect(calculus.derivative('xy', 'x', { x: 2, y: 3 }).toString()).to.equal('3');
        });
    });
    context('Derivative that has no symbolic form (x!)', function () {
        it('Should throw an error', function () {
            expect(() => calculus.derivative('x!')).to.throws();
        });
    });
    context('Derivative that has no symbolic form (normalcdf)', function () {
        it('Should throw an error', function () {
            expect(() => calculus.derivative('normalcdf(0, x, 1, -1)')).to.throws();
        });
    });
    context('Definite derivative that has no symbolic form (normalpdf) at x = 1', function () {
        it('Should return a value around -0.2498001805406602', function () {
            expect(+calculus.derivative('normalpdf(x,0,1)', 'x', 1)).closeTo(-0.2498001805406602, 0.001);
        });
    });
});

describe('gradient()', function () {
    context('Gradient with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.gradient()).to.throw();
        });
    });
    context('Gradient of x * y', function () {
        it('Should return [y, x, 0]', function () {
            expect(calculus.gradient('x * y').toString()).to.equal('y,x,0');
        });
    });
});

describe('limit()', function () {
    context('Limit with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.limit()).to.throw();
        });
    });
    context('Limit of x^2 as x -> 3', function () {
        it('Should return around 9', function () {
            expect(+calculus.limit('x^2', 3).toString()).closeTo(9, 0.001);
        });
    });
    context('Limit of 1/x as x -> 0-', function () {
        it('Should return around a large negative number (< -1e10)', function () {
            expect(+calculus.limit('1/x', 0, 'left').toString()).at.most(-1e10);
        });
    });
    context('Limit of 1/x as x -> 0+', function () {
        it('Should return around a large number (> 1e10)', function () {
            expect(+calculus.limit('1/x', 0, 'right').toString()).at.least(1e10);
        });
    });
    context('Limit of 1/x as x -> 0', function () {
        it('Should throw an Error', function () {
            expect(() => calculus.limit('1/x', 0)).to.throw();
        });
    });
    context('Limit of sin(x)/x as x -> 0', function () {
        it('Should be approximately 1', function () {
            expect(+calculus.limit('sin(x) / x', 0).toString()).closeTo(1, 0.001);
        });
    });
    context('Limit with invalid direction', function () {
        it('Should throw an error', function () {
            expect(() => calculus.limit('x', 0, 'test')).to.throw();
        });
    });
    context('Limit with expression not in x', function () {
        it('Should throw an error', function () {
            expect(() => calculus.limit('y', 0)).to.throw();
        });
    });
});