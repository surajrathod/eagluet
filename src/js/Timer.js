const { base } = require("./utils");

class Timer {
    constructor(sessionMinute) {
        this.sessionMinute = sessionMinute
        this.playing = false,
            this.timerId,
            this.countdown = null

    }

    counter() {
        if (!this.playing) {
            clearInterval(this.timerId);
            return
        }

        if (this.countdown == null) {
            this.countdown = this.sessionMinute * 60 * 1000;
        }
        console.log(this.countdown)
        this.timerId = setInterval(() => {
            if (this.playing == true) {
                this.countdown -= 1000;
                let min = Math.floor(this.countdown / (60 * 1000));
                let sec = Math.floor((this.countdown - (min * 60 * 1000)) / 1000);
                console.log(min)
                if (this.countdown <= 0) {
                    clearInterval(this.timerId);
                    this.playing = false;
                } else {
                    console.log({ min, sec })
                    base.CLOCK_MINUTES.firstElementChild.innerHTML = min;
                    base.CLOCK_SECONDS.firstElementChild.innerHTML = sec;

                }
            }
        }, 1000);
        return
    }
    startTimer() {
        this.playing = !this.playing
        this.counter();
    }

    pauseTimer() {
        this.playing = !this.playing;
        clearInterval(this.timerId);
    }

    stopTimer() {
        this.countdown = 0;
        this.pauseTimer();
    }
}


module.exports = Timer;