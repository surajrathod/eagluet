const { ipcRenderer, shell } = require('electron')
const { element, debounce, ConstantValue } = require('./utils')
const Timer = require('./Timer')

const Storage =  localStorage // eslint-disable-line
let UserSetting
let FocusMode

element.CLOCK_STOP.addEventListener('click', () => {
  // Stop or Reset the timer
  FocusMode.stopTimer()
  // Render the button based on playing or pause
  ClockBtnRender()
  // setup the default clock timer
  ClockSetup()
})

/** when we click on Play Button hide the playbutton and
 * visible the pause button
 * start the Timer for the Focus Mode */
element.CLOCK_PLAY.addEventListener('click', function () {
  element.CLOCK_PLAY.classList.add('hidden')
  element.CLOCK_PAUSE.classList.remove('hidden')
  FocusMode.startTimer()
})
/** when we click on Pause Button hide the pausebutton and
 * visible the play button
 * pause the timer for Focus Mode */
element.CLOCK_PAUSE.addEventListener('click', function () {
  element.CLOCK_PLAY.classList.remove('hidden')
  element.CLOCK_PAUSE.classList.add('hidden')
  FocusMode.pauseTimer()
})

/** function to render the clock based on playing or pause */
function ClockBtnRender () {
  if (!FocusMode.isPlaying()) {
    element.CLOCK_PLAY.classList.remove('hidden')
    element.CLOCK_PAUSE.classList.add('hidden')
  } else {
    element.CLOCK_PLAY.classList.add('hidden')
    element.CLOCK_PAUSE.classList.remove('hidden')
  }
}
// initial setup function
function ClockSetup () {
  element.CLOCK_MINUTES.firstElementChild.innerHTML = UserSetting.focus
  element.CLOCK_SECONDS.firstElementChild.innerHTML = '00'
}

/** save the data to the localStorage of the browser for the later use
 * when we click on save btn
 */
function saveData () {
  // set the Storage to the new UserSetting
  Storage.setItem(ConstantValue.USER_STORAGE_KEY, JSON.stringify(UserSetting))
  // stop the timer
  FocusMode.stopTimer()
  // set the new Timer Minutes
  FocusMode = new Timer(UserSetting.focus, 'focus')
  // Render the button based on playing or pause
  ClockBtnRender()
  // render the clock
  ClockSetup()
  toggleLeft()
}

const toggleLeft = () => {
  if (element.INFO_BTN.classList.contains('--iconactive')) {
    toggleRight()
  }
  element.TIMER_SETTING_AREA.classList.toggle('--slide_left')
  element.TIMER_SETTING.classList.toggle('--iconactive')
}
const toggleRight = () => {
  if (element.TIMER_SETTING.classList.contains('--iconactive')) {
    toggleLeft()
  }
  element.INFO_ABOUT.classList.toggle('--slide_right')
  element.INFO_BTN.classList.toggle('--iconactive')
}

// close the window when click on close button
function closeWindow () {
  ipcRenderer.send('CloseApp')
}
// minimize the window when click on minimize button
function minimizeWindow () {
  ipcRenderer.send('MinimizeApp')
}

const SliderRender = () => {
  /**
   * for each slider if the dataset is 'focus' or 'break'
   * --set the text to input value of the input
   * --set the defaultsetting to the current selected value
   */
  element.RANGE_SLIDER.forEach((InputSlider) => {
    const dataset = InputSlider.dataset.mode
    const TextElement = InputSlider.parentNode.firstElementChild.lastElementChild

    switch (dataset) {
      case 'focus':
        renderValue(InputSlider, TextElement, dataset)
        break
      case 'break':
        renderValue(InputSlider, TextElement, dataset)
        break
      case 'rounds':
        renderValue(InputSlider, TextElement, dataset)
        break
    }
    /** limit the event call for the slider by debouncing the call  */
    InputSlider.addEventListener('input', debounce(function (event) {
      event.srcElement.previousElementSibling.lastElementChild.textContent = `${event.target.value}`
      UserSetting[event.srcElement.dataset.mode] = Number(event.target.value)
      ipcRenderer.send('SetUserRounds', UserSetting.rounds)
    }, 20))
  })
  ipcRenderer.send('SetUserRounds', UserSetting.rounds)
}

function renderValue (InputSlider, TextElement, datasetmode) {
  InputSlider.value = UserSetting[datasetmode]
  TextElement.innerHTML = `${UserSetting[datasetmode]}`
}

// call the close window function
element.CLOSE.addEventListener('click', closeWindow)

// call the minimizewindow window function
element.MINIMIZE.addEventListener('click', minimizeWindow)

// display the timer setting area when we click on Timer button
element.TIMER_SETTING.addEventListener('click', toggleLeft)

element.INFO_BTN.addEventListener('click', toggleRight)

// cancel the setting and set previous setting
element.RESET.addEventListener('click', () => {
  Storage.setItem(ConstantValue.USER_STORAGE_KEY, ipcRenderer.sendSync('JsonDefaultSettings'))
  UserSetting = JSON.parse(Storage.getItem(ConstantValue.DEFAULT_STORAGE_KEY))
  // UserSetting = defaultsetting;
  FocusMode.stopTimer()
  FocusMode = new Timer(UserSetting.focus, 'focus')

  // Render the button based on playing or pause
  ClockBtnRender()
  ClockSetup()
  toggleLeft()
  SliderRender()
})
// save the setting
element.SAVE.addEventListener('click', saveData)

// initially load the Clock to it default state
window.addEventListener('load', () => {
  /**
   * if the localStorage does not have the value
   * -set the Default Value initially
   * if local Storage has the value set the
   * UserSetting Storage to the value
   */

  if (!Storage.getItem(ConstantValue.USER_STORAGE_KEY) || !Storage.getItem(ConstantValue.DEFAULT_STORAGE_KEY)) {
    Storage.setItem(ConstantValue.DEFAULT_STORAGE_KEY, ipcRenderer.sendSync('JsonDefaultSettings'))
    Storage.setItem(ConstantValue.USER_STORAGE_KEY, ipcRenderer.sendSync('JsonDefaultSettings'))
  }

  UserSetting = JSON.parse(Storage.getItem(ConstantValue.USER_STORAGE_KEY))
  FocusMode = new Timer(UserSetting.focus, 'focus')

  ClockSetup()
  SliderRender()

  renderInfoScreen()
})

function renderInfoScreen () {
  const infoAbout = `
  <figure class="info-figure">
  <img
  src="./assets/icons/Eagluet.png"
  width="100"
  height="100"
  alt="Eagluet Logo"
  />
  <figcaption class="info-about__text">Open Source Pomodoro Timer</figcaption>
  </figure>
  <p>${ipcRenderer.sendSync('AppVersion')}<p>
  <p class="info-text">To Contribute Visit <p class="info-about__link" title=${ipcRenderer.sendSync('AppLink')}>GitHub</p></p>`
  element.INFO_ABOUT.insertAdjacentHTML('beforeend', infoAbout)

  element.INFO_ABOUT.querySelector('.info-about__link').addEventListener('click', function () {
    shell.openExternal(ipcRenderer.sendSync('AppLink'))
  })
}

/**
 * Listen for the 'renderDefaultClock'
 * from the main process
 * reset the clock to default state
 *
 */

ipcRenderer.on('renderDefaultClock', () => {
  ClockBtnRender()
  ClockSetup()
})

ipcRenderer.on('ResetAndStart', () => {
  FocusMode.startTimer()
  ClockBtnRender()
})
