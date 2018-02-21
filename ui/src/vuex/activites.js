import axios from 'axios'
import { find, assignIn } from 'lodash'
import moment from 'moment'

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
  },
  INSCRIPTION_ACTIVITE ({commit, dispatch}, form) {
    const motif = `Inscription  à l'activité ${form.activite['NOM_ACTIVITE']} pour l'année ${moment(form.annee['DATE_DEBUT']).format('YYYY')} -> ${moment(form.annee['DATE_FIN']).format('YYYY')}
    Activité  ${form.montantA} euros
    Fourniture ${form.montantF} euros`
    return axios.post('/api/activites/' + form.activite['ID_ACTIVITE'], {
      operation: 'Inscription',
      membre: form.membre,
      montant: form.montant,
      motif: motif
    }).then((response) => {
      if (form.membre['ID_ENFANT']) {
        dispatch('GET_ENFANT', form.membre['ID_ENFANT'])
      } else {
        dispatch('GET_ADULTE', form.membre['ID_MEMBRE'])
      }
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
