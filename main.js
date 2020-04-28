const { app, BrowserWindow } = require('electron');


let mainWindow = null;

function createWindow() {
    const windowsOptions = {
        width: 600,
        height: 700,
        show: false
    }
    mainWindow = new BrowserWindow(windowsOptions)
}