import axios from 'axios'

const state = {
  'list': []
}

const mutations = {
  SET_FACTURES (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((f) => {
      state.list.push(f)
    })
  }
}

const actions = {
  GET_FACTURES ({ commit }) {
    axios.get('/api/factures').then((response) => {
      commit('SET_FACTURES', response.data)
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
