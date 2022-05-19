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

            // toggle display
            if (this.style.display === 'none') {
                this.style.display = 'flex';
            } else {
                this.style.display = 'none';
            }

            // hide focus button when task is complete
            if (task.checked) {
                this.shadowRoot.querySelector('.focus-icon').style.display = 'none';
            } else {
                this.shadowRoot.querySelector('.focus-icon').style.display = 'initial';
            }

            // save to local storage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // call focus function if task is set to complete during focus
            if (this.getAttribute('focused') === 'true' && task.checked) {
                this.focus(null);
            }
        }
    }

    /** removes custom element from DOM and deletes task from localStorage */
    removeTask() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        // find and remove task from localStorage
        tasks.splice(tasks.findIndex((task) => task.id === this.getAttribute('id') && task.text === this.getAttribute('text')), 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // remove this element from DOM
        this.remove();
        // update focus task title if focus task no longer exists
        const focusDiv = document.getElementById('focus-task');
        if (focusDiv.querySelector('task-item') === null) {
            const title = document.getElementById('select-focus');
            title.innerHTML = '';
        }
    }

    /** allows user to focus on a task item */
    focus(event) {
        // for generic focus call
        if (event) {
            event.stopPropagation();
        }

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
                // focusTask can only be the child of one task. implicit removeChild
                ul.appendChild(focusTask);
                focusTask.setAttribute('focused', false);
                const unfocus = tasks.find((t) => t.id === focusTask.getAttribute('id'));
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
        const template = document.getElementById('task-item-template');
        const templateContent = template.content;
        shadow.appendChild(templateContent.cloneNode(true));

        Object.defineProperties(this, {
            _bindedFocus: {
                value: this.focus.bind(this),
            },
            _bindedRemoveTask: {
                value: this.removeTask.bind(this),
            },
        });
    }

    connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        // set attributes
        // this.setAttribute('id', task.id);
        // this.setAttribute('checked', task.checked);
        // this.setAttribute('text', task.text);

        // add event listener such that clicking on element crosses out task
        this.addEventListener('click', this.toggle);

        // We add these event listeners here since they require these icons in
        // the DOM to actually function. Otherwise, how else would they be used
        // We also keep the binded functions to disconnect them later
        const focus = this.shadowRoot.querySelector('.focus-icon');
        focus.addEventListener('click', this._bindedFocus);

        const trash = this.shadowRoot.querySelector('.delete-icon');
        // add event listener to image to remove task
        trash.addEventListener('click', this._bindedRemoveTask);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.toggle);

        const focus = this.shadowRoot.querySelector('.focus-icon');
        const trash = this.shadowRoot.querySelector('.delete-icon');
        focus.removeEventListener('click', this._bindedFocus);
        trash.removeEventListener('click', this._bindedRemoveTask);
    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        this.shadowRoot.getElementById('task-text').textContent = newVal;
    }
}

customElements.define('task-item', TaskItem);

// module.exports = TaskItem;
