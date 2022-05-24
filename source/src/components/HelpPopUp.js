/** Help documentation modal component */
/**
 * The class is create a shadow dom and add every elements or detail in the dom and
 * include the style of the web.
 * @constructor The constructor would reset and show everything in pages
 */
class HelpPopUp extends HTMLElement {
    /** Closes the modal */
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('help-popup');
        wrapper.style.display = 'none';
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('help-popup-template');
        const templateContent = template.content;

        shadow.appendChild(templateContent.cloneNode(true));

        Object.defineProperties(this, {
            _bindedClose: {
                value: this.closePopUp.bind(this),
            },
        });
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }

        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.addEventListener('click', this._bindedClose);
    }

    disconnectedCallback() {
        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.removeEventListener('click', this._bindedClose);
    }
}
customElements.define('help-popup', HelpPopUp);

window.addEventListener('DOMContentLoaded', () => {
    const helpBtn = document.getElementById('help-button');
    const helpPopUp = document.querySelector('help-popup');
    helpBtn.addEventListener('click', () => {
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('clickState') === 'on') {
            btnSound.play(); // only plays sound when enabled
        }
        // this makes sure any popup is closed before opening current popup
        const popups = Array.from(document.getElementsByClassName('popup'));
        for (let i = 0; i < popups.length; i += 1) {
            popups[i].closePopUp();
        }
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:block');
    });
});
