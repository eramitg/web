import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

import auth from './auth';
import confirm from './confirm';
import snackbar from './snackbar';
import vuexI18n from 'vuex-i18n';

const store = new Vuex.Store({
  modules: {
    auth,
    confirm,
    snackbar,
    i18n: vuexI18n.store
  }
});

Vue.use(vuexI18n.plugin, store);
import translationEn from '../assets/locales/en';
import translationDe from '../assets/locales/de';
Vue.i18n.add('en', translationEn);
Vue.i18n.add('de', translationDe);

Vue.i18n.set(window.navigator.userLanguage || window.navigator.language);


// when the token is changed update HTTP and localStorage
store.subscribe((mutation, state) => {
  switch (mutation.type){
    case 'setToken':
      axios.defaults.headers.common['Authorization'] = `Bearer ${mutation.payload}`;
      Vue.http.headers.common['Authorization'] = `Bearer ${mutation.payload}`;
      localStorage.setItem("token", mutation.payload);
      break;
    case 'logout':
      delete axios.defaults.headers.common['Authorization'];
      delete Vue.http.headers.common['Authorization'];
      localStorage.removeItem('token');
      break;
  }
})

export default store;