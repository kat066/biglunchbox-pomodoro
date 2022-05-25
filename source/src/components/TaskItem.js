/** creates a task list item */
/**
 * The class is extend the HTMlElement function. The toggle function would be call for
 * check if the button toggle. The removeTask function would be call for remove all the tasks
 * and the class mostly would manage the focus tasks in the app.
 * @constructor The constructor would reset and show everything in pages
 */
class TaskItem extends HTMLElement {
    // toggles custom attribute 'checked' for this element
    toggle() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        // update checked attribute
        const checked = this.getAttribute('checked').toLowerCase() === 'true';
        this.setAttribute('checked', !checked);
        // update task item in localStorage
        const task = tasks.find((t) => t.id === this.getAttribute('id') && t.text === this.getAttribute('text'));
        if (typeof task !== 'undefined') {
            task.checked = !task.checked;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    /** removes custom element from DOM and deletes task from localStorage */
    removeTask() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        // find and remove task from localStorage
        tasks.splice(tasks.findIndex((task) => task.id === this.getAttribute('id') && task.text === this.getAttribute('text')), 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // remove this element from DOM
        this.parentNode.removeChild(this);
        // update focus task title if focus task no longer exists
        const focusDiv = document.getElementById('focus-task');
        if (focusDiv.querySelector('task-item') === null) {
            const title = document.getElementById('select-focus');
            title.innerHTML = '';
        }
    }

    /** allows user to focus on a task item */
    focus(event) {
        event.stopPropagation();
        // remove task item from parent
        this.parentNode.removeChild(this);
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find((t) => t.id === this.getAttribute('id') && t.text === this.getAttribute('text'));
        const ul = document.getElementById('task-list-elements');
        const title = document.getElementById('select-focus');
        const focusDiv = document.getElementById('focus-task');

        // check if task is a current focus task item
        if (this.getAttribute('focused').toLowerCase() === 'true') {
            // append to end of list and set 'focused' to false
            ul.appendChild(this);
            this.setAttribute('focused', false);
            // update local storage
            task.focused = false;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            // remove title
            title.innerHTML = '';
            // if in focus mode, queue in next task item
            if (localStorage.getItem('state') === 'focus') {
                const list = Array.from(ul.getElementsByTagName('task-item'));
                let allDone = true;
                for (let i = 0; i < list.length; i += 1) {
                    // if the next task item is unchecked
                    // remove from task list and append to focus div
                    if (list[i].getAttribute('checked').toLowerCase() === 'false') {
                        ul.removeChild(list[i]);
                        focusDiv.appendChild(list[i]);
                        list[i].setAttribute('focused', true);
                        const focusNow = tasks.find((t) => t.id === list[i].getAttribute('id') && t.text === list[i].getAttribute('text'));
                        focusNow.focused = true;
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        allDone = false;
                        break;
                    }
                }
                // Notify user if all task items are checked
                if (allDone === true) {
                    title.innerHTML = 'All tasks complete!';
                } else {
                    title.innerHTML = 'Focusing on:';
                }
            }
        } else {
            // update focused attribute
            this.setAttribute('focused', true);
            task.focused = true;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            const focusTask = focusDiv.querySelector('task-item');
            // if there doesn't exist a focus task yet
            if (focusTask === null) {
                focusDiv.appendChild(this);
            } else {
                focusDiv.removeChild(focusTask);
                ul.appendChild(focusTask);
                focusTask.setAttribute('focused', false);
                const unfocus = tasks.find((t) => t.id === focusTask.getAttribute('id') && t.text === focusTask.getAttribute('text'));
                unfocus.focused = false;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                // add 'this' task item to under clock display
                focusDiv.appendChild(this);
            }
            // update title
            title.innerHTML = 'Focusing on:';
        }
    }

    /** create task list item by building custom component */
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // set attributes
        // this.setAttribute('id', task.id);
        // this.setAttribute('checked', task.checked);
        // this.setAttribute('text', task.text);
        // create list node
        const li = document.createElement('li');
        li.setAttribute('id', 'li');
        const check = document.createElement('img');
        check.setAttribute('src', 'icons/check.svg');
        check.setAttribute('class', 'check-icon');
        check.setAttribute('part', 'test');
        li.appendChild(check);
        // add event listener such that clicking on element crosses out task
        this.addEventListener('click', this.toggle);
        const focus = document.createElement('img');
        focus.setAttribute('src', 'icons/focus.svg');
        focus.setAttribute('class', 'focus-icon');
        li.appendChild(focus);
        // add event listener to image to focus a task
        focus.addEventListener('click', this.focus.bind(this));
        // create delete icon
        const trash = document.createElement('img');
        trash.setAttribute('src', 'icons/delete.svg');
        trash.setAttribute('class', 'delete-icon');
        li.appendChild(trash);
        // add event listener to image to remove task
        trash.addEventListener('click', this.removeTask.bind(this));
        // CSS styling
        const style = document.createElement('style');
        style.textContent = `
        :host {
            cursor: pointer;
            //height: 50px;
            height: 3.90625vw;
            position: relative;
            // margin-bottom: 10px;
            // border-radius: 5px;
            border-radius: 0.390625vw;
            // margin-right: 20%;
            box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
            display: flex;
            align-items: center;
            // padding-left: 37px;
            padding-left: 2.890625vw;
            background-color: #f36060;
            color: white;
            // font-size: medium;
            font-size: 1.35vw;
            font-weight: 500;
            border-style:none;
            user-select: none;
            margin: 0 auto;
            // margin-bottom: 10px;
            margin-bottom: 0.78125vw;
        }
        :host(:hover) {
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
        }
        :host([checked = 'true']) {
            background: #f3606060;
            text-decoration: line-through;
            -webkit-text-decoration: line-through;
        }
        :host([checked = 'true']) .check-icon {
            visibility: visible;
        }
        .check-icon {
            position: absolute;
            // left: 10px;
            left: 0.78125vw;
            vertical-align: middle;
            // width: 20px;
            // height: 20px;
            width: 1.5625vw;
            height: 1.5625vw;
            margin: 0;
            visibility: hidden;
        }
        :host(:hover) .delete-icon {
            visibility: visible;
        }
        .delete-icon {
            position: absolute;
            color: #fff;
            // right: 10px;
            right: 0.78125vw;
            vertical-align: middle;
            // width: 20px;
            // height: 20px;
            width: 1.5625vw;
            height: 1.5625vw;
            margin: 0;
            visibility: hidden;
        }
        .delete-icon:hover {
            transform: scale(1.3);
            filter:brightness(105%)
        }
        :host(:hover) .focus-icon {
            visibility: visible;
        }
        .focus-icon {
            position: absolute;
            color: #fff;
            // right: 40px;
            right: 3.125vw;
            vertical-align: middle;
            // width: 20px;
            // height: 20px;
            width: 1.5625vw;
            height: 1.5625vw;
            margin: 0;
            visibility: hidden;
        }
        .focus-icon:hover {
            transform: scale(1.3);
            filter:brightness(105%)
        }
        `;
        shadow.appendChild(li);
        shadow.appendChild(style);
    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        const shadow = this.shadowRoot;
        const text = document.createTextNode(newVal);
        shadow.getElementById('li').append(text);
    }
}

customElements.define('task-item', TaskItem);

// module.exports = TaskItem;
