const { remote } = require('electron');

document.querySelector('.close__btn').addEventListener('click', closeWindow);
document.querySelector('.minimize__btn').addEventListener('click', minimizeWindow);

function closeWindow() {
    let window = remote.getCurrentWindow();
    window.close();
}

function minimizeWindow() {
    let window = remote.getCurrentWindow();
    window.minimize();
}