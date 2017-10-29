import axios from 'axios'

const state = {
  'list': []
}

const mutations = {
  SET_CONTACTS (state, data) {
    state.list.splice(0, state.list.length)
    data.forEach((membre) => {
      membre.type = membre['ID_ENFANT'] ? 'ENFANT' : 'ADULTE'
      state.list.push(membre)
    })
  }
}

const actions = {
  GET_CONTACTS ({ commit }) {
    axios.get('/api/contacts').then((response) => {
      commit('SET_CONTACTS', response.data)
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
