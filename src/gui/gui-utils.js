'use strict';

/**
 * Generate html for tabs from page object
 * @param {object} pages Pages object, each key is tab name, each value is
 *                       obj of tab functions like fName: fHelp
 * @param {string} width Width of each button
 * @return {string}      HTML generated
 */
function generateTabsFromPage(pages, width='150px') {
    let html = '';
    let keys = Object.keys(pages);

    for (let i = 0; i < keys.length; i++) {
        html += `<button class="modal-btn${i === 0 ? ' active-btn' : ''}" style="width: ${width}" id="modal-btn-${i + 1}"
    onclick="require('./src/state.js').modal.setActiveTab(${i + 1});">${keys[i]}</button>\n`;
    }

    for (let i = 0; i < keys.length; i++) {
        let list = generateListHTML(pages[keys[i]], i);
        html += `<ul class="modal-menu-list" style="display: ${i === 0 ? 'block' : 'none'}" id="modal-page-${i + 1}">${list}</ul>`;
    }

    return html;
}

/**
 * Generate <li> html for an object
 * @param {object} obj Object of name: help
 * @param {number} i   Index of the item (For tabs)
 * @return {string}    HTML code
 */
function generateListHTML(obj, i = 0) {
    let keys2 = Object.keys(obj);
    return keys2.map(x => {
        return `<li id="modal-list-item-${i}" onclick="addChar('${x}('); require('./src/state').modal.hide();">${x} 
    <span class="item-desc">${obj[x]}</span></li>`;
    }).join('\n');
}

module.exports = {
    generateTabsFromPage: generateTabsFromPage,
    generateListHTML: generateListHTML
};