const notifier = require("node-notifier");
const path = require("path")



class Notification {
    constructor() { }

    createnotification(title, icon, message, mode) {
        notifier.notify({
            title: title,
            message: `${mode} ${message}`,
            icon: path.join(__dirname, "/../assets/icons", icon)
        })
    }
    /**
     * alert to the user when 5 second is left on the clock
     * @param {Object} options 
     * @param {string} options.mode-{'focus','break'}
     * @param {string} options.message- message to be displayed
     * @param {string} options.icon -icon name with format
     */
    AlertFiveSecondEarly(options) {
        let nextmode
        switch (options.mode) {
            case "focus":
                nextmode = "break";
                break;

            case "beak":
                nextmode = "focus";
                break;
        }
        console.log(__dirname)
        this.createnotification(options.title, options.icon, options.message, nextmode);
    }


}

module.exports = Notification;