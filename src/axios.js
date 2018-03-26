import axios from 'axios'
const unLogin = ['homepage']
// import qs from 'qs'
const requestUrl = process.env.HOST_URL
axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
  if (typeof config.headers === 'object') {
    Object.assign(config.headers, {
      'DataType': 'application/json;charset=utf-8'
    })
  } else {
    config.headers = {
      'DataType': 'application/json;charset=utf-8'
    }
  }
  return config
})

export const _post = async ({url, data, headers}, callback) => {
  const ajax = await axios({
    method: 'post',
    url: requestUrl + url,
    data: data
  })
  if (callback) {
    callback(ajax)
  }
}

export const _get = async ({url, data, headers}, callback) => {
  var lock = false
  const ajax = await axios({
    method: 'get',
    url: requestUrl + url,
    data: data
  }).catch(error => {
    if (/settings\/member/.test(url)) {
      callback({error: 'login error'})
    }
    lock = true
  })
  if (lock) return
  if (callback) {
    callback(ajax)
  }
}

export const _delete = async ({url, data}, callback) => {
  const ajax = await axios({
    method: 'delete',
    url: requestUrl + url,
    data: data
  })
  if (callback) {
    callback(ajax)
  }
}
