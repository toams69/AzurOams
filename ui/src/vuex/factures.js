import axios from 'axios'
import { find, each, assignIn } from 'lodash'
import moment from 'moment'

const state = {
  'list': []
}

const mutations = {
  SET_FACTURES (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((f) => {
      state.list.push(f)
    })
  },
  SET_FACTURE (state, data) {
    let obj = find(state.list, ['ID_FACTURE', data['ID_FACTURE']])
    let index = state.list.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data)
      let restant = Math.round(parseFloat(obj['MONTANT_FACTURE']) * 100) / 100
      each(obj['reglements'], function (r) {
        restant -= parseFloat(r['MONTANT_REGLEMENT'])
        restant = Math.round(restant * 100) / 100
      })
      obj['MONTANT_RESTANT'] = restant
      state.list.splice(index, 1, obj)
    } else {
      let restant = Math.round(parseFloat(data['MONTANT_FACTURE']) * 100) / 100
      each(data['reglements'], function (r) {
        restant -= parseFloat(r['MONTANT_REGLEMENT'])
        restant = Math.round(restant * 100) / 100
      })
      data['MONTANT_RESTANT'] = restant
      state.list.push(data)
    }
  }
}

const actions = {
  GET_FACTURES ({ commit }) {
    axios.get('/api/factures').then((response) => {
      commit('SET_FACTURES', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  GET_FACTURE ({ commit }, id) {
    axios.get('/api/factures/' + id).then((response) => {
      commit('SET_FACTURE', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  ADD_REGLEMENT (store, obj) {
    obj.reglement['DATE_REGLEMENT'] = moment(obj.reglement['DATE_REGLEMENT']).format('YYYY-MM-DD')
    return axios.post('/api/factures/' + obj.factureId, {operation: 'AddReglement', reglement: obj.reglement}).then((response) => {
      store.dispatch('GET_FACTURE', obj.factureId)
    }, (err) => {
      console.log(err)
    })
  },
  DELETE_REGLEMENT (store, obj) {
    return axios.post('/api/factures/' + obj.factureId, {operation: 'DeleteReglement', idReglement: obj.idReglement}).then((response) => {
      store.dispatch('GET_FACTURE', obj.factureId)
    }, (err) => {
      console.log(err)
    })
  }
}

const getters = {
  getFactureById: (state, getters) => (id) => {
    return state.list.find(f => f['ID_FACTURE'] === id) || {}
  },
  getReglemensByFactureId: (state, getters) => (id) => {
    const f = state.list.find(f => f['ID_FACTURE'] === id)
    return (f && f['reglements']) || []
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
