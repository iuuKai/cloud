import request from '../request'

// 采购协同
export default {
  PODetailList (params) {
    return new Promise((resolve, reject) => {
      request.post('/poDetail/PODetailList', params).then(res => {
        console.log(res)
        const { status, data: { eid, page, msg } } = res
        if (status === 200 && eid === 200) {
          resolve(page)
        } else {
          reject(msg)
        }
      })
    })
  }
}
