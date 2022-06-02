import { TASK_POPUP_TEMPLATE } from './Constants';
import { addTemplates } from './utils';

let pageTemplate;

beforeAll(async () => {
    const templates = await addTemplates([
        TASK_POPUP_TEMPLATE,
    ], __dirname);

    pageTemplate = `
        ${templates}
        <ul id="task-list-elements">
        </ul>
        <div id="popup-button">
            <button id="task-popup-btn"> <img src="../icons/plus.svg" id="plus"></button>
        </div>
        <button id="completed" data-selected="false">Up Next</button>
    `;
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
});

// jest.mock('../src/components/TaskItem');

beforeEach(() => {
    localStorage.setItem('volume', 50);
    localStorage.setItem('tasks', '[]');
    localStorage.setItem('id', '0');
    document.body.innerHTML = pageTemplate;
    require('../src/components/TaskPopUp');
});

afterEach(() => {
    localStorage.clear();
});

test('Adding a task called test_task with the addButton correctly updates localStorage', () => {
    const taskPopUp = document.createElement('task-popup');
    const shadow = taskPopUp.shadowRoot;

    const input = shadow.querySelector('input');
    input.value = 'test_task';

    taskPopUp.addTask();

    // new task test_task is added to list of tasks
    expect(localStorage.getItem('tasks')).toBe('[{"id":"0","checked":false,"text":"test_task","focused":false}]');
    // id is updated
    expect(localStorage.getItem('id')).toBe('1');
    // input is set back to empty string
    expect(input.value).toBe('');
});

test('Adding empty task does not change localStorage', () => {
    const taskPopUp = document.createElement('task-popup');
    const shadow = taskPopUp.shadowRoot;

    const input = shadow.querySelector('input');
    input.value = '';

    taskPopUp.addTask();

    // localStorage remains the same
    expect(localStorage.getItem('tasks')).toBe('[]');
    // id remains the same
    expect(localStorage.getItem('id')).toBe('0');
});

test('cancelButton works correctly', () => {
    const taskPopUp = document.createElement('task-popup');
    taskPopUp.closePopUp();

    expect(getComputedStyle(taskPopUp.shadowRoot.getElementById('add-task-popup')).display).toBe('none');
    expect(taskPopUp.shadowRoot.getElementById('task-input').value).toBe('');
});

test('All attributes set correctly', () => {
    const testTaskPopUp = document.createElement('task-popup');
    const shadow = testTaskPopUp.shadowRoot;

    // wrapper attributes set correctly
    expect(shadow.querySelector('div').getAttribute('id')).toBe('add-task-popup');

    // title set correctly
    expect(shadow.querySelector('h3').innerHTML).toBe('Add Task');

    // input attributes set correctly
    expect(shadow.querySelector('input').getAttribute('type')).toBe('text');
    expect(shadow.querySelector('input').getAttribute('id')).toBe('task-input');
    expect(shadow.querySelector('input').getAttribute('placeholder')).toBe('What are you working on today?');
    expect(shadow.querySelector('input').getAttribute('maxlength')).toBe('48');

    // add button attributes set correctly
    expect(shadow.querySelector('button').getAttribute('class')).toBe('popup-btns');
    expect(shadow.querySelector('button').getAttribute('id')).toBe('add-task-btn');
    expect(shadow.querySelector('button').innerHTML).toBe('Add');

    // close icon attributes set correctly
    expect(shadow.querySelector('img').getAttribute('id')).toBe('close-icon');
});

test('Pop up button works correctly', () => {
    // const testTaskPopUp = new TaskPopUp();
    // const shadow = testTaskPopUp.shadowRoot;
    const popUp = document.createElement('task-popup');
    document.body.appendChild(popUp);

    const popupBtn = document.getElementById('task-popup-btn');
    document.body.appendChild(popupBtn);

    popupBtn.click();

    const shadow = popUp.shadowRoot;

    const display = getComputedStyle(shadow.getElementById('add-task-popup'));
    expect(display.display).toBe('block');
});
