import { addTemplates, dispatchDOMLoadedEvent } from './utils';
import {
    TASK_POPUP_TEMPLATE,
    SETTINGS_POPUP_TEMPLATE,
    RESET_POPUP_TEMPLATE,
    HELP_POPUP_TEMPLATE,
    TASK_ITEM_TEMPLATE,
} from './Constants';

import '../src/components/TaskItem';

beforeAll(() => {
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
});

beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('volume', 50);
});

afterEach(() => {
    jest.resetModules();
    jest.clearAllTimers();
});

test('start timer function', () => {
    document.head.innerHTML = `
        <title id="tab-label">Pomodoro Timer</title>
    `;
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <div id="timer-display" class="timer-value">
            <div id="timer-display-duration">25:00</div>
        </div>
        <button id = "pomo-btn"> Pomo</button>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer-display-duration');

    startButton.click();

    jest.advanceTimersByTime(5000);

    expect(startButton.innerHTML).toBe('Stop');
    expect(display.innerHTML).toBe('24:55');
});

test('Stop and reset function', () => {
    document.head.innerHTML = `
        <title id="tab-label">Pomodoro Timer</title>
    `;
    document.body.innerHTML = `
        <button id = "start-btn">Stop</button>
        <button id="pomo-btn"> Pomo</button>
        <button id="break-btn"> Break</button>
        <button id = "pomo-btn"> Pomo</button>
        <div id="timer-display" class="timer-value">
            <div id="timer-display-duration">13:00</div>
        </div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer-display-duration');

    startButton.click();
    jest.advanceTimersByTime(100);

    expect(startButton.innerHTML).toBe('Start');
    expect(display.innerHTML).toBe('25:00');
});

test('advance in time', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <button id = "pomo-btn"> Pomo</button>
        <div id="timer-display" class="timer-value">
            <div id="timer-display-duration">25:00</div>
        </div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer-display-duration');

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
        <div id="timer-display" class="timer-value">
            <div id="timer-display-duration">25:00</div>
        </div>
        <button id="pomo-btn"> Pomo</button>
        <button id="break-btn"> Break</button>
    `;
    require('../src/scripts/Timer');
    localStorage.setItem('stop', 'true');
    jest.advanceTimersByTime(1000);
    expect(localStorage.getItem('stop')).toBe('false');
});

describe(('update tab label'), () => {
    beforeEach(() => {
        jest.useFakeTimers();
        localStorage.setItem('pomo-length', '3');
        localStorage.setItem('short-break-length', '1');
        localStorage.setItem('long-break-length', '2');
        localStorage.setItem('tab-label', 'on');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllTimers();
        localStorage.clear();
    });

    test('reset to text when timer is stopped', () => {
        document.head.innerHTML = `
            <title id="tab-label">13:00 - Time to Focus!</title>
        `;
        document.body.innerHTML = `
            <button id = "start-btn">Stop</button>
            <button id="pomo-btn"> Pomo</button>
            <button id="break-btn"> Break</button>
            <button id = "pomo-btn"> Pomo</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">13:00</div>
            </div>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const tabLabel = document.getElementById('tab-label');

        startButton.click();
        jest.advanceTimersByTime(100);

        expect(startButton.innerHTML).toBe('Start');
        expect(tabLabel.innerHTML).toBe('Pomodoro Timer');
    });

    test('tab label shows correct time', () => {
        document.head.innerHTML = `
            <title id="tab-label">Pomodoro Timer</title>
        `;
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">3:00</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const tabLabel = document.getElementById('tab-label');

        startButton.click();
        expect(tabLabel.innerHTML).toBe('3:00 - Time to Focus!');
        jest.advanceTimersByTime(59000);
        expect(tabLabel.innerHTML).toBe('2:01 - Time to Focus!');
        jest.advanceTimersByTime(121000);
        expect(tabLabel.innerHTML).toBe('0:00 - Time to Focus!');
    });

    test('tab label shows correct mode', () => {
        document.head.innerHTML = `
            <title id="tab-label">Pomodoro Timer</title>
        `;
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">3:00</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const tabLabel = document.getElementById('tab-label');

        startButton.click();
        expect(tabLabel.innerHTML).toBe('3:00 - Time to Focus!');
        // 0
        jest.advanceTimersByTime(180000);
        // jest.runOnlyPendingTimers();
        jest.advanceTimersByTime(60000);
        expect(tabLabel.innerHTML).toBe('0:00 - Take a break!');
        // 1
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 2
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 3
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        expect(tabLabel.innerHTML).toBe('1:00 - Rest a while!');
    });

    test('shows correct text when setting is disabled', () => {
        document.head.innerHTML = `
            <title id="tab-label">Pomodoro Timer</title>
        `;
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">3:00</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');
        localStorage.setItem('tab-label', 'off');

        const startButton = document.getElementById('start-btn');
        const tabLabel = document.getElementById('tab-label');

        startButton.click();
        expect(tabLabel.innerHTML).toBe('Pomodoro Timer');
        // 0
        jest.advanceTimersByTime(180000);
        jest.runOnlyPendingTimers();
        expect(tabLabel.innerHTML).toBe('Pomodoro Timer');
        jest.advanceTimersByTime(60000);
        // 1
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 2
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 3
        jest.advanceTimersByTime(180000);
        expect(tabLabel.innerHTML).toBe('Pomodoro Timer');
    });
});

describe(('switch mode'), () => {
    beforeEach(() => {
        jest.useFakeTimers();
        localStorage.setItem('pomo-length', '3');
        localStorage.setItem('short-break-length', '1');
        localStorage.setItem('long-break-length', '2');
        localStorage.setItem('tab-label', 'on');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllTimers();
        localStorage.clear();
    });

    test('pomo section ends', async () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">3:00</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer-display-duration');
        const tabLabel = document.getElementById('tab-label');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        pomoButton.setAttribute('class', '');
        breakButton.setAttribute('class', '');

        startButton.click();
        jest.advanceTimersByTime(180000);
        expect(display.innerHTML).toBe('0:00');
        expect(tabLabel.innerHTML).toBe('0:00 - Time to Focus!');
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('0:59');
        expect(tabLabel.innerHTML).toBe('0:59 - Take a break!');

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });

    test('break section ends', async () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">0:01</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer-display-duration');
        const tabLabel = document.getElementById('tab-label');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        pomoButton.setAttribute('class', 'toggle');
        breakButton.setAttribute('class', 'toggle');

        startButton.click();
        jest.advanceTimersByTime(180000);
        expect(display.innerHTML).toBe('0:00');
        expect(tabLabel.innerHTML).toBe('0:00 - Time to Focus!');
        jest.advanceTimersByTime(60000);
        expect(display.innerHTML).toBe('0:00');
        expect(tabLabel.innerHTML).toBe('0:00 - Take a break!');
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('2:59');
        expect(tabLabel.innerHTML).toBe('2:59 - Time to Focus!');

        expect(pomoButton.classList).not.toContain('toggle');
        expect(breakButton.classList).not.toContain('toggle');
    });

    test('switch to long break when class is not toggle', () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">0:01</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer-display-duration');
        const tabLabel = document.getElementById('tab-label');
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
        expect(tabLabel.innerHTML).toBe('1:59 - Rest a while!');

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });

    test('switch to long break when class is toggle', () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">0:01</div>
            </div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer-display-duration');
        const tabLabel = document.getElementById('tab-label');
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
        expect(tabLabel.innerHTML).toBe('1:59 - Rest a while!');

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });
});

describe(('keyboard input'), () => {
    let templates;
    let genericPageTemplate;
    beforeAll(async () => {
        templates = await addTemplates([
            TASK_POPUP_TEMPLATE, SETTINGS_POPUP_TEMPLATE, RESET_POPUP_TEMPLATE,
            HELP_POPUP_TEMPLATE, TASK_ITEM_TEMPLATE,
        ], __dirname);

        document.head.innerHTML = '<title id="tab-label"></title>';

        genericPageTemplate = `
            ${templates}
            <ul id="task-list-elements">
            </ul>
            <nav id="header-buttons">
                <button class='top-buttons' id='focus-button'>
                    <img src="icons/half-moon.svg" id="focus" class="top-button-img" alt="focus">
                </button>  
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
            </nav>
            <div id="popup-button">
                <button id="task-popup-btn"> <img src="../icons/plus.svg" id="plus"></button>
            </div>
            <div id="pomodoro-timer">
                <button id="pomo-btn"> Pomo</button>
                <button id="break-btn"> Break</button>
                <div id='focus-task'>
                    <h2 id='select-focus'></h2>
                </div>
                <button id = "start-btn">Start</button>
                <div id="timer-display" class="timer-value">
                    <div id="timer-display-duration">25:00</div>
                </div>
            </div>
            <div id="task-list">
                <h2 id="up-next">Up Next</h2>
                <ul id="task-list-elements">
                </ul>
            </div>
            <button id="completed" data-selected="false">Up Next</button>
        `;

        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
        });

        require('../src/components/ResetPopUp');
        require('../src/components/SettingsPopUp');
        require('../src/components/TaskPopUp');
        require('../src/components/HelpPopUp');
    });

    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = genericPageTemplate;
        localStorage.setItem('volume', '50');
        localStorage.setItem('prevVolume', '50');
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

    test(('key press space starts the timer'), () => {
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

        dispatchDOMLoadedEvent(window);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Space';
        document.body.dispatchEvent(eventObj);

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer-display-duration');

        jest.advanceTimersByTime(5000);

        expect(startButton.innerHTML).toBe('Stop');
        expect(display.innerHTML).toBe('24:55');
    });

    test(('key press space stops the timer'), () => {
        document.body.innerHTML = `
            ${templates}
            <button id = "start-btn">Stop</button>
            <div id="timer-display" class="timer-value">
                <div id="timer-display-duration">25:00</div>
            </div>
            <ul id="task-list-elements">
            </ul>
            <button class="top-buttons" id="focus-button">
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

        dispatchDOMLoadedEvent(window);

        const eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');
        if (eventObj.initEvent) {
            eventObj.initEvent('keyup', true, true);
        }
        eventObj.code = 'Space';
        document.body.dispatchEvent(eventObj);

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer-display-duration');

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
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        dispatchDOMLoadedEvent(window);

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
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        dispatchDOMLoadedEvent(window);

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
        settingsPopUp.shadowRoot.getElementById('settings-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(settingsPopUp);
        const resetPopUp = document.createElement('reset-popup');
        resetPopUp.shadowRoot.getElementById('reset-confirm-popup').setAttribute('style', 'display:none');
        document.body.appendChild(resetPopUp);
        const helpPopUp = document.createElement('help-popup');
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:none');
        document.body.appendChild(helpPopUp);

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
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

        dispatchDOMLoadedEvent(window);

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
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
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

        dispatchDOMLoadedEvent(window);

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
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
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

        dispatchDOMLoadedEvent(window);

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
        taskPopUp.shadowRoot.getElementById('add-task-popup').setAttribute('style', 'display:none');
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

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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

        dispatchDOMLoadedEvent(window);

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
