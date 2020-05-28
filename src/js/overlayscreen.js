const { element, ConstantValue } = require("./utils")
const Timer = require("./Timer");



let DataUser = JSON.parse(localStorage.getItem(ConstantValue.USER_STORAGE_KEY));
let breakMode = new Timer(DataUser.break, "break")

element.CLOCK_MINUTES.firstElementChild.innerHTML = DataUser["break"];
element.CLOCK_SECONDS.firstElementChild.innerHTML = "00";

breakMode.startTimer();

