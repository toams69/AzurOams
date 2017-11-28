import axios from 'axios'
import extend from 'extend'

const state = {
  isAuthenticated: true,
  user: {}
}

const mutations = {
  LOGIN (state, data) {
    state.isAuthenticated = true
    extend(true, state.user, data)
  },
  LOGOUT (state) {
    state.isAuthenticated = false
  }
}

const actions = {
  login ({ commit }, {username, password}) {
    axios.post('/api/agents', {
      user: username,
      password: password
    }).then((response) => {
      commit('LOGIN', response.data)
    }, (err) => {
      console.log(err)
    })
  },
  logout ({ commit }) {
  }
}

const getters = {
  getUser: (state, getters) => () => {
    return state.user || {}
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
