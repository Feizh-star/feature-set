import html2canvas from 'html2canvas'

/**
 * 遍历树，查找指定的节
 * @param {Array} data 树的根
 * @param {String} id 要查找的标识
 * @param {Object} keys 配置对象：children：指明使用哪个属性作为子级测表；id：指明哪个属性作为id（可以族套，例如：'data.id'）
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
export function debounce(fn: (...args: any[]) => any, delay: number) {
  let timer: NodeJS.Timeout | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.call(this, ...args)
    }, delay)
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