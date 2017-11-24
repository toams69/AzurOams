import axios from 'axios'
import { find, assignIn } from 'lodash'
import moment from 'moment'

const state = {
  'list': [],
  'groups': []
}

const mutations = {
  SET_CONTACTS (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((membre) => {
      membre.type = membre['ID_ENFANT'] ? 'ENFANT' : 'ADULTE'
      membre['CERTIFICAT'] = membre['CERTIFICAT'] || 0
      membre['DROIT_IMAGE'] = membre['DROIT_IMAGE'] || 0
      membre['RENTRE_SEUL'] = membre['RENTRE_SEUL'] || 0
      membre['NAISSANCE_ENFANT'] = membre['NAISSANCE_ENFANT'] || ''
      membre['HORAIRE'] = membre['HORAIRE'] || ''
      state.list.push(membre)
    })
  },
  SET_ENFANT (state, data) {
    let obj = find(state.list, ['ID_ENFANT', data.enfant['ID_ENFANT']])
    let index = state.list.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data.enfant)
      obj['CERTIFICAT'] = !!obj['CERTIFICAT']
      obj['DROIT_IMAGE'] = !!obj['DROIT_IMAGE']
      obj['RENTRE_SEUL'] = !!obj['RENTRE_SEUL']
      obj['NOM_MEMBRE'] = obj['NOM_ENFANT']
      obj['PRENOM_MEMBRE'] = obj['PRENOM_ENFANT']
      obj.adhesions = data.adhesions
      obj.activites = data.activites
      obj.factures = data.factures
      state.list.splice(index, 1, obj)
    }
  },
  SET_ADULTE (state, data) {
    let obj = find(state.list, (e) => { return e['ID_ENFANT'] === 0 && e['ID_MEMBRE'] === data.adulte['ID_MEMBRE'] })
    let index = state.list.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data.adulte)
      obj.adhesions = data.adhesions
      obj['PARENT'] = !!obj['PARENT']
      obj['ALLOCATAIRE_CAF'] = !!obj['ALLOCATAIRE_CAF']
      obj['ALLOCATAIRE_MSA'] = !!obj['ALLOCATAIRE_MSA']
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
    } else {
      state.groups.push(data)
    }
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
  },
  SAVE_ENFANT ({ commit }, enfant) {
    enfant['NAISSANCE_ENFANT'] = moment(enfant['NAISSANCE_ENFANT']).format('YYYY-MM-DD')
    return axios.post('/api/contacts/enfants/' + enfant['ID_ENFANT'], {operation: 'Update', enfant: enfant}).then((response) => {
      commit('SET_ENFANT', {enfant: enfant})
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
