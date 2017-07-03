import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './auth'
import confirm from './confirm'
import snackbar from './snackbar'
import vuexI18n from 'vuex-i18n'

const store = new Vuex.Store({
  modules: {
    auth,
    confirm,
    snackbar,
    i18n: vuexI18n.store
  }
})

Vue.use(vuexI18n.plugin, store)
import translationEn from '../assets/locales/en'
import translationDe from '../assets/locales/de'
Vue.i18n.add('en', translationEn)
Vue.i18n.add('en-US', translationEn)
Vue.i18n.add('de', translationDe)

if (Vue.i18n.exists(window.navigator.userLanguage)) Vue.i18n.set(window.navigator.userLanguage)
else if (Vue.i18n.exists(window.navigator.language)) Vue.i18n.set(window.navigator.language)
else Vue.i18n.set('en')

// when the token is changed update HTTP and localStorage
store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case 'setToken':
      Vue.http.headers.common['Authorization'] = `Bearer ${mutation.payload}`
      localStorage.setItem('token', mutation.payload)
      break
    case 'setUser':
      localStorage.setItem('user', JSON.stringify(mutation.payload))
      break
    case 'logout':
      delete Vue.http.headers.common['Authorization']
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      break
  }
})

export default store
