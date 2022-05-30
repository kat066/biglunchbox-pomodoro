/** Help model component. */

/**
 * This class extends HTMLElement, creates a shadow document object model
 * (DOM), and adds the elements of the help popup window to the DOM.
 */
class HelpPopUp extends HTMLElement {
    // Opens the popup.
    openPopUp() {
        const wrapper = this.shadowRoot.getElementById('help-popup');
        wrapper.style.display = 'block';
    }

    // Closes the popup.
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('help-popup');
        wrapper.style.display = 'none';
    }

    // Appends the elements of the help popup to the shadow DOM.
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('help-popup-template');
        const templateContent = template.content;

        shadow.appendChild(templateContent.cloneNode(true));

        Object.defineProperties(this, {
            _bindedOpen: {
                value: this.openPopUp.bind(this),
            },
            _bindedClose: {
                value: this.closePopUp.bind(this),
            },
        });
    }

    // If node is connected, add an on-click listener to the close button.
    connectedCallback() {
        if (!this.isConnected) {
            return;
        }

        const shadow = this.shadowRoot;

        const closeBtn = shadow.getElementById('close-icon');
        closeBtn.addEventListener('click', this._bindedClose);

        this.addEventListener('openPopUp', this._bindedOpen);
    }

    // If node is connected, remove the close button's on-click listener.
    disconnectedCallback() {
        const shadow = this.shadowRoot;

        const closeBtn = shadow.getElementById('close-icon');
        closeBtn.removeEventListener('click', this._bindedClose);

        this.removeEventListener('openPopUp', this._bindedOpen);
    }
}
customElements.define('help-popup', HelpPopUp);

function init() {
    const helpBtn = document.getElementById('help-button');
    helpBtn.addEventListener('click', () => {
        const helpPopUp = document.querySelector('help-popup');
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('clickState') === 'on') {
            btnSound.play(); // only plays sound when enabled
        }
        // this makes sure any popup is closed before opening current popup
        const popups = Array.from(document.getElementsByClassName('popup'));
        popups.forEach((el) => {
            el.closePopUp();
        });
        helpPopUp.dispatchEvent(new Event('openPopUp'));
    });
}

if (document.readyState !== 'loading') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}

// module.exports = HelpPopUp;
