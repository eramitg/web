import axios from 'axios'

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
