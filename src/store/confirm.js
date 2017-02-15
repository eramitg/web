const state = {
  deferred: null
}

const mutations = {
  setDeferred (state, deferred) {
    state.deferred = deferred
  }
}

const actions = {
  confirm ({commit}) {
    return new Promise((resolve, reject) => commit('setDeferred', {resolve, reject}))
  }
}

export default {
  state,
  mutations,
  actions
}
