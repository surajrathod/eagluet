const { base } = require("./utils");
const { ipcRenderer } = require("electron");
// const notifier = require("node-notifier");


class Timer {
    //will accept the session timer and current mode of play
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
        //this will work for only initial 
        //when the countdown is null
        //this is for the functionality of pauseTimer
        if (this.countdown == null) {
            this.countdown = this.sessionMinute * 60 * 1000;
        }
        this.timerId = setInterval(() => {
            if (this.playing == true) {
                this.countdown -= 1000;
                let min = Math.floor(this.countdown / (60 * 1000));
                let sec = Math.floor((this.countdown - (min * 60 * 1000)) / 1000);

                //countdown gows below 0
                // stop the timer
                // send message to the main process
                if (this.countdown <= 0) {
                    this.stopTimer()
                    ipcRenderer.send("Countdown-Complete");


                } else if (this.countdown === 5000) {
                    //if counter has left with 5 second 
                    // notify the user for that
                    this._renderMinuteSecond(min, sec);
                    ipcRenderer.send("FiveSecondEarlyAlert", this.mode);
                }
                else {
                    this._renderMinuteSecond(min, sec);

                }
            }
        }, 1000);
        return
    }
    startTimer() {
        //change the playing to true call the counter
        this.playing = true
        this.counter();
    }

    pauseTimer() {
        //pause the timer
        this.playing = false;

        clearInterval(this.timerId);
    }

    stopTimer() {
        //stop the timer be clearing the timerid
        //setting mull to countdown
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