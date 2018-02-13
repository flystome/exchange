import axios from 'axios'
import qs from 'qs'
const requestUrl = process.env.HOST_URL
axios.defaults.withCredentials = true
console.log(process.env.HOST_URL)

axios.interceptors.request.use(function (config) {
  config.headers['DataType'] = 'application/json;charset=utf-8'
  // if (config.method === 'post') {
  //   debugger
  //   console.log(config.data)
  //   console.log(qs.stringify({
  //     ...config.data
  //   }))
  //   config.data = qs.stringify({
  //     ...config.data
  //   })
  // }
  return config
}, function (error) {
  return Promise.reject(error)
})

export const _post = async ({url, data, headers}, callback) => {
  if (headers) {
    const ajax = await axios({
      method: 'post',
      url: requestUrl + url,
      data: data,
      headers: headers
    }).catch(err => console.log(err))
    callback(ajax)
    return
  }
  const ajax = await axios({
    method: 'post',
    url: requestUrl + url,
    data: data
  }).catch(err => console.log(err))
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
