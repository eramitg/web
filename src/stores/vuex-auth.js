import axios from 'axios';


const state = {
  user: null,
  token: localStorage.getItem('token'),
  role: null,
}

const mutations = {
  setToken(state, token){
    state.token = token
  },
  logout(state){
    state.token = null
  }
}

const actions = {
  async login({commit, state}, payload){
    try{
      let {data} = await axios.post('/api/login', payload);
      if (data.token){
        commit('setToken', data.token);
      }
      return data;
    } catch (e){
      return Promise.reject(e);
    }
  }
}


export default {
  state,
  mutations,
  actions
}