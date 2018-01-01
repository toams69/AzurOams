import axios from 'axios'

const state = {
  'list': []
}

const mutations = {
  SET_ACTIVITES (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((activite) => {
      state.list.push(activite)
    })
  }
}

const actions = {
  GET_ACTIVITES ({ commit }) {
    return axios.get('/api/activites').then((response) => {
      commit('SET_ACTIVITES', response.data)
    }, (err) => {
      console.log(err)
    })
  }
}

const getters = {
  getActivitesForYear: (state, getters) => (idAnnee) => {
    return state.list.filter((activite) => {
      return activite['ID_ANNEE'] === idAnnee
    })
  },
  getActivite: (state, getters) => (idActivite) => {
    return state.list.find(a => a['ID_ACTIVITE'] === idActivite)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
