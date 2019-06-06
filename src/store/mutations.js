import * as types from './mutation-types'

const mutations = {
  [types.USERNAME](state, username){
    state.username = username
  }
}

export default mutations
