// import qs from 'qs'
import router from './router'
import state from './store/state'

const requestUrl = process.env.HOST_URL
const ROUTER_VERSION = process.env.ROUTER_VERSION
axios.defaults.withCredentials = true
var times = 0

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

axios.interceptors.response.use(response => {
  if (response.data.error && response.data.error.code === 1107) {
    if (times !== 0) return
    var loginData = JSON.parse(localStorage.getItem('UserInfo'))
    Object.assign(state, {
      sms_activated: response.data.error.sms_activated,
      app_activated: response.data.error.app_activated,
      loginData: loginData,
      assets: loginData.assets,
      two_factors: true
    })
    router.replace(`${ROUTER_VERSION}/login/verify`)
  } else if (response.data.error && (response.data.code === 1101 || response.data.code === 1102)) {
    router.replace(`${ROUTER_VERSION}/login`)
  }
  times++
  return response;
},
(err) => {
  console.log(err)
})

export const _post = async ({url, data, headers}, callback) => {
  const ajax = await axios({
    method: 'post',
    url: requestUrl + url,
    data: data,
    dataType: 'json',
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
    params: data
  }).catch(error => {
    if (/settings\/member/.test(url)) {
      console.log(error)
      callback({error: 'login error'})
    }
    lock = true
  })
  if (lock) return
  if (callback) {
    callback(ajax)
  }
}

export const _request = async ({url, method, data}, callback) => {
  const ajax = await axios({
    method: method,
    url: requestUrl + url,
    data: data
  })
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

export const _put = async ({url, data}, callback) => {
  const ajax = await axios({
    method: 'put',
    url: requestUrl + url,
    data: data
  })
  if (callback) {
    callback(ajax)
  }
}
