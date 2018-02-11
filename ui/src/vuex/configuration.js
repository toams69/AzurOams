import axios from 'axios'
import { assignIn, find } from 'lodash'
import moment from 'moment'

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
    state = assignIn(state, data.configuration)
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

const getters = {
  getFullConfiguration: (state, getters) => () => {
    // check if the prenom is defined to be sure the enfant obj is complete
    return state
  },
  getCurrentIdAnnee: (state, getters) => () => {
    const f = find(state.annees, (a) => {
      return moment().isBetween(moment(a['DATE_DEBUT']), moment(a['DATE_FIN']))
    })
    return f ? f['ID_ANNEE'] : null
  },
  getAnnee: (state, getters) => (idAnnee) => {
    const f = find(state.annees, (a) => {
      return a['ID_ANNEE'] === idAnnee
    })
    return f ? moment(f['DATE_DEBUT']).format('YYYY') + ' - ' + moment(f['DATE_FIN']).format('YYYY') : ''
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
