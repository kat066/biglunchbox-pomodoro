const startButton = document.getElementById('start-btn');
const timerDisplayDuration = document.getElementById('timer-display-duration');
const timerBackground = document.getElementById('timer-display');
const btnSound = new Audio('./icons/btnClick.mp3');
const alarmSound = new Audio('./icons/alarm.mp3');
const timerWorkerFile = '/scripts/Timer.worker.js';
const SECOND = 1000;

let timer;
let timerStatus = 'pomo';
let tabLabelStatus = 'Time to Focus!';
let breakCounter = 0;

// assign default session lengths to local storage
if (localStorage.getItem('pomo-length') === null) {
    localStorage.setItem('pomo-length', '25');
    localStorage.setItem('short-break-length', '5');
    localStorage.setItem('long-break-length', '15');
}
let pomoTime = localStorage.getItem('pomo-length');
let breakTime = localStorage.getItem('short-break-length');
let longBreakTime = localStorage.getItem('long-break-length');

timerDisplayDuration.textContent = `${pomoTime}:00`;

/**
 * This function is used by switchMode() to switch the highlighted button
 * on the UI from pomo to break when switching to break mode.
 */
function togglePomoButtonOff(pomoButton, breakButton) {
    if (pomoButton.getAttribute('class') !== 'toggle') {
        pomoButton.classList.toggle('toggle');
        breakButton.classList.toggle('toggle');
    }
}

/**
 * This function is used by switchMode() to switch the highlighted button
 * on the UI from break to pomo when switching to pomo mode.
 */
function togglePomoButtonOn(pomoButton, breakButton) {
    if (pomoButton.getAttribute('class') === 'toggle') {
        pomoButton.classList.toggle('toggle');
        breakButton.classList.toggle('toggle');
    }
}

/** This function is called to update the tab label with the remaining
 * time, if the Tab Label setting is enabled. It can also be used to
 * set the tab label back to normal text by passing null as the argument.
 */
function updateTabLabel(tabLabelTime) {
    const tabLabel = document.getElementById('tab-label');
    if (tabLabelTime === null) {
        tabLabel.innerHTML = 'Pomodoro Timer';
    } else if (localStorage.getItem('tab-label') === 'on') {
        tabLabel.innerHTML = `${tabLabelTime} - ${tabLabelStatus}`;
    }
}

/**
 * The sitchMode function would sitch the time mode if the pomo time is over.
 * the function would switch short break time mode. After three times of short
 * break time, the function would switch to long break time.
 */
function switchMode() {
    const pomoButton = document.getElementById('pomo-btn');
    const breakButton = document.getElementById('break-btn');

    timerBackground.style.transitionDelay = null;
    timerBackground.classList.remove('work', 'break');
    /**
     * Hacky way to reset animations at the cost of some performance without this,
     * changing between classes is really odd and animations do not get reset
     */
    // eslint-disable-next-line no-void
    // void timerBackground.offsetWidth;

    // Length in minutes of the next phase
    let newTime;

    if (timerStatus === 'pomo') {
        togglePomoButtonOff(pomoButton, breakButton);
        timerStatus = 'break';
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

/** Toggle focus mode: remove task list component and only show the Pomodoro timer */
/** The function is keep track of focus tasks and check if all the
 * tasks are complete.
  */
function toggleState() {
    // elements -- popup button, task list div, pomodoro timer div, focus task
    // const popUpBtn = document.getElementById('popup-button');
    const taskListDiv = document.getElementById('task-list');
    const pomoDiv = document.getElementById('pomodoro-timer');
    const focusTask = document.getElementById('focus-task');
    const button = document.getElementById('header-buttons');
    // popUpBtn.classList.toggle('state');
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
 *
 * @function
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
 * The function would call the switchMode function if the time mode counter
 * down to 0 and the alarm sound would be call. The counter down would be call
 * in this function.
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

function createTimerWorker() {
    const worker = new Worker(timerWorkerFile);
    /**
    * The function would call the switchMode function if the time mode counter
    * down to 0 and the alarm sound would be call. The counter down would be call
    * in this function.
    */
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

/** The function would be call when the click start button and the stop button
 * would be show in the web.
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

/** The function would be call when the click stop button the start button
 * would be show in the web. The time would be reset.
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

/** The function to check if the status stop */
async function stopChecker() {
    if (localStorage.getItem('stop') === 'true') {
        stop();
        localStorage.setItem('stop', 'false');
    }
}

/** The function check if the start button click then call start function
 * if the stop button click then call stop function. The sound of button would
 * be play.
 */
async function startAndStopButton() {
    btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
    if (localStorage.getItem('clickState') === 'on') {
        btnSound.play(); // only plays sound when enabled
    }
    if (startButton.innerHTML === 'Start') {
        start();
    } else {
        stop();
    }
}

// Respond to user feedback in 50ms or less.
setInterval(stopChecker, 50);

// disableing space keydown
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
    }
});

startButton.addEventListener('click', startAndStopButton);
// keyboard event stuff
window.addEventListener('keyup', (event) => {
    const addDis = document.querySelector('task-popup').shadowRoot.getElementById('add-task-popup').style.display;
    const setDis = document.querySelector('settings-popup').shadowRoot.getElementById('settings-confirm-popup').style.display;
    const resDis = document.querySelector('reset-popup').shadowRoot.getElementById('reset-confirm-popup').style.display;
    const helpDis = document.querySelector('help-popup').shadowRoot.getElementById('help-popup').style.display;
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
