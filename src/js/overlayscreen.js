const { base, ConstantValue } = require("./utils")
const { ipcRenderer } = require("electron")
const Timer = require("./Timer");



let a = JSON.parse(localStorage.getItem(ConstantValue.USER_STORAGE_KEY));
let breakMode = new Timer(a.break, "break")

base.CLOCK_MINUTES.firstElementChild.innerHTML = a["break"];
base.CLOCK_SECONDS.firstElementChild.innerHTML = "00";

breakMode.startTimer();

// ipcRenderer.on("display_alertbox", function () {
//     base.ALERT_BOX.classList.add("--slide_right")
// })

// base.NEXTROUND_YES.addEventListener("click", () => {

// })

