/**
 * @file Main timer logic. Controls the DOM and hotkeys.
 * @module Timer.js
 */

const startButton = document.getElementById('start-btn');
const timerDisplayDuration = document.getElementById('timer-display-duration');
const timerBackground = document.getElementById('timer-display');
const btnSound = new Audio('./icons/btnClick.mp3');
const alarmSound = new Audio('./icons/alarm.mp3');
const timerWorkerFile = 'scripts/Timer.worker.js';
const SECOND = 1000;

/**
 * @type {(Worker|intervalID)}
 */
let timer;

/**
 * Current phase of the timer
 * @type {('pomo'|'break')}
 * @default
 */
let timerStatus = 'pomo';

/**
 * Tab label corresponding to the current timer phase
 * @type {('Rest a while!'|'Take a break!'|'Time to Focus!')}
 * @default
 */
let tabLabelStatus = 'Time to Focus!';

/**
 * Current break in the pomo cycle
 * @type {(0|1|2|3)}
 * @default
 */
let breakCounter = 0;

// assign default session lengths to local storage

/** @type {number} */
let pomoTime = localStorage.getItem('pomo-length');
if (pomoTime === null) {
    localStorage.setItem('pomo-length', '25');
    pomoTime = 25;
}

/** @type {number} */
let breakTime = localStorage.getItem('short-break-length');
if (breakTime === null) {
    localStorage.setItem('short-break-length', '5');
    breakTime = 5;
}

/** @type {number} */
let longBreakTime = localStorage.getItem('long-break-length');
if (longBreakTime === null) {
    localStorage.setItem('long-break-length', '15');
    longBreakTime = 15;
}

timerDisplayDuration.textContent = `${pomoTime}:00`;

/**
 * Used by switchmode() to switch highlighted button on UI from pomo to break mode.
 * @param {HTMLButtonElement} pomoButton
 * @param {HTMLButtonElement} breakButton
 */
function togglePomoButtonOff(pomoButton, breakButton) {
    pomoButton.classList.add('toggle');
    breakButton.classList.add('toggle');
}

/**
 * Used by switchmode() to switch highlighted button on UI from break to pomo mode.
 * @param {HTMLButtonElement} pomoButton
 * @param {HTMLButtonElement} breakButton
 */
function togglePomoButtonOn(pomoButton, breakButton) {
    pomoButton.classList.remove('toggle');
    breakButton.classList.remove('toggle');
}

/**
 * Updates tab label with the remaining time if the setting is enabled.
 * Also used to reset tab label back to normal.
 * @param {(string|null)} tabLabelTime - String adds time to tab label.
 *     null resets tab label to default.
 */
function updateTabLabel(tabLabelTime) {
    const tabLabel = document.getElementById('tab-label');
    if (tabLabelTime === null) {
        tabLabel.textContent = 'Pomodoro Timer';
    } else if (localStorage.getItem('tab-label') === 'on') {
        tabLabel.textContent = `${tabLabelTime} - ${tabLabelStatus}`;
    }
}

/**
 * Switches between pomo and break time mode. After three short breaks, the next
 * break will be a long break.
 */
function switchMode() {
    const pomoButton = document.getElementById('pomo-btn');
    const breakButton = document.getElementById('break-btn');

    timerBackground.style.transitionDelay = null;
    timerBackground.classList.remove('work', 'break');

    // Length in minutes of the next phase
    let newTime;

    if (timerStatus === 'pomo') {
        togglePomoButtonOff(pomoButton, breakButton);
        timerStatus = 'break';
        // If we had three short breaks, have a long break
        if (breakCounter >= 3) {
            tabLabelStatus = 'Rest a while!';
            newTime = longBreakTime;
            breakCounter = 0;
            timerBackground.style.transitionDuration = `${longBreakTime * 60}s`;
        } else {
            tabLabelStatus = 'Take a break!';
            newTime = breakTime;
            breakCounter += 1;
            timerBackground.style.transitionDuration = `${breakTime * 60}s`;
        }
        timerBackground.classList.add('break');
    } else {
        newTime = pomoTime;
        togglePomoButtonOn(pomoButton, breakButton);
        tabLabelStatus = 'Time to Focus!';
        timerBackground.style.transitionDuration = `${pomoTime * 60}s`;
        timerStatus = 'pomo';
        timerBackground.classList.add('work');
    }

    if (typeof Worker !== 'undefined') {
        // If timer is set to undefined as a guard, then it will not post the
        // message and restart the timer
        timer?.postMessage(newTime);
    } else {
        newTime = `${newTime}:00`;
        timerDisplayDuration.textContent = newTime;
        updateTabLabel(newTime);
    }
}

/**
 * Keep track of focus tasks and check if all tasks are complete.
 */
function toggleState() {
    // elements -- popup button, task list div, pomodoro timer div, focus task
    const taskListDiv = document.getElementById('task-list');
    const pomoDiv = document.getElementById('pomodoro-timer');
    const focusTask = document.getElementById('focus-task');
    const button = document.getElementById('header-buttons');
    taskListDiv.classList.toggle('state');
    pomoDiv.classList.toggle('state');
    focusTask.classList.toggle('state');
    button.classList.toggle('state');

    if (localStorage.getItem('state') === 'default') {
        localStorage.setItem('state', 'focus');
    } else {
        localStorage.setItem('state', 'default');
        const title = document.getElementById('select-focus');
        if (title.innerHTML === 'All tasks complete!') {
            title.innerHTML = '';
        }
    }
}

/**
 * Updates the transition on tab refocus to prevent transition desync.
 * @listens document#visibilitychange
 */
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
        return;
    }

    const currentTimeStr = timerBackground.textContent;

    let actualDuration;
    if (timerStatus === 'pomo') {
        actualDuration = pomoTime;
    } else if (timerStatus === 'break' && breakCounter !== 0) { // short break
        actualDuration = breakTime;
    } else { // long break
        actualDuration = longBreakTime;
    }
    actualDuration *= 60;

    const [currentTimeMinutes, currentTimeSeconds] = currentTimeStr.split(':');
    const currentTime = parseInt(currentTimeMinutes, 10) * 60 + parseInt(currentTimeSeconds, 10);
    const elapsedTime = actualDuration - currentTime;
    const elapsedPercentage = elapsedTime / actualDuration;

    timerBackground.style.transitionDelay = '0s';
    timerBackground.style.transitionDuration = '0s';
    if (timerStatus === 'pomo') {
        timerBackground.style.backgroundSize = `100% calc(${100 - (elapsedPercentage * 100)}% + 5vh)`;
    } else {
        timerBackground.style.backgroundSize = `100% calc(${elapsedPercentage * 100}% + 5vh)`;
    }
    // Trigger dom reflow to ensure that that backgroundSize gets set
    void timerBackground.offsetWidth; // eslint-disable-line no-void

    timerBackground.style.backgroundSize = null;
    timerBackground.style.transitionDuration = `${currentTime}s`;
});

/**
 * Timer function ran for each tick (one second) to update DOM. Fallback when
 * workers are unavailable.
 */
async function timerFunction() {
    let timerText = timerDisplayDuration.innerHTML;

    if (timerText === '0:00') {
        switchMode();
        timerText = timerDisplayDuration.innerHTML;
    }

    if (timerText === '0:01') {
        alarmSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('alarmState') === 'on') {
            alarmSound.play(); // only plays sound when enabled
        }
    }

    let minutes = parseInt(timerDisplayDuration.innerHTML.split(':')[0], 10);
    let seconds = parseInt(timerDisplayDuration.innerHTML.split(':')[1], 10);

    if (seconds !== 0) {
        seconds -= 1;
    } else {
        seconds = 59;
        minutes -= 1;
    }

    const newTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    timerDisplayDuration.textContent = newTime;
    updateTabLabel(newTime);
}

/**
 * Creates a webworker to manage the timer function to reduce drift.
 * @returns {Worker} - Webworker managing the timer function and ticks.
 */
function createTimerWorker() {
    const worker = new Worker(timerWorkerFile);

    worker.addEventListener('message', (event) => {
        const { remainingTime, timerString } = event.data;
        if (remainingTime === -1) {
            switchMode();
        } else if (remainingTime === 0) {
            alarmSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
            if (localStorage.getItem('alarmState') === 'on') {
                alarmSound.play(); // only plays sound when enabled
            }
        }

        timerDisplayDuration.textContent = timerString;
        updateTabLabel(timerString);
    });
    return worker;
}

// Used to prevent get request every time the start button is clicked
const timerWorker = (typeof Worker !== 'undefined' ? createTimerWorker() : undefined);

/**
 * Begins the timer and automatically assigns timer type based on webworker support.
 */
async function start() {
    // automatically get into focus mode when timer is running
    if (localStorage.getItem('state') === 'default') {
        toggleState();
    }

    if (typeof Worker !== 'undefined') {
        timer = timerWorker;
        timer.postMessage(pomoTime);
        // Only shown if the webworker takes a while to load
        const beginTimeout = setTimeout(() => {
            startButton.textContent = 'Beginning...';
        }, 50);
        // Hacky way to prevent timer animations from starting when worker is not ready
        await new Promise((resolve) => {
            timer.addEventListener('message', function waitUntilReady(event) {
                timer.removeEventListener('message', waitUntilReady);
                resolve(event.data);
            });
        });
        clearTimeout(beginTimeout);
    } else {
        updateTabLabel(`${pomoTime}:00`);
        timer = setInterval(timerFunction, SECOND);
    }
    timerBackground.setAttribute('data-started', '');
    timerBackground.style.transitionDuration = `${pomoTime * 60}s`;
    timerBackground.classList.add('work');
    startButton.textContent = 'Stop';
}

/**
 * Stops the timer and updates the DOM to the default "waiting" state.
 */
async function stop() {
    pomoTime = localStorage.getItem('pomo-length');
    breakTime = localStorage.getItem('short-break-length');
    longBreakTime = localStorage.getItem('long-break-length');

    if (localStorage.getItem('state') === 'focus') {
        toggleState();
    }

    timerStatus = 'break';
    if (typeof Worker !== 'undefined') {
        timer?.postMessage('stop');
        // We don't terminate here to prevent needing to remake the worker
    } else {
        clearInterval(timer);
    }
    timer = undefined;
    switchMode();
    updateTabLabel(null);
    breakCounter = 0;
    startButton.textContent = 'Start';
    timerDisplayDuration.textContent = `${pomoTime}:00`;
    timerBackground.removeAttribute('data-started');
    timerBackground.transitionDelay = null;
    timerBackground.classList.remove('work', 'break');
}

/**
 * The function to check if the status stop
 */
async function stopChecker() {
    if (localStorage.getItem('stop') === 'true') {
        stop();
        localStorage.setItem('stop', 'false');
    }
}

/**
 * Start or stops the timer when the button is clicked.
 * @listens HTMLButtonElement#click
 */
startButton.addEventListener('click', () => {
    btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
    if (localStorage.getItem('clickState') === 'on') {
        btnSound.play(); // only plays sound when enabled
    }
    if (startButton.innerHTML === 'Start') {
        start();
    } else {
        stop();
    }
});

// Respond to user feedback in 50ms or less.
setInterval(stopChecker, 50);

/**
 * Disable space keydown.
 * @listens window#keydown
 */
window.addEventListener('keydown', (event) => {
    const addDis = document.querySelector('task-popup')?.shadowRoot.getElementById('add-task-popup').style.display;
    if (event.code === 'Space' && (!addDis || addDis === 'none')) {
        event.preventDefault();
    }
});

/**
 * Keyboard event shortcuts.
 * @listens window#keyup
 * @param {KeyboardEvent} event - Keyboard event and shortcuts
 */
window.addEventListener('keyup', (event) => {
    const addDis = document.querySelector('task-popup')?.shadowRoot.getElementById('add-task-popup').style.display;
    const setDis = document.querySelector('settings-popup')?.shadowRoot.getElementById('settings-confirm-popup').style.display;
    const resDis = document.querySelector('reset-popup')?.shadowRoot.getElementById('reset-confirm-popup').style.display;
    const helpDis = document.querySelector('help-popup')?.shadowRoot.getElementById('help-popup').style.display;
    if (!addDis || addDis === 'none') {
        switch (event.code) {
        case 'KeyF':
            btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
            if (localStorage.getItem('clickState') === 'on') {
                btnSound.play(); // only plays sound when enabled
            }
            document.getElementById('focus-button').click();
            break;
        case 'Space':
            startButton.click();
            break;
        case 'KeyR':
            document.getElementById('reset-button').click();
            break;
        case 'KeyH':
            document.getElementById('help-button').click();
            break;
        case 'Semicolon':
            document.getElementById('setting-button').click();
            break;
        case 'Escape':
            if (setDis === 'block') {
                document.querySelector('body > settings-popup').shadowRoot.querySelector('#close-icon').click();
            } else if (resDis === 'block') {
                document.querySelector('body > reset-popup').shadowRoot.querySelector('#close-icon').click();
            } else if (helpDis === 'block') {
                document.querySelector('body > help-popup').shadowRoot.querySelector('#close-icon').click();
            }
            break;
        case 'KeyA':
        {
            const state = localStorage.getItem('state');
            if (state === 'default') document.getElementById('task-popup-btn').click();
            break;
        }
        case 'Enter':
            if (setDis === 'block') {
                document.querySelector('body > settings-popup').shadowRoot.querySelector('#confirm-settings-btn').click();
            } else if (resDis === 'block') {
                document.querySelector('body > reset-popup').shadowRoot.querySelector('#confirm-reset-btn').click();
            }
            break;
        default:
            break;
        }
    } else if (addDis === 'block') {
        if (event.code === 'Enter') {
            document.querySelector('body > task-popup').shadowRoot.querySelector('#add-task-btn').click();
        } else if (event.code === 'Escape') {
            document.querySelector('body > task-popup').shadowRoot.querySelector('#close-icon').click();
        }
    }
});
