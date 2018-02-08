import axios from 'axios'
import qs from 'qs'

const requestUrl = 'http://192.168.1.110:3000'
axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  if (config.method === 'post') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export const _post = async ({url, data}, callback) => {
  const ajax = await axios({
    method: 'post',
    url: requestUrl + url,
    data: data
  })
  callback(ajax)
}

export const _get = async ({url, data}, callback) => {
  const ajax = await axios({
    method: 'get',
    url: requestUrl + url,
    data: data
  })
  callback(ajax)
}
