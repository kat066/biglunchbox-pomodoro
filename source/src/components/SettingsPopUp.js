/**
 * The class is extend the HTMlElement function. The closePopup function would be call for
 * close all the popup windows. The confirmSettings function would be call for confirm setting
 * all the time. The toggleMode function would be call for change the dark or light mode.
 * The setVolume would be call for setting the volume.
 * include the style of the web.
 * @constructor The constructor would reset and show everything in pages
 */
class SettingsPopUp extends HTMLElement {
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('settings-confirm-popup');
        wrapper.style.display = 'none';
    }

    confirmSettings() {
        let pomoLength = parseInt(this.shadowRoot.getElementById('pomo-length-input').value, 10);
        if (Number.isNaN(pomoLength)) {
            pomoLength = 25;
            this.shadowRoot.getElementById('pomo-length-input').value = 25;
        }
        localStorage.setItem('pomo-length', String(pomoLength));

        let shortBreak = parseInt(this.shadowRoot.getElementById('short-break-input').value, 10);
        if (Number.isNaN(shortBreak)) {
            shortBreak = 5;
            this.shadowRoot.getElementById('short-break-input').value = 5;
        }
        localStorage.setItem('short-break-length', String(shortBreak));

        let longBreak = parseInt(this.shadowRoot.getElementById('long-break-input').value, 10);
        if (Number.isNaN(longBreak)) {
            longBreak = 15;
            this.shadowRoot.getElementById('long-break-input').value = 15;
        }
        localStorage.setItem('long-break-length', String(longBreak));

        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('clickState') === 'on') {
            btnSound.play(); // only plays sound when enabled
        }
        localStorage.setItem('stop', 'true');
        this.closePopUp();
    }

    toggleMode() {
        if (localStorage.getItem('theme') === 'light') {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        document.body.classList.toggle('dark-theme');
    }

    // toggles clickState's state
    toggleClickSound() {
        if (localStorage.getItem('clickState') === 'off') {
            localStorage.setItem('clickState', 'on');
        } else {
            localStorage.setItem('clickState', 'off');
        }
    }

    // toggles alarmState's state
    toggleAlarmSound() {
        if (localStorage.getItem('alarmState') === 'off') {
            localStorage.setItem('alarmState', 'on');
        } else {
            localStorage.setItem('alarmState', 'off');
        }
    }

    toggleTabLabel() {
        const tabLabel = document.getElementById('tab-label');
        if (localStorage.getItem('tab-label') === 'on') {
            localStorage.setItem('tab-label', 'off');
            tabLabel.innerHTML = 'Pomodoro Timer';
        } else {
            localStorage.setItem('tab-label', 'on');
        }
    }

    setVolume() {
        const volume = this.shadowRoot.getElementById('range').value;
        localStorage.setItem('volume', `${volume}`);
    }

    updateVolumeText() {
        const volumeText = this.shadowRoot.getElementById('volume-number');
        const rangeInput = this.shadowRoot.getElementById('range');
        volumeText.textContent = rangeInput.value;
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('settings-popup-template');
        const templateContent = template.content;

        shadow.appendChild(templateContent.cloneNode(true));

        Object.defineProperties(this, {
            _bindedClose: {
                value: this.closePopUp.bind(this),
            },
            _bindedSetVolume: {
                value: this.setVolume.bind(this),
            },
            _bindedToggleClickSound: {
                value: this.toggleClickSound.bind(this),
            },
            _bindedToggleAlarmSound: {
                value: this.toggleAlarmSound.bind(this),
            },
            _bindedConfirmSettings: {
                value: this.confirmSettings.bind(this),
            },
            _bindedChangeTheme: {
                value: this.toggleMode.bind(this),
            },
            _bindedToggleTabLabel: {
                value: this.toggleTabLabel.bind(this),
            },
            _bindedUpdateVolumeText: {
                value: this.updateVolumeText.bind(this),
            },
        });
    }

    connectedCallback() {
        // Guard clause to prevent it from being called when element is disconnected.
        if (!this.isConnected) {
            return;
        }

        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.addEventListener('click', this._bindedClose);

        const pomoInput = this.shadowRoot.getElementById('pomo-length-input');
        pomoInput.setAttribute('value', parseInt(localStorage.getItem('pomo-length'), 10));
        // There should be a way to do this and similar changes with an event listener,
        // but I can't be bothered to debug this statement for 20 minutes
        pomoInput.setAttribute('oninput', 'validity.valid||(value="")');

        const shortBreakInput = this.shadowRoot.getElementById('short-break-input');
        shortBreakInput.setAttribute('value', parseInt(localStorage.getItem('short-break-length'), 10));
        shortBreakInput.setAttribute('oninput', 'validity.valid||(value="")');

        const longBreakInput = this.shadowRoot.getElementById('long-break-input');
        longBreakInput.setAttribute('value', parseInt(localStorage.getItem('long-break-length'), 10));
        longBreakInput.setAttribute('oninput', 'validity.valid||(value="")');

        const themeCheckbox = this.shadowRoot.querySelector('#dark-mode > label.switch > input[type=checkbox]');
        if (localStorage.getItem('theme') === 'dark') {
            themeCheckbox.toggleAttribute('checked');
        }
        const themeStylisticSlider = this.shadowRoot.getElementById('mode-switch-slider');
        themeStylisticSlider.addEventListener('click', this._bindedChangeTheme);

        const tabLabelCheckbox = this.shadowRoot.querySelector('#tab-label-switch > label.switch > input[type=checkbox]');
        if (localStorage.getItem('tab-label') === 'on' || localStorage.getItem('tab-label') === null) {
            tabLabelCheckbox.toggleAttribute('checked');
        }
        const tabLabelStylisticSlider = this.shadowRoot.getElementById('tab-label-switch-slider');
        tabLabelStylisticSlider.addEventListener('click', this._bindedToggleTabLabel);

        const rangeInput = this.shadowRoot.getElementById('range');
        rangeInput.setAttribute('value', parseInt(localStorage.getItem('volume'), 10));
        this._bindedUpdateVolumeText();
        rangeInput.addEventListener('input', this._bindedUpdateVolumeText);
        rangeInput.addEventListener('change', this._bindedSetVolume);

        const soundCheckbox = this.shadowRoot.querySelector('#sound-switch > input[type=checkbox]');
        if (localStorage.getItem('clickState') === 'on') {
            soundCheckbox.toggleAttribute('checked');
        }
        const soundStylisticSlider = this.shadowRoot.querySelector('#sound-switch > span.slider');
        soundStylisticSlider.addEventListener('click', this._bindedToggleClickSound);

        const alarmCheckbox = this.shadowRoot.querySelector('#alarm-switch > input[type=checkbox]');
        if (localStorage.getItem('clickState') === 'on') {
            alarmCheckbox.toggleAttribute('checked');
        }
        const alarmStylisticSlider = this.shadowRoot.querySelector('#sound-switch > span.slider');
        alarmStylisticSlider.addEventListener('click', this._bindedToggleAlarmSound);

        const confirmBtn = this.shadowRoot.getElementById('confirm-settings-btn');
        confirmBtn.addEventListener('click', this._bindedConfirmSettings);
    }

    disconnectedCallback() {
        const closeBtn = this.shadowRoot.getElementById('close-icon');
        closeBtn.addEventListener('click', this._bindedClose);

        const themeStylisticSlider = this.shadowRoot.getElementById('mode-switch-slider');
        themeStylisticSlider.addEventListener('click', this._bindedChangeTheme);

        const rangeInput = this.shadowRoot.getElementById('range');
        rangeInput.addEventListener('input', this._bindedUpdateVolumeText);
        rangeInput.addEventListener('change', this._bindedSetVolume);

        const soundStylisticSlider = this.shadowRoot.querySelector('#sound-switch > span.slider');
        soundStylisticSlider.addEventListener('click', this._bindedToggleClickSound);

        const alarmStylisticSlider = this.shadowRoot.querySelector('#sound-switch > span.slider');
        alarmStylisticSlider.addEventListener('click', this._bindedToggleAlarmSound);

        const confirmBtn = this.shadowRoot.getElementById('confirm-settings-btn');
        confirmBtn.addEventListener('click', this._bindedConfirmSettings);
    }
}

customElements.define('settings-popup', SettingsPopUp);

window.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('setting-button');
    const settingsPopUp = document.querySelector('settings-popup');
    settingsButton.addEventListener('click', () => {
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('clickState') === 'on') {
            btnSound.play();
        }
        // make sure all popups are closed before opening another one
        const popups = Array.from(document.getElementsByClassName('popup'));
        for (let i = 0; i < popups.length; i += 1) {
            popups[i].closePopUp();
        }
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:block');
    });
});

// module.exports = SettingsPopUp;
