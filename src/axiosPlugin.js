import axios from 'axios'
import Qs from 'qs'

axios.default.paramsSerializer = function (params) {
  return Qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })
}

export default (Vue) => {
  Vue.http = axios
  Object.defineProperties(Vue.prototype, {
    $http: {
      get () {
        return axios
      }
    }
  })
}
