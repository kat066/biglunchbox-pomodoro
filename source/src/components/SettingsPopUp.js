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
        btnSound.play();
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

    setVolume() {
        const volume = this.shadowRoot.getElementById('range').value;
        localStorage.setItem('volume', `${volume}`);
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // use div as wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'settings-confirm-popup');
        // close icon
        const close = wrapper.appendChild(document.createElement('img'));
        close.setAttribute('src', 'icons/close.svg');
        close.setAttribute('id', 'close-icon');
        // title
        const title = wrapper.appendChild(document.createElement('h3'));
        title.innerHTML = 'Settings';
        // session title
        const sessionTitle = wrapper.appendChild(document.createElement('h4'));
        sessionTitle.setAttribute('id', 'timer-settings');
        sessionTitle.innerHTML = 'Session Length (minutes)';
        // session div
        const session = wrapper.appendChild(document.createElement('div'));
        session.setAttribute('id', 'session');
        // append input forms
        const pomoWrapper = session.appendChild(document.createElement('div'));
        pomoWrapper.setAttribute('class', 'session-inputs');
        const pomoLabel = pomoWrapper.appendChild(document.createElement('label'));
        pomoLabel.setAttribute('for', 'pomo');
        pomoLabel.innerHTML = 'Pomodoro';
        const pomoInput = pomoWrapper.appendChild(document.createElement('input'));
        pomoInput.setAttribute('type', 'number');
        pomoInput.setAttribute('id', 'pomo-length-input');
        pomoInput.setAttribute('value', parseInt(localStorage.getItem('pomo-length'), 10));
        pomoInput.setAttribute('min', 1); // values subj. to change
        pomoInput.setAttribute('max', 60); // values subj. to change
        pomoInput.setAttribute('oninput', "validity.valid||(value='');");
        const shortBreakWrapper = session.appendChild(document.createElement('div'));
        shortBreakWrapper.setAttribute('class', 'session-inputs');
        const shortBreakLabel = shortBreakWrapper.appendChild(document.createElement('label'));
        shortBreakLabel.setAttribute('for', 'short-break');
        shortBreakLabel.innerHTML = 'Short Break';
        const shortBreakInput = shortBreakWrapper.appendChild(document.createElement('input'));
        shortBreakInput.setAttribute('type', 'number');
        shortBreakInput.setAttribute('id', 'short-break-input');
        shortBreakInput.setAttribute('value', parseInt(localStorage.getItem('short-break-length'), 10));
        shortBreakInput.setAttribute('min', 1); // values subj. to change
        shortBreakInput.setAttribute('max', 60); // values subj. to change
        shortBreakInput.setAttribute('oninput', "validity.valid||(value='');");
        const longBreakWrapper = session.appendChild(document.createElement('div'));
        longBreakWrapper.setAttribute('class', 'session-inputs');
        const longBreakLabel = longBreakWrapper.appendChild(document.createElement('label'));
        longBreakLabel.setAttribute('for', 'long-break');
        longBreakLabel.innerHTML = 'Long Break';
        const longBreakInput = longBreakWrapper.appendChild(document.createElement('input'));
        longBreakInput.setAttribute('type', 'number');
        longBreakInput.setAttribute('id', 'long-break-input');
        longBreakInput.setAttribute('value', parseInt(localStorage.getItem('long-break-length'), 10));
        longBreakInput.setAttribute('min', 1); // values subj. to change
        longBreakInput.setAttribute('max', 60); // values subj. to change
        longBreakInput.setAttribute('oninput', "validity.valid||(value='');");
        // separate div for dark mode setting
        const darkModeDiv = wrapper.appendChild(document.createElement('div'));
        darkModeDiv.setAttribute('id', 'dark-mode');
        const darkModeTitle = darkModeDiv.appendChild(document.createElement('h4'));
        darkModeTitle.setAttribute('id', 'enable-dark-mode');
        darkModeTitle.innerHTML = 'Enable Dark Mode?';
        const modeSwitch = darkModeDiv.appendChild(document.createElement('label'));
        modeSwitch.setAttribute('class', 'switch');
        const checkboxInput = modeSwitch.appendChild(document.createElement('input'));
        checkboxInput.setAttribute('type', 'checkbox');
        if (localStorage.getItem('theme') === 'dark') {
            checkboxInput.checked = 'checked';
        }
        const slider = modeSwitch.appendChild(document.createElement('span'));
        slider.setAttribute('class', 'slider');
        // add event listener to toggle dark mode
        slider.addEventListener('click', this.toggleMode.bind(this));
        // separate div for volume
        const volumeDiv = wrapper.appendChild(document.createElement('div'));
        volumeDiv.setAttribute('id', 'volume-div');
        const volumeTitle = volumeDiv.appendChild(document.createElement('h4'));
        volumeTitle.setAttribute('id', 'sound-volume');
        volumeTitle.innerHTML = 'Audio Volume';
        const volP = volumeDiv.appendChild(document.createElement('p'));
        const volSpan = volP.appendChild(document.createElement('span'));
        volSpan.setAttribute('id', 'volume-number');
        const sliderDiv = volumeDiv.appendChild(document.createElement('div'));
        sliderDiv.setAttribute('class', 'slider-div');
        const rangeInput = sliderDiv.appendChild(document.createElement('input'));
        rangeInput.setAttribute('type', 'range');
        rangeInput.setAttribute('min', 0);
        rangeInput.setAttribute('max', 100);
        rangeInput.setAttribute('value', parseInt(localStorage.getItem('volume'), 10));
        rangeInput.setAttribute('class', 'vol-slider');
        rangeInput.setAttribute('id', 'range');
        // append confirm btn in footer
        const footer = wrapper.appendChild(document.createElement('div'));
        footer.setAttribute('class', 'button-footer');
        const confirmBtn = footer.appendChild(document.createElement('button'));
        confirmBtn.setAttribute('class', 'settings-popup-btns');
        confirmBtn.setAttribute('id', 'confirm-settings-btn');
        confirmBtn.innerHTML = 'Confirm';
        // event listeners for confirm btn and close icon
        confirmBtn.addEventListener('click', this.confirmSettings.bind(this));
        close.addEventListener('click', this.closePopUp.bind(this));
        // event listener to set volume in local storage
        rangeInput.addEventListener('change', this.setVolume.bind(this));
        volSpan.innerHTML = rangeInput.value;
        // event listener to dynamically display volume
        rangeInput.addEventListener('input', function onInput() {
            volSpan.innerHTML = this.value;
        });
        // use ::part pseudo-element to style element outside of shadow tree -- for dark mode
        wrapper.setAttribute('part', 'settings-confirm-popup');
        close.setAttribute('part', 'close-icon');
        title.setAttribute('part', 'settings-h3');
        sessionTitle.setAttribute('part', 'timer-settings');
        pomoLabel.setAttribute('part', 'session-labels');
        pomoInput.setAttribute('part', 'length-inputs');
        shortBreakLabel.setAttribute('part', 'session-labels');
        shortBreakInput.setAttribute('part', 'length-inputs');
        longBreakLabel.setAttribute('part', 'session-labels');
        longBreakInput.setAttribute('part', 'length-inputs');
        darkModeTitle.setAttribute('part', 'enable-dark-mode');
        volumeTitle.setAttribute('part', 'sound-volume');
        volSpan.setAttribute('part', 'volume-number');
        rangeInput.setAttribute('part', 'range-slider');
        footer.setAttribute('part', 'btn-footer');
        confirmBtn.setAttribute('part', 'confirm-btn');
        const style = document.createElement('style');
        style.textContent = `
        h4 {
                font-size: 1.15vw;
        }
        p {
                display: flex;
                align-items: center;
                margin: 0;
        }
        #volume-number {
                font-size: 1.09375vw;
                font-family: Arial;
                color: rgb(85, 85, 85);
                margin-left: 1.5625vw;
        }
        .vol-slider {
                background-color: #ccc;
                -webkit-appearance: none;
                appearance: none;
                border-radius: 3.90625vw;
                height: 0.546875vw;
                width: 10.390625vw;
                outline: none;
                cursor: pointer;
                opacity: 0.7;
                -webkit-transition: .1s;
                transition: opacity .1s;
        }
        .vol-slider:hover {
                opacity: 1;
        }
        .vol-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                cursor: pointer;
                width: 1.5625vw;
                height: 1.5625vw;
                border-radius: 50%;
                background: #e6e5e5;
                box-shadow: 0 0 3px 1px rgba(0,0,0,0.2);
        }
        .vol-slider::-moz-range-thumb {
                cursor: pointer;
                width: 1.5625vw;
                height: 1.5625vw;
                border-radius: 50%;
                background: #e6e5e5;
                box-shadow: 0 0 3px 1px rgba(0,0,0,0.2);
        }
        #volume-div {
                justify-content: space-between;
                display: flex;
                width: 85%;
                margin: 1.5625vw auto 0.78125vw auto;
                padding-bottom: 1.5625vw;
        }
        .slider-div {
                position: relative;
                display: inline-flex;
                vertical-align: middle;
                align-items: center;
        }
        #sound-volume {
                color: rgb(85, 85, 85);
                margin: 0;
                font-weight: 500;
                display: flex;
                align-items: center;
        }
        #enable-dark-mode {
                color: rgb(85, 85, 85);
                font-weight: 500;
                margin: 0;
                display: flex;
                align-items: center;
        }
        #dark-mode {
                justify-content: space-between;
                display: flex;
                width: 85%;
                margin: 1.5625vw auto 0.78125vw auto;
                border-bottom: solid 1px #d2d2d2;
                padding-bottom: 1.5625vw;
        }
        .switch {
                position: relative;
                display: inline-flex;
                width: 4.6875vw;
                height: 2.65625vw;
        }
        .switch input[type='checkbox'] { 
                opacity: 0;
                width: 0;
                height: 0;
        }
        .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
                border-radius: 2.65625vw;
        }
        .slider:before {
                position: absolute;
                content: "";
                height: 2.03125vw;
                width: 2.03125vw;
                left: 0.3125vw;
                bottom: 0.3125vw;
                background-color: white;
                -webkit-transition: 0.2s;
                transition: 0.2s;
                border-radius: 50%;
        }
        input[type='checkbox']:checked + .slider {
                background-color: rgb(163 243 67 / 88%);
        }
        input[type='checkbox']:checked + .slider:before {
                -webkit-transform: translateX(2.03125vw);
                -ms-transform: translateX(2.03125vw);
                transform: translateX(2.03125vw);
        }
        #session {
                justify-content: space-between;
                display: flex;
                width: 85%;
                margin: 0.78125vw auto 0.78125vw auto;
                border-bottom: solid 1px #d2d2d2;
                padding-bottom: 1.5625vw;
        }
        label {
                display: block;
                font-size: 0.9375vw;
                color: rgb(85, 85, 85);
                font-weight: 500;
        }
        input[type='number'] {
                font-size: 1.09375vw;
                color: rgb(85, 85, 85);
                border: none;
                border-radius: 0.3125vw;
                background-color: rgb(234 234 234);
                padding: 0.78125vw;
                box-sizing: border-box;
                width: 100%;
                outline: none;
        }
        .button-footer {
                background-color: rgb(234 234 234);
                padding: 1.09375vw 1.5625vw;
                text-align: right;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                border-bottom-left-radius: 0.3125vw;
                border-bottom-right-radius: 0.3125vw;
        }
        #timer-settings {
                color: rgb(85, 85, 85);
                width: 85%;
                font-weight: 500;
                margin: 1.5625vw auto 0.78125vw auto;
        }
        #close-icon {
                width: 1.171875vw;
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
        }
        #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
        }
        #settings-confirm-popup {
                display: none;
                position: fixed;
                width: 29.296875vw;
                height: 30.46875vw;
                border-radius: 0.3125vw;
                top:20%;
                left: 34%;
                z-index: 999;
                background-color: whitesmoke;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                -webkit-animation-name: animatetop; 
                -webkit-animation-duration: 0.3s;
                animation-name: animatetop;
                animation-duration: 0.3s
        }
        @-webkit-keyframes animatetop {
                from {top:-200px; opacity:0} 
                to {top:70; opacity:1}
        }
        @keyframes animatetop {
                from {top:-200px; opacity:0}
                to {top:70; opacity:1}
        }
        #settings-confirm-popup > h3 {
                font-size: 1.6vw;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                padding-bottom: 0.390625vw;
                width: 85%;
                font-weight: 500;
                margin: 1.5625vw auto 0.78125vw auto;
        }
        .settings-popup-btns {
                cursor: pointer;
                border-style: none;
                border-radius: 0.3125vw;
                text-align: center;
                background-color:#f36060;
                color:#fff;
                font-family: 'Quicksand', sans-serif;
                height: 17%;
                width: 27%;
                font-size: 1.25vw;
                font-weight: 500;
                outline: none;
        }
        .settings-popup-btns:hover {
                filter: brightness(105%);
                transform: scale(1.1);
        }
        #confirm-settings-btn {
                padding: 0.625vw 0.9375vw;
        }`;
        shadow.appendChild(wrapper);
        shadow.appendChild(style);
    }
}
customElements.define('settings-popup', SettingsPopUp);

window.addEventListener('load', () => {
    const settingsButton = document.getElementById('setting-button');
    const settingsPopUp = document.createElement('settings-popup');
    settingsPopUp.setAttribute('class', 'popup');
    document.body.appendChild(settingsPopUp);
    settingsButton.addEventListener('click', () => {
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        btnSound.play();
        // make sure all popups are closed before opening another one
        const popups = Array.from(document.getElementsByClassName('popup'));
        for (let i = 0; i < popups.length; i += 1) {
            popups[i].closePopUp();
        }
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:block');
    });
});

// module.exports = SettingsPopUp;
