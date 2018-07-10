import { BigNumber } from 'bignumber.js'

let fixed2 = (params) => {
  if (!params) return 0
  var val = new BigNumber(+params.toFixed(10))
  return val.toFixed(2)
}

let upper = value => {
  if (!value || value === '/' || value === 'undefined/undefined') return '--'
  return value.toUpperCase()
}

let fixedNum = (params, num, num2) => {
  if (!params) return 0
  if (!num) num = 6
  if (num2) {
    num = num > num2 ? num : num2
  }
  var val = new BigNumber((+params).toFixed(10))
  var times = new BigNumber(10).exponentiatedBy(num)
  var value = (val.multipliedBy(times)).integerValue(BigNumber.ROUND_FLOOR).dividedBy(times).toFixed(num)
  // var value = (Math.floor(value * Math.pow(10, num)) / Math.pow(10, num)).toFixed(num)
  if (value.length >= 14) value = (+value).toFixed(num - 2)
  return value
}

let time = date => {
  var d = new Date(date)
  var y = d.getFullYear()
  var m = d.getMonth() + 1
  var day = d.getDate()
  var time = d.toString().split(' ')[4]
  return y + '-' + (m > 9 ? m : '0' + m) + '-' + (day > 9 ? day : '0' + day) + ' ' + time
}

let dayTime = (date) => {
  var d = new Date(date).toLocaleString()
  return d.split(' ')[4]
}

export {
  fixed2,
  upper,
  fixedNum,
  time,
  dayTime
}
