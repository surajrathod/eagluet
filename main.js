const { app, BrowserWindow } = require("electron");
const path = require("path");

require("electron-reload")(__dirname);

app.allowRendererProcessReuse = true
let mainWindow = null;

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

}

app.on("ready", () => {
    createWindow()
})
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
})
