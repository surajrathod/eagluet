const { app, BrowserWindow, ipcMain } = require("electron");
const Notification = require("./src/js/Notification");

const path = require("path");

const APP_NAME = require(path.join(__dirname, "/package.json")).name;
const APP_GITURL = require(path.join(__dirname, "/package.json")).repository
  .url;
const APP_VERSION = require(path.join(__dirname, "/package.json")).version;

const defaultSetting = {
  focus: 25,
  break: 4,
  rounds: 2,
};
let CurrentRound = 1;
let UserRound = null;

if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// app is in development
if (!app.isPackaged) {
  require("electron-reload")(__dirname);
}

app.allowRendererProcessReuse = true;
let mainWindow = null;
let secondWindow = null;

const notification = new Notification();

function CreateMainWindow() {
  const MainWindowOptions = getBrowserOptions();
  mainWindow = new BrowserWindow(MainWindowOptions);
  mainWindow.loadURL(path.join("file://", __dirname, "/src/index.html"));
  mainWindow.on("close", () => {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}
function CreateSecondWindow() {
  secondWindow = new BrowserWindow(getBrowserOptions);
  secondWindow.loadURL(
    path.join("file://", __dirname, "/src/overlayscreen.html")
  );
  secondWindow.maximize();
}

ipcMain.on("AppName", (event) => {
  event.returnValue = APP_NAME;
});
ipcMain.on("AppLink", (event) => {
  event.returnValue = APP_GITURL;
});
ipcMain.on("AppVersion", (event) => {
  event.returnValue = APP_VERSION;
});
ipcMain.on("MinimizeApp", () => {
  mainWindow.minimize();
});
ipcMain.on("MaximizeWindow", () => {
  mainWindow.show();
});
ipcMain.on("CloseBreakWindow", () => {
  secondWindow.close();
});
ipcMain.on("SetUserRounds", (e, round) => {
  UserRound = Number(round);
});
ipcMain.on("JsonDefaultSettings", (e) => {
  e.returnValue = JSON.stringify(defaultSetting);
});

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
  });
});

ipcMain.on("StartNextRound", function (event) {
  if (CurrentRound < UserRound) {
    mainWindow.webContents.send("ResetAndStart");
    CurrentRound++;
  } else {
    CurrentRound = 1;
  }
});

// listen for Closing the App
ipcMain.on("CloseApp", () => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.close();
  });
});

/**
 * All the Notification will be in main Process
 */

// this will we called to the notification class which will display the message
ipcMain.on("FiveSecondEarlyAlert", function (event, mode) {
  if (mode === "break") {
    if (CurrentRound === UserRound) {
      return;
    }
  }
  notification.AlertFiveSecondEarly({
    title: "Information",
    mode: mode,
    message: "will start in 5 sec",
  });
});

// app settings
app.on("ready", () => {
  CreateMainWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    CreateMainWindow();
  }
});

function getBrowserOptions() {
  return {
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  };
}
/*
 * single Instance of the app
 */
const getTheLock = app.requestSingleInstanceLock();
if (!getTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  });
}
