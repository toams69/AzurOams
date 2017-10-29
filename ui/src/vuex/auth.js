import axios from 'axios'
import extend from 'extend'

const state = {
  isAuthenticated: true,
  user: {}
}

const mutations = {
  LOGIN (state, data) {
    state.isAuthenticated = true
    state.user = Object.assign({}, extend(true, state.user, data))
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

export default {
  state,
  mutations,
  actions
}
