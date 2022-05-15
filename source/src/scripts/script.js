// require('../components/TaskItem');
// const TaskItem = require('../components/TaskItem');
window.addEventListener('DOMContentLoaded', () => {
    let tasks; // holds list nodes in local storage
    let id; // id counter for task items
    let theme; // UI theme
    let volume; // default volume -> initialized to 50
    let state; // state -> initialized to 'default'
    let clickState; // record for if click sound is enabled
    let alarmState; // record for if alarm sound is enabled

    if (localStorage.getItem('clickState') === null) {
        clickState = 'on'; // default to be on
        localStorage.setItem('clickState', clickState);
    }
    if (localStorage.getItem('alarmState') === null) {
        alarmState = 'on'; // default to be on
        localStorage.setItem('alarmState', alarmState);
    }

    if (localStorage.getItem('tasks') === null || localStorage.getItem('id') === null || localStorage.getItem('theme') === null || localStorage.getItem('volume') === null
        || localStorage.getItem('state') === null || localStorage.getItem('clickState') === null || localStorage.getItem('alarmState') === null) {
        tasks = [];
        id = 0;
        theme = 'light';
        volume = 50;
        state = 'default';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('id', `${id}`);
        localStorage.setItem('theme', theme);
        localStorage.setItem('volume', `${volume}`);
        localStorage.setItem('state', state);
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    // create task items if exists in local storage
    for (let i = 0; i < tasks.length; i += 1) {
        const task = document.createElement('task-item');
        const focusDiv = document.getElementById('focus-task');
        const ul = document.getElementById('task-list-elements');
        const title = document.getElementById('select-focus');
        task.setAttribute('id', tasks[i].id);
        task.setAttribute('checked', tasks[i].checked);
        task.setAttribute('text', tasks[i].text);
        task.setAttribute('focused', tasks[i].focused);
        task.setAttribute('title', 'Click to toggle task completion');
        if (tasks[i].focused === true) {
            title.innerHTML = 'Focusing on:';
            focusDiv.appendChild(task);
        } else {
            ul.appendChild(task);
        }
    }
});
