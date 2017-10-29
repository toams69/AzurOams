import axios from 'axios'
import extend from 'extend'

const state = {
  'version': '3.0.0',
  'remoteVersion': '3.0.0',
  'alert-timeout': 5000,
  'villes': [],
  'agrementations': [],
  'quartiers': [],
  'annees': [],
  'civilites': [],
  'ristournes': [],
  'banques': [],
  'secteurs': [],
  'typesReglement': []
}

const mutations = {
  SET_CONFIGURATION (state, data) {
    state = Object.assign({}, extend(true, state, data.configuration))
  }
}

const actions = {
  GET_CONFIGURATION ({ commit }) {
    axios.get('/api/configuration').then((response) => {
      commit('SET_CONFIGURATION', { configuration: response.data })
    }, (err) => {
      console.log(err)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
