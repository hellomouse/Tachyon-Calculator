'use strict';
/* global toggleSideMenu:true */

const page = document.getElementById('page-overlay');
const state = require('../state.js');

class Page {
    /**
     * Create a new Page
     * @param {string} name Name of the page
     * @param {string} html HTML inside the page
     * @param {string} icon Icon name (in img/side-nav/<name>)
     */
    constructor(name, html, icon='sci.png') {
        this.name = name;
        this.html = html;
        this.icon = icon;
    }

    /** Override this */
    onload() {
        /* Runs on load */
    }

    /**
     * Show the page
     * @param {Element} li The <li> clicked
     */
    show(li) {
        /* Check not already open */
        if (state.page && state.page.name === this.name && page.innerHTML) {
            toggleSideMenu();
            return;
        }

        if (state.modal) state.modal.hide();
        if (state.page) state.page.hide();

        this.doHighlights(li);

        state.page = this;
        page.style.display = 'block';
        page.innerHTML = this.html;

        this.onload();
        toggleSideMenu();
    }

    /** 
     * Hides the page and unloads page 
     * @param {Element} li The <li> clicked
     */
    hide(li) {
        page.style.display = 'none';
        page.innerHTML = '';
        this.doHighlights(li); 
    }

    /** 
     * Alias for hide 
     * @param {Element} li The <li> clicked
     */
    close(li) { 
        this.hide(li);
    }

    /** 
     * Highlight selected li 
     * @param {Element} li The <li> clicked
     */
    doHighlights(li) {
        /* Highlight the li */
        if (!li) return;
        let lis = document.getElementById('side-nav-bar-menu').getElementsByTagName('li');
        for (let i = 0; i < lis.length; i++)
            lis[i].classList.remove('active');
        li.classList.add('active');
    }
}

module.exports = Page;