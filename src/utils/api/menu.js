import request from '../request'

export default {
  // 获取所有菜单
  getMenuTree (params) {
    return new Promise((resolve, reject) => {
      request.post('/menu/getAllMenuTree', params).then(res => {
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
