// Vue.filter('upper', function (value) {
//   if (!value || value === '/' || value === 'undefined/undefined') return '--'
//   return value.toUpperCase()
// })
// filters () {

// }
let fixed2 = (params) => {
  if (!params) return 0
  return (+params).toFixed(2)
}

let upper = value => {
  if (!value || value === '/' || value === 'undefined/undefined') return '--'
  return value.toUpperCase()
}

let fixedNum = (params, num, num2) => {
  if (+params <= 0 || !params) return 0
  if (!num) num = 6
  if (num2) {
    num = num > num2 ? num : num2
  }
  var value = (+Math.floor(params * Math.pow(10, num)) / Math.pow(10, num)).toFixed(num)
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
  var d = new Date(date).toString()
  return d.split(' ')[4]
}

export {
  fixed2,
  upper,
  fixedNum,
  time,
  dayTime
}

// export filters
