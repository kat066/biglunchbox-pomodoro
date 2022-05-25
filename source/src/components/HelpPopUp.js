/** Help documentation modal component */
/**
 * The class is create a shadow dom and add every elements or detail in the dom and
 * include the style of the web.
 * @constructor The constructor would reset and show everything in pages
 */
class HelpPopUp extends HTMLElement {
    /** Closes the modal */
    closePopUp() {
        const wrapper = this.shadowRoot.getElementById('help-popup');
        wrapper.style.display = 'none';
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'help-popup');
        const close = wrapper.appendChild(document.createElement('img'));
        close.setAttribute('src', 'icons/close.svg');
        close.setAttribute('id', 'close-icon');
        const title = wrapper.appendChild(document.createElement('h3'));
        title.innerHTML = 'Help';
        close.addEventListener('click', this.closePopUp.bind(this));
        const helpContainer = wrapper.appendChild(document.createElement('div'));
        helpContainer.setAttribute('id', 'help-container');
        const instructionsDiv = helpContainer.appendChild(document.createElement('div'));
        instructionsDiv.setAttribute('id', 'how-to');
        const howTo = instructionsDiv.appendChild(document.createElement('h4'));
        howTo.innerHTML = 'How to use the Pomodoro Timer';
        const howToContent = instructionsDiv.appendChild(document.createElement('ol'));
        howToContent.setAttribute('id', 'how-to-content');
        const step1 = howToContent.appendChild(document.createElement('li'));
        step1.innerHTML = "Add tasks using the '+' button";
        const step2 = howToContent.appendChild(document.createElement('li'));
        step2.innerHTML = 'Set pomodoro and break lengths in the settings (or use the default values)';
        const step3 = howToContent.appendChild(document.createElement('li'));
        step3.innerHTML = 'Select a task to focus on using the magnifying glass icon';
        const step4 = howToContent.appendChild(document.createElement('li'));
        step4.innerHTML = 'Start the timer and be productive!';
        const step5 = howToContent.appendChild(document.createElement('li'));
        step5.innerHTML = 'Take a break when the alarm rings';
        const step6 = howToContent.appendChild(document.createElement('li'));
        step6.innerHTML = 'Repeat steps 3-5 to satisfaction';

        const featuresDiv = helpContainer.appendChild(document.createElement('div'));
        featuresDiv.setAttribute('id', 'features');
        const featuresTitle = featuresDiv.appendChild(document.createElement('h4'));
        featuresTitle.innerHTML = 'Features';
        const featuresContent = featuresDiv.appendChild(document.createElement('ul'));
        featuresContent.setAttribute('id', 'features-content');
        const feature1 = featuresContent.appendChild(document.createElement('li'));
        feature1.innerHTML = 'Dark mode theme for late night work sessions';
        const feature2 = featuresContent.appendChild(document.createElement('li'));
        feature2.innerHTML = 'Audio notifications at end of pomodoro sessions';
        const feature3 = featuresContent.appendChild(document.createElement('li'));
        feature3.innerHTML = 'Customizable pomodoro and break intervals';
        const feature4 = featuresContent.appendChild(document.createElement('li'));
        feature4.innerHTML = 'Ability to focus, mark as completed, and delete tasks';
        const feature5 = featuresContent.appendChild(document.createElement('li'));
        feature5.innerHTML = 'Focus mode to eliminate page distractions and allow for greater focus on current task';

        const accessibilityDiv = helpContainer.appendChild(document.createElement('div'));
        accessibilityDiv.setAttribute('id', 'accessibility');
        const accessibilityTitle = accessibilityDiv.appendChild(document.createElement('h4'));
        accessibilityTitle.innerHTML = 'Keyboard Shortcuts';
        const accessibilityContent = accessibilityDiv.appendChild(document.createElement('ul'));
        accessibilityContent.setAttribute('id', 'accessibility-content');
        const shortcut1 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut1.innerHTML = "'h' - Help page pop up";
        const shortcut2 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut2.innerHTML = "';' - Settings pop up";
        const shortcut3 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut3.innerHTML = "'r' - Reset pop up";
        const shortcut4 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut4.innerHTML = "'f' - Focus mode";
        const shortcut5 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut5.innerHTML = "'s' - Start/stop";
        const shortcut6 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut6.innerHTML = "'a' - Add task";
        const shortcut7 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut7.innerHTML = "'Enter' - Confirm/Add";
        const shortcut8 = accessibilityContent.appendChild(document.createElement('li'));
        shortcut8.innerHTML = "'Esc' - Cancel/Close";

        // use ::part pseudo-element to style element outside of shadow tree -- for dark mode
        wrapper.setAttribute('part', 'popup-wrapper');
        close.setAttribute('part', 'close-icon');
        title.setAttribute('part', 'help-h3');
        instructionsDiv.setAttribute('part', 'instructions');
        featuresDiv.setAttribute('part', 'features');
        accessibilityDiv.setAttribute('part', 'accessibility');
        howTo.setAttribute('part', 'h4');
        featuresTitle.setAttribute('part', 'h4');
        accessibilityTitle.setAttribute('part', 'h4');

        // CSS styling
        const style = document.createElement('style');
        style.textContent = `
        #accessibility-content li{
            margin-bottom: 0.390625vw;
        }
        #accessibility-content {
            padding: 0;
            margin-left: 1.875vw;
            font-size: 1vw;
        }
        #accessibility {
            font-weight: 500;
            color: rgb(85, 85, 85);
        }
        #features-content li {
            margin-bottom: 0.390625vw;
        }
        #features-content {
            padding: 0;
            margin-left: 1.875vw;
            font-size: 1vw;
        }
        #features {
            font-weight: 500;
            color: rgb(85, 85, 85);
        }
        #how-to-content li {
            margin-bottom: 0.390625vw;
        }
        #how-to-content {
            padding: 0;
            margin-left: 1.875vw;
            font-size: 1vw;
        }
        #how-to {
            font-weight: 500;
            color: rgb(85, 85, 85);
        }
        h4 {
            font-size: 1.15vw;
            color: rgb(85, 85, 85);
            font-weight: 500;
        }
        #help-container {
            width: 85%;
            margin: 0 auto;
            // height: 80%;
            height: 28.125vw;
            overflow: auto;
        }
        #close-icon {
            // width: 15px;
            width: 1.171875vw;
            // margin-top: 10px;
            // margin-right: 10px;
            margin-top: 0.78125vw;
            margin-right: 0.78125vw;
            position:absolute;
            top:0;
            right:0;
            cursor: pointer;
            opacity: 0.33;
        }
        #close-icon:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        #help-popup {
            display: none;
            position: fixed;
            // width: 30%;
            // width: 52%;
            width: 51.953125vw;
            // height: 30%;
            height: 35.15625vw;
            // border-radius: 4px;
            border-radius: 0.3125vw;
            top:18%;
            // left: 34%;
            left: 24%;
            z-index: 999;
            background-color: whitesmoke;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            -webkit-animation-name: animatetop; 
            -webkit-animation-duration: 0.3s;
            animation-name: animatetop;
            animation-duration: 0.3s
        }
        @-webkit-keyframes animatetop {
            from {top:-200px; opacity:0} 
            to {top:70; opacity:1}
        }
        @keyframes animatetop {
            from {top:-200px; opacity:0}
            to {top:70; opacity:1}
        }
        #help-popup > h3{
            font-size: 1.6vw;
            color: #f36060;
            border-bottom: solid 1px #d2d2d2;
            // padding-bottom: 5px;
            padding-bottom: 0.390625vw;
            width: 85%;
            font-weight: 500;
            // margin: 20px auto 10px auto;
            margin: 1.5625vw auto 0.78125vw auto;
        }`;
        shadow.appendChild(wrapper);
        shadow.appendChild(style);
    }
}
customElements.define('help-popup', HelpPopUp);

window.addEventListener('load', () => {
    const helpPopUp = document.createElement('help-popup');
    helpPopUp.setAttribute('class', 'popup');
    document.body.appendChild(helpPopUp);
    const helpBtn = document.getElementById('help-button');
    helpBtn.addEventListener('click', () => {
        const btnSound = new Audio('./icons/btnClick.mp3');
        btnSound.volume = 0.01 * parseInt(localStorage.getItem('volume'), 10);
        btnSound.play();
        // this makes sure any popup is closed before opening current popup
        const popups = Array.from(document.getElementsByClassName('popup'));
        for (let i = 0; i < popups.length; i += 1) {
            popups[i].closePopUp();
        }
        helpPopUp.shadowRoot.getElementById('help-popup').setAttribute('style', 'display:block');
    });
});
