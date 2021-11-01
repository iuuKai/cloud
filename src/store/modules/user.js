// import api from '@/utils/api'
import Cookie from 'js-cookie'

export default {
  namespaced: true,
  state: () => ({
    user: null,
    token: ''
  }),
  mutations: {
    setUser (state, val) {
      state.user = val
      Cookie.set('user', JSON.stringify(val), { expires: 1 })
    },
    getUser (state) {
      if (Cookie.get('user')) {
        state.user = JSON.parse(Cookie.get('user'))
      }
    },
    clearUser (state) {
      state.user = ''
      Cookie.remove('user')
    },
    setToken (state, val) {
      state.token = val
      Cookie.set('token', val, { expires: 1 })
    },
    getToken (state) {
      state.token = Cookie.get('token')
    },
    clearToken (state) {
      state.token = ''
      Cookie.remove('token')
    },
    updateUserAvatar (state, url) {
      state.user.userImgUrl = url
      Cookie.remove('user')
      Cookie.set('user', JSON.stringify(state.user))
    }
  },
  actions: {
  }
}
