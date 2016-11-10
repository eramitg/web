import axios from 'axios';

export default {
  state: {
    user: null,
    token: null,
    role: null,
  },
  async login(username, password){
    try{
      let {data} = await axios.post('/api/login', {username, password});
      if (data.token){
        this.state.token = data.token;
        axios.default.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
    } catch (e){
      console.log(e.data.message)
    }
  },
  logout(){

  }
}