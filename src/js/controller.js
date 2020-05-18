const { remote, ipcRenderer } = require("electron");
const { base, debounce } = require("./utils");
const Timer = require("./Timer");

const USER_STORAGE_KEY = "USERSETTINGS";
const DEFAULT_STORAGE_KEY = "DEFAULTSETTINGS";
let Storage = localStorage;
let UserSetting;
let FocusMode;

let defaultsetting = {
  focus: 25,
  break: 4
};


base.CLOCK_STOP.addEventListener("click", () => {
  //Stop or Reset the timer
  FocusMode.stopTimer();
  //Render the button based on playing or pause
  ClockBtnRender();
  //setup the default clock timer
  ClockSetup();

});



/**when we click on Play Button hide the playbutton and 
 * visible the pause button
 * start the Timer for the Focus Mode */
base.CLOCK_PLAY.addEventListener("click", function () {
  base.CLOCK_PLAY.classList.add("hidden");
  base.CLOCK_PAUSE.classList.remove("hidden");
  FocusMode.startTimer();
})
/**when we click on Pause Button hide the pausebutton and 
 * visible the play button 
 * pause the timer for Focus Mode*/
base.CLOCK_PAUSE.addEventListener("click", function () {
  base.CLOCK_PLAY.classList.remove("hidden");
  base.CLOCK_PAUSE.classList.add("hidden");
  FocusMode.pauseTimer();
})


/**function to render the clock based on playing or pause */
function ClockBtnRender() {

  if (!FocusMode.isPlaying()) {

    base.CLOCK_PLAY.classList.remove("hidden")
    base.CLOCK_PAUSE.classList.add("hidden")

  } else {

    base.CLOCK_PLAY.classList.add("hidden")
    base.CLOCK_PAUSE.classList.remove("hidden")
  }
}
//initial setup function
function ClockSetup() {
  base.CLOCK_MINUTES.firstElementChild.innerHTML = UserSetting.focus
  base.CLOCK_SECONDS.firstElementChild.innerHTML = "00"
}

/**save the data to the localStorage of the browser for the later use 
 * when we click on save btn
 */
function saveData() {
  //set the Storage to the new UserSetting
  Storage.setItem(USER_STORAGE_KEY, JSON.stringify(UserSetting));
  //stop the timer
  FocusMode.stopTimer();
  //set the new Timer Minutes
  FocusMode = new Timer(UserSetting.focus, "focus")
  //Render the button based on playing or pause
  ClockBtnRender();
  //render the clock
  ClockSetup();
  toggleLeft();


}


const toggleLeft = () => {

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

const SliderRender = () => {

  /**
   * for each slider if the dataset is 'focus' or 'break'
   * --set the text to input value of the input
   * --set the defaultsetting to the current selected value
   */
  base.RANGE_SLIDER.forEach((InputSlider) => {

    let dataset = InputSlider.dataset.mode;
    let TextElement = InputSlider.parentNode.firstElementChild.lastElementChild;

    if (dataset == "focus") {

      InputSlider.value = UserSetting["focus"]
      TextElement.innerHTML = `${UserSetting["focus"]}:00`

    } else if (dataset == "break") {

      InputSlider.value = UserSetting["break"]
      TextElement.innerHTML = `${UserSetting["break"]}:00`

    }

    /**limit the event call for the slider by debouncing the call  */
    InputSlider.addEventListener("input", debounce(function (event) {
      event.srcElement.previousElementSibling.lastElementChild.textContent = `${event.target.value}:00`;
      UserSetting[event.srcElement.dataset.mode] = Number(event.target.value);
      console.log(UserSetting, event.srcElement.dataset.mode)

    }, 20))
  })

}


//call the close window function
base.CLOSE.addEventListener("click", closeWindow);

//call the minimizewindow window function
base.MINIMIZE.addEventListener("click", minimizeWindow);

//display the timer setting area when we click on Timer button
base.TIMER_SETTING.addEventListener("click", toggleLeft);


//cancel the setting and set previous setting
base.RESET.addEventListener("click", () => {
  Storage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultsetting));
  UserSetting = JSON.parse(Storage.getItem(DEFAULT_STORAGE_KEY));
  // UserSetting = defaultsetting;
  FocusMode.stopTimer()
  FocusMode = new Timer(UserSetting.focus, "focus")

  //Render the button based on playing or pause
  ClockBtnRender();
  ClockSetup();
  toggleLeft();
  SliderRender();
});
//save the setting 
base.SAVE.addEventListener("click", saveData);

//initially load the Clock to it default state
window.addEventListener("load", () => {
  /**
   * if the localStorage does not have the value
   * -set the Default Value initially
   * if local Storage has the value set the 
   * UserSetting Storage to the value
   */

  if (!Storage.getItem(USER_STORAGE_KEY) || !Storage.getItem(DEFAULT_STORAGE_KEY)) {
    Storage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(defaultsetting));
    Storage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultsetting));
  }

  UserSetting = JSON.parse(Storage.getItem(USER_STORAGE_KEY));
  FocusMode = new Timer(UserSetting.focus, "focus")
  console.log(FocusMode)
  ClockSetup();
  SliderRender();
});

/**
 * Listen for the 'renderDefaultClock'
 * from the main process
 * reset the clock to default state
 * 
 */

ipcRenderer.on("renderDefaultClock", function () {
  console.log(FocusMode)
  ClockBtnRender()
  ClockSetup()
  console.log(FocusMode)

})




















