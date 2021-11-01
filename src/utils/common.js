/**
 * 递归子数组
 */
export function loopChildren (arr, callback) {
  if (!arr) return
  arr.forEach(item => {
    if (item.children && item.children.length > 0) {
      loopChildren(item.children, callback)
    }
    callback(item)
  })
}
