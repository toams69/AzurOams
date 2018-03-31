import axios from 'axios'
// import extend from 'extend'
import { find, assignIn, maxBy, minBy, uniqWith, isEqual } from 'lodash'

const state = {
  secteurs: [],
  sejours: []
}

const mutations = {
  SET_SECTEURS (state, data) {
    state.secteurs.splice(0, state.secteurs.length)
    data.forEach((secteur) => {
      state.secteurs.push(secteur)
    })
  },
  SET_SEJOURS (state, data) {
    state.sejours.splice(0, state.sejours.length)
    data.forEach((sejour) => {
      state.sejours.push(sejour)
    })
  },
  SET_SEJOUR (state, data) {
    let obj = find(state.sejours, ['ID_SEJOUR', data['ID_SEJOUR']])
    let index = state.sejours.indexOf(obj)
    if (obj) {
      obj = assignIn(obj, data)
      state.sejours.splice(index, 1, obj)
    } else {
      state.sejours.push(data)
    }
  }
}

const actions = {
  GET_CLSH ({ commit }) {
    return axios.get('/api/clsh/secteurs').then((response) => {
      commit('SET_SECTEURS', response.data)
      return axios.get('/api/clsh/sejours').then((response) => {
        commit('SET_SEJOURS', response.data)
      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      console.log(err)
    })
  },
  GET_SEJOUR ({ commit }, id) {
    return axios.get('/api/clsh/sejours/' + id).then((response) => {
      commit('SET_SEJOUR', response.data)
    }, (err) => {
      console.log(err)
    })
  }
}

const getters = {
  getRangeSejour: (state, getters) => () => {
    return {
      max: maxBy(state.sejours, (s) => { return s.ANNEE }) ? maxBy(state.sejours, (s) => { return s.ANNEE }).ANNEE : 2000,
      min: minBy(state.sejours, (s) => { return s.ANNEE }) ? minBy(state.sejours, (s) => { return s.ANNEE }).ANNEE : 2000
    }
  },
  getSejours: (state, getters) => () => {
    return state.sejours
  },
  getSejour: (state, getters) => (idSejour) => {
    return state.sejours.find(s => s['ID_SEJOUR'] === idSejour)
  },
  getSejourDate: (state, getters) => (idSejour) => {
    var find = state.sejours.find(s => s['ID_SEJOUR'] === idSejour)
    return find && find.journees ? find.journees : []
  },
  getPeriodesSejour: (state, getters) => (idSejour) => {
    var ret = []
    var find = state.sejours.find(s => s['ID_SEJOUR'] === idSejour)
    if (find && find.journees) {
      ret = uniqWith(find.journees.reduce(function (a, val) { return a.concat(val.periodes) }, ret), isEqual)
    }
    return ret
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
