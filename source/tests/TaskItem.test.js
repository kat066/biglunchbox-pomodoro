import { TASK_ITEM_TEMPLATE } from './Constants';
import { addTemplates } from './utils';

import '../src/components/TaskItem';

let defaultTasks;
let templates;

beforeAll(async () => {
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
    const tasks = [];
    const taskF = { id: '0', checked: false, text: 'First Item' };
    const taskT = { id: '1', checked: true, text: 'Second Item' };
    tasks.push(taskF);
    tasks.push(taskT);
    defaultTasks = JSON.stringify(tasks);

    templates = await addTemplates([
        TASK_ITEM_TEMPLATE,
    ], __dirname);
});

beforeEach(() => {
    const id = 2;
    localStorage.setItem('tasks', defaultTasks);
    localStorage.setItem('id', id.toString());
    document.body.innerHTML = templates;
});

afterEach(() => [
    localStorage.clear(),
]);

test(('toggle finished state'), () => {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskItem = document.createElement('task-item');
    taskItem.setAttribute('id', tasks[0].id);
    taskItem.setAttribute('checked', tasks[0].checked);
    taskItem.setAttribute('text', tasks[0].text);
    taskItem.toggle();

    // Changed from false to true
    expect(taskItem.getAttribute('checked')).toBe('true');
    expect(JSON.parse(localStorage.getItem('tasks'))[0].checked).toBe(true);

    // Changed from true to false
    taskItem.toggle();
    expect(taskItem.getAttribute('checked')).toBe('false');
    expect(JSON.parse(localStorage.getItem('tasks'))[0].checked).toBe(false);
});

test(('remove a task'), () => {
    document.body.innerHTML += `
        <button class="top-buttons" id="reset-button">
            <img src="../icons/reset.svg" id="reset" class="top-button-img" alt=git "reset">
            <p class="top-button-text">Reset</p>
        </button>
        <ul id="task-list-elements">
        </ul>
        <div id="focus-task">
            <h2 id="select-focus"></h2>
        </div>
    `;
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskItem = document.createElement('task-item');
    taskItem.setAttribute('id', tasks[0].id);
    taskItem.setAttribute('checked', tasks[0].checked);
    taskItem.setAttribute('text', tasks[0].text);
    const list = document.getElementById('task-list-elements');
    list.appendChild(taskItem);

    taskItem.removeTask();

    tasks = JSON.parse(localStorage.getItem('tasks'));
    expect(tasks).toEqual([{ checked: true, id: '1', text: 'Second Item' }]);
    expect(list.childElementCount).toBe(0);
});

describe(('focus task'), () => {
    let pageTemplate;
    const tasks = [];

    beforeAll(async () => {
        const templates = await addTemplates([ // eslint-disable-line no-shadow
            TASK_ITEM_TEMPLATE,
        ], __dirname);

        pageTemplate = `
            ${templates}
            <div id='focus-task'>
                <h2 id='select-focus'></h2>
            </div>
            <ul id="task-list-elements">
                <task-item id="0" checked="false" text="First Item" focused="false"></task-item>
                <task-item id="1" checked="false" text="Second Item" focused="false"></task-item>
                <task-item id="2" checked="false" text="Third Item" focused="false"></task-item>
            </ul>
        `;

        const task0 = {
            id: '0', checked: false, text: 'First Item', focused: false,
        };
        const task1 = {
            id: '1', checked: false, text: 'Second Item', focused: false,
        };
        const task2 = {
            id: '2', checked: false, text: 'Third Item', focused: false,
        };
        tasks.push(task0);
        tasks.push(task1);
        tasks.push(task2);
    });

    beforeEach(() => {
        const id = 2;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('id', `${id}`);
        document.body.innerHTML = pageTemplate;
    });

    test(('set a new focus task'), () => {
        const task0 = document.getElementById('0');
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        expect(task0.getAttribute('focused')).toBe('true');
        // local storage is correctly updated
        const tasksLocalstorage = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksLocalstorage[0].focused).toBe(true);
        // task item is moved to focuse section
        const taskList = document.getElementById('task-list-elements');
        const focus = document.getElementById('focus-task');
        expect(taskList.childElementCount).toBe(2);
        expect(task0.parentElement).toBe(focus);
    });

    // test(('focusing a task that does not exist in localStorage does nothing'), () => {
    //     document.body.innerHTML = `
    //         <div id='focus-task'>
    //             <h2 id='select-focus'></h2>
    //         </div>
    //         <ul id="task-list-elements">
    //             <task-item id="0" checked="false" text="First Item" focused="false"></task-item>
    //             <task-item id="1" checked="false" text="Second Item" focused="false"></task-item>
    //             <task-item id="3" checked="false" text="Third Item" focused="false"></task-item>
    //         </ul>
    //     `;
    //     const task0 = document.getElementById('3');
    //     task0.shadowRoot.querySelector('img[src="icons/focus.svg"]').click();

    //     const taskList = document.getElementById('task-list-elements');
    //     expect(taskList.childElementCount).toBe(2);
    // });

    test(('change focus task'), () => {
        const task0 = document.getElementById('0');
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        const task1 = document.getElementById('1');
        task1.focus(new Event('click', { bubbles: true, cancelable: true }));
        expect(task0.getAttribute('focused')).toBe('false');
        expect(task1.getAttribute('focused')).toBe('true');
        // local storage
        const tasksLocalstorage = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksLocalstorage[0].focused).toBe(false);
        expect(tasksLocalstorage[1].focused).toBe(true);
        // task1 is moved to focus section and task 1 is in task list
        const taskList = document.getElementById('task-list-elements');
        const focus = document.getElementById('focus-task');
        expect(task0.parentElement).toBe(taskList);
        expect(task1.parentElement).toBe(focus);
    });

    // test.only(('change focus task to task does not exist in localStorage does nothing'), () => {
    //     const task0 = document.getElementById('0');
    //     task0.shadowRoot.querySelector('img[src="icons/focus.svg"]').click();

    //     const focusDiv = document.getElementById('focus-task');
    //     const focusTask = focusDiv.querySelector('task-item');
    //     focusTask.setAttribute('id', '3');

    //     const task1 = document.getElementById('1');
    //     task1.shadowRoot.querySelector('img[src="icons/focus.svg"]').click();
    //     expect(task0.getAttribute('focused')).toBe('false');
    //     expect(task1.getAttribute('focused')).toBe('true');

    //     // task1 is moved to focus section and task 1 is in task list
    //     const taskList = document.getElementById('task-list-elements');
    //     const focuse = document.getElementById('focus-task');
    //     expect(task0.parentElement).toBe(taskList);
    //     expect(task1.parentElement).toBe(focuse);
    // });

    test(('remove a focus task by deletion'), () => {
        const task0 = document.getElementById('0');
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        // remove task0
        task0.removeTask();
        const focus = document.getElementById('focus-task');
        expect(focus.querySelector('task-item')).toBe(null);
        const title = document.getElementById('select-focus');
        expect(title.innerHTML).toBe('');
    });

    test(('unfocus a task when in default mode'), () => {
        localStorage.setItem('state', 'default');
        const task0 = document.getElementById('0');
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        // unfocus task0
        const focus = document.getElementById('focus-task');
        expect(focus.querySelector('task-item')).toBe(null);
        const title = document.getElementById('select-focus');
        expect(title.innerHTML).toBe('');
    });

    test(('unfocus a task when in focus mode'), () => {
        localStorage.setItem('state', 'focus');
        const task0 = document.getElementById('0');
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        // unfocus task0
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));

        // Second task should be focused
        const focus = document.getElementById('focus-task');
        expect(focus.querySelector('task-item').getAttribute('id')).toBe('1');
        const title = document.getElementById('select-focus');
        expect(title.innerHTML).toBe('Focusing on:');
    });

    test(('unfocus a task when in focus mode and all tasks done'), () => {
        localStorage.setItem('state', 'focus');
        const task0 = document.getElementById('0');
        const task1 = document.getElementById('1');
        task1.toggle();
        const task2 = document.getElementById('2');
        task2.toggle();

        // Focus and finish task 0
        task0.focus(new Event('click', { bubbles: true, cancelable: true }));
        task0.toggle();

        // unfocus task0
        // task0.focus(new Event('click', { bubbles: true, cancelable: true }));

        // There should be no more tasks during focus mode
        const focus = document.getElementById('focus-task');
        expect(focus.querySelector('task-item')).toBe(null);
        const title = document.getElementById('select-focus');
        expect(title.innerHTML).toBe('All tasks complete!');
    });
});
