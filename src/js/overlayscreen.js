const { base, ConstantValue } = require("./utils")
const Timer = require("./Timer");



let a = JSON.parse(localStorage.getItem(ConstantValue.USER_STORAGE_KEY));
let breakMode = new Timer(a.break, "break")

base.CLOCK_MINUTES.firstElementChild.innerHTML = a["break"];
base.CLOCK_SECONDS.firstElementChild.innerHTML = "00";

breakMode.startTimer();

