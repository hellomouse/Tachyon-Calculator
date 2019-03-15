'use strict';

const modal = document.getElementById('modal');
const state = require('../state.js');

/** Toggle if the modal (appear or don't appear) */
function toggleModalView() {
    document.getElementById('modal-overlay').classList.toggle('active');
    modal.classList.toggle('active');
}

class Modal {
    /**
     * @param {string} html innerHTML of the modal
     * @param {array}  size [width, height], set to null for default CSS size 
     */
    constructor(html, size=[null, null]) {
        this.html = html;
        this.size = size;
    }

    /**
     * Adds text to the input box and closes the modal
     * @param {string} text            Text to add to the input box, set as null for createText
     * @param {boolean} autoenter=true Automatically press ENTER if there is no other input in the box
     */
    addTextAndClose(text, autoenter=true) {
        if (!text) text = this.createText();
        addChar(text);

        if (autoenter && document.getElementById('main-input').value === text)
            require('../../renderer.js').sendData();
        this.hide();
    }

    /** 
     * Override this, returns the text that will be
     * added in addTextAndClose if no parameter is supplied 
     */
    createText() {
        return '';
    }

    /** 
     * Override this, update any elements. Should run on the
     * oninput event for an input element (You will need to do
     * this in the modal yourself)
     */
    updateState() {
        // Do nothing
    }

    show() {
        if (state.modal) state.modal.hide();
        state.modal = this;

        modal.style.width  = this.size[0];
        modal.style.height = this.size[1];
        modal.innerHTML = this.html;
        if (!modal.classList.contains('active'))
            toggleModalView();

        /* Autofocus first input */
        let inputs = Array.from(document.getElementById('modal').getElementsByTagName('input'));
        if (inputs.length > 0) inputs[0].focus();
    }

    hide() {
        modal.innerHTML = '';
        if (modal.classList.contains('active'))
            toggleModalView();
    }

    // Alias for hide
    close() { this.hide(); }
}

module.exports = Modal;