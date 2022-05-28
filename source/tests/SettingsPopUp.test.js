import { addTemplates } from './utils';
import { SETTINGS_POPUP_TEMPLATE } from './Constants';

let templates;
let pageTemplate;

beforeAll(async () => {
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
    templates = await addTemplates([
        SETTINGS_POPUP_TEMPLATE,
    ], __dirname);
    pageTemplate = `
        ${templates}
        <button class="top-buttons" id="setting-button">
            <img src="../icons/settings.svg" id="gear" class="top-button-img" alt="gear">
            <p class="top-button-text">Setting</p>
        </button>
        <div id="timer-display" class="timer-value">
            <div id="timer-display-duration">25:00</div>
        </div>
        <button id = "start-btn">Start</button>
    `;
});

beforeEach(() => {
    localStorage.setItem('volume', 50);
    localStorage.setItem('prevVolume', 50);
    localStorage.setItem('pomo-length', '25');
    localStorage.setItem('short-break-length', '5');
    localStorage.setItem('long-break-length', '15');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('tab-label', 'on');
    localStorage.setItem('prevTabState', 'on');
    document.body.innerHTML = pageTemplate;
    require('../src/components/SettingsPopUp');
});

afterEach(() => {
    localStorage.clear();
});

test('Confirm Button functions as intended', () => {
    document.body.innerHTML = templates;
    const testSettingsPopUp = document.createElement('settings-popup');
    const shadow = testSettingsPopUp.shadowRoot;

    const pomoLength = shadow.getElementById('pomo-length-input');
    const shortBreakLength = shadow.getElementById('short-break-input');
    const longBreakLength = shadow.getElementById('long-break-input');

    pomoLength.value = '30';
    shortBreakLength.value = '10';
    longBreakLength.value = '20';

    // !! TODO: Correct way to properly confirm that the settings are working for
    // Jest since it doesn't need settings-popup attachment to body. We should
    // only add eventlisteners when it is attached to the body since that is
    // when they can actually be interacted with. We use cypress for testing
    // UI and integration of components
    testSettingsPopUp.confirmSettings();

    expect(localStorage.getItem('pomo-length')).toBe('30');
    expect(localStorage.getItem('short-break-length')).toBe('10');
    expect(localStorage.getItem('long-break-length')).toBe('20');

    // closes pop up
    expect(shadow.getElementById('settings-confirm-popup').style.display).toBe('none');
});

test('Illegal numbers treated properly', () => {
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;

    localStorage.setItem('pomo-length', '100');
    localStorage.setItem('short-break-length', '-10');
    localStorage.setItem('long-break-length', '0.5');

    const confirmBtn = shadow.querySelectorAll('button')[0];

    confirmBtn.click();

    expect(localStorage.getItem('pomo-length')).toBe('25');
    expect(localStorage.getItem('short-break-length')).toBe('5');
    expect(localStorage.getItem('long-break-length')).toBe('15');

    // closes pop up
    expect(shadow.getElementById('settings-confirm-popup').style.display).toBe('none');
});

test('NaN input treated correctly', () => {
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;

    const pomoLength = shadow.querySelectorAll('input')[0];
    const shortBreakLength = shadow.querySelectorAll('input')[1];
    const longBreakLength = shadow.querySelectorAll('input')[2];

    pomoLength.value = '';
    shortBreakLength.value = '';
    longBreakLength.value = '';

    const confirmBtn = shadow.querySelectorAll('button')[0];

    confirmBtn.click();

    expect(localStorage.getItem('pomo-length')).toBe('25');
    expect(localStorage.getItem('short-break-length')).toBe('5');
    expect(localStorage.getItem('long-break-length')).toBe('15');

    // closes pop up
    expect(shadow.getElementById('settings-confirm-popup').style.display).toBe('none');
});

test('Cancel Button functions as intended', () => {
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;

    const pomoLength = shadow.querySelectorAll('input')[0];
    const shortBreakLength = shadow.querySelectorAll('input')[1];
    const longBreakLength = shadow.querySelectorAll('input')[2];

    pomoLength.value = '30';
    shortBreakLength.value = '10';
    longBreakLength.value = '20';

    const cancelBtn = shadow.querySelector("img[src='icons/close.svg']");

    cancelBtn.click();

    expect(localStorage.getItem('pomo-length')).toBe('25');
    expect(localStorage.getItem('short-break-length')).toBe('5');
    expect(localStorage.getItem('long-break-length')).toBe('15');

    expect(shadow.getElementById('settings-confirm-popup').style.display).toBe('none');
});

test('All attributes set correctly', () => {
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;

    // wrapper attributes set correctly
    expect(shadow.querySelectorAll('div')[0].getAttribute('id')).toBe('settings-confirm-popup');

    // title set correctly
    expect(shadow.querySelector('h3').innerHTML).toBe('Settings');

    // session title set correctly
    expect(shadow.querySelectorAll('h4')[0].getAttribute('id')).toBe('timer-settings');
    expect(shadow.querySelectorAll('h4')[0].innerHTML).toBe('Session Length (minutes)');

    // session dic set correctly
    expect(shadow.querySelectorAll('div')[1].getAttribute('id')).toBe('session');

    // pomo input attributes set correctly
    expect(shadow.querySelectorAll('input')[0].getAttribute('type')).toBe('number');
    expect(shadow.querySelectorAll('input')[0].getAttribute('id')).toBe('pomo-length-input');
    expect(shadow.querySelectorAll('input')[0].getAttribute('value')).toBe('25');
    expect(shadow.querySelectorAll('input')[0].getAttribute('min')).toBe('1');
    expect(shadow.querySelectorAll('input')[0].getAttribute('max')).toBe('60');

    // short break input attributes set correctly
    expect(shadow.querySelectorAll('input')[1].getAttribute('type')).toBe('number');
    expect(shadow.querySelectorAll('input')[1].getAttribute('id')).toBe('short-break-input');
    expect(shadow.querySelectorAll('input')[1].getAttribute('value')).toBe('5');
    expect(shadow.querySelectorAll('input')[1].getAttribute('min')).toBe('1');
    expect(shadow.querySelectorAll('input')[1].getAttribute('max')).toBe('60');

    // long break input attributes set correctly
    expect(shadow.querySelectorAll('input')[2].getAttribute('type')).toBe('number');
    expect(shadow.querySelectorAll('input')[2].getAttribute('id')).toBe('long-break-input');
    expect(shadow.querySelectorAll('input')[2].getAttribute('value')).toBe('15');
    expect(shadow.querySelectorAll('input')[2].getAttribute('min')).toBe('1');
    expect(shadow.querySelectorAll('input')[2].getAttribute('max')).toBe('60');

    // dark mode session set correctly
    expect(shadow.querySelectorAll('h4')[1].getAttribute('id')).toBe('enable-dark-mode');
    expect(shadow.querySelectorAll('h4')[1].innerHTML).toBe('Enable Dark Mode?');
    // dark mode switch, default in light mode
    expect(shadow.querySelectorAll('input')[3].getAttribute('type')).toBe('checkbox');
    expect(shadow.querySelectorAll('input')[3].checked).toBe(false);
    expect(shadow.querySelector('span').getAttribute('class')).toBe('slider');

    // volume session set correctly, default volume 50
    expect(shadow.querySelectorAll('input')[5].getAttribute('type')).toBe('range');
    expect(shadow.querySelectorAll('input')[5].getAttribute('id')).toBe('range');
    expect(shadow.querySelectorAll('input')[5].getAttribute('value')).toBe('50');
    expect(shadow.querySelectorAll('input')[5].getAttribute('min')).toBe('0');
    expect(shadow.querySelectorAll('input')[5].getAttribute('max')).toBe('100');

    // confirm button attributes set correctly
    expect(shadow.querySelectorAll('button')[0].getAttribute('class')).toBe('settings-popup-btns');
    expect(shadow.querySelectorAll('button')[0].getAttribute('id')).toBe('confirm-settings-btn');
    expect(shadow.querySelectorAll('button')[0].innerHTML).toBe('Confirm');

    // cancel icon attributes set correctly
    expect(shadow.querySelector('img').getAttribute('id')).toBe('close-icon');
    expect(shadow.querySelector('img').getAttribute('src')).toBe('icons/close.svg');
});

test('Pop up button works correctly', () => {
    const settingsButton = document.getElementById('setting-button');
    const settingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(settingsPopUp);

    settingsButton.click();

    const shadow = settingsPopUp.shadowRoot;

    const display = getComputedStyle(shadow.getElementById('settings-confirm-popup'));

    expect(display.display).toBe('block');
});

test(('the page is in dark mode'), () => {
    localStorage.setItem('theme', 'dark');
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;
    expect(shadow.querySelector('input[type="checkbox"]').checked).toBe(true);
});

test(('toggle from light to dark mode'), () => {
    localStorage.setItem('theme', 'light');
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;
    const mode = shadow.querySelector('span[class="slider"]');
    mode.click();
    const confirm = shadow.querySelectorAll('button')[0];
    confirm.click();
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.body.classList).toContain('dark-theme');
});

test(('toggle from dark to light mode'), () => {
    localStorage.setItem('theme', 'dark');
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;
    const mode = shadow.querySelector('span[class="slider"]');
    mode.click();
    const confirm = shadow.querySelectorAll('button')[0];
    confirm.click();
    expect(localStorage.getItem('theme')).toBe('light');
});

test(('set volume'), () => {
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;
    const slider = shadow.querySelector('input[type="range"]');
    slider.value = 60;
    const event = new Event('change');
    slider.dispatchEvent(event);
    expect(localStorage.getItem('volume')).toBe('60');
});

test(('volume label consist with slider value'), () => {
    const testSettingsPopUp = document.createElement('settings-popup');
    document.body.appendChild(testSettingsPopUp);
    const shadow = testSettingsPopUp.shadowRoot;
    const slider = shadow.querySelector('input[type="range"]');
    slider.value = 60;
    const event = new Event('input');
    slider.dispatchEvent(event);
    expect(shadow.querySelector('span[id="volume-number"]').innerHTML).toBe('60');
});
