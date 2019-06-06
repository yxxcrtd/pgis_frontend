/*
 *index.js 入口文件
 * state.js 所有的状态管理文件
 * mutation.js 修改文件(同步)
 * mutaton-types.js 所有mutation相关的名字，存储一些mutation相关的字符串常量
 * actions.js  异步操作、异步修改或对mutations作的一些封装
 * getters.js 获取
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
