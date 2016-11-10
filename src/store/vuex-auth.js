import axios from 'axios';


//axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const initializeState = () => {
  let token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return {
    user: null,
    token: token,
    role: null,
  }
};

const state = initializeState();

const getters = {
  isAuthenticated(state){
    return state.token != null
  }
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
        let arr = data.token.split(".");
        let decoded = JSON.parse(atob(arr[1]));
        console.log(decoded);
        commit('setToken', data.token);
      }
      return data;
    } catch (e){
      return Promise.reject(e);
    }
  },
  logout({commit}){
    commit('logout')
  }
}


export default {
  state,
  getters,
  mutations,
  actions
}