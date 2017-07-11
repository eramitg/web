import Vue from 'vue'

const state = {
  token: null,
  userObj: null,
  roles: ['USER', 'ADMIN', 'SUPER']
}

const getters = {
  isAuthenticated (state) {
    return state.token != null
  },
  user (state) {
    return state.userObj || {}
  },
  company (state) {
    return state.userObj ? state.userObj.company : {}
  },
  hasRole (state) {
    return state.userObj
    ? state.roles[state.userObj.role]
    : ''
  }
}

const mutations = {
  setToken (state, token) {
    state.token = token
  },
  setUser (state, user) {
    state.userObj = user
  },
  logout (state) {
    state.token = null
    state.userObj = null
  }
}

const actions = {
  async login ({commit, state}, payload) {
    try {
      let {data} = await Vue.http.post('login', payload)
      if (data.token) {
        commit('setToken', data.token)
      }
      if (data.user) {
        commit('setUser', data.user)
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
    let userRole = getters.hasRole
    switch (userRole) {
      case 'SUPER':
        return true
      case 'ADMIN':
        if (role === 'ADMIN' || role === undefined) return true
        else return false
      case 'USER':
        if (role === 'ADMIN' || role === 'SUPER') return false
        if (role === undefined) return true
        break
      default:
        return false
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
