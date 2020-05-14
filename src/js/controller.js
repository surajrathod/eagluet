const { remote } = require("electron");
const { base, debounce } = require("./utils");



let defaultsetting = {
  focus: 25,
  break: 4
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


base.SAVE.addEventListener("click", function () {
  localStorage.setItem("uservalue", JSON.stringify(defaultsetting));
  console.log(localStorage.getItem("uservalue"))
  toggleLeft()
});











//call the close window function
base.CLOSE.addEventListener("click", closeWindow);

//call the minimizewindow window function
base.MINIMIZE.addEventListener("click", minimizeWindow);



base.TIMER_SETTING.addEventListener("click", toggleLeft);
base.CANCEL.addEventListener("click", toggleLeft);
function toggleLeft() {

  base.TIMER_SETTING_AREA.classList.toggle("--active_left")
  base.TIMER_SETTING.classList.toggle("--iconactive")


}

//render to the dom



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