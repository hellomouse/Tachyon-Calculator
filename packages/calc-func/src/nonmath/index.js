'use strict';

const xssFilters = require('xss-filters');

/* Let renderer load first */
const renderer = require('../../../../renderer.js');

/**
 * Loads an image of the url
 * @param {string} url Url to the image
 */
function loadImage(url) {
    renderer.addData(`<img class="internet-img" src=${xssFilters.uriInUnQuotedAttr(url)}>`, false);
    return undefined;
}

module.exports = {
    loadImage: loadImage
};