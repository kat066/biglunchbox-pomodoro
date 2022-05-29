/** Help model component. */

/**
 * This class extends HTMLElement, creates a shadow document object model 
 * (DOM), and adds the elements of the help popup window to the DOM.
 */
class HelpPopUp extends HTMLElement {
    //Closes the popup.
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('help-popup');
        wrapper.style.display = 'none';
    }

    //Appends the elements of the help popup to the shadow DOM.
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

    //If node is connected, add an on-click listener to the close button.
    connectedCallback() {
        if (!this.isConnected) {
            return;
        }

        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.addEventListener('click', this._bindedClose);
    }

    //If node is connected, remove the close button's on-click listener.
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

// module.exports = HelpPopUp;
