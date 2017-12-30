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
      membre.adhesions = []
      membre.activites = []
      membre.factures = []
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
      obj = Object.assign(obj, data.adulte) // trick to refresh
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
  },
  SET_FAMILLES (state, data) {
    state.groups.splice(0, state.list.length)
    data.forEach((famille) => {
      state.groups.push(famille)
    })
  }
}

const actions = {
  GET_CONTACTS ({ commit }) {
    return axios.get('/api/contacts').then((response) => {
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
  },
  SAVE_ADULTE ({ commit }, adulte) {
    adulte['NAISSANCE_MEMBRE'] = moment(adulte['NAISSANCE_MEMBRE']).format('YYYY-MM-DD')
    adulte['PARENT'] = adulte['PARENT'] || 0
    adulte['ALLOCATAIRE_CAF'] = adulte['ALLOCATAIRE_CAF'] || 0
    adulte['ALLOCATAIRE_MSA'] = adulte['ALLOCATAIRE_MSA'] || 0
    return axios.post('/api/contacts/adultes/' + adulte['ID_MEMBRE'], {operation: 'Update', adulte: adulte}).then((response) => {
      commit('SET_ADULTE', {adulte: adulte})
    }, (err) => {
      console.log(err)
    })
  },
  SAVE_FAMILLE ({ commit }, famille) {
    return axios.post('/api/familles/' + famille['ID_FAMILLE'], {operation: 'Update', contact: famille}).then((response) => {
      commit('SET_FAMILLE', famille)
    }, (err) => {
      console.log(err)
    })
  },
  GET_FAMILLES ({ commit }) {
    return axios.get('/api/familles').then((response) => {
      commit('SET_FAMILLES', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  CREATE_FAMILLE ({commit}, famille) {
    return axios.post('/api/familles', {operation: 'Create', contact: famille.contact, nomFamille: famille.nomFamille}).then((response) => {
      return response.data.idMembre
    }, (err) => {
      console.log(err)
    })
  },
  CREATE_ADULTE ({commit}, famille) {
    return axios.post('/api/familles/' + famille.idFamille, {operation: 'CreateAdulte', contact: famille.contact}).then((response) => {
      return response.data.idMembre
    }, (err) => {
      console.log(err)
    })
  },
  CREATE_ENFANT ({commit}, famille) {
    return axios.post('/api/familles/' + famille.idFamille, {operation: 'CreateEnfant', contact: famille.contact}).then((response) => {
      return response.data.idEnfant
    }, (err) => {
      console.log(err)
    })
  },
  CREATE_ADHESION ({commit}, form) {
    if (form.membre && form.membre['ID_ENFANT']) {
      return axios.post('/api/contacts/enfants/' + form.membre['ID_ENFANT'], {
        operation: 'CreateAdhesion',
        idFamille: form.membre['ID_FAMILLE'],
        montant: form.montant,
        idMembre: form.membre['ID_MEMBRE'],
        numeroAdherent: form.numeroAdherent,
        motif: 'Adhésion  à l\'association pour l\'année  ' + moment(form.annee['DATE_DEBUT']).format('YYYY') + '-> ' + moment(form.annee['DATE_FIN']).format('YYYY'),
        idAnnee: form.annee['ID_ANNEE']}).then((response) => {
          form.membre.adhesions.push(response.data.adhesion)
          form.membre = Object.assign({}, form.membre) // trick to refresh
          return response.data.adhesion
        }, (err) => {
          console.log(err)
        })
    } else if (form.membre) {
      return axios.post('/api/contacts/adultes/' + form.membre['ID_MEMBRE'], {
        operation: 'CreateAdhesion',
        idFamille: form.membre['ID_FAMILLE'],
        idMembre: form.membre['ID_MEMBRE'],
        numeroAdherent: form.numeroAdherent,
        montant: form.montant,
        motif: 'Adhésion  à l\'association pour l\'année  ' + moment(form.annee['DATE_DEBUT']).format('YYYY') + '-> ' + moment(form.annee['DATE_FIN']).format('YYYY'),
        idAnnee: form.annee['ID_ANNEE']}).then((response) => {
          form.membre.adhesions.push(response.data.adhesion)
          return response.data.adhesion
        }, (err) => {
          console.log(err)
        })
    }
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
    return state.groups.find(m => m['ID_FAMILLE'] === id) || {}
  },
  getMembresFamilleById: (state, getters) => (id) => {
    if (state.groups.find(m => m['ID_FAMILLE'] === id)) {
      return state.groups.find(m => m['ID_FAMILLE'] === id).membres
    }
    return []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
