import request from '../request'

// 请求所需参数
const query = {
  apiAccount: 'api_web',
  apiToken: '9B66E5B6-05B0-472C-B955-2B897FE730B9',
  timestamp: '1559192325',
  sign: '4abbcdb5dd6a6cf7c1a353b2f17b5edc',
  reqMsg: 'myflag'
  // userPwd: ''
  // phone: ''
  // vcode: '',
  // vmark: ''
}

export default {
  // 发送验证码
  sendCode (data) {
    return new Promise((resolve, reject) => {
      const params = Object.assign(data, query)
      request.post('/api/website/verifyCode/sendCode', params).then(res => {
        const { status, data: { eid, msg, data } } = res
        if (status === 200 & eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 注册
  register (data) {
    return new Promise((resolve, reject) => {
      const params = Object.assign(data, query)
      request.post('/api/webSite/webUser/webster', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 登录（登录都同一个接口啊）
  login (data) {
    return new Promise((resolve, reject) => {
      const params = Object.assign(data, query)
      request.post('/api/webSite/webUser/webLogin', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // // 修改密码
  // updatePassword (params) {
  //   return request.post('/api/webSite/webUser/webUpdatePwd', params)
  // },
  // 修改密码
  changePassword (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUser/changePwd', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 忘记密码
  forgetPwd (params) {
    console.log(params)
    return new Promise((resolve, reject) => {
      request.post('/webUser/forgetPwd', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取用户列表
  userDetailList (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUserDetail/userDetailList', params).then(res => {
        const { status, data: { eid, page, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(page)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取用户列表
  userList (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUserDetail/userList', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 获取用户详情
  userInfo (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUser/userInfo', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 修改用户信息
  updateUser (params) {
    return new Promise((resolve, reject) => {
      request.put('/webUser/updateUserInfo', params).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 新增人员
  addUser (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUser/saveUser', params).then(res => {
        const { status, data: { eid, msg } } = res
        if (status === 200 && eid === 200) {
          resolve()
        } else {
          reject(msg)
        }
      })
    })
  },
  // 删除人员
  delUser (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUser/delBatchUser', params).then(res => {
        const { status, data: { eid, msg } } = res
        if (status === 200 && eid === 200) {
          resolve()
        } else {
          reject(msg)
        }
      })
    })
  },
  // 头像
  uploadAvatar (params) {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const data = new FormData()
      for (const k in params) {
        data.append(k, params[k])
      }
      request.post('/webUser/upload/oss', data, config).then(res => {
        const { status, data: { eid, data, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 左边企业列表
  companyList (params) {
    return new Promise((resolve, reject) => {
      request.post('/webUserDetail/companyList', params).then(res => {
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
