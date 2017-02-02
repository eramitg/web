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
  notify({commit}, notification){
    let {text} = notification;
    let type = notification.type || 'info';
    let timeout = false;
    let delay = notification.delay || 3000;

    if (notification.timeout === undefined) timeout = true;

    let obj = {text, type};
    commit('addNotification', obj);
    if (timeout){
      setTimeout(() => commit('removeNotification', obj), delay);
    }
  }
}

export default {
  state,
  mutations,
  actions
}
