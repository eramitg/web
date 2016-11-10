const state = {
  list: []
}

const mutations = {
  addNotification(state, notification){
    state.list.push(notification);
  },
  removeNotification(state, notification){
    let index = state.list.indexOf(notification);
    state.list.splice(index, 1);
  }
}

const actions = {
  addNotification({commit}, notification){
    commit('addNotification', notification);
    let {timeout, delay} = notification;

    if (timeout || (timeout == null)){
      setTimeout(() => commit('removeNotification', notification), delay || 3000);
    }

  }
}

export default {
  state,
  mutations,
  actions
}