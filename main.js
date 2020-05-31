const { app, BrowserWindow, ipcMain } = require("electron");
const Notification = require("./src/js/Notification");
const path = require("path");

let APP_NAME = require(path.join(__dirname, "/package.json")).name;
let APP_GITURL = require(path.join(__dirname, "/package.json")).repository.url;
let APP_VERSION = require(path.join(__dirname, "/package.json")).version;



if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit();
}


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
            transparent: true,
            alwaysOnTop: true,
            resizable: false,
            show: false,
            webPreferences:
                { nodeIntegration: true }
        })
    secondWindow.loadURL(path.join("file://", __dirname, "/src/overlayscreen.html"))
    secondWindow.on("close", () => {
        secondWindow = null
    })
    secondWindow.maximize();
}


ipcMain.on("AppName", function (event) {
    event.returnValue = APP_NAME;
})

ipcMain.on("AppLink", function (event) {
    event.returnValue = APP_GITURL;
})
ipcMain.on("AppVersion", function (event) {
    event.returnValue = APP_VERSION;
})
/**
 * Listen for the 'Countdown-Complete' event from the 
 * renderer process
 * send the 'renderDefaultClock' to the renderer process
 */

ipcMain.on("CountdownComplete", function (event) {
    event.sender.send("renderDefaultClock");

    CreateSecondWindow();

    secondWindow.once("ready-to-show", () => {
        secondWindow.show();
    })
})

ipcMain.on("MaximizeWindow", function () {
    mainWindow.show();
})

// ipcMain.on("AskForAnotherRound", function (event) {
//     event.sender.send("display_alertbox");
// })

ipcMain.on("CloseBreakWindow", function () {
    secondWindow.close();

})

//listen for Closing the App
ipcMain.on("CloseApp", function () {
    BrowserWindow.getAllWindows().forEach((window) => {
        window.close()
    })
})

//Listen for the Minimize app
ipcMain.on("MinimizeApp", () => {
    mainWindow.minimize();
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

})
app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        CreateMainWindow();
    }
})
