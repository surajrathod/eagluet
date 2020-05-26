const notifier = require("node-notifier");
const path = require("path")



class Notification {
    constructor() { }

    createnotification(title, icon, message, mode) {
        notifier.notify({
            title: title,
            message: `${mode} ${message}`,
            icon: path.join(__dirname, "/../assets/icons", icon),
            sound: true
        })
    }
    
    /**
     * alert to the user when 5 second is left on the clock
     * @param {Object} options 
     * @param {string} options.mode-{'focus','break'}
     * @param {string} options.message- message to be displayed
     */
    AlertFiveSecondEarly(options) {
        let nextmode;
        let icon;
        switch (options.mode) {
            case "focus":
                nextmode = "break";
                icon = `${nextmode}.png`;
                break;

            case "break":
                nextmode = "focus";
                icon = `${nextmode}.png`;
                break;
        }
        console.log(icon)
        this.createnotification(options.title, icon, options.message, nextmode);
    }


}

module.exports = Notification;