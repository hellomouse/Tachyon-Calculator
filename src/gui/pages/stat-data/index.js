'use strict';

/* TODO auto detect input formats: 
1
2
3 (line seperator)

1,2,3,4 (comam or space seperator)

(1,2) (3,4) (points)
1,2
3,4 (points by line)

also freq list

*/

const parser = require('./stat-parser.js');

const Page = require('../../page.js');
let page = new Page('Statistics (Data)', 
    `<p style="font-size: 24px; margin: 30px 30px 0 30px">Statistics (Data)</p>

<div style="margin: 30px" class="responsive-grid">
    <div class="card" style="max-height: 500px">
        <p style="font-size: 14px; margin: 0 0 5px 0">Data (Single or multivariable)</p>
        <textarea oninput="require('./src/gui/pages/stat-data/stat-parser.js').onInputChange()" style="width: 100%; height: 170px" id="stat-page-textarea-1"></textarea>
        
        <br><br>
        <p style="font-size: 14px; margin: 0 0 5px 0">Freq List (Optional)</p>
        <textarea oninput="require('./src/gui/pages/stat-data/stat-parser.js').onInputChange()" style="width: 100%; height: 55px" id="stat-page-textarea-2"></textarea>
        <br><br>
        <small>${parser.helpForInputData}</small>
    </div>
    <div class="card" style="max-height: 500px" id="stat-page-card-1">
        <p style="font-size: 16px; margin-top: 0"><b>X Stats</b></p>
        <p style="color: grey">Add data in the input box<br>
        Results will be calculated live</p>
    </div>
    <div class="card" id="stat-page-card-2"></div>
    <div class="card" id="stat-page-card-3"></div>
    <div class="card" id="stat-page-card-4"></div>
    <div class="card" id="stat-page-card-5"></div>
</div>`);


module.exports = page;