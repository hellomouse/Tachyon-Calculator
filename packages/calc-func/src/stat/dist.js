/* Distribution functions */

'use strict';

const distriprob = require('distriprob');
const math = require('mathjs');

module.exports = {
    normalpdf: function(x, u=0, sigma=1) {
        /* Normalize numbers */
        x = math.number(x);
        u = math.number(u);
        sigma = math.number(sigma);

        return distriprob.normal.pdfSync(x, u, sigma);
    },
    normalcdf: function(low, high, u=0, sigma=1) {
        /* Normalize numbers */
        low = math.number(low);
        high = math.number(high);
        u = math.number(u);
        sigma = math.number(sigma);

        return distriprob.normal.cdfSync(high, u, sigma) - distriprob.normal.cdfSync(low, u, sigma);
    },
    invNorm: function(area, u=0, sigma=1) {
        /* Normalize numbers */
        area = math.number(area);
        u = math.number(u);
        sigma = math.number(sigma);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.normal.quantileSync(area, u, sigma);
    },
    invT: function(area, df) {
        /* Normalize numbers */
        area = math.number(area);
        df = math.number(df);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.t.quantileSync(area, df);
    },
    tpdf: function (x, df) {
        /* Normalize numbers */
        x = math.number(x);
        df = math.number(df);

        if (df < 1)
            throw new RangeError('df msut be greater than 0');

        return distriprob.t.pdfSync(x, df);
    },
    tcdf: function (low, high, df) {
        /* Normalize numbers */
        low = math.number(low);
        high = math.number(high);
        df = math.number(df);

        if (df < 1)
            throw new RangeError('df msut be greater than 0');

        return distriprob.t.cdfSync(high, df) - distriprob.t.cdfSync(low, df);
    },
    invChi2: function (area, df) {
        /* Normalize numbers */
        area = math.number(area);
        df = math.number(df);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.chi2.quantileSync(area, df);
    },
    chi2pdf: function (x, df) {
        /* Normalize numbers */
        x = math.number(x);
        df = math.number(df);

        return distriprob.chi2.pdfSync(x, df);
    },
    chi2cdf: function (low, high, df) {
        /* Normalize numbers */
        low = math.number(low);
        high = math.number(high);
        df = math.number(df);

        return distriprob.chi2.cdfSync(high, df) - distriprob.chi2.cdfSync(low, df);
    },
    Fpdf: function (x, dof1, dof2) {
        /* Normalize numbers */
        x = math.number(x);
        dof1 = math.number(dof1);
        dof2 = math.number(dof2);

        return distriprob.F.pdfSync(x, dof1, dof2);
    },
    Fcdf: function (low, high, dof1, dof2) {
        /* Normalize numbers */
        low = math.number(low);
        high = math.number(high);
        dof1 = math.number(dof1);
        dof2 = math.number(dof2);

        return distriprob.F.cdfSync(high, dof1, dof2) - distriprob.F.cdfSync(low, dof1, dof2);
    },
    invF: function (area, dof1, dof2) {
        /* Normalize numbers */
        area = math.number(area);
        dof1 = math.number(dof1);
        dof2 = math.number(dof2);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.F.quantileSync(area, dof1, dof2);
    },
    betapdf: function (x, alpha, beta) {
        /* Normalize numbers */
        x = math.number(x);
        alpha = math.number(alpha);
        beta = math.number(beta);

        return distriprob.beta.pdfSync(x, alpha, beta);
    },
    betacdf: function (low, high, alpha, beta) {
        /* Normalize numbers */
        low = math.number(low);
        high = math.number(high);
        alpha = math.number(alpha);
        beta = math.number(beta);

        return distriprob.beta.cdfSync(high, alpha, beta) - distriprob.beta.cdfSync(low, alpha, beta);
    },
    invBeta: function (area, alpha, beta) {
        /* Normalize numbers */
        area = math.number(area);
        alpha = math.number(alpha);
        beta = math.number(beta);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.beta.quantileSync(area, alpha, beta);
    },
    invExp: function (area, lambda) {
        /* Normalize numbers */
        area = math.number(area);
        lambda = math.number(lambda);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.exponential.quantileSync(area, lambda);
    },
    expoentialpdf: function (x, lambda) {
        /* Normalize numbers */
        x = math.number(x);
        lambda = math.number(lambda);

        return distriprob.exponential.pdfSync(x, lambda);
    },
    expoentialcdf: function (low, high, lambda) {
        /* Normalize numbers */
        low = math.number(low);
        high = math.number(high);
        lambda = math.number(lambda);

        return distriprob.exponential.cdfSync(high, lambda) - distriprob.exponential.cdfSync(low, lambda);
    },
    binomialpdf: function (trials, probSuccess, x) {
        /* Normalize numbers */
        x = math.number(x);
        trials = math.number(trials);
        probSuccess = math.number(probSuccess);

        if (probSuccess <= 0 || probSuccess > 1)
            throw new RangeError('0 < probSuccess < 1 must be true');

        return distriprob.binomial.pdfSync(x, trials, probSuccess);
    },
    binomialcdf: function (trials, probSuccess, x) {
        /* Normalize numbers */
        x = math.number(x);
        trials = math.number(trials);
        probSuccess = math.number(probSuccess);

        if (probSuccess <= 0 || probSuccess > 1)
            throw new RangeError('0 < probSuccess < 1 must be true');

        return distriprob.binomial.cdfSync(x, trials, probSuccess);
    },
    invBin: function (area, trials, probSuccess) {
        /* Normalize numbers */
        area = math.number(area);
        trials = math.number(trials);
        probSuccess = math.number(probSuccess);

        if (probSuccess <= 0 || probSuccess > 1)
            throw new RangeError('0 < probSuccess < 1 must be true');
        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.binomial.quantileSync(area, trials, probSuccess);
    },
    invPoisson: function (area, lambda) {
        /* Normalize numbers */
        area = math.number(area);
        lambda = math.number(lambda);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.poisson.quantileSync(area, lambda);
    },
    poissonpdf: function (x, lambda) {
        /* Normalize numbers */
        x = math.number(x);
        lambda = math.number(lambda);

        return distriprob.poisson.pdfSync(x, lambda);
    },
    poissoncdf: function (x, lambda) {
        /* Normalize numbers */
        x = math.number(x);
        lambda = math.number(lambda);

        return distriprob.poisson.cdfSync(x, lambda);
    },
    gammapdf: function (x, shape, scale) {
        /* normalize numbers */
        x = math.number(x);
        shape = math.number(shape);
        scale = math.number(scale);

        return distriprob.gamma.pdfSync(x, shape, scale);
    },
    gammacdf: function (low, high, shape, scale) {
        /* normalize numbers */
        low = math.number(low);
        high = math.number(high);
        shape = math.number(shape);
        scale = math.number(scale);

        return distriprob.gamma.cdfSync(high, shape, scale) - distriprob.gamma.cdfSync(low, shape, scale);
    },
    invGamma: function (area, shape, scale) {
        /* normalize numbers */
        area = math.number(area);
        shape = math.number(shape);
        scale = math.number(scale);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.gamma.quantileSync(area, shape, scale);
    },
    hypergeometricpdf: function (sampleSuccesses, draws, successPop, totalPop) {
        /* normalize numbers */
        sampleSuccesses = math.number(sampleSuccesses);
        draws = math.number(draws);
        successPop = math.number(successPop);
        totalPop = math.number(totalPop);

        return distriprob.hypergeometric.pdfSync(sampleSuccesses, draws, successPop, totalPop);
    },
    hypergeometriccdf: function (x, draws, successPop, totalPop) {
        /* normalize numbers */
        x = math.number(x);
        draws = math.number(draws);
        successPop = math.number(successPop);
        totalPop = math.number(totalPop);

        return distriprob.hypergeometric.cdfSync(x, draws, successPop, totalPop);
    },
    invHypergeo: function (area, draws, successPop, totalPop) {
        /* normalize numbers */
        area = math.number(area);
        draws = math.number(draws);
        successPop = math.number(successPop);
        totalPop = math.number(totalPop);

        if (Math.abs(area) > 1)
            throw new RangeError('|Area| must ≤ 1');

        return distriprob.hypergeometric.quantileSync(area, draws, successPop, totalPop);
    },
    geometricpdf: function (probSuccess, x) {
        /* Normalize numbers */
        x = Math.floor(math.number(x));
        probSuccess = math.number(probSuccess);

        if (probSuccess <= 0 || probSuccess > 1)
            throw new RangeError('0 < probSuccess < 1 must be true');
        if (x <= 0)
            throw new RangeError('x must be greater than 0');

        return probSuccess * (1 - probSuccess) ** (x - 1);
    },
    geometriccdf: function (probSuccess, x) {
        /* Normalize numbers */
        x = Math.floor(math.number(x));
        probSuccess = math.number(probSuccess);
        let r = 1 - probSuccess;

        if (probSuccess <= 0 || probSuccess > 1)
            throw new RangeError('0 < probSuccess < 1 must be true');
        if (x <= 0)
            throw new RangeError('x must be greater than 0');

        return probSuccess * (r ** (x + 1) - 1) / (r - 1);
    },
    invGeo: function (p, probSuccess) {
        /* Normalize numbers */
        p = math.number(p);
        probSuccess = math.number(probSuccess);
        let r = 1 - probSuccess;
        
        if (probSuccess <= 0 || probSuccess > 1)
            throw new RangeError('0 < probSuccess < 1 must be true');
        if (p <= 0 || p > 1)
            throw new RangeError('0 < p < 1 must be true');

        /* Solve for x in that equation from geometriccdf */
        return Math.ceil(Math.log(p * (r - 1) / probSuccess + 1) / Math.log(r) - 1);
    },
    cauchypdf: function (x, x0=0, scale=1) {
        x = math.number(x);
        x0 = math.number(x0);
        scale = math.number(scale);

        return 1 / (Math.PI * scale) * (scale ** 2) / ((x - x0) ** 2 + scale ** 2);
    },
    cauchycdf: function(x, x0=0, scale=1) {
        x = math.number(x);
        x0 = math.number(x0);
        scale = math.number(scale);

        return 1 / Math.PI * Math.atan2(x - x0, scale) + 0.5;
    },
    invCauchy: function(area, x0=0, scale=1) {
        area = math.number(area);
        x0 = math.number(x0);
        scale = math.number(scale);

        return x0 + scale * Math.tan(Math.PI * (area - 0.5));
    }
};   