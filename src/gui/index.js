'use strict';

const pages = require('./pages');

/**
 * Adds all pages to the sorted
 * calculator list
 */
function addPagesToList() {
    let list = document.getElementById('calculator-list-menu');
    let lis = [];

    function addPage(obj, prefix) {
        for (let key of Object.keys(obj)) {
            if (obj[key].name && obj[key].html) lis.push([prefix + '.' + key, obj[key].name, obj[key]]);
            else addPage(obj[key], prefix + '.' + key);
        }
    }
    addPage(pages, '');
    lis.sort((a, b) => a[1] > b[1] ? 1 : -1);
    list.innerHTML = lis.map(x => `<li onclick="require('./src/gui').page${x[0]}.show()">
        <div style="width: 30px; display: inline-block">
            <img src="./public/img/side-nav/${x[2].icon}">
        </div>${x[1]}</li>`).join('\n');
}


module.exports = {
    modal: {
        dist: require('./modal/dist'),
        const: require('./modal/const'),
        misc: require('./modal/misc'),
        angle: require('./modal/angle.js'),
        list: require('./modal/list'),
        math: require('./modal/math.js'),
        rand: require('./modal/rand.js')
    },
    page: pages,
    addPagesToList: addPagesToList
};