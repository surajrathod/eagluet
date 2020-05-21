const { app, BrowserWindow, ipcMain } = require("electron");
const Notification = require("./src/js/Notification");



const path = require("path");

require("electron-reload")(__dirname);

app.allowRendererProcessReuse = true
let mainWindow = null;
let secondWindow = null;


let notification = new Notification();

function CreateMainWindow() {

    const MainWindowOptions = {
        width: 450,
        height: 400,
        frame: false,
        show: false,
        resizable: false,

        webPreferences: {
            nodeIntegration: true
        },

    }
    mainWindow = new BrowserWindow(MainWindowOptions);
    mainWindow.loadURL(path.join("file://", __dirname, "/src/index.html"))
    mainWindow.on("close", () => {
        mainWindow = null;
    })

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    })
}

function CreateSecondWindow() {
    secondWindow = new BrowserWindow(
        {
            frame: false,
            fullscreen: true,
            transparent: true,
            alwaysOnTop: true,
            // show: false,
            webPreferences:
                { nodeIntegration: true }
        })
    secondWindow.loadURL(path.join("file://", __dirname, "/src/overlayscreen.html"))
    secondWindow.on("close", () => {
        secondWindow = null
    })
    secondWindow.show();
    // secondWindow.maximize();


}

/**
 * Listen for the 'Countdown-Complete' event from the 
 * renderer process
 * send the 'renderDefaultClock' to the renderer process
 */

ipcMain.on("Countdown-Complete", function (event) {
    event.sender.send("renderDefaultClock");

    // CreateSecondWindow();

    // secondWindow.once("ready-to-show", () => {
    //     secondWindow.show();
    // })
})

ipcMain.on("Close-Break-Window", function () {
    secondWindow.close();

})

/**
 * All the Notification will be in main Process
 */

//this will we called to the notification class which will display the message
ipcMain.on("FiveSecondEarlyAlert", function (event, mode) {

    notification.AlertFiveSecondEarly({
        title: "Information",
        mode: mode,
        message: "will start in 5 sec",
    });

})



app.on("ready", () => {
    CreateMainWindow()
    CreateSecondWindow();
})
app.on("activate", () => {
    if (mainWindow === null) {
        CreateMainWindow();
    }
})
