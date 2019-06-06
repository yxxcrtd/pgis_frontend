import axios from 'axios'

//获取登录信息
export function login(url, userinfo, config) {
  return axios.post(url, userinfo, config).then((res) => {
    return Promise.resolve(res)
  })
}
//退出
export function logout(url) {
  return axios.post(url).then((res) => {
    return Promise.resolve(res)
  })
}
//获取用户信息列表
export function list(apiUrl) {
  var url = "";
  url = apiUrl
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res)
  })
}
//增加用户信息
export function add(url, userinfo, config){
  return axios.post(url, userinfo, config).then((res) => {
    return Promise.resolve(res)
  })
}
//删除用户信息
export function del(url) {
  return axios.post(url).then((res) => {
    return Promise.resolve(res)
  })
}
//编辑用户信息
export function edit(url, userinfo, config) {
  return axios.post(url, userinfo, config).then((res) => {
    return Promise.resolve(res)
  })
}
//查询用户信息
export function search(url, userInfo, config) {
  return axios.post(url, userInfo, config).then((res) => {
    return Promise.resolve(res)
  })
}
//删除用户信息
export function reset(url, userinfo, config) {
  return axios.post(url, userinfo, config).then((res) => {
    return Promise.resolve(res)
  })
}
//菜单
export function menu(apiUrl) {
  var url = "";
  url = apiUrl
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res)
  })
}
//数据字典
export function dictList(apiUrl) {
  var url = "";
  url = apiUrl
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res)
  })
}
