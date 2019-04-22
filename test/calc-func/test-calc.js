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
    context('Derivative with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.derivative([1,2,3])).to.throw();
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
    context('Derivative with implict multiplication of variables (f = xy) with respect to x at x = 2 and y= 3', function () {
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
    context('Derivative of x * t (respect to x)', function () {
        it('Should return t', function () {
            expect(calculus.derivative('x * t', 'x').toString()).to.equal('t');
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
    context('Limit with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.limit([1, 2, 3])).to.throw();
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

describe('integral()', function () {
    context('Integral with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.integral()).to.throw();
        });
    });
    context('Integral with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.integral([1, 2, 3])).to.throw();
        });
    });
    context('Integral that is not solvable', function () {
        it('Should throw an error', function () {
            expect(() => calculus.integral('x!')).to.throw();
        });
    });
    context('Integral of x * e^(x^2)', function () {
        it('Should equal 1/2*exp(x^2)', function () {
            expect(calculus.integral('x*e^(x^2)')).to.equal('1/2*exp(x^2)');
        });
    });
    context('Integral with no end value', function () {
        it('Should throw an error', function () {
            expect(() => calculus.integral('x', 0)).to.throw();
        });
    });
    context('Integral over y of y^2', function () {
        it('Should equal 1/3*y^3', function () {
            expect(calculus.integral('y^2')).to.equal('1/3*y^3');
        });
    });
    context('Integral (definite) of x^2 from -1 to 1', function () {
        it('Should equal 0.6666666666666666', function () {
            expect(calculus.integral('x^2', -1, 1)).closeTo(0.6666666666666666, 0.001);
        });
    });
    context('Integral (definite) of y^2 from -1 to 1', function () {
        it('Should equal 0.6666666666666666', function () {
            expect(calculus.integral('y^2', -1, 1, 'y')).closeTo(0.6666666666666666, 0.001);
        });
    });
    context('Integral of 1/x from -1 to 1', function () {
        it('Should be undefined (NaN)', function () {
            expect(calculus.integral('1/x', -1, 1)).to.be.NaN;
        });
    });
    context('Integral of x * t', function () {
        it('Should equal 1/2*t*x^2', function () {
            expect(calculus.integral('x*t')).to.equal('1/2*t*x^2');
        });
    });
});

describe('taylorSeries()', function () {
    context('Taylor Series with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.taylorSeries()).to.throw();
        });
    });
    context('Taylor Series with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.taylorSeries([1, 2, 3])).to.throw();
        });
    });
    context('Taylor Seriesof e^x (center = 0) at x = 2 with 3 terms', function () {
        it('Should equal 5', function () {
            expect(calculus.taylorSeries('e^x', 0, 3, 2)).closeTo(5, 0.001);
        });
    });
});

describe('summation()', function () {
    context('Summation with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.summation()).to.throw();
        });
    });
    context('Summation with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.summation([1, 2, 3])).to.throw();
        });
    });
    context('Summation of integers 1 to 100', function () {
        it('Should equal 5050', function () {
            expect(+calculus.summation('x', 1, 100).toString()).to.equal(5050);
        });
    });
    context('Summation of integers 1 to 100 using y as variable', function () {
        it('Should equal 5050', function () {
            expect(+calculus.summation('y', 1, 100, 1, 'y').toString()).to.equal(5050);
        });
    });
    context('Summation of integers 1 to 100 with 2 as increment', function () {
        it('Should equal 2500', function () {
            expect(+calculus.summation('x', 1, 100, 2).toString()).to.equal(2500);
        });
    });
    context('Summation of integers 100 to 1 with -1 as increment', function () {
        it('Should equal 5050', function () {
            expect(+calculus.summation('x', 100, 1, -1).toString()).to.equal(5050);
        });
    });
    context('Summation with increment as 0', function () {
        it('Should throw an error', function () {
            expect(() => calculus.summation('x', 1, 100, 0)).to.throw();
        });
    });
    context('Summation with increment as 1 and start, end = 10, 1', function () {
        it('Should throw an error', function () {
            expect(() => calculus.summation('x', 10, 1, 1)).to.throw();
        });
    });
});

describe('seriesProduct()', function () {
    context('seriesProduct with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.seriesProduct()).to.throw();
        });
    });
    context('seriesProduct with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.seriesProduct([1, 2, 3])).to.throw();
        });
    });
    context('seriesProduct of integers 1 to 6', function () {
        it('Should equal 720', function () {
            expect(+calculus.seriesProduct('x', 1, 6).toString()).to.equal(720);
        });
    });
    context('seriesProduct of integers 1 to 6 using y as variable', function () {
        it('Should equal 720', function () {
            expect(+calculus.seriesProduct('y', 1, 6, 1, 'y').toString()).to.equal(720);
        });
    });
    context('seriesProduct of integers 1 to 6 with 2 as increment', function () {
        it('Should equal 15', function () {
            expect(+calculus.seriesProduct('x', 1, 6, 2).toString()).to.equal(15);
        });
    });
    context('seriesProduct of integers 6 to 1 with -1 as increment', function () {
        it('Should equal 720', function () {
            expect(+calculus.seriesProduct('x', 6, 1, -1).toString()).to.equal(720);
        });
    });
    context('seriesProduct with increment as 1 and start, end = 10, 1', function () {
        it('Should throw an error', function () {
            expect(() => calculus.seriesProduct('x', 10, 1, 1)).to.throw();
        });
    });
});

describe('newtonRaphson()', function () {
    context('Newton Raphson with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.newtonRaphson()).to.throw();
        });
    });
    context('Newton Raphson with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.newtonRaphson([1, 2, 3])).to.throw();
        });
    });
    context('Newton Raphson of x^2 - 2 guess x = 1', function () {
        it('Should return approximately sqrt(2)', function () {
            expect(+calculus.newtonRaphson('x^2 - 2', 1).toString()).closeTo(Math.sqrt(2), 0.01);
        });
    });
    context('Newton Raphson of y^2 - 2 guess y = 1', function () {
        it('Should return approximately sqrt(2)', function () {
            expect(+calculus.newtonRaphson('y^2 - 2', 1, 'y').toString()).closeTo(Math.sqrt(2), 0.01);
        });
    });
    context('Newton Raphson with unsolvable equation x^2 + 1 = 0', function () {
        it('Should not error', function () {
            expect(() => calculus.newtonRaphson('x^2 + 1', 1)).to.not.throw(); 
        });
    });
});

describe('Riemann()', function () {
    context('Riemann with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.Riemann()).to.throw();
        });
    });
    context('Riemann with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.Riemann([1, 2, 3])).to.throw();
        });
    });
});

describe('fmin()', function () {
    context('fmin with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmin()).to.throw();
        });
    });
    context('fmin with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmin([1, 2, 3])).to.throw();
        });
    });
    context('fmin of parabola x^2 + 5x with search -5 to 0', function () {
        it('Should return approximately -2.5', function () {
            expect(+calculus.fmin('x^2+5x', -5, 0).toString()).closeTo(-2.5, 0.01);
        });
    });
    context('fmin of line x with search -5 to 0', function () {
        it('Should return approximately -5', function () {
            expect(+calculus.fmin('x', -5, 0).toString()).closeTo(-5, 0.01);
        });
    });
    context('fmin of x! from 1 to 5', function () {
        it('Should return approximately 1', function () {
            expect(+calculus.fmin('x!', 1, 5).toString()).closeTo(1, 0.01);
        });
    });
    context('fmin of y! from 1 to 5', function () {
        it('Should return approximately 1', function () {
            expect(+calculus.fmin('y!', 1, 5, 'y').toString()).closeTo(1, 0.01);
        });
    });
    context('fmin with low > high', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmin('x', -5, -10)).to.throw();
        });
    });
    context('fmin with non-valid variable (func = x but var = y) from 1 to 2', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmin('x', 1, 2, 'y')).to.throw();
        });
    });
    context('fmin with maxError = 0', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmin('x', 1, 2, 'x', 0)).to.throw();
        });
    });
    context('fmin with maxError = -1', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmin('x', 1, 2, 'x', -1)).to.throw();
        });
    });
});

describe('fmax()', function () {
    context('fmax with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmax()).to.throw();
        });
    });
    context('fmax with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmax([1, 2, 3])).to.throw();
        });
    });
    context('fmax of parabola -x^2 - 5x with search -5 to 0', function () {
        it('Should return approximately -2.5', function () {
            expect(+calculus.fmax('-x^2-5x', -5, 0).toString()).closeTo(-2.5, 0.01);
        });
    });
    context('fmax of line -x with search -5 to 0', function () {
        it('Should return approximately -5', function () {
            expect(+calculus.fmax('-x', -5, 0).toString()).closeTo(-5, 0.01);
        });
    });
    context('fmax of x! from 1 to 5', function () {
        it('Should return approximately 5', function () {
            expect(+calculus.fmax('x!', 1, 5).toString()).closeTo(5, 0.01);
        });
    });
    context('fmax of y! from 1 to 5', function () {
        it('Should return approximately 5', function () {
            expect(+calculus.fmax('y!', 1, 5, 'y').toString()).closeTo(5, 0.01);
        });
    });
    context('fmax with low > high', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmax('x', -5, -10)).to.throw();
        });
    });
    context('fmax with non-valid variable (func = x but var = y) from 1 to 2', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmax('x', 1, 2, 'y')).to.throw();
        });
    });
    context('fmax with maxError = 0', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmax('x', 1, 2, 'x', 0)).to.throw();
        });
    });
    context('fmax with maxError = -1', function () {
        it('Should throw an error', function () {
            expect(() => calculus.fmax('x', 1, 2, 'x', -1)).to.throw();
        });
    });
});

describe('lagrangeErrorBound()', function () {
    context('lagrangeErrorBound with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.lagrangeErrorBound()).to.throw();
        });
    });
    context('lagrangeErrorBound with non-string function', function () {
        it('Should throw an error', function () {
            expect(() => calculus.lagrangeErrorBound([1, 2, 3])).to.throw();
        });
    });
    context('lagrangeErrorBound with non-integer degree', function () {
        it('Should throw an error', function () {
            expect(() => calculus.lagrangeErrorBound('x', 0, 2, 0.2, 1)).to.throw();
        });
    });
    context('lagrangeErrorBound with negative degree', function () {
        it('Should throw an error', function () {
            expect(() => calculus.lagrangeErrorBound('x', 0, 2, -5, 1)).to.throw();
        });
    });
    context('lagrangeErrorBound with guess not inbetween center and x', function () {
        it('Should throw an error', function () {
            expect(() => calculus.lagrangeErrorBound('x', 0, 2, 1, -2)).to.throw();
        });
    });
});

describe('curl()', function () {
    context('curl with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.curl()).to.throw();
        });
    });
    context('curl of 2D function [x, y]', function () {
        it('Should equal -x+y', function () {
            expect(calculus.curl(['x', 'y']).toString()).to.equal('-x+y');
        });
    });
    context('curl of 2D function [x, y] at [1, 1]', function () {
        it('Should equal 0', function () {
            expect(+calculus.curl(['x', 'y'], [1, 1]).toString()).to.equal(0);
        });
    });
    context('curl of 2D function [a, b] with vars [a, b]', function () {
        it('Should equal -a+b', function () {
            expect(calculus.curl(['a', 'b'], null, ['a', 'b']).toString()).to.equal('-a+b');
        });
    });
    context('curl of 2D function [a, b] with vars [a, b] at [1, 1]', function () {
        it('Should equal 0', function () {
            expect(+calculus.curl(['a', 'b'], [1, 1], ['a', 'b']).toString()).to.equal(0);
        });
    });
    context('curl of 3D function [x, y, z]', function () {
        it('Should equal [-y+z, x-z, y-z]', function () {
            expect(calculus.curl(['x', 'y', 'z']).toString()).to.equal('-y+z,x-z,y-z');
        });
    });
    context('curl of 3D function [x, y, z] at [1, 1, 1]', function () {
        it('Should equal [0, 0, 0]', function () {
            expect(calculus.curl(['x', 'y', 'z'], [1, 1, 1]).toString()).to.equal('0,0,0');
        });
    });
});

describe('div()', function () {
    context('div with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.div()).to.throw();
        });
    });
    context('div of 2D function [x, y]', function () {
        it('Should equal x+y', function () {
            expect(calculus.div(['x', 'y']).toString()).to.equal('x+y');
        });
    });
    context('div of 2D function [x, y] at [1, 1]', function () {
        it('Should equal 2', function () {
            expect(+calculus.div(['x', 'y'], [1, 1]).toString()).to.equal(2);
        });
    });
    context('div of 2D function [a, b] with vars [a, b]', function () {
        it('Should equal a+b', function () {
            expect(calculus.div(['a', 'b'], null, ['a', 'b']).toString()).to.equal('a+b');
        });
    });
    context('div of 2D function [a, b] with vars [a, b] at [1, 1]', function () {
        it('Should equal 2', function () {
            expect(+calculus.div(['a', 'b'], [1, 1], ['a', 'b']).toString()).to.equal(2);
        });
    });
    context('div of 3D function [x, y, z]', function () {
        it('Should equal x+y+z', function () {
            expect(calculus.div(['x', 'y', 'z']).toString()).to.equal('x+y+z');
        });
    });
    context('div of 3D function [x, y, z] at [1, 1, 1]', function () {
        it('Should equal 3', function () {
            expect(+calculus.div(['x', 'y', 'z'], [1, 1, 1]).toString()).to.equal(3);
        });
    });
});

describe('partfrac()', function () {
    context('partfrac with no arguments supplied', function () {
        it('Should throw an error', function () {
            expect(() => calculus.partfrac()).to.throw();
        });
    });
});