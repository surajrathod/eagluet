const { remote } = require("electron");

const DOM_SELECTORS = {
    CLOSE: document.querySelector(".close__btn"),
    MINIMIZE: document.querySelector(".minimize__btn"),
    TIMER_SETTING: document.querySelector(".timer__btn"),
    TIMER_SETTING_AREA: document.querySelector(".timer-setting__area"),
    CANCEL: document.querySelector(".cancel__btn"),
    SAVE: document.querySelector(".save__btn"),
    CLOCK_PLAYPAUSE: document.querySelector(".clock__play__pause")
}
//call the close window function
DOM_SELECTORS.CLOSE.addEventListener("click", closeWindow);

//call the minimizewindow window function
DOM_SELECTORS.MINIMIZE.addEventListener("click", minimizeWindow);

DOM_SELECTORS.TIMER_SETTING.addEventListener("click", toggleLeft);
DOM_SELECTORS.CANCEL.addEventListener("click", toggleLeft);


function toggleLeft() {
    DOM_SELECTORS.TIMER_SETTING_AREA.classList.toggle("--active_left")
    DOM_SELECTORS.TIMER_SETTING.classList.toggle("--iconactive")
}
//close the window when click on close button
function closeWindow() {
    let window = remote.getCurrentWindow();
    window.close();
}
//minimize the window when click on minimize button
function minimizeWindow() {
    let window = remote.getCurrentWindow();
    window.minimize();
}