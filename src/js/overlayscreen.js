const { base, ConstantValue } = require("./utils")
//const { ipcRenderer } = require("electron")
const Timer = require("./Timer");



let UserSetting = JSON.parse(localStorage.getItem(ConstantValue.USER_STORAGE_KEY));
let breakMode = new Timer(UserSetting.break, "break")

base.CLOCK_MINUTES.firstElementChild.innerHTML = UserSetting["break"];
base.CLOCK_SECONDS.firstElementChild.innerHTML = "00";

breakMode.startTimer();

// ipcRenderer.on("display_alertbox", function () {
//     base.ALERT_BOX.classList.add("--slide_right")
// })

// base.NEXTROUND_YES.addEventListener("click", () => {

// })

