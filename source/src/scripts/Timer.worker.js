/* eslint-disable no-restricted-globals */
let timer;
let expectedTime;
let remainingTime;
let attemptedCorrection = true;

function timerFunction() {
    const remainingMinutes = Math.floor(remainingTime / 60);
    const remainingSeconds = remainingTime % 60;

    const timerString = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;

    self.postMessage({ remainingTime, timerString });
    remainingTime -= 1;
}

/**
 * Creates an accurate interval by calculating drift.
 * @param {function} cb -
 * @param {any} data -
 * @param {number} baseDelay
 * @param {number} acceptableDrift
 */
function accurateInterval(cb, data, baseDelay, acceptableDrift) {
    cb(...(data || []));

    const currentTime = Date.now();
    if (typeof expectedTime === 'undefined') expectedTime = currentTime;
    const drift = currentTime - expectedTime;

    // If previousTime was undefined, then first execution. Otherwise, change according to drift
    if (Math.abs(drift) > acceptableDrift) {
        // If the drift was still larger, then clearing a used setTimeout does nothing
        clearInterval(timer);
        timer = setTimeout(accurateInterval, Math.max(0, baseDelay - drift), cb, data,
            baseDelay, acceptableDrift);
        attemptedCorrection = true;
        console.log('drifted');
    } else if (attemptedCorrection) {
        attemptedCorrection = false;
        timer = setInterval(accurateInterval, Math.max(0, baseDelay - drift), cb, data,
            baseDelay, acceptableDrift);
    }
    expectedTime += baseDelay;
    return timer;
}

self.addEventListener('message', (ev) => {
    clearInterval(timer);
    if (ev.data === 'stop') {
        timer = undefined;
        expectedTime = undefined;
        attemptedCorrection = true;
        remainingTime = 0;
        return;
    }

    const totalTime = parseInt(ev.data, 10);

    if (Number.isNaN(totalTime)) {
        throw new Error(`Unknown message ${ev.data}`);
    }

    remainingTime = totalTime * 60;
    timer = accurateInterval(timerFunction, null, 1000, 50);
});
