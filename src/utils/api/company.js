import request from '../request'

export default {
  // 获取企业列表
  companyList (params) {
    // return request.post('/company/companyList', params)
    return new Promise((resolve, reject) => {
      request.post('/company/companyList', params).then(res => {
        const { status, data: { eid, page, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(page)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取企业详情
  componentInfo (params) {
    return new Promise((resolve, reject) => {
      request.post('/company/companyInfo', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 加入企业
  joinCompany (params) {
    return new Promise((resolve, reject) => {
      request.post('/company/joinCompany', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取用户有权限的企业
  authCompanyList (params) {
    return new Promise((resolve, reject) => {
      request.post('/company/authCompanyList', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取选中用户绑定所有公司
  companyListByUserId (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUserDetail/companyListByUserId', params).then(res => {
        const { status, data: { eid, page, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(page)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取企业所有员工
  personByCompany (params) {
    return new Promise((resolve, reject) => {
      request.post('/company/personByCompany', params).then(res => {
        const { status, data: { eid, page, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(page)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 企业可用角色
  companyRoleList (params) {
    return new Promise((resolve, reject) => {
      request.post('/role/userRoleList', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 新增用户
  addCompanyUser (params) {
    return new Promise((resolve, reject) => {
      request.post('/company/savePageOne', params).then(res => {
        const { status, data: { eid, msg } } = res
        if (status === 200 && eid === 200) {
          resolve()
        } else {
          reject(msg)
        }
      })
    })
  },
  // 删除用户
  delCompanyUser (params) {
    return new Promise((resolve, reject) => {
      request.post('/company/delPageOne', params).then(res => {
        const { status, data: { eid, msg } } = res
        if (status === 200 && eid === 200) {
          resolve()
        } else {
          reject(msg)
        }
      })
    })
  },
  // 启用用户
  enableCompanyUser (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUserDetail/startUser', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 禁用用户
  disableCompanyUser (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUserDetail/forbidUser', params).then(res => {
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
