import html2canvas from 'html2canvas'

/**
 * 遍历树，查找指定的节点
 * @param {Array} data 树的根
 * @param {String} id 要查找的标识
 * @param {Object} keys 配置对象：children：指明使用哪个属性作为子级测表；id：指明哪个属性作为id（可以嵌套，例如：'data.id'）
 * @param {Function} compare 自定义比较函数，接收四个参数；树中节点的id值，要查找的id值，当前节点对象，当前节点对象的祖先列表；
 *                   compare 需返回1个boolean值，如果为true，则代表找到了目标
 * @return {Object | null} node：找到的节点对象，其上会多1个’_stack'属性，是1个数组，代表了当前节点在树中的路径（即所有根先）
 */
export function filterTreeNode(data: any, id: any, keys: any, compare: any, stack: any[] = []): any {
  const childrenKey = keys?.children || 'children'
  let idKey = keys?.id || 'id'
  idKey = idKey.split('.')
  let result = null
  const compareFunc = compare || ((a: any, b: any) => a === b)
  for (const node of data) {
    // 查找指定的键
    const nodeId = idKey.reduce((p: any, c: any) => p && p[c], node)
    const compareResult = compareFunc(nodeId, id, node, stack)
    if(compareResult) {
      result = {...node}
      break
    } else if (node[childrenKey]) {
      stack.push(node)
      result = filterTreeNode(node[childrenKey], id, keys, compare, stack)
      if (result) break
    } else {
      continue 
    }
  }
  if (!result) stack.pop()
  else result._stack = stack
  return result
}

export function download(filename: string, file: string | Blob) {
  const a = document.createElement('a')
  // blob.type = "application/octet-stream";
  filename = filename || '1'
  // @ts-ignore
  if (window.navigator.msSaveBlob) {
    try {
      // @ts-ignore
      window.navigator.msSaveBlob(file, filename)
    } catch (e) {
      console.log(e)
    }
  } else {
    const url = typeof file === 'string' ? file : window.URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a) // 火狐浏览器 必须把元素插入body中
    a.click()
    document.body.removeChild(a)
    // 释放之前创建的URL对象
    typeof file !== 'string' && window.URL.revokeObjectURL(url)
  }
}

/**
 * 防抖
 * @param fn 回调函数
 * @param delay 延时
 * @returns 
 */
export function debounce(fn: (...args: any[]) => any, delay: number, immediate: boolean) {
  let timer: number | null = null
  let exed = false
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    if (immediate && !exed) {
      fn.call(this, ...args)
      exed = true
    }
    timer = setTimeout(() => {
      if (!immediate && !exed) fn.call(this, ...args)
      timer = null
      exed = false
    }, delay) as any as number
  }
}

/**
 * 判断闰年
 */
export function isLeap(year: number) {
  if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
    return true;
  }
  return false;
}

/**
 * 获取根据月份获取天数
 */
export function getDaysByMonth(fullYear: number, month: number) {
  let days = 30
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      days = 31
      break
    case 2:
      days = isLeap(fullYear) ? 29 : 28
      break
    default:
      days = 30
  }
  return days
}

/**
 * 合并对象
 * @param a 
 * @param b 
 * @returns 
 */
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
        a[key] = deepCopy(b[key])
      }
    } else {
      // 如果 b 当前属性不为对象，则直接覆盖 a 当前属性
      a[key] = b[key]
    }
  }

  return a
}

function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepCopy) as unknown as T;
  }
  
  // 创建一个新的对象或数组
  const newObj = (Array.isArray(obj) ? [] : {}) as T;
  
  // 递归复制属性值
  for (const key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }
  return newObj;
}

/**
 * 计算b对a的差集
 * @param a 
 * @param b 
 * @returns 
 */
export function differenceSet(a: Array<any>, b: Array<any>) {
  const bs = new Set([...b])
  return [...new Set([...a].filter(x => !bs.has(x)))]
}

export function curAreaImageByElements(lt: HTMLElement, rb: HTMLElement, filename?: string) {
  filename = filename || 'image'
  const body = document.body
  const ltLayoutInfo = lt.getBoundingClientRect()
  const rbLayoutInfo = rb.getBoundingClientRect()
  const top = ltLayoutInfo.top
  const left = ltLayoutInfo.left
  const bottom = rbLayoutInfo.top + rbLayoutInfo.height
  const right = rbLayoutInfo.left + rbLayoutInfo.width
  const areaWidth = right - left
  const areaHeight = bottom - top
  html2canvas(body, { useCORS: true, }).then(mcanvas => {
    // const cutCanvas = document.createElement('canvas')
    // cutCanvas.width = areaWidth
    // cutCanvas.height = areaHeight
    // const cctx = cutCanvas.getContext('2d', { preserveDrawingBuffer: true }) as CanvasRenderingContext2D
    // cctx.drawImage(mcanvas, left, top, areaWidth, areaHeight, 0, 0, areaWidth, areaHeight)
    // const imgURL = cutCanvas.toDataURL("image/png");
    // download(filename as string, imgURL);
    
    const mctx = mcanvas.getContext('2d', { preserveDrawingBuffer: true }) as CanvasRenderingContext2D
    const imgData = mctx.getImageData(left, top, areaWidth, areaHeight)
    mcanvas.width = areaWidth
    mcanvas.height = areaHeight
    mctx.putImageData(imgData, 0, 0)
    // 将canvas转换为图像URL
    const imgURL = mcanvas.toDataURL("image/png");
    download(filename as string, imgURL);
  });
}

//最大高度： 三角 * 2 + 长 * 3 + 短 * 4 = 35 * 2 + 7 * 15 = 175
//最小高度： 80
//竖杆 lingLength * 15 + triangleLength * 35 Math.max(x, )
//长杆 M0 ${i * 15} L35 ${i * 15} L35 ${i * 15 + 5} L0 ${i * 15 + 5}z
//短杆 M0 ${i * 15} L20 ${i * 15} L20 ${i * 15 + 5} L0 ${i * 15 + 5}z
//三角 M0 ${i * 35} L45 ${i * 35} L0 ${i * 35 + 30} L0 ${i * 35 + 25} L28 ${i * 35 + 5} L0 ${i * 35 + 5}z
export function getWindShaftPath(speed: number) {
  const triGen = (i: number, y = 0) =>
    `M0 ${i * 35 + y} L45 ${i * 35 + y} L0 ${i * 35 + 30 + y} L0 ${i * 35 + 25 + y} L28 ${
      i * 35 + 5 + y
    } L0 ${i * 35 + 5 + y}z `
  const longGen = (i: number, y = 0) =>
    `M0 ${i * 15 + y} L35 ${i * 15 + y} L35 ${i * 15 + 5 + y} L0 ${i * 15 + 5 + y}z `
  const shortGen = (i: number, y = 0) =>
    `M0 ${i * 15 + y} L20 ${i * 15 + y} L20 ${i * 15 + 5 + y} L0 ${i * 15 + 5 + y}z `
  const triConut = Math.floor(speed % 20 >= 19 ? speed / 20 + 1 : speed / 20)
  const longResidue = speed - triConut * 20 < 0 ? 0 : speed - triConut * 20
  const longCount = Math.floor(longResidue % 4 >= 3 ? longResidue / 4 + 1 : longResidue / 4)
  const shortResidue = longResidue - longCount * 4 < 0 ? 0 : longResidue - longCount * 4
  const shortCount = Math.floor(shortResidue % 2 >= 1 ? shortResidue / 2 + 1 : shortResidue / 2)
  let path = ''
  for (let i = 0; i < triConut; i++) {
    path += triGen(i)
  }
  for (let i = 0; i < longCount; i++) {
    path += longGen(i, triConut * 35)
  }
  for (let i = 0; i < shortCount; i++) {
    path += shortGen(i, triConut * 35 + longCount * 15)
  }
  const poleHeight = Math.min(Math.max(triConut * 35 + (longCount + shortCount) * 15 + 10, 80), 175)
  path += `M0 ${poleHeight} L0 0 L5 0 L5 ${poleHeight}z`
  return path
}
export function getWindShaftImg(speed: number, color: string = '#333333') {
  const path = getWindShaftPath(speed)
  const pointStr: any = path.match(/(M|L)\d+\s\d+/g)
  if (!pointStr) return ''
  const points: {
    type: 'lineTo' | 'moveTo'
    point: [number, number]
  }[] = pointStr.map((item: string) => {
    const point1 = item.split(/\s/)
    const startAction = point1[0]?.[0] || 'L'
    return {
      type: startAction === 'L' ? 'lineTo' : 'moveTo', // 不是L就是M
      point: [point1[0]?.replace(/(M|L)/, '') || 0, point1[1] || 0]
    }
  })
  const xMax = Math.max(...points.map(item => item.point[0]))
  const yMax = Math.max(...points.map(item => item.point[1]))
  const canvas = document.createElement('canvas')
  canvas.width = xMax
  canvas.height = yMax
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  for (const pt of points) {
    const actionName = pt.type
    const point = pt.point
    ;(ctx as any)[actionName](point[0], point[1])
  }
  ctx.fillStyle = color
  ctx.fill()
  const dataUrl = canvas.toDataURL()
  return dataUrl
}

/**
 * 二分法查找，超出范围的取端点索引，在范围内的索引向下取整
 */
function binarySearch(list: any[], value: number): number {
  let left: number = 0
  let right: number = list.length
  if (value <= list[0]) return 0
  if (value >= list[right - 1]) return right - 1
  while (left < right) {
    const midIndex: number = (left + right) >> 1
    const midVlaue: number = list[midIndex]
    if (midVlaue === value) {
      right = midIndex
      break
    } else if (midVlaue < value) {
      left = midIndex
    } else {
      right = midIndex - 1
    }
  }
  return right
}
// 测试二分查找
for (const i of [-1, 0, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]) {
  console.log(i, binarySearch([2, 3, 4], i))
}