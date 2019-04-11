/* Test calculus functions */

/* global describe context it:true */
'use strict';

const calculus = require('../../packages/calc-func').calculus;
const expect = require('chai').expect;

describe('derivative()', function () {
    context('No arguments supplied', function () {
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
});
