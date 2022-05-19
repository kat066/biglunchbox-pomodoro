import { addTemplates } from './utils';
import { RESET_POPUP_TEMPLATE, TASK_ITEM_TEMPLATE } from './Constants';
import '../src/components/TaskItem';

let pageTemplate;

beforeAll(async () => {
    const templates = await addTemplates([
        RESET_POPUP_TEMPLATE, TASK_ITEM_TEMPLATE,
    ], __dirname);

    // Create page template here to prevent multiple string builds
    pageTemplate = `
        ${templates}
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

    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
});

beforeEach(() => {
    const tasks = [];
    const id = 2;
    const taskF = { id: 0, checked: false, text: 'First Item' };
    const taskT = { id: 1, checked: true, text: 'Second Item' };
    tasks.push(taskF);
    tasks.push(taskT);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('id', `${id}`);
    document.body.innerHTML = pageTemplate;
    document.body.appendChild(document.createElement('reset-popup'));

    const list = document.getElementById('task-list-elements');
    tasks.forEach((task) => {
        const taskItemNode = document.createElement('task-item');
        Object.entries(task).forEach(([key, value]) => {
            taskItemNode.setAttribute(key, value);
        });
        list.appendChild(taskItemNode);
    });
    localStorage.setItem('volume', 50);
    require('../src/components/ResetPopUp');
});

afterEach(() => [
    localStorage.clear(),
]);

test(('reset button pops the window'), () => {
    // const resetPopUp = document.createElement('reset-popup');
    // document.body.appendChild(resetPopUp);
    localStorage.setItem('volume', 50);
    const resetBtn = document.getElementById('reset-button');
    resetBtn.click();
    const resetPopUp = document.querySelector('reset-popup');
    const dispaly = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
    expect(dispaly.display).toBe('block');
});

test(('close without reset'), () => {
    const resetPopUp = document.querySelector('reset-popup');
    const wrapper = resetPopUp.shadowRoot.getElementById('reset-confirm-popup');
    wrapper.style.display = 'block';
    const closeBtn = resetPopUp.shadowRoot.getElementById('close-icon');
    closeBtn.click();

    const display = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
    expect(display.display).toBe('none');
    expect(localStorage.getItem('id')).toBe('2');
    expect(localStorage.getItem('tasks')).toBe('[{"id":0,"checked":false,"text":"First Item"},{"id":1,"checked":true,"text":"Second Item"}]');
});

test(('confirm and reset with a focus task in place'), () => {
    const resetPopUp = document.querySelector('reset-popup');
    const wrapper = resetPopUp.shadowRoot.getElementById('reset-confirm-popup');
    wrapper.style.display = 'block';

    const focusTask = document.getElementById('focus-task');
    const newTask = document.createElement('task-item');
    focusTask.appendChild(newTask);

    const confirm = resetPopUp.shadowRoot.getElementById('confirm-reset-btn');
    confirm.click();

    const display = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
    expect(display.display).toBe('none');
    expect(localStorage.getItem('id')).toBe('0');
    expect(localStorage.getItem('tasks')).toBe('[]');
});

test(('confirm and reset without a focus task'), () => {
    const resetPopUp = document.querySelector('reset-popup');
    const wrapper = resetPopUp.shadowRoot.getElementById('reset-confirm-popup');
    wrapper.style.display = 'block';

    const focusTask = document.getElementById('focus-task');
    const newTask = document.createElement('task-item');
    focusTask.appendChild(newTask);

    const confirm = resetPopUp.shadowRoot.getElementById('confirm-reset-btn');
    confirm.click();

    const display = getComputedStyle(resetPopUp.shadowRoot.getElementById('reset-confirm-popup'));
    expect(display.display).toBe('none');
    expect(localStorage.getItem('id')).toBe('0');
    expect(localStorage.getItem('tasks')).toBe('[]');
});
