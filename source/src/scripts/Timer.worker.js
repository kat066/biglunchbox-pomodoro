/* eslint-disable no-restricted-globals */

/**
 * @file Webworker for the pomodoro timer. Used when browser/environment supports
 * webworkers and maintains driftless intervals.
 * @author Juhmer Tena
 * @module Timer.worker.js
 */

/**
 * Remaining time in seconds for timerFunction
 * @type {number}
 */
let remainingTime;

let /** @type {AccurateInterval} */ timer;

/**
 * Class representing a self-correcting interval.
 * @property {(timeoutID|intervalID)} timer - Maintains timeouts/intervals and checks it
 *     against the drift.
 * @property {number} expectedTime - Expected tiemstamp the next tick would be run
 */
class AccurateInterval {
    /**
     * Creates an accurate interval with an acceptable drift.
     * @param {function} cb - Callback function
     * @param {any[]} args - Arguments to the callback function
     * @param {number} interval - Interval in milliseconds
     * @param {number} acceptableDrift - Allowed drift in milliseconds
     */
    constructor(cb, args, interval, acceptableDrift) {
        this.cb = cb;
        this.args = args;
        this.interval = interval;
        this.acceptableDrift = acceptableDrift;
    }

    /**
     * Starts the accurate interval
     * @param {boolean} noZeroTick - Checks to see if we want a zerotick callback run.
     */
    start(noZeroTick) {
        if (noZeroTick) {
            this.expectedTime = Date.now() + this.interval;
            this.tick();
        } else {
            this.tick(true);
        }
    }

    /**
     * Each run of the accurate interval
     * @param {boolean} attemptedCorrection
     */
    tick(attemptedCorrection) {
        this.cb(...(this.args || []));

        const currentTime = Date.now();
        if (typeof this.expectedTime === 'undefined') this.expectedTime = currentTime;
        const drift = currentTime - this.expectedTime;

        this.expectedTime += this.interval;

        // If previousTime was undefined, then first execution. Otherwise, change according to drift
        if (Math.abs(drift) > this.acceptableDrift) {
            // If the drift was still larger, then clearing a used setTimeout does nothing
            clearInterval(this.timer);
            this.timer = setTimeout(this.tick.bind(this), Math.max(0, this.interval - drift), true);
        } else if (attemptedCorrection) {
            // This is a bit counterintuitive but resetting the interval to counteract the drift
            // results in less drift by predicting future delays.
            // Over 2 minutes: results in 6 drift corrections instead of 22 on Firefox
            this.timer = setInterval(this.tick.bind(this),
                Math.max(0, this.interval - drift), false);
        }
    }

    /**
     * Stops the accurate interval
     */
    stop() {
        clearInterval(this.timer);
        this.timer = undefined;
        this.expectedTime = undefined;
    }
}

/**
 * Each tick of the pomodoro timer where worker posts message of the new time.
 */
function timerFunction() {
    const remainingMinutes = Math.floor(remainingTime / 60);
    const remainingSeconds = remainingTime % 60;

    const timerString = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;

    self.postMessage({ remainingTime, timerString });
    remainingTime -= 1;
}

/**
 * Listen to messages for the timer webworker.
 * @listens Worker#message
 * @param {Event} ev - Message event from main JavaScript thread
 */
self.addEventListener('message', (ev) => {
    if (timer instanceof AccurateInterval) {
        timer.stop();
    }

    if (ev.data === 'stop') {
        timer = undefined;
        return;
    }

    const totalTime = parseInt(ev.data, 10);

    if (Number.isNaN(totalTime)) {
        throw new Error(`Unknown message ${ev.data}`);
    }

    remainingTime = totalTime * 60;
    timer = new AccurateInterval(timerFunction, null, 1000, 50);
    timer.start();
});
