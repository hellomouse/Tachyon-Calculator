'use strict';

// Credit to https://github.com/iczero for the code
// Generate TI random values and seeds
const mod1 = 2147483563;
const mod2 = 2147483399;
const mult1 = 40014;
const mult2 = 40692;

/**
 * Check whether two arrays are equal to each other
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Boolean}
 */
function checkArrayEquality(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

/** Random generator class */
class RandomGenerator {
    /**
     * @param {Number[]|Number} seed The seed
     */
    constructor(seed) {
        if (!seed) {
            this.seed = [12345, 67890]; // this is the default seed
        } else if (seed instanceof Array) {
            this.seed = seed;
        } else {
            this.seed = [(mult1 * seed) % mod1, seed % mod2];
        }
    }
    /**
     * Generate a single random value
     * @return {Number}
     */
    generate() {
        this.seed = [(this.seed[0] * mult1) % mod1, (this.seed[1] * mult2) % mod2];
        let result = (this.seed[0] - this.seed[1]) / mod1;
        if (result < 0) result += 1;
        return result;
    }
    /**
     * Generate random integers
     * @param {Number} low Lower limit
     * @param {Number} high Upper limit
     * @param {Number} num Count
     * @return {Number[]}
     */
    genInt(low, high, num = 1) {
        let ret = Array(num).fill(0);
        ret = ret.map(() => {
            let num = this.generate();
            return Math.floor(num * (high - low + 1) + low);
        });
        if (num === 1) return ret[0];
        return ret;
    }
    /**
     * Seed the generator like in TI calculator
     * @param {number} n Value to seed with
     */
    setSeed(n) {
        this.seed[0] = (mult1 * n) % mod1;
        this.seed[1] = n % mod2;
    }
    /**
     * Match an array of random integers
     * @param {Number[]} matchArr Array to match
     * @param {Number} low Lower limit for integers
     * @param {Number} high Upper limit for integers
     * @return {Number} The seed from which the array was generated
     */
    findSeed(matchArr, low, high) {
        // if low/high are defined then it uess genInt otherwise plain generate()
        let arr = [];
        let start = new Date();
        let gen;
        if (!high) gen = this.generate;
        else gen = () => this.genInt(low, high);

        let count = 0;

        for (; ;) {
            if (arr.length >= matchArr.length) arr.shift();
            arr.push(gen());
            count++;

            if (checkArrayEquality(arr, matchArr)) {
                return [count, [this.seed[0], this.seed[1]]];
            }

            if ((new Date()) - start > 1000) {
                document.getElementById('modal-prediction').innerHTML = 'Function timed out, could not find matching seed';
                return;
            }
        }
    }
}

const Page = require('../page.js');
let page = new Page('TI Randint Predictor', 
    `<p style="font-size: 24px; margin: 30px 30px 0 30px">TI Randint Predictor</p>
<div style="margin: 30px">
    <p>Type in the integers generated from randint seperated by commas, along with the range used<br>
    This program will brute force L'Ecuyer's algorithm and predict upcoming values<br><br>
    Typically around 3 or 4 values is sufficent for accuracy</p>
    <table style="width: 100%">
        <tr>
            <td>Generated Values</td>
            <td style="min-width: 300px; width: 80%"><input type="text" class="modal-input" id="modal-numbers"
                placeholder="i.e. 1, 3, 2, 15"></input></td>
        </tr><tr>
            <td>Low bound</td>
            <td><input type="text" class="modal-input" placeholder="i.e. 10" id="modal-low"></input></td>
        </tr><tr>
            <td>High Bound</td>
            <td><input type="text" class="modal-input" id="modal-high" placeholder="i.e. 20"></input></td>
        </tr>
    </table>

    <br>
    <button class="modal-btn" onclick="require('./src/state.js').page.predict()">Predict</button>

    <br><br>
    <pre id="modal-prediction" style="max-height: 200px; overflow: auto">

    </pre>
</div>`);

page.predict = () => {
    let values = document.getElementById('modal-numbers').value.split(',');
    let low = document.getElementById('modal-low').value;
    let high = document.getElementById('modal-high').value;
    let output = document.getElementById('modal-prediction');

    if (values.some(x => Number.isNaN(x))) {
        output.innerHTML = 'Generated values must be a comma seperated list of integers';
        return;
    } else if (Number.isNaN(low) || Number.isNaN(high)) {
        output.innerHTML = 'Low and high bound must be integers';
        return;
    } 

    values = values.map(x => Math.floor(+x));
    low = Math.floor(+low);
    high = Math.floor(+high);
    
    if (values.some(x => x !== Math.floor(x))) {
        output.innerHTML = 'Generated values must be all integers';
        return;
    } else if (low !== Math.floor(low) || high !== Math.floor(high)) {
        output.innerHTML = 'Low and high bound must be integers';
        return;
    }
    if (values.some(x => x < low || x > high)) {
        output.innerHTML = 'Some generated values do not lie in the range between low and high';
        return;
    }

    const random = new RandomGenerator();
    let result = random.findSeed(values, low, high);

    let s = 'Internal Seed found: ' + result[1].join(', ') + '\n\n';
    s += 'You will need to generate ' + result[0] + ' numbers from initial\nseed (0 -> rand) to reach this state\n\n';

    /* Brute force small seeds */
    let start = new Date();
    for (let i = 0; i < 2 ** 31; i++) {
        random.setSeed(i);
        if (checkArrayEquality(random.genInt(low, high, values.length), values)) {
            s += 'Alternatively seed your calculator with ' + i + ' -> rand\nfor beginning of input sequence\n\n';
            break;
        }
        if ((new Date()) - start > 1000)
            break;
    }

    s += '--- Next Random Numbers ---\n';

    for (let i = 0; i < 25; i++)
        s += '#' + (i + 1 < 10 ? '0' + (i + 1) : (i + 1)) + ': ' + random.genInt(low, high) + '\n';
    output.innerHTML = s;

};

module.exports = page;