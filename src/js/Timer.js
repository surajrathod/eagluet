const { base } = require("./base");

class Timer {
    constructor() {
        this.playing = false,
            this.timerId,

    }

    counter(sessionCount) {
        let timerId;
        this.playing = !this.playing
        if (!this.playing) {
            clearInterval(this.timerId);
            return
        }

        let countdown = sessionCount * 60 * 1000;
        console.log(countdown)
        this.timerId = setInterval(() => {
            if (this.playing == true) {
                countdown -= 1000;
                let min = Math.floor(countdown / (60 * 1000));
                let sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);
                console.log(min)
                if (countdown <= 0) {
                    clearInterval(timerId);
                    this.playing = false;
                } else {
                    base.CLOCK_MINUTES.firstElementChild.innerHTML = min;
                    base.CLOCK_SECONDS.firstElementChild.innerHTML = sec;

                }
            }
        }, 1000);
        return
    }
}
module.exports.Timer = Timer;