// const TaskItem = require('./TaskItem');

/**
 * The class is extend the HTMlElement function. The addTask function would be call for
 * add the tasks in the focus mode. the closePopup function would
 * be called for close all pop up windows.
 *
 * @constructor The constructor would reset and show everything in pages
 */
class TaskPopUp extends HTMLElement {
    // add TaskItem element to DOM
    addTask() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const input = this.shadowRoot.getElementById('task-input').value;
        if (input !== '') {
            // create TaskItem and append to DOM
            const task = {
                id: localStorage.getItem('id'),
                checked: false,
                text: input,
                focused: false,
            };
            const taskItem = document.createElement('task-item');
            taskItem.setAttribute('id', task.id);
            taskItem.setAttribute('title', 'Click to toggle task completion');
            taskItem.setAttribute('checked', task.checked);
            taskItem.setAttribute('text', task.text);
            taskItem.setAttribute('focused', task.focused);
            document.getElementById('task-list-elements').appendChild(taskItem);
            // update localStorage
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            const id = parseInt(localStorage.getItem('id'), 10) + 1;
            localStorage.setItem('id', `${id}`);
            const btnSound = new Audio('./icons/btnClick.mp3');
            btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
            if (localStorage.getItem('clickState') === 'on') {
                btnSound.play(); // only plays sound when enabled
            }
            // hide popup
            this.closePopUp();
        }
    }

    /** closes popup */
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('add-task-popup');
        const input = this.shadowRoot.getElementById('task-input');
        wrapper.style.display = 'none';
        input.value = '';
    }

    /** create popup item to add tasks by building a custom component */
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('task-popup-template');
        const templateContent = template.content;
        shadow.appendChild(templateContent.cloneNode(true));

        Object.defineProperties(this, {
            _bindedClose: {
                value: this.closePopUp.bind(this),
            },
            _bindedAddTask: {
                value: this.addTask.bind(this),
            },
        });
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        const closeBtn = this.shadowRoot.getElementById('close-icon');
        const addBtn = this.shadowRoot.getElementById('add-task-btn');

        closeBtn.addEventListener('click', this._bindedClose);
        addBtn.addEventListener('click', this._bindedAddTask);
    }

    disconnectedCallback() {
        const closeBtn = this.shadowRoot.getElementById('close-icon');
        const addBtn = this.shadowRoot.getElementById('add-task-btn');

        closeBtn.removeEventListener('click', this._bindedClose);
        addBtn.removeEventListener('click', this._bindedAddTask);
    }
}

customElements.define('task-popup', TaskPopUp);

window.addEventListener('DOMContentLoaded', () => {
    const popupBtn = document.getElementById('task-popup-btn');
    const popUp = document.querySelector('task-popup');
    popupBtn.addEventListener('click', () => {
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        if (localStorage.getItem('clickState') === 'on') {
            btnSound.play(); // only plays sound when enabled
        }
        // make sure any popup is closed before opening current popup
        const popups = Array.from(document.getElementsByClassName('popup'));
        for (let i = 0; i < popups.length; i += 1) {
            popups[i].closePopUp();
        }
        popUp.shadowRoot.getElementById('add-task-popup').style.display = 'block';
        popUp.shadowRoot.getElementById('task-input').focus();
    });
});

// module.exports = TaskPopUp;
