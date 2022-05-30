/** Reset model component. */

/**
 * This class extends HTMLElement, creates a shadow document object model
 * (DOM), and adds the elements of the reset popup window to the DOM.
 */
class ResetPopUp extends HTMLElement {
    // Resets current Pomodoro session.
    reset() {
        // stop();
        localStorage.setItem('stop', 'true');
        const taskList = Array.from(document.getElementById('task-list-elements').getElementsByTagName('task-item'));
        for (let i = 0; i < taskList.length; i += 1) {
            taskList[i].removeTask();
        }
        // remove focus task
        const focusTask = document.getElementById('focus-task').querySelector('task-item');
        if (focusTask !== null) {
            focusTask.removeTask();
        }
        localStorage.setItem('id', `${0}`);
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('clickState') === 'on') {
            btnSound.play(); // only plays sound when enabled
        }
        this.closePopUp();
    }

    // Closes the reset popup.
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('reset-confirm-popup');
        wrapper.style.display = 'none';
    }

    // Appends the elements of the reset popup to the shadow DOM.
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('reset-popup-template');
        const templateContent = template.content;

        shadow.appendChild(templateContent.cloneNode(true));

        // Define these properties such that they cannot be changed and are bounded
        // Useful for adding and removing event listeners. Also prevents recreating
        // these when they are reconnected
        Object.defineProperties(this, {
            _bindedReset: {
                value: this.reset.bind(this),
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

        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.addEventListener('click', this._bindedClose);

        const confirmBtn = this.shadowRoot.getElementById('confirm-reset-btn');
        confirmBtn.addEventListener('click', this._bindedReset);
    }

    // If node is connected, remove the close button's on-click listener.
    disconnectedCallback() {
        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.removeEventListener('click', this._bindedClose);

        const confirmBtn = this.shadowRoot.getElementById('confirm-reset-btn');
        confirmBtn.removeEventListener('click', this._bindedReset);
    }
}
customElements.define('reset-popup', ResetPopUp);

function init() {
    const resetPopUp = document.querySelector('reset-popup');
    const resetBtn = document.getElementById('reset-button');
    resetBtn.addEventListener('click', () => {
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
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:block');
    });
}

if (document.readyState !== 'loading') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}

// module.exports = ResetPopUp;
