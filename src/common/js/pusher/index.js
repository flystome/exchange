import Pusher from 'pusher-js'
var config = process.env.PUSHER_CONFIG
Pusher.Runtime.createXHR = function () {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true
  return xhr
}
var pusher = new Pusher(config.key, {
  authEndpoint: process.env.HOST_URL + '/pusher/auth',
  wsHost: config.wsHost,
  wsPort: config.wsPort,
  auth: {
    headers: {
      'DataType': 'application/json;charset=utf-8'
    }
  },
  encrypted: config.encrypted
})

export default pusher
