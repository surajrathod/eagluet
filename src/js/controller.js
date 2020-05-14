const { remote } = require("electron");
const { base, debounce } = require("./utils");
const Timer = require("./Timer")



let defaultsetting = {
  focus: 25,
  break: 4
}

let a = new Timer(defaultsetting.focus)

base.CLOCK_PLAY.addEventListener("click", function (e) {
  base.CLOCK_PLAY.classList.add("hidden")
  base.CLOCK_STOP.classList.remove("hidden")
  a.startTimer();
})
base.CLOCK_STOP.addEventListener("click", function (e) {
  base.CLOCK_PLAY.classList.remove("hidden")
  base.CLOCK_STOP.classList.add("hidden")
  a.pauseTimer();
})

//call the close window function
base.CLOSE.addEventListener("click", closeWindow);

//call the minimizewindow window function
base.MINIMIZE.addEventListener("click", minimizeWindow);



base.TIMER_SETTING.addEventListener("click", toggleLeft);
base.CANCEL.addEventListener("click", toggleLeft);
base.SAVE.addEventListener("click", saveData);


window.addEventListener("load", ClockSetup);


function ClockSetup() {
  base.CLOCK_MINUTES.firstElementChild.innerHTML = defaultsetting.focus
  base.CLOCK_SECONDS.firstElementChild.innerHTML = "00"
}

base.RANGE_SLIDER.forEach((element) => {

  let dataset = element.dataset.mode;
  let TextElement = element.parentNode.firstElementChild.lastElementChild;

  if (dataset == "focus") {

    element.value = defaultsetting["focus"]
    TextElement.innerHTML = defaultsetting["focus"]

  } else if (dataset == "break") {

    element.value = defaultsetting["break"]
    TextElement.innerHTML = defaultsetting["break"]

  }


  element.addEventListener("input", debounce(function (event) {

    console.log(event)

    event.srcElement.previousElementSibling.lastElementChild.textContent = event.target.value;
    defaultsetting[event.srcElement.dataset.mode] = event.target.value;
  }, 20))
});




function saveData() {
  localStorage.setItem("uservalue", JSON.stringify(defaultsetting));
  console.log(localStorage.getItem("uservalue"))
  toggleLeft()
  ClockSetup()

}



function toggleLeft() {

  base.TIMER_SETTING_AREA.classList.toggle("--active_left")
  base.TIMER_SETTING.classList.toggle("--iconactive")

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




