const { remote } = require('electron');
const DOMSECECTORES = {
    'CLOSE': '.close__btn',
    'MINIMIZE': '.minimize__btn',
    "TIMER_SETTING": '.timer__btn',
    "TIMER_SETTING_AREA": '.timer__setting__area'
}

document.querySelector(DOMSECECTORES.CLOSE).addEventListener('click', closeWindow);
document.querySelector(DOMSECECTORES.MINIMIZE).addEventListener('click', minimizeWindow);

const TimerBtn = document.querySelector(DOMSECECTORES.TIMER_SETTING)
const SettingArea = document.querySelector(DOMSECECTORES.TIMER_SETTING_AREA);

TimerBtn.addEventListener('click', toggleLeft);


function toggleLeft(e) {
    SettingArea.classList.toggle("--active_left")
    TimerBtn.classList.toggle('--iconactive')
}
function closeWindow() {
    let window = remote.getCurrentWindow();
    window.close();
}

function minimizeWindow() {
    let window = remote.getCurrentWindow();
    window.minimize();
}