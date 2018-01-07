import axios from 'axios'
import { find, assignIn } from 'lodash'

const state = {
  'list': []
}

const mutations = {
  SET_ACTIVITES (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((activite) => {
      activite['LISTE_INSCRITS'] = []
      state.list.push(activite)
    })
  },
  SET_ACTIVITE (state, data) {
    let obj = find(state.list, ['ID_ACTIVITE', data['ID_ACTIVITE']])
    let index = state.list.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data)
      state.list.splice(index, 1, obj)
    } else {
      state.list.push(data)
    }
  }
}

const actions = {
  GET_ACTIVITES ({ commit }) {
    return axios.get('/api/activites').then((response) => {
      commit('SET_ACTIVITES', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  GET_ACTIVITE ({ commit }, id) {
    axios.get('/api/activites/' + id).then((response) => {
      commit('SET_ACTIVITE', response.data)
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
  },
  getActiviteMembers: (state, getters) => (idActivite) => {
    var f = state.list.find(a => a['ID_ACTIVITE'] === idActivite)
    return f ? f['LISTE_INSCRITS'] : []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
