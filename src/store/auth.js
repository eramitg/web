import Vue from 'vue';

export default {
  state: {
    user: null,
    token: null,
    role: null,
  },
  async login(username, password){
    try{
      let {data} = await Vue.http.post('/api/login', {username, password});
      if (data.token){
        this.state.token = data.token;
        Vue.http.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
    } catch (e){
      console.log(e.data.message)
    }
  },
  logout(){

  }
}