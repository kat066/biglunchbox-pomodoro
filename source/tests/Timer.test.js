import '../src/components/ResetPopUp';
import '../src/components/SettingsPopUp';
import '../src/components/TaskPopUp';
import '../src/components/TaskItem';
import '../src/components/HelpPopUp';

import { addTemplates, dispatchDOMLoadedEvent } from './utils';
import {
    TASK_POPUP_TEMPLATE, SETTINGS_POPUP_TEMPLATE, RESET_POPUP_TEMPLATE,
    HELP_POPUP_TEMPLATE, TASK_ITEM_TEMPLATE,
} from './Constants';

window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };

beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('volume', 50);
});

afterEach(() => {
    jest.resetModules();
    jest.clearAllTimers();
});

test('start timer function', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <div id="timer_display_duration">25:00</div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer_display_duration');

    startButton.click();

    jest.advanceTimersByTime(5000);

    expect(startButton.innerHTML).toBe('Stop');
    expect(display.innerHTML).toBe('24:55');
});

test('Stop and reset function', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Stop</button>
        <button id="pomo-btn"> Pomo</button>
        <button id="break-btn"> Break</button>
        <div id="timer_display_duration">13:00</div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer_display_duration');

    startButton.click();
    jest.advanceTimersByTime(100);

    expect(startButton.innerHTML).toBe('Start');
    expect(display.innerHTML).toBe('25:00');
});

test('advance in time', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <div id="timer_display_duration">25:00</div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer_display_duration');

    startButton.click();

    // advance by 00:05
    jest.advanceTimersByTime(5000);
    expect(display.innerHTML).toBe('24:55');

    // advance by 00:55
    jest.advanceTimersByTime(55000);
    expect(display.innerHTML).toBe('24:00');

    jest.advanceTimersByTime(1000);
    expect(display.innerHTML).toBe('23:59');

    // advance by 23:00
    jest.advanceTimersByTime(1380000);
    expect(display.innerHTML).toBe('0:59');

    jest.advanceTimersByTime(59000);
    expect(display.innerHTML).toBe('0:00');
});

test('stop() called when localStorage stop value is true', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <div id="timer_display_duration">25:00</div>
        <button id="pomo-btn"> Pomo</button>
        <button id="break-btn"> Break</button>
    `;
    require('../src/scripts/Timer');
    localStorage.setItem('stop', 'true');
    jest.advanceTimersByTime(1000);
    expect(localStorage.getItem('stop')).toBe('false');
});

describe(('switch mode'), () => {
    beforeEach(() => {
        jest.useFakeTimers();
        localStorage.setItem('pomo-length', '3');
        localStorage.setItem('short-break-length', '1');
        localStorage.setItem('long-break-length', '2');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllTimers();
        localStorage.clear();
    });

    test('pomo section ends', async () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">3:00</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        pomoButton.setAttribute('class', '');
        breakButton.setAttribute('class', '');

        startButton.click();
        jest.advanceTimersByTime(180000);
        expect(display.innerHTML).toBe('0:00');
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('0:59');

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });

    test('break section ends', async () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">0:01</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        pomoButton.setAttribute('class', 'toggle');
        breakButton.setAttribute('class', 'toggle');

        startButton.click();
        jest.advanceTimersByTime(180000);
        expect(display.innerHTML).toBe('0:00');
        jest.advanceTimersByTime(60000);
        expect(display.innerHTML).toBe('0:00');
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('2:59');

        expect(pomoButton.classList).not.toContain('toggle');
        expect(breakButton.classList).not.toContain('toggle');
    });

    test('switch to long break when class is not toggle', () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">0:01</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        // pomoButton.setAttribute('class', '');
        // breakButton.setAttribute('class', '');

        startButton.click();
        // 0
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 1
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 2
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);

        pomoButton.setAttribute('class', '');
        breakButton.setAttribute('class', '');

        // 3
        jest.advanceTimersByTime(180000);
        jest.runOnlyPendingTimers();

        expect(display.innerHTML).toBe('1:59');

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });

    test('switch to long break when class is toggle', () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">0:01</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        // pomoButton.setAttribute('class', '');
        // breakButton.setAttribute('class', '');

        startButton.click();
        // 0
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 1
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 2
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 3
        jest.advanceTimersByTime(180000);
        pomoButton.setAttribute('class', 'toggle');
        breakButton.setAttribute('class', 'toggle');
        jest.runOnlyPendingTimers();

        expect(display.innerHTML).toBe('1:59');

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });
});

describe(('keyboard input'), () => {
    // let templates;
    // let genericPageTemplate;
    // beforeAll(async () => {
    //     templates = await addTemplates([
    //         TASK_POPUP_TEMPLATE, SETTINGS_POPUP_TEMPLATE, RESET_POPUP_TEMPLATE,
    //         HELP_POPUP_TEMPLATE, TASK_ITEM_TEMPLATE,
    //     ], __dirname);

    //     genericPageTemplate = `
    //         ${templates}
    //         <ul id="task-list-elements">
    //         </ul>
    //         <button class='top-buttons' id='focus-button'>
    //             <img src="icons/half-moon.svg" id="focus" class="top-button-img" alt="focus">
    //         </button>
    //         <div id="popup-button">
    //             <button id="task-popup-btn"> <img src="../icons/plus.svg" id="plus"></button>
    //         </div>
    //         <button class="top-buttons" id="setting-button">
    //             <img src="../icons/settings.svg" id="gear" class="top-button-img" alt="gear">
    //             <p class="top-button-text">Setting</p>
    //         </button>
    //         <button class="top-buttons" id="reset-button">
    //             <img src="../icons/reset.svg" id="reset" class="top-button-img" alt=git "reset">
    //             <p class="top-button-text">Reset</p>
    //         </button>
    //         <button class="top-buttons" id="help-button">
    //             <img src="icons/help.svg" id="help" class="top-button-img" alt="help">
    //         </button>
    //         <div id="pomodoro-timer">
    //             <button id="pomo-btn"> Pomo</button>
    //             <button id="break-btn"> Break</button>
    //             <div id='focus-task'>
    //                 <h2 id='select-focus'></h2>
    //             </div>
    //             <button id = "start-btn">Start</button>
    //             <div id="timer_display_duration">25:00</div>
    //         </div>
    //         <div id="task-list">
    //             <h2 id="up-next">Up Next</h2>
    //             <ul id="task-list-elements">
    //             </ul>
    //         </div>
    //     `;
    // });

    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = `<template id="help-popup-template">
        <style>
            #accessibility-content li{
                margin-bottom: 0.390625vw;
            }
            #accessibility-content {
                padding: 0;
                margin-left: 1.875vw;
                font-size: 1vw;
            }
            #accessibility {
                font-weight: 500;
                color: rgb(85, 85, 85);
            }
            #features-content li {
                margin-bottom: 0.390625vw;
            }
            #features-content {
                padding: 0;
                margin-left: 1.875vw;
                font-size: 1vw;
            }
            #features {
                font-weight: 500;
                color: rgb(85, 85, 85);
            }
            #how-to-content li {
                margin-bottom: 0.390625vw;
            }
            #how-to-content {
                padding: 0;
                margin-left: 1.875vw;
                font-size: 1vw;
            }
            #how-to {
                font-weight: 500;
                color: rgb(85, 85, 85);
            }
            h4 {
                font-size: 1.15vw;
                color: rgb(85, 85, 85);
                font-weight: 500;
            }
            #help-container {
                width: 85%;
                margin: 0 auto;
                /* height: 80%; */
                height: 28.125vw;
                overflow: auto;
            }
            #close-icon {
                /* width: 15px; */
                width: 1.171875vw;
                /* margin-top: 10px; */
                /* margin-right: 10px; */
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #help-popup {
                display: none;
                position: fixed;
                /* width: 30%; */
                /* width: 52%; */
                width: 51.953125vw;
                /* height: 30%; */
                height: 35.15625vw;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                top:18%;
                /* left: 34%; */
                left: 24%;
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
            #help-popup > h3{
                font-size: 1.6vw;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                /* padding-bottom: 5px; */
                padding-bottom: 0.390625vw;
                width: 85%;
                font-weight: 500;
                /* margin: 20px auto 10px auto; */
                margin: 1.5625vw auto 0.78125vw auto;
            }
        </style>
        <div id="help-popup" part="popup-wrapper">
            <img src="icons/close.svg" id="close-icon" part="close-icon">
            <h3 part="help-h3">Help</h3>
            <div id="help-container">
                <div id="how-to" part="instructions">
                    <h4 part="h4">How to use the Pomodoro Timer</h4>
                    <ol id="how-to-content">
                        <li>Add tasks using the '+' button</li>
                        <li>Set pomodoro and break lengths in the setitngs (or use the default values)</li>
                        <li>Select a task to focus on using the magnifying glass icon</li>
                        <li>Start the timer and be productive!</li>
                        <li>Take a break when the alarm rings</li>
                        <li>Repeats teps 3-5 to satisfaction</li>
                    </ol>
                </div>
                <div id="features" part="features">
                    <h4 part="h4">Features</h4>
                    <ul id="features-content">
                        <li>Dark mode theme for late night work sessions</li>
                        <li>Audio notifications at end of pomodoro sessions</li>
                        <li>Customizable pomodoro and break intervals</li>
                        <li>Ability to focus, mark as completed, and delete tasks</li>
                        <li>Focus mode to eliminate page distractions and allow for greater focus on current task</li>
                    </ul>
                </div>
                <div id="accessibility" part="accessibility">
                    <h4 part="h4">Keyboard Shortcuts</h4>
                    <ul id="accessibility-content">
                        <li>'h' - Help page pop up</li>
                        <li>';' - Settings pop up</li>
                        <li>'r' - Reset pop up</li>
                        <li>'f' - Focus mode</li>
                        <li>'s' - Start/stop</li>
                        <li>'a' - Add task</li>
                        <li>'Enter' - Confirm/Add</li>
                        <li>'Esc' - Cancel/Close</li>
                    </ul>
                </div>
            </div>
        </div>
    </template>
    <template id="settings-popup-template">
        <style>
            button {
                transition: transform .3s ease;
            }
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
                width: 8.390625vw;
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
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #settings-confirm-popup {
                display: none;
                position: fixed;
                width: 29.296875vw;
                height: 36.46875vw;
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
            }
            #sound-options {
                display: flex;
                width: 75%;
                margin: 3vw auto 2vw auto;
            }
    
            #clickState-div {
                width: 55%;
            }
            #alarmState-div {
                flex-grow: 1;
            }
            .text {
                color: rgb(85, 85, 85);
                margin: 0;
                font-size: 1.1vw;
                font-weight: 500;
                display: flex;
                align-items: center;
            }
            #sound-switch {
                flex-grow: 1;
                position: absolute;
                left: 7.6vw;
                display: inline-flex;
                width: 4.6875vw;
                height: 2.65625vw;
            }
            #sound-switch input[type='checkbox'] { 
                opacity: 0;
                width: 0;
                height: 0;
            }
            #alarm-switch {
                flex-grow: 1;
                position: absolute;
                left: 19.8vw;
                display: inline-flex;
                width: 4.6875vw;
                height: 2.65625vw;
            }
            #alarm-switch input[type='checkbox'] { 
                opacity: 0;
                width: 0;
                height: 0;
            }
        </style>
        <!-- Part attributes are set to change the style in a global stylesheet -->
        <div id="settings-confirm-popup" part="settings-confirm-popup">
            <img src="icons/close.svg" id="close-icon" part="close-icon">
            <h3 part="settings-h3">Settings</h3>
            <h4 id="timer-settings" part="timer-settings">Session Length (minutes)</h4>
            <div id="session">
                <div class="session-inputs">
                    <label for="pomo" part="session-labels">Pomodoro</label>
                    <input type="number" id="pomo-length-input" min="1" max="60" part="length-inputs">
                </div>
                <div class="session-inputs">
                    <label for="short-break" part="session-labels">Short Break</label>
                    <input type="number" id="short-break-input" min="1" max="60" part="length-inputs">
                </div>
                <div class="session-inputs">
                    <label for="long-break" part="session-labels">Short Break</label>
                    <input type="number" id="long-break-input" min="1" max="60" part="length-inputs">
                </div>
            </div>
            <div id="dark-mode">
                <h4 id="enable-dark-mode" part="enable-dark-mode">Enable Dark Mode?</h4>
                <label class="switch">
                    <input type="checkbox">
                    <span id="mode-switch-slider" class="slider"></span>
                </label>
            </div>
            <div id="volume-div">
                <h4 id="sound-volume" part="sound-volume">Global Audio Volume</h4>
                <p><span id="volume-number" part="volume-number"></span></p>
                <div class="slider-div">
                    <input type="range" min="0" max="100" class="vol-slider" id="range" part="range-slider">
                </div>
            </div>
            <div id="sound-options">
                <div id="clickState-div">
                    <h4 id="enable-disable-clicksound" class="text" part="enable-disable-clicksound">&nbsp&nbspClick<br/>Sound</h4>
                </div>
                <label id="sound-switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                </label>
                <div id="alarmState-div">
                    <h4 id="enable-disable-alarmsound" class="text" part="enable-disable-alarmsound">Alarm<br/>Sound</h4>
                </div>
                <label id="alarm-switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="button-footer" part="btn-footer">
                <button class="settings-popup-btns" id="confirm-settings-btn" part="confirm-btn">Confirm</button>
            </div>
        </div> 
    </template>
    <template id="reset-popup-template">
        <style>
            button{
                transition: transform .3s ease;
            }
            .button-footer {
                background-color: rgb(234 234 234);
                /* padding: 14px 20px; */
                padding: 1.09375vw 1.5625vw;
                text-align: right;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                /* border-bottom-left-radius: 4px; */
                /* border-bottom-right-radius: 4px; */
                border-bottom-left-radius: 0.3125vw;
                border-bottom-right-radius: 0.3125vw;
            }
            #close-icon {
                /* width: 15px; */
                width: 1.171875vw;
                /* margin-top: 10px; */
                /* margin-right: 10px; */
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #reset-content {
                color: rgb(85, 85, 85);
                width: 85%;
                font-weight: 500;
                font-size: 1.0375vw;
                /* margin: 20px auto 0 auto; */
                margin: 1.5625vw auto 0 auto;
            }
            #reset-confirm-popup {
                display: none;
                position: fixed;
                /* width: 30%; */
                width: 29.296875vw;
                /* height: 30%; */
                height: 15.625vw;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                top:25%;
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
            #reset-confirm-popup > h3{
                font-size: 1.6vw;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                /* padding-bottom: 5px; */
                padding-bottom: 0.390625vw;
                width: 85%;
                font-weight: 500;
                /* margin: 20px auto 10px auto; */
                margin: 1.5625vw auto 0.78125vw auto;
            }
            .reset-popup-btns {
                cursor: pointer;
                border-style: none;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                text-align: center;
                background-color:#f36060;
                color:#fff;
                font-family: 'Quicksand', sans-serif;
                height: 17%;
                width: 27%;
                /* font-size: 1em; */
                font-size: 1.25vw;
                font-weight: 500;
                outline: none;
            }
            .reset-popup-btns:hover {
                filter: brightness(105%);
                transform: scale(1.1);
            }
            #confirm-reset-btn {
                /* padding: 8px 12px; */
                padding: 0.625vw 0.9375vw;
            }
            /* #cancel-reset-btn {
                position: absolute;
                float:right;
                right: 5em;
                bottom: 2em;
            } */
        </style>
        <div id="reset-confirm-popup" part="popup-wrapper">
            <img src="icons/close.svg" alt="" id="close-icon" part="close-icon">
            <h3 part="reset-confirm-h3">Are you sure?</h3>
            <h5 id="reset-content" part="reset-content">This will reset your current pomodoro session and wipe out your jotted tasks!</h5>
            <div class="button-footer" part="btn-footer">
                <button class="reset-popup-btns" id="confirm-reset-btn" part="confirm-btn">Confirm</button>
            </div>
        </div>
    </template>
    <template id="task-item-template">
        <style>
            :host {
                cursor: pointer;
                /* height: 50px; */
                height: 3.90625vw;
                position: relative;
                /* margin-bottom: 10px; */
                /* border-radius: 5px; */
                border-radius: 0.390625vw;
                /* margin-right: 20%; */
                box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
                display: flex;
                align-items: center;
                /* padding-left: 37px; */
                padding-left: 2.890625vw;
                background-color: #f36060;
                color: white;
                /* font-size: medium; */
                font-size: 1.35vw;
                font-weight: 500;
                border-style:none;
                user-select: none;
                margin: 0 auto;
                /* margin-bottom: 10px; */
                margin-bottom: 0.78125vw;
            }
            :host(:hover) {
                box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
            }
            :host([checked = 'true']) {
                background: #f3606060;
                text-decoration: line-through;
                -webkit-text-decoration: line-through;
            }
            :host([checked = 'true']) .check-icon {
                visibility: visible;
            }
            .check-icon {
                position: absolute;
                /* left: 10px; */
                left: 0.78125vw;
                vertical-align: middle;
                /* width: 20px; */
                /* height: 20px; */
                width: 1.5625vw;
                height: 1.5625vw;
                margin: 0;
                visibility: hidden;
            }
            :host(:hover) .delete-icon {
                visibility: visible;
            }
            .delete-icon {
                position: absolute;
                color: #fff;
                /* right: 10px; */
                right: 0.78125vw;
                vertical-align: middle;
                /* width: 20px; */
                /* height: 20px; */
                width: 1.5625vw;
                height: 1.5625vw;
                margin: 0;
                visibility: hidden;
                transition: transform .3s ease;
            }
            .delete-icon:hover {
                transform: scale(1.3);
                filter:brightness(105%)
            }
            :host(:hover) .focus-icon {
                visibility: visible;
            }
            .focus-icon {
                position: absolute;
                color: #fff;
                /* right: 40px; */
                right: 3.125vw;
                vertical-align: middle;
                /* width: 20px; */
                /* height: 20px; */
                width: 1.5625vw;
                height: 1.5625vw;
                margin: 0;
                visibility: hidden;
                transition: transform .3s ease;
            }
            .focus-icon:hover {
                transform: scale(1.3);
                filter:brightness(105%)
            }
        </style>
        <li id="li">
            <img src="icons/check.svg" alt="" part="test" class="check-icon">
            <img src="icons/focus.svg" alt="" title="Focus on this task" class="focus-icon">
            <img src="icons/delete.svg" alt="" title="Delete this task" class="delete-icon">
            <span id="task-text"></span>
        </li>
    </template>
    <template id="task-popup-template">
        <style>
            .button-footer {
                background-color: rgb(234 234 234);
                /* padding: 14px 20px; */
                padding: 1.09375vw 1.5625vw;
                text-align: right;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                /* border-bottom-left-radius: 4px; */
                /* border-bottom-right-radius: 4px; */
                border-bottom-left-radius: 0.3125vw;
                border-bottom-right-radius: 0.3125vw;
            }
            #close-icon {
                /* width: 15px; */
                width: 1.171875vw;
                /* margin-top: 10px; */
                /* margin-right: 10px; */
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #add-task-popup {
                display: none;
                position: fixed;
                /* width: 30%; */
                width: 29.296875vw;
                /* height: 30%; */
                height: 15.625vw;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                top:25%;
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
            #task-input {
                font-family: 'Quicksand', sans-serif;
                font-size: 1.5vw;
                font-weight: 600;
                width: 85%;
                height: 22%;
                background-color: whitesmoke;
                color: rgb(85, 85, 85); 
                border-style: hidden;
                /* border-radius: 5px; */
                border-radius: 0.390625vw;
                outline: none;
                display: block;
                /* margin: 20px auto 0 auto; */
                margin: 1.5625vw auto 0 auto;
                font-weight: 500;
            }
            input[type='text']::placeholder {
                /* color: rgba(85, 85, 85, 0.2); */
                /* color: #A7A7A7; */
                color: #c7c7c75e;
            }
            #add-task-popup > h3{
                font-size: 1.6vw;
                font-weight: 500;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                /* padding-bottom: 5px; */
                padding-bottom: 0.390625vw;
                width: 85%;
                /* margin: 20px auto 10px auto; */
                margin: 1.5625vw auto 0.78125vw auto;
            }
            .popup-btns {
                cursor: pointer;
                border-style: none;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                text-align: center;
                background-color:#f36060;
                color:#fff;
                font-family: 'Quicksand', sans-serif;
                height: 17%;
                width: 20%;
                /* font-size: 1em; */
                font-size: 1.25vw;
                font-weight: 500;
                outline: none;
                transition: transform .3s ease;
            }
            .popup-btns:hover {
                filter: brightness(105%);
                transform: scale(1.1);
            }
            #add-task-btn {
                /* padding: 8px 12px; */
                padding: 0.625vw 0.9375vw;
            }
            #cancel-task-btn {
                position: absolute;
                float:right;
                right: 5em;
                bottom: 2em;
            }
        </style>
        <div id="add-task-popup" part="popup-wrapper">
            <img src="icons/close.svg" alt="" id="close-icon" part="close-icon">
            <h3 part="add-task-h3">Add Task</h3>
            <input type="text" name="" id="task-input" placeholder="What are you working on today?" maxlength="48" spellcheck="false" part="task-input">
            <div class="button-footer" part="btn-footer">
                <button id="add-task-btn" class="popup-btns" part="add-btn">Add</button>
            </div>
        </div>
    </template>
    <ul id="task-list-elements">
    </ul>
    <button class='top-buttons' id='focus-button'>
        <img src="icons/half-moon.svg" id="focus" class="top-button-img" alt="focus">
    </button>
    <div id="popup-button">
        <button id="task-popup-btn"> <img src="../icons/plus.svg" id="plus"></button>
    </div>
    <button class="top-buttons" id="setting-button">
        <img src="../icons/settings.svg" id="gear" class="top-button-img" alt="gear">
        <p class="top-button-text">Setting</p>
    </button>
    <button class="top-buttons" id="reset-button">
        <img src="../icons/reset.svg" id="reset" class="top-button-img" alt=git "reset">
        <p class="top-button-text">Reset</p>
    </button>
    <button class="top-buttons" id="help-button">
        <img src="icons/help.svg" id="help" class="top-button-img" alt="help">
    </button>
    <div id="pomodoro-timer">
        <button id="pomo-btn"> Pomo</button>
        <button id="break-btn"> Break</button>
        <div id='focus-task'>
            <h2 id='select-focus'></h2>
        </div>
        <button id = "start-btn">Start</button>
        <div id="timer_display_duration">25:00</div>
    </div>
    <div id="task-list">
        <h2 id="up-next">Up Next</h2>
        <ul id="task-list-elements">
        </ul>
    </div>
    `
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllTimers();
        localStorage.clear();
    });

    test(('key press F toggles focus mode'), () => {
        require('../src/scripts/Timer');
        require('../src/scripts/FocusMode');
        localStorage.setItem('state', 'default');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        dispatchDOMLoadedEvent(window);

        // !! TODO: Correct way to dispatch keyboard events in jest
        // Replace other event simulations (eg. clicks) with this to prevent
        // requirement of DOMContentLoaded
        document.dispatchEvent(new KeyboardEvent('keyup', {
            code: 'KeyF',
            bubbles: true,
            cancelable: true,
        }));

        expect(localStorage.getItem('state')).toBe('focus');

        document.dispatchEvent(new KeyboardEvent('keyup', {
            code: 'KeyF',
            bubbles: true,
            cancelable: true,
        }));

        expect(localStorage.getItem('state')).toBe('default');
    });

    test(('key press S starts the timer'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyS';
        document.body.dispatchEvent(eventObj);

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');

        jest.advanceTimersByTime(5000);

        expect(startButton.innerHTML).toBe('Stop');
        expect(display.innerHTML).toBe('24:55');
    });

    test(('key press S stops the timer'), () => {
        document.body.innerHTML = `
        <template id="help-popup-template">
        <style>
            #accessibility-content li{
                margin-bottom: 0.390625vw;
            }
            #accessibility-content {
                padding: 0;
                margin-left: 1.875vw;
                font-size: 1vw;
            }
            #accessibility {
                font-weight: 500;
                color: rgb(85, 85, 85);
            }
            #features-content li {
                margin-bottom: 0.390625vw;
            }
            #features-content {
                padding: 0;
                margin-left: 1.875vw;
                font-size: 1vw;
            }
            #features {
                font-weight: 500;
                color: rgb(85, 85, 85);
            }
            #how-to-content li {
                margin-bottom: 0.390625vw;
            }
            #how-to-content {
                padding: 0;
                margin-left: 1.875vw;
                font-size: 1vw;
            }
            #how-to {
                font-weight: 500;
                color: rgb(85, 85, 85);
            }
            h4 {
                font-size: 1.15vw;
                color: rgb(85, 85, 85);
                font-weight: 500;
            }
            #help-container {
                width: 85%;
                margin: 0 auto;
                /* height: 80%; */
                height: 28.125vw;
                overflow: auto;
            }
            #close-icon {
                /* width: 15px; */
                width: 1.171875vw;
                /* margin-top: 10px; */
                /* margin-right: 10px; */
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #help-popup {
                display: none;
                position: fixed;
                /* width: 30%; */
                /* width: 52%; */
                width: 51.953125vw;
                /* height: 30%; */
                height: 35.15625vw;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                top:18%;
                /* left: 34%; */
                left: 24%;
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
            #help-popup > h3{
                font-size: 1.6vw;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                /* padding-bottom: 5px; */
                padding-bottom: 0.390625vw;
                width: 85%;
                font-weight: 500;
                /* margin: 20px auto 10px auto; */
                margin: 1.5625vw auto 0.78125vw auto;
            }
        </style>
        <div id="help-popup" part="popup-wrapper">
            <img src="icons/close.svg" id="close-icon" part="close-icon">
            <h3 part="help-h3">Help</h3>
            <div id="help-container">
                <div id="how-to" part="instructions">
                    <h4 part="h4">How to use the Pomodoro Timer</h4>
                    <ol id="how-to-content">
                        <li>Add tasks using the '+' button</li>
                        <li>Set pomodoro and break lengths in the setitngs (or use the default values)</li>
                        <li>Select a task to focus on using the magnifying glass icon</li>
                        <li>Start the timer and be productive!</li>
                        <li>Take a break when the alarm rings</li>
                        <li>Repeats teps 3-5 to satisfaction</li>
                    </ol>
                </div>
                <div id="features" part="features">
                    <h4 part="h4">Features</h4>
                    <ul id="features-content">
                        <li>Dark mode theme for late night work sessions</li>
                        <li>Audio notifications at end of pomodoro sessions</li>
                        <li>Customizable pomodoro and break intervals</li>
                        <li>Ability to focus, mark as completed, and delete tasks</li>
                        <li>Focus mode to eliminate page distractions and allow for greater focus on current task</li>
                    </ul>
                </div>
                <div id="accessibility" part="accessibility">
                    <h4 part="h4">Keyboard Shortcuts</h4>
                    <ul id="accessibility-content">
                        <li>'h' - Help page pop up</li>
                        <li>';' - Settings pop up</li>
                        <li>'r' - Reset pop up</li>
                        <li>'f' - Focus mode</li>
                        <li>'s' - Start/stop</li>
                        <li>'a' - Add task</li>
                        <li>'Enter' - Confirm/Add</li>
                        <li>'Esc' - Cancel/Close</li>
                    </ul>
                </div>
            </div>
        </div>
    </template>
    <template id="settings-popup-template">
        <style>
            button {
                transition: transform .3s ease;
            }
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
                width: 8.390625vw;
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
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #settings-confirm-popup {
                display: none;
                position: fixed;
                width: 29.296875vw;
                height: 36.46875vw;
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
            }
            #sound-options {
                display: flex;
                width: 75%;
                margin: 3vw auto 2vw auto;
            }
    
            #clickState-div {
                width: 55%;
            }
            #alarmState-div {
                flex-grow: 1;
            }
            .text {
                color: rgb(85, 85, 85);
                margin: 0;
                font-size: 1.1vw;
                font-weight: 500;
                display: flex;
                align-items: center;
            }
            #sound-switch {
                flex-grow: 1;
                position: absolute;
                left: 7.6vw;
                display: inline-flex;
                width: 4.6875vw;
                height: 2.65625vw;
            }
            #sound-switch input[type='checkbox'] { 
                opacity: 0;
                width: 0;
                height: 0;
            }
            #alarm-switch {
                flex-grow: 1;
                position: absolute;
                left: 19.8vw;
                display: inline-flex;
                width: 4.6875vw;
                height: 2.65625vw;
            }
            #alarm-switch input[type='checkbox'] { 
                opacity: 0;
                width: 0;
                height: 0;
            }
        </style>
        <!-- Part attributes are set to change the style in a global stylesheet -->
        <div id="settings-confirm-popup" part="settings-confirm-popup">
            <img src="icons/close.svg" id="close-icon" part="close-icon">
            <h3 part="settings-h3">Settings</h3>
            <h4 id="timer-settings" part="timer-settings">Session Length (minutes)</h4>
            <div id="session">
                <div class="session-inputs">
                    <label for="pomo" part="session-labels">Pomodoro</label>
                    <input type="number" id="pomo-length-input" min="1" max="60" part="length-inputs">
                </div>
                <div class="session-inputs">
                    <label for="short-break" part="session-labels">Short Break</label>
                    <input type="number" id="short-break-input" min="1" max="60" part="length-inputs">
                </div>
                <div class="session-inputs">
                    <label for="long-break" part="session-labels">Short Break</label>
                    <input type="number" id="long-break-input" min="1" max="60" part="length-inputs">
                </div>
            </div>
            <div id="dark-mode">
                <h4 id="enable-dark-mode" part="enable-dark-mode">Enable Dark Mode?</h4>
                <label class="switch">
                    <input type="checkbox">
                    <span id="mode-switch-slider" class="slider"></span>
                </label>
            </div>
            <div id="volume-div">
                <h4 id="sound-volume" part="sound-volume">Global Audio Volume</h4>
                <p><span id="volume-number" part="volume-number"></span></p>
                <div class="slider-div">
                    <input type="range" min="0" max="100" class="vol-slider" id="range" part="range-slider">
                </div>
            </div>
            <div id="sound-options">
                <div id="clickState-div">
                    <h4 id="enable-disable-clicksound" class="text" part="enable-disable-clicksound">&nbsp&nbspClick<br/>Sound</h4>
                </div>
                <label id="sound-switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                </label>
                <div id="alarmState-div">
                    <h4 id="enable-disable-alarmsound" class="text" part="enable-disable-alarmsound">Alarm<br/>Sound</h4>
                </div>
                <label id="alarm-switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="button-footer" part="btn-footer">
                <button class="settings-popup-btns" id="confirm-settings-btn" part="confirm-btn">Confirm</button>
            </div>
        </div> 
    </template>
    <template id="reset-popup-template">
        <style>
            button{
                transition: transform .3s ease;
            }
            .button-footer {
                background-color: rgb(234 234 234);
                /* padding: 14px 20px; */
                padding: 1.09375vw 1.5625vw;
                text-align: right;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                /* border-bottom-left-radius: 4px; */
                /* border-bottom-right-radius: 4px; */
                border-bottom-left-radius: 0.3125vw;
                border-bottom-right-radius: 0.3125vw;
            }
            #close-icon {
                /* width: 15px; */
                width: 1.171875vw;
                /* margin-top: 10px; */
                /* margin-right: 10px; */
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #reset-content {
                color: rgb(85, 85, 85);
                width: 85%;
                font-weight: 500;
                font-size: 1.0375vw;
                /* margin: 20px auto 0 auto; */
                margin: 1.5625vw auto 0 auto;
            }
            #reset-confirm-popup {
                display: none;
                position: fixed;
                /* width: 30%; */
                width: 29.296875vw;
                /* height: 30%; */
                height: 15.625vw;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                top:25%;
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
            #reset-confirm-popup > h3{
                font-size: 1.6vw;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                /* padding-bottom: 5px; */
                padding-bottom: 0.390625vw;
                width: 85%;
                font-weight: 500;
                /* margin: 20px auto 10px auto; */
                margin: 1.5625vw auto 0.78125vw auto;
            }
            .reset-popup-btns {
                cursor: pointer;
                border-style: none;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                text-align: center;
                background-color:#f36060;
                color:#fff;
                font-family: 'Quicksand', sans-serif;
                height: 17%;
                width: 27%;
                /* font-size: 1em; */
                font-size: 1.25vw;
                font-weight: 500;
                outline: none;
            }
            .reset-popup-btns:hover {
                filter: brightness(105%);
                transform: scale(1.1);
            }
            #confirm-reset-btn {
                /* padding: 8px 12px; */
                padding: 0.625vw 0.9375vw;
            }
            /* #cancel-reset-btn {
                position: absolute;
                float:right;
                right: 5em;
                bottom: 2em;
            } */
        </style>
        <div id="reset-confirm-popup" part="popup-wrapper">
            <img src="icons/close.svg" alt="" id="close-icon" part="close-icon">
            <h3 part="reset-confirm-h3">Are you sure?</h3>
            <h5 id="reset-content" part="reset-content">This will reset your current pomodoro session and wipe out your jotted tasks!</h5>
            <div class="button-footer" part="btn-footer">
                <button class="reset-popup-btns" id="confirm-reset-btn" part="confirm-btn">Confirm</button>
            </div>
        </div>
    </template>
    <template id="task-item-template">
        <style>
            :host {
                cursor: pointer;
                /* height: 50px; */
                height: 3.90625vw;
                position: relative;
                /* margin-bottom: 10px; */
                /* border-radius: 5px; */
                border-radius: 0.390625vw;
                /* margin-right: 20%; */
                box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
                display: flex;
                align-items: center;
                /* padding-left: 37px; */
                padding-left: 2.890625vw;
                background-color: #f36060;
                color: white;
                /* font-size: medium; */
                font-size: 1.35vw;
                font-weight: 500;
                border-style:none;
                user-select: none;
                margin: 0 auto;
                /* margin-bottom: 10px; */
                margin-bottom: 0.78125vw;
            }
            :host(:hover) {
                box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
            }
            :host([checked = 'true']) {
                background: #f3606060;
                text-decoration: line-through;
                -webkit-text-decoration: line-through;
            }
            :host([checked = 'true']) .check-icon {
                visibility: visible;
            }
            .check-icon {
                position: absolute;
                /* left: 10px; */
                left: 0.78125vw;
                vertical-align: middle;
                /* width: 20px; */
                /* height: 20px; */
                width: 1.5625vw;
                height: 1.5625vw;
                margin: 0;
                visibility: hidden;
            }
            :host(:hover) .delete-icon {
                visibility: visible;
            }
            .delete-icon {
                position: absolute;
                color: #fff;
                /* right: 10px; */
                right: 0.78125vw;
                vertical-align: middle;
                /* width: 20px; */
                /* height: 20px; */
                width: 1.5625vw;
                height: 1.5625vw;
                margin: 0;
                visibility: hidden;
                transition: transform .3s ease;
            }
            .delete-icon:hover {
                transform: scale(1.3);
                filter:brightness(105%)
            }
            :host(:hover) .focus-icon {
                visibility: visible;
            }
            .focus-icon {
                position: absolute;
                color: #fff;
                /* right: 40px; */
                right: 3.125vw;
                vertical-align: middle;
                /* width: 20px; */
                /* height: 20px; */
                width: 1.5625vw;
                height: 1.5625vw;
                margin: 0;
                visibility: hidden;
                transition: transform .3s ease;
            }
            .focus-icon:hover {
                transform: scale(1.3);
                filter:brightness(105%)
            }
        </style>
        <li id="li">
            <img src="icons/check.svg" alt="" part="test" class="check-icon">
            <img src="icons/focus.svg" alt="" title="Focus on this task" class="focus-icon">
            <img src="icons/delete.svg" alt="" title="Delete this task" class="delete-icon">
            <span id="task-text"></span>
        </li>
    </template>
    <template id="task-popup-template">
        <style>
            .button-footer {
                background-color: rgb(234 234 234);
                /* padding: 14px 20px; */
                padding: 1.09375vw 1.5625vw;
                text-align: right;
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                /* border-bottom-left-radius: 4px; */
                /* border-bottom-right-radius: 4px; */
                border-bottom-left-radius: 0.3125vw;
                border-bottom-right-radius: 0.3125vw;
            }
            #close-icon {
                /* width: 15px; */
                width: 1.171875vw;
                /* margin-top: 10px; */
                /* margin-right: 10px; */
                margin-top: 0.78125vw;
                margin-right: 0.78125vw;
                position:absolute;
                top:0;
                right:0;
                cursor: pointer;
                opacity: 0.33;
                transition: transform .3s ease;
            }
            #close-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            #add-task-popup {
                display: none;
                position: fixed;
                /* width: 30%; */
                width: 29.296875vw;
                /* height: 30%; */
                height: 15.625vw;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                top:25%;
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
            #task-input {
                font-family: 'Quicksand', sans-serif;
                font-size: 1.5vw;
                font-weight: 600;
                width: 85%;
                height: 22%;
                background-color: whitesmoke;
                color: rgb(85, 85, 85); 
                border-style: hidden;
                /* border-radius: 5px; */
                border-radius: 0.390625vw;
                outline: none;
                display: block;
                /* margin: 20px auto 0 auto; */
                margin: 1.5625vw auto 0 auto;
                font-weight: 500;
            }
            input[type='text']::placeholder {
                /* color: rgba(85, 85, 85, 0.2); */
                /* color: #A7A7A7; */
                color: #c7c7c75e;
            }
            #add-task-popup > h3{
                font-size: 1.6vw;
                font-weight: 500;
                color: #f36060;
                border-bottom: solid 1px #d2d2d2;
                /* padding-bottom: 5px; */
                padding-bottom: 0.390625vw;
                width: 85%;
                /* margin: 20px auto 10px auto; */
                margin: 1.5625vw auto 0.78125vw auto;
            }
            .popup-btns {
                cursor: pointer;
                border-style: none;
                /* border-radius: 4px; */
                border-radius: 0.3125vw;
                text-align: center;
                background-color:#f36060;
                color:#fff;
                font-family: 'Quicksand', sans-serif;
                height: 17%;
                width: 20%;
                /* font-size: 1em; */
                font-size: 1.25vw;
                font-weight: 500;
                outline: none;
                transition: transform .3s ease;
            }
            .popup-btns:hover {
                filter: brightness(105%);
                transform: scale(1.1);
            }
            #add-task-btn {
                /* padding: 8px 12px; */
                padding: 0.625vw 0.9375vw;
            }
            #cancel-task-btn {
                position: absolute;
                float:right;
                right: 5em;
                bottom: 2em;
            }
        </style>
        <div id="add-task-popup" part="popup-wrapper">
            <img src="icons/close.svg" alt="" id="close-icon" part="close-icon">
            <h3 part="add-task-h3">Add Task</h3>
            <input type="text" name="" id="task-input" placeholder="What are you working on today?" maxlength="48" spellcheck="false" part="task-input">
            <div class="button-footer" part="btn-footer">
                <button id="add-task-btn" class="popup-btns" part="add-btn">Add</button>
            </div>
        </div>
    </template>
            <button id = "start-btn">Stop</button>
            <div id="timer_display_duration">23:00</div>
            <ul id="task-list-elements">
            </ul>
            <div id="popup-button">
                <button id="task-popup-btn"> <img src="../icons/plus.svg" id="plus"></button>
            </div>
            <button class="top-buttons" id="setting-button">
                <img src="../icons/settings.svg" id="gear" class="top-button-img" alt="gear">
                <p class="top-button-text">Setting</p>
            </button>
            <button class="top-buttons" id="reset-button">
                <img src="../icons/reset.svg" id="reset" class="top-button-img" alt=git "reset">
                <p class="top-button-text">Reset</p>
            </button>
            <button id="pomo-btn"> Pomo</button>
            <button id="break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyS';
        document.body.dispatchEvent(eventObj);

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');

        jest.advanceTimersByTime(5000);

        expect(startButton.innerHTML).toBe('Start');
        expect(display.innerHTML).toBe('25:00');
    });

    test(('key press H opens help pop-up'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyH';
        document.body.dispatchEvent(eventObj);

        const dispaly = getComputedStyle(helpPopUp.shadowRoot.getElementById('help-popup'));
        expect(dispaly.display).toBe('block');
    });

    test(('key press R opens reset pop-up'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyR';
        document.body.dispatchEvent(eventObj);

        const dispaly = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
        expect(dispaly.display).toBe('block');
    });

    test(('key press ; opens setting pop-up'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Semicolon';
        document.body.dispatchEvent(eventObj);

        const display = getComputedStyle(settingsPopUp.shadowRoot.getElementById('settings-confirm-popup'));

        expect(display.display).toBe('block');
    });

    test(('key press A opens add-task pop-up when in default state'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        localStorage.setItem('state', 'default');

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyA';
        document.body.dispatchEvent(eventObj);

        const display = getComputedStyle(taskPopUp.shadowRoot.getElementById('add-task-popup'));

        expect(display.display).toBe('block');
    });

    test(('key press A does not open add-task pop-up when in focus state'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        localStorage.setItem('state', 'focus');

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyA';
        document.body.dispatchEvent(eventObj);

        const display = getComputedStyle(taskPopUp.shadowRoot.getElementById('add-task-popup'));

        expect(display.display).toBe('none');
    });

    test(('key press ESCAPE closes help pop-up correctly'), () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:block');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Escape';

        document.body.dispatchEvent(eventObj);

        expect(helpPopUp.shadowRoot.getElementById('help-popup').style.display).toBe('none');
    });

    test(('key press ENTER confirms reset correctly'), () => {
        const tasks = [];
        const id = 2;
        const taskF = { id: 0, checked: false, text: 'First Item' };
        const taskT = { id: 1, checked: true, text: 'Second Item' };
        tasks.push(taskF);
        tasks.push(taskT);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('id', `${id}`);
        const list = document.getElementById('task-list-elements');
        const taskItemF = document.createElement('task-item');
        taskItemF.setAttribute('id', taskF.id);
        taskItemF.setAttribute('checked', taskF.checked);
        taskItemF.setAttribute('text', taskF.text);
        const taskItemT = document.createElement('task-item');
        taskItemT.setAttribute('id', taskT.id);
        taskItemT.setAttribute('checked', taskT.checked);
        taskItemT.setAttribute('text', taskT.text);
        list.appendChild(taskItemF);
        list.appendChild(taskItemT);

        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:block');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Enter';

        document.body.dispatchEvent(eventObj);

        const dispaly = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));

        expect(dispaly.display).toBe('none');
        expect(localStorage.getItem('id')).toBe('0');
        expect(localStorage.getItem('tasks')).toBe('[]');
    });

    test(('key press ESCAPE exits reset correctly'), () => {
        const tasks = [];
        const id = 2;
        const taskF = { id: 0, checked: false, text: 'First Item' };
        const taskT = { id: 1, checked: true, text: 'Second Item' };
        tasks.push(taskF);
        tasks.push(taskT);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('id', `${id}`);
        const list = document.getElementById('task-list-elements');
        const taskItemF = document.createElement('task-item');
        taskItemF.setAttribute('id', taskF.id);
        taskItemF.setAttribute('checked', taskF.checked);
        taskItemF.setAttribute('text', taskF.text);
        const taskItemT = document.createElement('task-item');
        taskItemT.setAttribute('id', taskT.id);
        taskItemT.setAttribute('checked', taskT.checked);
        taskItemT.setAttribute('text', taskT.text);
        list.appendChild(taskItemF);
        list.appendChild(taskItemT);

        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:block');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Escape';

        document.body.dispatchEvent(eventObj);

        const dispaly = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));

        expect(dispaly.display).toBe('none');
        expect(localStorage.getItem('id')).toBe('2');
        expect(localStorage.getItem('tasks')).toBe('[{"id":0,"checked":false,"text":"First Item"},{"id":1,"checked":true,"text":"Second Item"}]');
    });

    test('Key press ENTER confirms settings correctly', () => {
        localStorage.setItem('volume', 50);
        localStorage.setItem('pomo-length', '25');
        localStorage.setItem('short-break-length', '5');
        localStorage.setItem('long-break-length', '15');

        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:block');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const shadow = settingsPopUp.shadowRoot;
        const pomoLength = shadow.querySelectorAll('input')[0];
        const shortBreakLength = shadow.querySelectorAll('input')[1];
        const longBreakLength = shadow.querySelectorAll('input')[2];

        pomoLength.value = '30';
        shortBreakLength.value = '10';
        longBreakLength.value = '20';

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Enter';

        document.body.dispatchEvent(eventObj);

        expect(localStorage.getItem('pomo-length')).toBe('30');
        expect(localStorage.getItem('short-break-length')).toBe('10');
        expect(localStorage.getItem('long-break-length')).toBe('20');

        // closes pop up
        expect(shadow.getElementById('settings-confirm-popup').style.display).toBe('none');
    });

    test('Key press ESCAPE exits settings correctly', () => {
        localStorage.setItem('volume', 50);
        localStorage.setItem('pomo-length', '25');
        localStorage.setItem('short-break-length', '5');
        localStorage.setItem('long-break-length', '15');

        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:block');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const shadow = settingsPopUp.shadowRoot;
        const pomoLength = shadow.querySelectorAll('input')[0];
        const shortBreakLength = shadow.querySelectorAll('input')[1];
        const longBreakLength = shadow.querySelectorAll('input')[2];

        pomoLength.value = '30';
        shortBreakLength.value = '10';
        longBreakLength.value = '20';

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Escape';

        document.body.dispatchEvent(eventObj);

        expect(localStorage.getItem('pomo-length')).toBe('25');
        expect(localStorage.getItem('short-break-length')).toBe('5');
        expect(localStorage.getItem('long-break-length')).toBe('15');

        expect(shadow.getElementById('settings-confirm-popup').style.display).toBe('none');
    });

    test('Key press ENTER adds a task correctly', () => {
        require('../src/scripts/Timer');

        localStorage.setItem('volume', 50);
        localStorage.setItem('tasks', '[]');
        localStorage.setItem('id', '0');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:block');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        const shadow = taskPopUp.shadowRoot;

        const input = shadow.getElementById('task-input');
        input.value = 'test_task';

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Enter';

        document.body.dispatchEvent(eventObj);

        // new task test_task is added to list of tasks
        expect(localStorage.getItem('tasks')).toBe('[{"id":"0","checked":false,"text":"test_task","focused":false}]');
        // id is updated
        expect(localStorage.getItem('id')).toBe('1');
        // input is set back to empty string
        expect(input.value).toBe('');
    });

    test('Key press ESCAPE exits task pop up correctly', () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:block');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        localStorage.setItem('tasks', '[]');
        localStorage.setItem('id', '0');
        localStorage.setItem('volume', 50);

        const shadow = taskPopUp.shadowRoot;
        const input = shadow.getElementById('task-input');
        input.value = 'test_task';

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Escape';

        document.body.dispatchEvent(eventObj);

        expect(shadow.querySelector('div').style.display).toBe('none');
        expect(shadow.querySelector('input').value).toBe('');
    });

    test('other key presses do nothing when task-popup is closed', () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        localStorage.setItem('tasks', '[]');
        localStorage.setItem('id', '0');
        localStorage.setItem('volume', 50);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyG';

        document.body.dispatchEvent(eventObj);

        const resetPopUpDisplay = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
        const settingsPopUpDisplay = getComputedStyle(settingsPopUp.shadowRoot.getElementById('settings-confirm-popup'));
        const taskPopUpDisplay = getComputedStyle(taskPopUp.shadowRoot.getElementById('add-task-popup'));

        expect(resetPopUpDisplay.display).toBe('none');
        expect(settingsPopUpDisplay.display).toBe('none');
        expect(taskPopUpDisplay.display).toBe('none');
    });

    test('other key presses do nothing when task-popup is open', () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:block');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        localStorage.setItem('tasks', '[]');
        localStorage.setItem('id', '0');
        localStorage.setItem('volume', 50);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyG';

        document.body.dispatchEvent(eventObj);

        const resetPopUpDisplay = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
        const settingsPopUpDisplay = getComputedStyle(settingsPopUp.shadowRoot.getElementById('settings-confirm-popup'));
        const taskPopUpDisplay = getComputedStyle(taskPopUp.shadowRoot.getElementById('add-task-popup'));

        expect(resetPopUpDisplay.display).toBe('none');
        expect(settingsPopUpDisplay.display).toBe('none');
        expect(taskPopUpDisplay.display).toBe('block');
    });

    test('other key presses do nothing when task-popup is undefined', () => {
        require('../src/scripts/Timer');

        const taskPopUp = document.createElement('task-popup');
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:inline');
        document.body.appendChild(taskPopUp);
        const settingsPopUp = document.createElement('settings-popup');
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        localStorage.setItem('tasks', '[]');
        localStorage.setItem('id', '0');
        localStorage.setItem('volume', 50);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'KeyG';

        document.body.dispatchEvent(eventObj);

        const resetPopUpDisplay = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
        const settingsPopUpDisplay = getComputedStyle(settingsPopUp.shadowRoot.getElementById('settings-confirm-popup'));
        const taskPopUpDisplay = getComputedStyle(taskPopUp.shadowRoot.getElementById('add-task-popup'));

        expect(resetPopUpDisplay.display).toBe('none');
        expect(settingsPopUpDisplay.display).toBe('none');
        expect(taskPopUpDisplay.display).toBe('inline');
    });
});
