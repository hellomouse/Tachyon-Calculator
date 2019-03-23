'use strict';

const xssFilters = require('xss-filters');

/* Let renderer load first */
let renderer;
setTimeout(() => { renderer = require('../../../../renderer.js'); }, 1000);

/**
 * Loads an image of the url
 * @param {string} url Url to the image
 */
function loadImage(url) {
    renderer.addData(`<img class="internet-img" src="${xssFilters.uriInUnQuotedAttr(url)}">`, false);
    return '';
}

module.exports = {
    loadImage: loadImage
};