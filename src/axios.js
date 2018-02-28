import axios from 'axios'
// import qs from 'qs'
const requestUrl = process.env.HOST_URL
// axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
  config.headers['DataType'] = 'application/json;charset=utf-8'
  return config
})

export const _post = async ({url, data, headers}, callback) => {
  if (headers) {
    const ajax = await axios({
      method: 'post',
      url: requestUrl + url,
      data: data,
      headers: headers,
      withCredentials: true
    }).catch(err => console.log(err))
    if (callback) {
      callback(ajax)
    }
    return
  }
  const ajax = await axios({
    method: 'post',
    url: requestUrl + url,
    data: data
  }).catch(err => console.log(err))
  if (callback) {
    callback(ajax)
  }
}

export const _get = async ({url, data, headers}, callback) => {
  const ajax = await axios({
    method: 'get',
    url: requestUrl + url,
    data: data,
    withCredentials: true,
    headers: headers
  })
  if (callback) {
    callback(ajax)
  }
}

export const _httpget = async ({url, data}, callback) => {
  const ajax = await axios({
    method: 'get',
    url: url,
    data: data
  })
  if (callback) {
    callback(ajax)
  }
}
