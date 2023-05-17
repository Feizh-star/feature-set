
export function merge(a: any, b: any) {
  // 检查输入是否为对象
  if (typeof a !== 'object' || typeof b !== 'object') {
    throw new Error('merge 函数只能接受对象类型的参数')
  }

  // 遍历 b 的所有属性
  for (const key in b) {
    // 检查 b 当前属性是否为对象
    if (typeof b[key] === 'object') {
      // 如果 a 当前属性也为对象，则递归合并
      if (typeof a[key] === 'object') {
        merge(a[key], b[key])
      } else {
        // 否则直接复制 b 当前属性到 a 上
        a[key] = JSON.parse(JSON.stringify(b[key]))
      }
    } else {
      // 如果 b 当前属性不为对象，则直接覆盖 a 当前属性
      a[key] = b[key]
    }
  }

  return a
}