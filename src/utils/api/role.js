import request from '../request'

export default {
  // 角色详情
  roleInfo (params) {
    return new Promise((resolve, reject) => {
      request.post('/role/infoById', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 角色列表
  roleCompanyList (params) {
    return new Promise((resolve, reject) => {
      request.post('/role/roleCompanyList', params).then(res => {
        const { status, data: { eid, page, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(page)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 删除角色
  delRole (params) {
    return new Promise((resolve, reject) => {
      request.post('/role/delBatchRole', params).then(res => {
        const { status, data: { eid, msg } } = res
        if (status === 200 && eid === 200) {
          resolve()
        } else {
          reject(msg)
        }
      })
    })
  },
  // 角色菜单树
  roleMenuTree (params) {
    return new Promise((resolve, reject) => {
      request.post('/roleMenuRef/roleMenuTree', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 修改角色
  updateRole (params) {
    return new Promise((resolve, reject) => {
      request.post('/role/updateRole', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 新增角色
  addRole (params) {
    return new Promise((resolve, reject) => {
      request.post('/role/saveRole', params).then(res => {
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
