import api from '@/utils/api'

export default {
  namespaced: true,
  state: () => ({
  }),
  mutations: {
  },
  actions: {
    joinCompany ({ state, getters, commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        api.company.joinCompany(params).then(res => {
          const { status, data: { eid, data, msg } } = res
          if (status === 200 && eid === 200) {
            resolve(data)
          } else {
            reject(msg)
          }
        })
      })
    }
  }
}
