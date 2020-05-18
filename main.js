const { app, BrowserWindow, ipcMain } = require("electron");
const Notification = require("./src/js/Notification");



const path = require("path");

require("electron-reload")(__dirname);

app.allowRendererProcessReuse = true
let mainWindow = null;


let notification = new Notification();

function createWindow() {

    const windowsOptions = {
        width: 450,
        height: 400,
        frame: false,
        show: false,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    }
    mainWindow = new BrowserWindow(windowsOptions);
    mainWindow.loadURL(path.join("file://", __dirname, "/src/index.html"))
    mainWindow.on("close", () => {
        mainWindow = null;
    })

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    })


    // secondWindow = new BrowserWindow({ width: 500, height: 500, show: false, alwaysOnTop: true, frame: false, transparent: true })
    // secondWindow.loadURL(path.join("file://", __dirname, "/src/focus.html"))
    // secondWindow.on("close", () => {
    //     secondWindow = null
    // })



}

/**
 * Listen for the 'Countdown-Complete' event from the 
 * renderer process
 * send the 'renderDefaultClock' to the renderer process
 */

ipcMain.on("Countdown-Complete", function (event) {
    event.sender.send("renderDefaultClock");
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
        icon: "rest.png",
    });
})


app.on("ready", () => {
    createWindow()
})
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
})
