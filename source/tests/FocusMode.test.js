// import { toggleState } from '../src/scripts/FocusMode';
import { dispatchDOMLoadedEvent } from './utils';
import '../src/scripts/FocusMode';

let pageTemplate;

beforeAll(() => {
    pageTemplate = `
        <nav id="header-buttons">
            <button class='top-buttons' id='focus-button'>
                <img src="icons/half-moon.svg" id="focus" class="top-button-img" alt="focus">
            </button>        
        </nav>
        <div id="pomodoro-timer">
            <div id='focus-task'>
                <h2 id='select-focus'></h2>
            </div>
        </div>
        <div id="task-list">
            <h2 id="up-next">Up Next</h2>
            <ul id="task-list-elements">
            </ul>
        </div>
        <div id="popup-button">
            <button id="task-popup-btn"> <img src="icons/plus.svg" id="plus"></button>
        </div>
    `;
});

beforeEach(() => {
    document.body.innerHTML = pageTemplate;
    dispatchDOMLoadedEvent(window);
    localStorage.setItem('volume', 100);
    localStorage.setItem('prevVolume', 100);
});

afterEach(() => [
    localStorage.clear(),
]);

test('Switch state from default to focus', () => {
    localStorage.setItem('state', 'default');
    // const popUpBtn = document.getElementById('popup-button');
    const taskListDiv = document.getElementById('task-list');
    const pomoDiv = document.getElementById('pomodoro-timer');
    const focusTask = document.getElementById('focus-task');

    /**
     * TODO Make FocusMode export toggleState and use ToggleState instead of clicks
     */
    const focusBtn = document.getElementById('focus-button');
    focusBtn.click();

    // expect(popUpBtn.getAttribute('class')).toBe('state');
    expect(taskListDiv.getAttribute('class')).toBe('state');
    expect(pomoDiv.getAttribute('class')).toBe('state');
    expect(focusTask.getAttribute('class')).toBe('state');

    expect(localStorage.getItem('state')).toBe('focus');
});

test('Switch state from focus to default, title updates properly', () => {
    // Initialize state to focus and then toggle
    localStorage.setItem('state', 'focus');
    const title = document.getElementById('select-focus');
    title.innerHTML = 'All tasks complete!';

    const focusBtn = document.getElementById('focus-button');
    focusBtn.click();

    // const popUpBtn = document.getElementById('popup-button');
    const taskListDiv = document.getElementById('task-list');
    const pomoDiv = document.getElementById('pomodoro-timer');
    const focusTask = document.getElementById('focus-task');

    // expect(popUpBtn.getAttribute('class')).toBe('state');
    expect(taskListDiv.getAttribute('class')).toBe('state');
    expect(pomoDiv.getAttribute('class')).toBe('state');
    expect(focusTask.getAttribute('class')).toBe('state');

    expect(localStorage.getItem('state')).toBe('default');
    expect(title.innerHTML).toBe('');
});

test('Switch state from focus to default, title unchanges properly', () => {
    // Initialize state to focus state and then toggle
    localStorage.setItem('state', 'focus');
    const title = document.getElementById('select-focus');
    title.innerHTML = '';

    const focusBtn = document.getElementById('focus-button');
    focusBtn.click();

    // const popUpBtn = document.getElementById('popup-button');
    const taskListDiv = document.getElementById('task-list');
    const pomoDiv = document.getElementById('pomodoro-timer');
    const focusTask = document.getElementById('focus-task');

    // expect(popUpBtn.getAttribute('class')).toBe('state');
    expect(taskListDiv.getAttribute('class')).toBe('state');
    expect(pomoDiv.getAttribute('class')).toBe('state');
    expect(focusTask.getAttribute('class')).toBe('state');

    expect(localStorage.getItem('state')).toBe('default');
    expect(title.innerHTML).toBe('');
});
