const startButton = document.getElementById('start-btn');
const timerDisplayDuration = document.getElementById('timer_display_duration');
const timerBackground = document.getElementById('timer_display');
const tabLabel = document.getElementById('tab-label');
const btnSound = new Audio('./icons/btnClick.mp3');
const alarmSound = new Audio('./icons/alarm.mp3');
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

timerDisplayDuration.innerHTML = `${pomoTime}:00`;

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
 * time, if the Tab Label setting is enabled.
*/
function updateTabLabel(tabLabelTime) {
    if (localStorage.getItem('tab-label') === 'on') {
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

    if (timerStatus === 'pomo' && breakCounter >= 3) {
        timerDisplayDuration.innerHTML = `${longBreakTime}:00`;
        togglePomoButtonOff(pomoButton, breakButton);
        tabLabelStatus = 'Rest a while!';
        updateTabLabel(`${longBreakTime}:00`);
        timerStatus = 'break';
        breakCounter = 0;
    } else if (timerStatus === 'pomo') {
        timerDisplayDuration.innerHTML = `${breakTime}:00`;
        togglePomoButtonOff(pomoButton, breakButton);
        tabLabelStatus = 'Take a break!';
        updateTabLabel(`${breakTime}:00`);
        timerStatus = 'break';
        breakCounter += 1;
    } else {
        timerDisplayDuration.innerHTML = `${pomoTime}:00`;
        togglePomoButtonOn(pomoButton, breakButton);
        tabLabelStatus = 'Time to Focus!';
        updateTabLabel(`${pomoTime}:00`);
        timerStatus = 'pomo';
    }
}

/**
 * The function would call the switchMode function if the time mode counter
 * down to 0 and the alarm sound would be call. The counter down would be call
 * in this function.
 */
// theme color for timer graphics
let themeColor = (document.body.classList.length === 0) ? '#f36060' : '#4a5568';
async function timerFunction() {
    let timerText = timerDisplayDuration.innerHTML;

    if (timerText === '0:00') {
        switchMode();
        timerText = timerDisplayDuration.innerHTML;
    }

    if (timerText === '0:01') {
        alarmSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        // console.log(alarmSound.volume);
        if (localStorage.getItem('alarmState') === 'on') {
            alarmSound.play(); // only plays sound when enabled
        }
    }

    let minutes = Number(timerText.substring(0, timerText.length - 3));
    let seconds = Number(timerText.substring(timerText.length - 2));

    if (!(seconds === 0)) {
        seconds -= 1;
    } else {
        seconds = 59;
        minutes -= 1;
    }

    if (seconds < 10) {
        seconds = `0${String(seconds)}`;
    }

    timerDisplayDuration.innerHTML = `${minutes}:${seconds}`;
    // Adapt to each modes
    const timeMin = parseInt(timerDisplayDuration.innerHTML.split(':')[0], 10);
    const timeSec = parseInt(timerDisplayDuration.innerHTML.split(':')[1], 10);
    updateTabLabel(`${timeMin}:${timeSec}`);
    let pomoMode = true;
    const pomoButton = document.getElementById('pomo-btn');
    pomoMode = (pomoButton.getAttribute('class') !== 'toggle');
    let timePerc = 100 - ((timeMin * 60 + timeSec) / (parseFloat(pomoTime) * 60)) * 100;
    if (pomoMode) {
        timePerc = 100 - ((timeMin * 60 + timeSec) / (parseFloat(pomoTime) * 60)) * 100;
    } else {
        timePerc = 100 - ((timeMin * 60 + timeSec) / (parseFloat(breakTime) * 60)) * 100;
    }
    // set timer graphics
    timerBackground.style.background = `linear-gradient(0deg, 
        ${themeColor} ${timePerc}%, rgba(51, 231, 255, 0) 0%)`;
}

/** The function would be call when the click start button and the stop button
 * would be show in the web.
 */
async function start() {
    // get background color for sync between different modes
    themeColor = (document.body.classList.length === 0) ? '#f36060' : '#4a5568';
    startButton.innerHTML = 'Stop';
    updateTabLabel(`${pomoTime}:00`);
    timer = setInterval(timerFunction, SECOND);
}

/** The function would be call when the click stop button the start button
 * would be show in the web. The time would be reset.
 */
async function stop() {
    pomoTime = localStorage.getItem('pomo-length');
    breakTime = localStorage.getItem('short-break-length');
    longBreakTime = localStorage.getItem('long-break-length');
    clearInterval(timer);
    timerStatus = 'break';
    setTimeout(switchMode, SECOND / 10);
    breakCounter = 0;
    startButton.innerHTML = 'Start';
    timerBackground.style.background = `linear-gradient(0deg, 
                        ${themeColor} 0%, rgba(51, 231, 255, 0) 0%)`;
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

setInterval(stopChecker, 500);

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
        case 'KeyS':
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
