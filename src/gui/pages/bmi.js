'use strict';

const Page = require('../page.js');
let page = new Page('Body Mass Index', 
    `<p style="font-size: 24px; margin: 30px 30px 0 30px">Body Mass Index (BMI)</p>

<div style="margin: 30px" class="responsive-grid">
    <div>
        <table style="width: 100%; max-width: 800px">
            <tr>
                <td>Mode</td>
                <td><button class="modal-btn" style="margin-left: 5px; margin-bottom: 4px; width: calc(60% + 25px)" id="bmi-mode" onclick="
            this.innerHTML = this.innerText.includes('SI') ? 'Mode: Imperial' : 'Mode: SI';
            document.getElementById('bmi-label-1').innerHTML = 'Weight ' + (this.innerText.includes('SI') ? '(kg)' : '(lb)');
            document.getElementById('bmi-label-2').innerHTML = 'Height ' + (this.innerText.includes('SI') ? '(cm)' : '(in)');
            document.getElementById('bmi-answer-btn').click();
        ">Mode: SI</button></td>
            </tr>

            <tr>
                <td style="width: 120px" id="bmi-label-1">Weight (kg)</td>
                <td><input type="number" class="modal-input" style="width: 60%" id="bmi-input-1" oninput="
                    document.getElementById('bmi-answer-btn').click();"></input></td>
            </tr>
            <tr>
                <td id="bmi-label-2">Height (cm)</td>
                <td><input type="number" class="modal-input" style="width: 60%" id="bmi-input-2" oninput="
                    document.getElementById('bmi-answer-btn').click();"></input></td>
            </tr>
        </table>

        <p style="font-size: 26px" id="bmi-answer">BMI: None</p>
    </div>

    <table style="width: 100%; max-width: 800px">
        <tr>
            <td style="text-decoration: underline">BMI</td>
            <td style="text-decoration: underline">Category</td>
        </tr>
        <tr>
            <td>< 15</td>
            <td>Very severely underweight</td>
        </tr>
        <tr>
            <td>15 - 16</td>
            <td>Severely underweight</td>
        </tr>
        <tr>
            <td>16 - 18.5</td>
            <td>Underweight</td>
        </tr>
        <tr>
            <td>18.5 - 25</td>
            <td>Normal</td>
        </tr>
        <tr>
            <td>25 - 30</td>
            <td>Overweight</td>
        </tr>
        <tr>
            <td>30 - 35</td>
            <td>Moderately obese</td>
        </tr>
        <tr>
            <td>35 - 40</td>
            <td>Severely obese</td>
        </tr>
        <tr>
            <td>> 40</td>
            <td>Very severely obese</td>
        </tr>
    </table>

    <!-- Hidden button to update BMI -->
    <button id="bmi-answer-btn" onclick="
    let w = +document.getElementById('bmi-input-1').value;
    let h = +document.getElementById('bmi-input-2').value;
    console.log(w, h)
    if (!w || !h) document.getElementById('bmi-answer').innerHTML = 'BMI: None';
    else if (document.getElementById('bmi-mode').innerText.includes('SI'))
        document.getElementById('bmi-answer').innerHTML = 'BMI: ' + (w / (h / 100) ** 2).toFixed(1);
    else document.getElementById('bmi-answer').innerHTML = 'BMI: ' + (703 * w / h / h).toFixed(1);
    " style="display: none"></button>
</div>`);

module.exports = page;