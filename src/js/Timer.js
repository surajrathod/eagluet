const { base } = require("./utils");
const { ipcRenderer } = require("electron");
// const notifier = require("node-notifier");


class Timer {
    constructor(sessionMinute, mode) {
        this.sessionMinute = sessionMinute;
        this.playing = false;
        this.countdown = null;
        this.mode = mode;
        this.timerId;
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

                if (this.countdown <= 0) {
                    this.stopTimer()
                    ipcRenderer.send("Countdown-Complete");


                } else if (this.countdown === 54000) {
                    this._renderMinuteSecond(min, sec);



                    // let nextMode
                    // switch (this.mode) {
                    //     case "focus":
                    //         nextMode = "break"
                    //         break;
                    //     case "break":
                    //         nextMode = "focus"
                    //         break;
                    // }
                    // notifier.notify({
                    //     title: nextMode,
                    //     message: "be prepared",
                    //     sound: true,
                    // })
                }
                else {
                    this._renderMinuteSecond(min, sec);

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
        this.countdown = null;
        clearInterval(this.timerId)
        this.timerId = null;
        this.playing = false;
    }
    isPlaying() {
        return this.playing;
    }
    _renderMinuteSecond(min, sec) {
        base.CLOCK_MINUTES.firstElementChild.innerHTML = min;
        base.CLOCK_SECONDS.firstElementChild.innerHTML = sec;
    }
}


module.exports = Timer;