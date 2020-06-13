const { element, ConstantValue } = require('./utils')
const Timer = require('./Timer')

const DataUser = JSON.parse(localStorage.getItem(ConstantValue.USER_STORAGE_KEY)) // eslint-disable-line
const breakMode = new Timer(DataUser.break, 'break')

element.CLOCK_MINUTES.firstElementChild.innerHTML = DataUser.break
element.CLOCK_SECONDS.firstElementChild.innerHTML = '00'

breakMode.startTimer()
