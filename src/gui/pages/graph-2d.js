'use strict';

const Page = require('../page.js');
let page = new Page('Graph 2D', `<iframe id="desmos-iframe" src="https://www.desmos.com/calculator" class="desmos-graph"></iframe><br>
<small>2D Graphing Supplied by Desmos. This product is not endorsed by Desmos and is for personal use only</small>`);

const cssLink = document.createElement('link');
cssLink.href = process.cwd() + '/public/css/desmos.css';
cssLink.rel = 'stylesheet'; 

/* Inject custom CSS */
page.onload = () => {
    let frame = document.getElementById('desmos-iframe');
    frame.onload = () => {  
        frame.contentDocument.head.appendChild(cssLink); 
    };
};

module.exports = page;