import '../src/scripts/script';
import '../src/components/TaskItem';

import { addTemplates, dispatchDOMLoadedEvent } from './utils';
import { TASK_ITEM_TEMPLATE } from './Constants';

let pageTemplate;

beforeAll(async () => {
    const templates = await addTemplates([
        TASK_ITEM_TEMPLATE,
    ], __dirname);

    // Page template to be used for every test
    // Initialized here to prevent multiple string building
    pageTemplate = `
        ${templates}
        <main id="main"></main>
        <button id="up-next"> Up Next </button>
        <button id="completed"> Completed </button>
        <ul id="task-list-elements">
        </ul>
        <div id='focus-task'>
            <h2 id='select-focus'></h2>
        </div>
        <audio id="click-snd" src="#"></audio>
    `;
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
});

beforeEach(() => {
    document.body.innerHTML = pageTemplate;
});

afterEach(() => {
    localStorage.clear();
});

/**
 * !! Due to how script.js is written, this is necessary to do before running
 * tests that manipulate the localStorage. This is because the tests relied on
 * beforeEach initializing localStorage manually and used the event listener
 * to populate the document with the tasks.
 *
 * We should aim to no longer need this function and to unlink the localStorage
 * manipulation with the DOMContentLoaded event listener in script.js
 */
function initializeLocalStorage() {
    localStorage.setItem('tasks', '[]');
    localStorage.setItem('id', '0');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('tab-label', 'on');
    localStorage.setItem('volume', '50');
    localStorage.setItem('state', 'default');
}

test('Initializes localStorage correctly', () => {
    dispatchDOMLoadedEvent(window);

    expect(localStorage.getItem('tasks')).toBe('[]');
    expect(localStorage.getItem('id')).toBe('0');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(localStorage.getItem('tab-label')).toBe('on');
    expect(localStorage.getItem('volume')).toBe('50');
    expect(document.getElementById('task-list-elements').children).toHaveLength(0);
});

test('Reads task list and creates one task correctly', () => {
    initializeLocalStorage();
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false}]');
    dispatchDOMLoadedEvent(window);

    expect(document.getElementById('task-list-elements').children).toHaveLength(1);

    const taskItem = document.getElementById('task-list-elements').children[0];
    expect(taskItem.getAttribute('checked')).toBe('false');
    expect(taskItem.id).toBe('0');
    expect(taskItem.style.display).toBe('flex');
    expect(taskItem.getAttribute('text')).toBe('test_task');
    expect(taskItem.getAttribute('focused')).toBe('false');
});

test('Reads task list and creates one task that is completed correctly', () => {
    initializeLocalStorage();
    localStorage.setItem('tasks', '[{"id":"0","checked":true,"text":"test_task","focused":false}]');
    dispatchDOMLoadedEvent(window);

    expect(document.getElementById('task-list-elements').children).toHaveLength(1);

    const taskItem = document.getElementById('task-list-elements').children[0];
    expect(taskItem.getAttribute('checked')).toBe('true');
    expect(taskItem.id).toBe('0');
    expect(taskItem.getAttribute('text')).toBe('test_task');
    expect(taskItem.style.display).toBe('none');
    expect(taskItem.getAttribute('focused')).toBe('false');
});

test('Reads task list and creates multiple tasks correctly', () => {
    initializeLocalStorage();
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false},'
        + '{"id":"1","checked":false,"text":"test_task1","focused":false}]');
    dispatchDOMLoadedEvent(window);

    expect(document.getElementById('task-list-elements').children).toHaveLength(2);

    const taskItem = document.getElementById('task-list-elements').children[0];
    expect(taskItem.getAttribute('checked')).toBe('false');
    expect(taskItem.id).toBe('0');
    expect(taskItem.getAttribute('text')).toBe('test_task');
    expect(taskItem.getAttribute('focused')).toBe('false');

    const taskItem1 = document.getElementById('task-list-elements').children[1];
    expect(taskItem1.getAttribute('checked')).toBe('false');
    expect(taskItem1.id).toBe('1');
    expect(taskItem1.getAttribute('text')).toBe('test_task1');
    expect(taskItem1.getAttribute('focused')).toBe('false');
});

test('Reads task list and creates multiple tasks correctly, with one focused task', () => {
    initializeLocalStorage();
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false},'
        + '{"id":"1","checked":false,"text":"test_task1","focused":true}]');
    dispatchDOMLoadedEvent(window);

    expect(document.getElementById('task-list-elements').children).toHaveLength(1);

    const taskItem = document.getElementById('task-list-elements').children[0];
    expect(taskItem.getAttribute('checked')).toBe('false');
    expect(taskItem.id).toBe('0');
    expect(taskItem.getAttribute('text')).toBe('test_task');
    expect(taskItem.getAttribute('focused')).toBe('false');

    // const taskItem1 = document.getElementById('task-list-elements').children[1];
    const taskItem1 = document.getElementById('focus-task').childNodes[3];
    expect(taskItem1.getAttribute('checked')).toBe('false');
    expect(taskItem1.id).toBe('1');
    expect(taskItem1.getAttribute('text')).toBe('test_task1');
    expect(taskItem1.getAttribute('focused')).toBe('true');
});

test('Show completed task on button click', () => {
    initializeLocalStorage();
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false},'
        + '{"id":"1","checked":true,"text":"test_task1","focused":false}]');
    dispatchDOMLoadedEvent(window);

    expect(document.getElementById('task-list-elements').children).toHaveLength(2);

    const taskItem = document.getElementById('task-list-elements').children[0];
    const taskItem1 = document.getElementById('task-list-elements').children[1];

    /* before click */
    expect(taskItem.getAttribute('checked')).toBe('false');
    expect(taskItem.id).toBe('0');
    expect(taskItem.getAttribute('text')).toBe('test_task');
    expect(taskItem.getAttribute('focused')).toBe('false');
    expect(taskItem.style.display).toBe('flex');

    expect(taskItem1.getAttribute('checked')).toBe('true');
    expect(taskItem1.id).toBe('1');
    expect(taskItem1.getAttribute('text')).toBe('test_task1');
    expect(taskItem1.getAttribute('focused')).toBe('false');
    expect(taskItem1.style.display).toBe('none');

    /* after click */
    document.getElementById('completed').click();
    expect(taskItem.style.display).toBe('none');
    expect(taskItem1.style.display).toBe('flex');
});

// test(('save dark theme'), () => {
//     localStorage.setItem('theme', 'dark');
//     dispatchEvent(new Event('DOMContentLoaded'));
//     expect(document.body.classList).toContain('dark-theme');
// });
