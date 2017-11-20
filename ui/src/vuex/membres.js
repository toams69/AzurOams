import axios from 'axios'
import { find, assignIn } from 'lodash'

const state = {
  'list': [],
  'groups': []
}

const mutations = {
  SET_CONTACTS (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((membre) => {
      membre.type = membre['ID_ENFANT'] ? 'ENFANT' : 'ADULTE'
      state.list.push(membre)
    })
  },
  SET_ENFANT (state, data) {
    let obj = find(state.list, ['ID_ENFANT', data.enfant['ID_ENFANT']])
    let index = state.list.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data.enfant)
      obj.adhesions = data.adhesions
      obj.activites = data.activites
      obj.factures = data.factures
      state.list.splice(index, 1, obj)
    }
  },
  SET_ADULTE (state, data) {
    let obj = find(state.list, ['ID_ENFANT', 0, 'ID_MEMBRE', data.adulte['ID_MEMBRE']])
    let index = state.list.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data.enfant)
      obj.adhesions = data.adhesions
      obj.activites = data.activites
      obj.factures = data.factures
      state.list.splice(index, 1, obj)
    }
  },
  SET_FAMILLE (state, data) {
    let obj = find(state.groups, ['ID_FAMILLE', data['ID_FAMILLE']])
    let index = state.groups.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data)
      state.groups.splice(index, 1, obj)
    }
    state.groups.push(obj)
  }
}

const actions = {
  GET_CONTACTS ({ commit }) {
    axios.get('/api/contacts').then((response) => {
      commit('SET_CONTACTS', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  GET_ENFANT ({ commit }, id) {
    axios.get('/api/contacts/enfants/' + id).then((response) => {
      commit('SET_ENFANT', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  GET_ADULTE ({ commit }, id) {
    axios.get('/api/contacts/adultes/' + id).then((response) => {
      commit('SET_ADULTE', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  GET_FAMILLE ({ commit }, id) {
    axios.get('/api/familles/' + id).then((response) => {
      commit('SET_FAMILLE', response.data)
    }, (err) => {
      console.log(err)
    })
  }
}

const getters = {
  getEnfantById: (state, getters) => (id) => {
    // check if the prenom is defined to be sure the enfant obj is complete
    return state.list.find(m => m['ID_ENFANT'] === id && m['PRENOM_ENFANT']) || {}
  },
  getFactureByEnfantId: (state, getters) => (id) => {
    const enfant = state.list.find(m => m['ID_ENFANT'] === id)
    return enfant ? enfant.factures : []
  },
  getAdulteById: (state, getters) => (id) => {
    // check if the prenom is defined to be sure the enfant obj is complete
    return state.list.find(m => m['ID_MEMBRE'] === id && m['ID_MEMBRE']) || {}
  },
  getFactureByAdulteId: (state, getters) => (id) => {
    const adulte = state.list.find(m => m['ID_MEMBRE'] === id && !m['ID_ENFANT'])
    return adulte ? adulte.factures : []
  },
  getFamilleById: (state, getters) => (id) => {
    // check if the prenom is defined to be sure the enfant obj is complete
    return state.groups.find(m => m['ID_FAMILLE'] === id) || {}
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
