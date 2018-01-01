import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import membres from './membres'
import factures from './factures'
import configuration from './configuration'
import activites from './activites'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    configuration,
    membres,
    factures,
    activites
  }
})
