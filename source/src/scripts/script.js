(function initializeLocalStorage() {
    const defaults = {
        tasks: '[]',
        id: 0,
        theme: 'light',
        volume: 50,
        state: 'default',
        'tab-label': 'on',
        clickState: 'on',
        alarmState: 'on',
        prevClickState: 'on',
        prevAlarmState: 'on',
        prevTabState: 'on',
        prevVolume: 50,
        'pomo-length': 25,
        'short-break-length': 5,
        'long-break-length': 15,
    };

    Object.entries(defaults).forEach(([key, value]) => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, value.toString());
        }
    });
}());

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks'));
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

function buildTaskList() {
    const tasks = getTasks();

    const taskNodes = tasks.map((task) => {
        const taskNode = document.createElement('task-item');
        Object.entries(task).forEach(([key, value]) => {
            taskNode.setAttribute(key, value);
        });
        taskNode.setAttribute('title', 'Click to toggle task completion');
        return taskNode;
    });

    return taskNodes;
}

// require('../components/TaskItem');
// const TaskItem = require('../components/TaskItem');
window.addEventListener('DOMContentLoaded', () => {
    const upNextBtn = document.getElementById('up-next');
    const completedBtn = document.getElementById('completed');

    const focusDiv = document.getElementById('focus-task');
    const focusDivTitle = document.getElementById('select-focus');
    const tasklist = document.getElementById('task-list-elements');

    const taskNodes = buildTaskList();
    taskNodes.forEach((taskNode) => {
        if (taskNode.getAttribute('focused') === 'true') {
            focusDivTitle.textContent = 'Focusing on:';
            focusDiv.appendChild(taskNode);
        } else {
            tasklist.appendChild(taskNode);
        }
    });

    // hide completed tasks while showing incomplete
    showInComplete();

    upNextBtn.addEventListener('click', showInComplete);
    completedBtn.addEventListener('click', showCompleted);

    // document.getElementById('click-snd').volume = localStorage.getItem('volume') / 100;
});
