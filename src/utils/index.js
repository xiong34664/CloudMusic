
import axios from 'axios'

// axios.defaults.baseURL = 'http://192.168.1.118:3000';

// axios.defaults.withCredentials = true;
axios.interceptors.request.use((config)=>{
  config.url = '/api' + config.url
  return config
});

// axios.interceptors.response.use(res => {

// });
function stringifyURL(params, postFlag) {
  var paramUrl = ''
  for (var key in params) {
    if (!postFlag && paramUrl === '') {
      paramUrl += '?' + key + '=' + encodeURIComponent(params[key])
    } else {
      paramUrl += '&' + key + '=' + encodeURIComponent(params[key])
    }
  }
  //console.log(paramUrl);
  return paramUrl
}

export function post(url, data, isJson = false) {
  return new Promise((resolve, reject) => {
    data = isJson ? data : stringifyURL(data, true)
    let header = isJson
      ? {'Content-type': 'application/json'}
      : {'Content-Type': 'application/x-www-form-urlencoded'}
    axios
      .post(url, data, {
        headers: header
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function get(url, data) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: data}, {})
      .then(res => {
          if(res !== undefined){
              resolve(res.data)
          }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export let log = console.log.bind(console)
