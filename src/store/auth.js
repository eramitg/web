import axios from 'axios'
// import Vue from 'vue'

const initializeState = () => {
  let token = localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  // Vue.http.headers.common['Authorization'] = `Bearer ${token}`

  return {
    token: token,
    roles: ['USER', 'ADMIN', 'SUPER']
  }
}

const state = initializeState()

const getters = {
  isAuthenticated (state) {
    return state.token != null
  },
  user (state) {
    if (state.token == null) {
      return {}
    }
    let data = state.token.split('.')[1]
    let json = JSON.parse(atob(data))

    return json
  }
}

const mutations = {
  setToken (state, token) {
    state.token = token
  },
  logout (state) {
    state.token = null
  }
}

const actions = {
  async login ({commit, state}, payload) {
    try {
      let {data} = await axios.post('/api/login', payload)
      if (data.token) {
        commit('setToken', data.token)
      }
      return data
    } catch (e) {
      return Promise.reject(e)
    }
  },
  checkAccess ({getters}, role) {
    if (!role) {
      return true
    }
    if (getters.user) {
      let userRole = getters.user.role
      if (userRole === 'SUPER') return true
      if (userRole === 'ADMIN' && role === 'ADMIN') return true
      if (userRole === 'USER') {
        if (role === 'ADMIN' || role === 'SUPER') return false
      }
    }
    return false
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
