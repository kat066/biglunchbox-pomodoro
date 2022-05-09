/* eslint-disable jest/expect-expect */
// returning false here prevents Cypress from
// failing the test
Cypress.on('uncaught:exception', () => false);
describe(('task list and timer'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
    });
    it('add task when timer has started', () => {
        // start timer
        cy.get('#start-btn').trigger('click');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#add-task-popup')
            .should('have.css', 'display', 'block');
        // test empty input behave as expected
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#add-task-popup')
            .should('have.css', 'display', 'block');
        // add task 1
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        // task is added successfully
        cy.url().should(() => {
            expect(localStorage.getItem('id')).contains('1');
            expect(localStorage.getItem('tasks')).contains('test item 1');
        });
        // timer runs without affect
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it('add task when timer has started (keyboard)', () => {
        // start timer
        cy.get('#start-btn').trigger('click');
        cy.get('body').type('a');
        cy.get('task-popup').shadow()
            .find('#add-task-popup').should('have.css', 'display', 'block');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        // random key has no affect
        cy.get('body').type('b');
        cy.get('task-popup').shadow()
            .find('#add-task-popup').should('have.css', 'display', 'block');
        cy.get('body').type('{esc}');
        cy.get('task-popup').shadow()
            .find('#add-task-popup').should('have.css', 'display', 'none');
        // add task 1
        cy.get('body').type('a');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        cy.get('body').type('{enter}');
        // task is added successfully
        cy.url().should(() => {
            expect(localStorage.getItem('id')).contains('1');
            expect(localStorage.getItem('tasks')).contains('test item 1');
        });
        // timer runs without affect
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it(('start the timer while adding the task'), () => {
        cy.get('#task-popup-btn').trigger('click');
        cy.get('#start-btn').trigger('click');
        // timer runs without affect
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        // interact with the timer
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('#start-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        // task is added successfully
        cy.get('#0').shadow()
            .find('li')
            .should('have.text', 'test item 1');
        cy.url().should(() => {
            expect(localStorage.getItem('id')).contains('1');
            expect(localStorage.getItem('tasks')).contains('test item 1');
        });
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it('cancel add task when timer has started', () => {
        // start timer
        cy.get('#start-btn').trigger('click');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#close-icon').trigger('click');
        // timer runs without affect
        cy.get('task-item').should('have.length', 0);
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it(('start the timer while adding the task then cancel'), () => {
        cy.get('#task-popup-btn').trigger('click');
        cy.get('#start-btn').trigger('click');
        // timer runs without affect
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('task-popup').shadow()
            .find('#close-icon').trigger('click');
        cy.get('task-item').should('have.length', 0);
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });
});

describe(('interact with exist task list while timer is runing'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 2', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.visit('http://127.0.0.1:5500');
    });
    it(('toggle the tasks while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#0').trigger('click');
        cy.get('#0').should('have.css', 'text-decoration', 'line-through solid rgb(255, 255, 255)');
        cy.get('#0').trigger('click');
        cy.get('#0').should('have.css', 'text-decoration', 'none solid rgb(255, 255, 255)');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it(('delete the tasks while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#0').shadow()
            .find('img[src="icons/delete.svg"]').click({ force: true });
        cy.get('#0').should('have.length', 0);
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it(('switch a focus on a task while timer is running'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#0').shadow().find('img[class="focus-icon"]').click({ force: true });
        // focus task is set correctly
        cy.get('#0').parent().should('have.id', 'focus-task');
        cy.get('#1').parent().should('have.id', 'task-list-elements');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });

    it(('unfocus a task while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#1').parent().should('have.id', 'task-list-elements');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
    });
});

describe('reset popup and timer', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
        // add task 1
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        // add task 2
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 2', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
    });

    it(('reset when timer has started (with focus tasks)'), () => {
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#start-btn').click();
        cy.get('#reset-button').click();
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('reset-popup').shadow()
            .find('#confirm-reset-btn').click();
        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Start');
        cy.get('task-item').should('have.length', 0);
        cy.url().should(() => {
            expect(localStorage.getItem('id')).contains('0');
            expect(localStorage.getItem('tasks')).contains('[]');
        });
    });

    it(('start the timer when reset'), () => {
        cy.get('#reset-button').click();
        cy.get('#start-btn').click();
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('reset-popup').shadow()
            .find('#confirm-reset-btn').click();
        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Start');
        cy.get('task-item').should('have.length', 0);
        cy.url().should(() => {
            expect(localStorage.getItem('id')).contains('0');
            expect(localStorage.getItem('tasks')).contains('[]');
        });
    });

    it(('reset then cancel when timer has started'), () => {
        cy.get('#start-btn').click();
        cy.get('#reset-button').click();
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('reset-popup').shadow()
            .find('#close-icon').click();
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Stop');
        cy.get('task-item').should('have.length', 2);
    });

    it(('start the timer when reset then cancel'), () => {
        cy.get('#reset-button').click();
        cy.get('#start-btn').click();
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('reset-popup').shadow()
            .find('#close-icon').click();
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Stop');
        cy.get('task-item').should('have.length', 2);
    });
});

describe('setting popup and timer', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
    });

    it(('set time while timer is runing, stop and reset the timer'), () => {
        // start the timer
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        // set the times
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('#pomo-length-input')
            .invoke('val', 3);
        cy.get('settings-popup').shadow()
            .find('#short-break-input')
            .invoke('val', 1);
        cy.get('settings-popup').shadow()
            .find('#long-break-input')
            .invoke('val', 2);
        cy.get('settings-popup').shadow()
            .find('#confirm-settings-btn')
            .trigger('click');
        // check pomo time
        cy.get('#timer_display_duration').should('have.text', '3:00');
        cy.get('#start-btn').should('have.text', 'Start');
        cy.clock();
        cy.get('#start-btn').trigger('click');
        // check short break time
        cy.tick(181000);
        cy.get('#timer_display_duration').should('have.text', '0:59');
        // check long break time
        cy.tick(59000);
        cy.tick(180000);
        cy.tick(60000);
        cy.tick(180000);
        cy.tick(60000);
        cy.tick(181000);
        cy.get('#timer_display_duration').should('have.text', '1:59');
        // test when class are toggled
        cy.get('#start-btn').trigger('click');
        cy.get('#start-btn').trigger('click');
        cy.get('#pomo-btn').invoke('attr', 'class', '');
        cy.tick(180000);
        cy.get('#pomo-btn').invoke('attr', 'class', 'toggle');
        cy.tick(60000);
        cy.tick(180000);
        cy.tick(60000);
        cy.tick(180000);
        cy.tick(60000);
        cy.tick(180000);
        cy.get('#pomo-btn').invoke('attr', 'class', 'toggle');
        cy.tick(1000);
        cy.get('#timer_display_duration').should('have.text', '1:59');
    });

    it(('set time incorrectly resets values to default'), () => {
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('#pomo-length-input')
            .invoke('val', '');
        cy.get('settings-popup').shadow()
            .find('#short-break-input')
            .invoke('val', '');
        cy.get('settings-popup').shadow()
            .find('#long-break-input')
            .invoke('val', '');
        cy.get('settings-popup').shadow()
            .find('#confirm-settings-btn')
            .trigger('click');

        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Start');
    });

    it(('set time then cancel while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('#pomo-length-input')
            .invoke('val', 3);
        cy.get('settings-popup').shadow()
            .find('#close-icon')
            .trigger('click');
        cy.get('#timer_display_duration').should('have.text', '24:57');
        cy.get('#start-btn').should('have.text', 'Stop');
    });

    it(('switch to dark mode while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('span[id="mode-switch-slider"]')
            .click();
        cy.get('#timer_display_duration').should('have.text', '24:57');
        cy.url().should(() => {
            expect(localStorage.getItem('theme')).contains('dark');
        });
    });

    it(('set volume while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('#range')
            .invoke('val', 30)
            .trigger('change');
        cy.get('settings-popup').shadow()
            .find('#range')
            .trigger('input');
        cy.url().should(() => {
            expect(localStorage.getItem('volume')).contains('30');
        });
        cy.get('settings-popup').shadow()
            .find('#volume-number').should('have.text', '30');
        cy.get('#timer_display_duration').should('have.text', '24:57');
    });
});

describe(('helping popup and timer'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
    });

    it(('view help popup while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#help-button').click();
        cy.get('help-popup').shadow()
            .find('#help-popup')
            .should('have.css', 'display', 'block');
        cy.get('#timer_display_duration').should('have.text', '24:58');
        cy.get('help-popup').shadow()
            .find('#close-icon')
            .click();
        cy.get('help-popup').shadow()
            .find('#help-popup')
            .should('have.css', 'display', 'none');
        cy.get('#timer_display_duration').should('have.text', '24:56');
    });
});

describe(('in dark mode'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('span[id="mode-switch-slider"]')
            .trigger('click');
        cy.get('settings-popup').shadow()
            .find('#close-icon')
            .click();
        cy.visit('http://127.0.0.1:5500');
    });
    it(('switch to light mode while timer is runing'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#setting-button').trigger('click');
        cy.get('settings-popup').shadow()
            .find('span[id="mode-switch-slider"]')
            .trigger('click');
        cy.get('#timer_display_duration').should('have.text', '24:57');
        cy.url().should(() => {
            expect(localStorage.getItem('theme')).contains('light');
        });
    });
});

describe(('toggle focus mode while timer is runing'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
    });
    it(('toggle to focus mode'), () => {
        cy.get('#start-btn').trigger('click');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#focus-button').click();
        // state changed successfully
        cy.url().should(() => {
            expect(localStorage.getItem('state')).contains('focus');
        });
        // timer runs as intended
        cy.get('#timer_display_duration').should('have.text', '24:58');
        cy.get('#start-btn').should('have.text', 'Stop');
        // toggle back to normal mode
        cy.get('#focus-button').click();
        cy.url().should(() => {
            expect(localStorage.getItem('state')).contains('default');
        });
        cy.get('#timer_display_duration').should('have.text', '24:56');
        cy.get('#start-btn').should('have.text', 'Stop');
    });
});

describe(('task list in focus mode'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 2', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#focus-button').click();
        cy.visit('http://127.0.0.1:5500');
    });

    it(('toggle task in focus mode'), () => {
        cy.get('#1').trigger('click');
        cy.get('#1').should('have.css', 'text-decoration', 'line-through solid rgb(255, 255, 255)');
        cy.get('#1').trigger('click');
        cy.get('#1').should('have.css', 'text-decoration', 'none solid rgb(255, 255, 255)');
    });
    it(('unfocus a task and queue in the next task'), () => {
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#0').parent().should('have.id', 'focus-task');
    });

    it(('all task are checked'), () => {
        cy.get('#1').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#0').trigger('click');
        cy.get('#0').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#select-focus').should('have.text', 'All tasks complete!');
    });

    it(('switch back to normal mode with correct task list'), () => {
        // cross out 2 and focus on 1
        cy.get('#1').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        // switch back
        cy.get('#focus-button').click();
        // 1 is the focus and 2 is in the task list and crossed out
        cy.get('#0').parent().should('have.id', 'focus-task');
        cy.get('#1').parent().should('have.id', 'task-list-elements');
        cy.get('#1').should('have.css', 'text-decoration', 'line-through solid rgb(255, 255, 255)');
    });

    it(('switch back to normal mode when all task are done'), () => {
        cy.get('#1').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#0').trigger('click');
        cy.get('#0').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#focus-button').click();
        // check the task list
        cy.get('#0').parent().should('have.id', 'task-list-elements');
        cy.get('#1').parent().should('have.id', 'task-list-elements');
        cy.get('#0').should('have.css', 'text-decoration', 'line-through solid rgb(255, 255, 255)');
        cy.get('#1').should('have.css', 'text-decoration', 'line-through solid rgb(255, 255, 255)');
        // TODO: check focus task
        // cy.get('#select-focus').should('have.text', '');
    });
});

describe(('keyboard shortcut and focus mode'), () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 1', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('#task-popup-btn').trigger('click');
        cy.get('task-popup').shadow()
            .find('#task-input')
            .type('test item 2', { force: true });
        cy.get('task-popup').shadow()
            .find('#add-task-btn').trigger('click');
        cy.get('#1').shadow().find('img[class="focus-icon"]').click({ force: true });
        cy.get('#focus-button').click();
    });
    it(('random key have no affect'), () => {
        cy.get('body').type('q');
        cy.get('body').type('{enter}');
        cy.get('body').type('{esc}');
        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('reset-popup').shadow()
            .find('#reset-confirm-popup').should('have.css', 'display', 'none');
        cy.get('help-popup').shadow()
            .find('#help-popup')
            .should('have.css', 'display', 'none');
        cy.get('settings-popup').shadow()
            .find('#settings-confirm-popup').should('have.css', 'display', 'none');
        cy.url().should(() => {
            expect(localStorage.getItem('state')).contains('focus');
        });

        cy.get('task-popup').shadow()
            .find('#add-task-popup').should('have.css', 'display', 'none');
    });
    it(('start and stop the timer'), () => {
        cy.get('body').type('s');
        cy.get('#timer_display_duration').should('not.have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Stop');
        cy.get('body').type('s');
        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('#start-btn').should('have.text', 'Start');
    });

    it(('reset and confirm/cancel'), () => {
        cy.get('body').type('r');
        cy.get('reset-popup').shadow()
            .find('#reset-confirm-popup').should('have.css', 'display', 'block');
        cy.get('body').type('{esc}');
        cy.get('reset-popup').shadow()
            .find('#reset-confirm-popup').should('have.css', 'display', 'none');
        cy.get('task-item').should('have.length', 2);
        // reset and confirm
        cy.get('body').type('r');
        cy.get('reset-popup').shadow()
            .find('#reset-confirm-popup').should('have.css', 'display', 'block');
        cy.get('body').type('{enter}');
        cy.get('reset-popup').shadow()
            .find('#reset-confirm-popup').should('have.css', 'display', 'none');
        cy.get('task-item').should('have.length', 0);
    });

    it(('setting confirm/cancel'), () => {
        cy.get('body').type(';');
        cy.get('settings-popup').shadow()
            .find('#settings-confirm-popup').should('have.css', 'display', 'block');
        cy.get('body').type('{esc}');
        cy.get('settings-popup').shadow()
            .find('#settings-confirm-popup').should('have.css', 'display', 'none');
        cy.get('#timer_display_duration').should('have.text', '25:00');
        // set and confirm
        cy.get('body').type(';');
        cy.get('settings-popup').shadow()
            .find('#settings-confirm-popup').should('have.css', 'display', 'block');
        cy.get('settings-popup').shadow()
            .find('#pomo-length-input')
            .invoke('val', 3);
        cy.get('body').type('{enter}');
        cy.get('settings-popup').shadow()
            .find('#settings-confirm-popup').should('have.css', 'display', 'none');
        cy.get('#timer_display_duration').should('have.text', '3:00');
    });

    it(('help popup'), () => {
        cy.get('body').type('h');
        cy.get('help-popup').shadow()
            .find('#help-popup')
            .should('have.css', 'display', 'block');
        cy.get('body').type('{esc}');
        cy.get('help-popup').shadow()
            .find('#help-popup')
            .should('have.css', 'display', 'none');
    });

    it(('switch mode'), () => {
        cy.get('body').type('f');
        cy.url().should(() => {
            expect(localStorage.getItem('state')).contains('default');
        });
        cy.get('body').type('f');
        cy.url().should(() => {
            expect(localStorage.getItem('state')).contains('focus');
        });
    });

    it(('add task disabled'), () => {
        cy.get('body').type('a');
        cy.get('task-popup').shadow()
            .find('#add-task-popup').should('have.css', 'display', 'none');
    });

    it(('when task-pop is undefined'), () => {
        cy.get('#focus-button').click();
        cy.get('task-popup').shadow()
            .find('#add-task-popup').invoke('attr', 'style', 'display: inline');
        cy.get('body').type('s');
        cy.get('#timer_display_duration').should('have.text', '25:00');
        cy.get('reset-popup').shadow()
            .find('#reset-confirm-popup').should('have.css', 'display', 'none');
        cy.get('help-popup').shadow()
            .find('#help-popup')
            .should('have.css', 'display', 'none');
        cy.get('settings-popup').shadow()
            .find('#settings-confirm-popup').should('have.css', 'display', 'none');
        cy.url().should(() => {
            expect(localStorage.getItem('state')).contains('default');
        });
    });
});