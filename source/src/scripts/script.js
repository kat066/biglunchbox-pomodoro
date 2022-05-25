function getTasks() {
    let tasks; // holds list nodes in local storage
    let id; // id counter for task items
    let theme; // UI theme
    let tabLabel;
    let volume; // default volume -> initialized to 50
    let state; // state -> initialized to 'default'
    let clickState; // record for if click sound is enabled
    let alarmState; // record for if alarm sound is enabled

    if (localStorage.getItem('clickState') === null) {
        clickState = 'on'; // default to be on
        localStorage.setItem('clickState', clickState);
        // initializing previous state
        localStorage.setItem('prevClickState', clickState);
    }
    if (localStorage.getItem('alarmState') === null) {
        alarmState = 'on'; // default to be on
        localStorage.setItem('alarmState', alarmState);
        // initializing previous state
        localStorage.setItem('prevAlarmState', alarmState);
    }

    if (localStorage.getItem('tasks') === null || localStorage.getItem('id') === null || localStorage.getItem('theme') === null
        || localStorage.getItem('tab-label') === null || localStorage.getItem('volume') === null || localStorage.getItem('state') === null
        || localStorage.getItem('clickState') === null || localStorage.getItem('alarmState') === null) {
        tasks = [];
        id = 0;
        theme = 'light';
        tabLabel = 'on';
        volume = 50;
        state = 'default';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('id', `${id}`);
        localStorage.setItem('theme', theme);
        localStorage.setItem('tab-label', tabLabel);
        localStorage.setItem('prevTabState', tabLabel);
        localStorage.setItem('volume', `${volume}`);
        localStorage.setItem('prevVolume', `${volume}`); // prev state tracking
        localStorage.setItem('state', state);
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    return tasks;
}

function showInComplete() {
    const tasks = document.getElementById('task-list-elements').children;
    const upNextBtn = document.getElementById('up-next');
    const completedBtn = document.getElementById('completed');

    upNextBtn.setAttribute('data-selected', 'true');
    completedBtn.setAttribute('data-selected', 'false');
    for (let i = 0; i < tasks.length; i += 1) {
        if (tasks[i].getAttribute('checked') === 'false') {
            tasks[i].style.display = 'flex';
        } else {
            tasks[i].style.display = 'none';
        }
    }
}

function showCompleted() {
    const tasks = document.getElementById('task-list-elements').children;
    const upNextBtn = document.getElementById('up-next');
    const completedBtn = document.getElementById('completed');

    upNextBtn.setAttribute('data-selected', 'false');
    completedBtn.setAttribute('data-selected', 'true');
    for (let i = 0; i < tasks.length; i += 1) {
        if (tasks[i].getAttribute('checked') === 'true') {
            tasks[i].style.display = 'flex';
        } else {
            tasks[i].style.display = 'none';
        }
    }
}

// require('../components/TaskItem');
// const TaskItem = require('../components/TaskItem');
window.addEventListener('DOMContentLoaded', () => {
    const upNextBtn = document.getElementById('up-next');
    const completedBtn = document.getElementById('completed');

    // holds list nodes in local storage
    // id counter for task items
    // UI theme
    // default volume -> initialized to 50
    // state -> initialized to 'default'
    const tasks = getTasks();

    const ul = document.getElementById('task-list-elements');
    // create task items if exists in local storage
    for (let i = 0; i < tasks.length; i += 1) {
        const task = document.createElement('task-item');
        const focusDiv = document.getElementById('focus-task');
        const title = document.getElementById('select-focus');
        task.setAttribute('id', tasks[i].id);
        task.setAttribute('checked', tasks[i].checked);
        task.setAttribute('text', tasks[i].text);
        task.setAttribute('focused', tasks[i].focused);
        task.setAttribute('title', 'Click to toggle task completion');

        // hide completed tasks while showing incomplete
        if (tasks[i].checked) {
            task.style.display = 'none';
            task.shadowRoot.querySelector('.focus-icon').style.display = 'none';
        } else {
            task.style.display = 'flex';
            task.shadowRoot.querySelector('.focus-icon').style.display = 'initial';
        }

        if (tasks[i].focused === true) {
            title.innerHTML = 'Focusing on:';
            focusDiv.appendChild(task);
        } else {
            ul.appendChild(task);
        }
    }

    upNextBtn.addEventListener('click', showInComplete);
    completedBtn.addEventListener('click', showCompleted);
});
