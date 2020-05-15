const { remote } = require("electron");
const { base, debounce } = require("./utils");
const Timer = require("./Timer")

let Storage = window.localStorage;
let defaultsetting = {
  focus: 25,
  break: 4
}
let FocusMode = new Timer(defaultsetting.focus)


base.CLOCK_STOP.addEventListener("click", () => {
  //Stop or Reset the timer
  FocusMode.stopTimer();
  //Render the button based on playing or pause
  ClockBtnRender();
  //setup the default clock timer
  ClockSetup();

})



/**when we click on Play Button hide the playbutton and 
 * visible the pause button
 * start the Timer for the Focus Mode */
base.CLOCK_PLAY.addEventListener("click", function () {
  base.CLOCK_PLAY.classList.add("hidden")
  base.CLOCK_PAUSE.classList.remove("hidden")
  FocusMode.startTimer();
})
/**when we click on Pause Button hide the pausebutton and 
 * visible the play button 
 * pause the timer for Focus Mode*/
base.CLOCK_PAUSE.addEventListener("click", function () {
  base.CLOCK_PLAY.classList.remove("hidden")
  base.CLOCK_PAUSE.classList.add("hidden")
  FocusMode.pauseTimer();
})

//call the close window function
base.CLOSE.addEventListener("click", closeWindow);

//call the minimizewindow window function
base.MINIMIZE.addEventListener("click", minimizeWindow);

//display the timer setting area when we click on Timer button
base.TIMER_SETTING.addEventListener("click", toggleLeft);
//cancel the setting and set previous setting
base.CANCEL.addEventListener("click", toggleLeft);
//save the setting 
base.SAVE.addEventListener("click", saveData);

//initially load the Clock to it default state
window.addEventListener("load", ClockSetup);


/**
 * for each slider if the dataset is 'focus' or 'break'
 * --set the text to input value of the input
 * --set the defaultsetting to the current selected value
 */
base.RANGE_SLIDER.forEach((InputSlider) => {

  let dataset = InputSlider.dataset.mode;
  let TextElement = InputSlider.parentNode.firstElementChild.lastElementChild;

  if (dataset == "focus") {

    InputSlider.value = defaultsetting["focus"]
    TextElement.innerHTML = defaultsetting["focus"]

  } else if (dataset == "break") {

    InputSlider.value = defaultsetting["break"]
    TextElement.innerHTML = defaultsetting["break"]

  }

  /**limit the event call for the slider by debouncing the call  */
  InputSlider.addEventListener("input", debounce(function (event) {
    console.log(2)
    event.srcElement.previousElementSibling.lastElementChild.textContent = event.target.value;
    defaultsetting[event.srcElement.dataset.mode] = event.target.value;
  }, 100))
});



/**function to render the clock based on playing or pause */
function ClockBtnRender() {

  if (FocusMode.isPlaying()) {

    base.CLOCK_PLAY.classList.remove("hidden")
    base.CLOCK_PAUSE.classList.add("hidden")

  } else {

    base.CLOCK_PLAY.classList.add("hidden")
    base.CLOCK_PAUSE.classList.remove("hidden")
  }
}
//initial setup function
function ClockSetup() {
  base.CLOCK_MINUTES.firstElementChild.innerHTML = defaultsetting.focus
  base.CLOCK_SECONDS.firstElementChild.innerHTML = "00"
}

/**save the data to the localStorage of the browser for the later use 
 * when we click on save btn
 */
function saveData() {
  Storage.setItem("uservalue", JSON.stringify(defaultsetting));
  //set the new Timer Minutes
  FocusMode = new Timer(defaultsetting.focus)
  //close the setting area
  toggleLeft()
  //render the clock
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




