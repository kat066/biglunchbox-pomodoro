window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
beforeEach(() => {
    require('../src/scripts/script');
    require('../src/components/TaskItem');
    localStorage.setItem('tasks', '[]');
    localStorage.setItem('id', '0');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('volume', 50);
    localStorage.setItem('state', 'default');
    document.body.innerHTML = `
        <ul id="task-list-elements">
        </ul>   
        <div id='focus-task'>
            <h2 id='select-focus'></h2>
        </div>   
    `;
});

afterEach(() => {
    localStorage.clear();
});

test('Initializes localStorage correctly', () => {
    localStorage.clear();

    window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
    }));
    expect(localStorage.getItem('tasks')).toBe('[]');
    expect(localStorage.getItem('id')).toBe('0');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(localStorage.getItem('volume')).toBe('50');
    expect(document.getElementById('task-list-elements').children).toHaveLength(0);
});

test('Reads task list and creates one task correctly', () => {
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false}]');

    window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
    }));

    expect(document.getElementById('task-list-elements').children).toHaveLength(1);

    const taskItem = document.getElementById('task-list-elements').children[0];
    expect(taskItem.getAttribute('checked')).toBe('false');
    expect(taskItem.id).toBe('0');
    expect(taskItem.getAttribute('text')).toBe('test_task');
    expect(taskItem.getAttribute('focused')).toBe('false');
});

test('Reads task list and creates multiple tasks correctly', () => {
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false},'
    + '{"id":"1","checked":false,"text":"test_task1","focused":false}]');

    window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
    }));

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
    localStorage.setItem('tasks', '[{"id":"0","checked":false,"text":"test_task","focused":false},'
    + '{"id":"1","checked":false,"text":"test_task1","focused":true}]');

    window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
    }));

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

// test(('save dark theme'), () => {
//     localStorage.setItem('theme', 'dark');
//     dispatchEvent(new Event('DOMContentLoaded'));
//     expect(document.body.classList).toContain('dark-theme');
// });
