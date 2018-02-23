import axios from 'axios'
// import qs from 'qs'
const requestUrl = process.env.HOST_URL
// axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
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
      headers: headers,
      withCredentials: true
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

export const _get = async ({url, data, headers}, callback) => {
  const ajax = await axios({
    method: 'get',
    url: requestUrl + url,
    data: data,
    withCredentials: true,
    headers: headers
  })
  callback(ajax)
}

export const _httpget = async ({url, data}, callback) => {
  const ajax = await axios({
    method: 'get',
    url: url,
    data: data
  })
  callback(ajax)
}
