import '../src/components/HelpPopUp';

window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
beforeEach(() => {
    localStorage.setItem('volume', 50);
    localStorage.setItem('tasks', '[]');
    localStorage.setItem('id', '0');
    document.body.innerHTML = `
    <button class="top-buttons" id="help-button">
        <img src="icons/help.svg" id="help" class="top-button-img" alt="help">
    </button>
    `;
});

test(('create help popup on load'), () => {
    dispatchEvent(new Event('load'));
    expect(document.querySelector('help-popup')).not.toBeNull();
});
test(('popup help window when help button is clicked'), () => {
    dispatchEvent(new Event('load'));
    const helpBtn = document.getElementById('help-button');
    helpBtn.click();
    const helpPopUp = document.querySelector('help-popup');
    expect(helpPopUp.shadowRoot.getElementById('help-popup').style.display).toBe('block');
});

test(('close icon works properly'), () => {
    const helpPopUp = document.createElement('help-popup');
    const helpBtn = document.getElementById('help-button');
    helpBtn.click();
    const close = helpPopUp.shadowRoot.getElementById('close-icon');
    close.click();
    expect(helpPopUp.shadowRoot.getElementById('help-popup').style.display).toBe('none');
});
