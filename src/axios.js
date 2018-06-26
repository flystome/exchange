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

axios.interceptors.response.use(response => {
  console.log(response)
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
