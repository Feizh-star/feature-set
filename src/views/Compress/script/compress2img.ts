import moment from 'moment'
import { testGl } from './glcopy'

export interface ISysInfo {
  deltaTime: number
  group: number
  system: number
}

export function compress2img(data: any[], info: ISysInfo) {
  if (data.length === 0) {
    console.warn('数据长度为0！')
    return ''
  }
  if (!data[0].time) {
    console.warn('时间参数time不存在！')
    return ''
  }
  const startTime = moment(new Date(data[0].time.substring(0, 10))).diff(moment('2000-01-01 00:00:00'), 'days') // 从2000-01-01到今天的天数
  const { numbers } = justNumber(data)
  // 各个部分的256进制数，用十进制数组表示
  // 时间-占2位
  const time256 = decimalToBase256(startTime, 2)
  // 时间间隔-占1位
  const timeDelta256 = decimalToBase256(info.deltaTime, 1)
  // 电站群组-占1位
  const group256 = decimalToBase256(info.group, 1)
  // 系统编号-占1位
  const system256 = decimalToBase256(info.system, 1)
  // 数据-每一个数字占2位
  const dataBytes256 = numbers.map(item => decimalToBase256(item, 2)).flat()

  // 要压缩的序列
  const numberList = [...time256, ...timeDelta256, ...group256, ...system256, ...dataBytes256]
  const dataPixelCount = Math.ceil(numberList.length / 4) // 向上取整为4的倍数个像素
  const sideLength = Math.ceil(Math.sqrt(dataPixelCount))
  const usePixelRow = Math.ceil(dataPixelCount / sideLength)
  
  const fullPixelData = new Array(sideLength * usePixelRow * 4).fill(255).map((item, index) => numberList[index] ?? item)
  console.log(fullPixelData)
  // const imgBase64 = testGl(sideLength, usePixelRow, fullPixelData)
  const canvas = document.createElement('canvas')
  canvas.width = sideLength
  canvas.height = usePixelRow
  const ctx = canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D
  const imageData = ctx.getImageData(0, 0, sideLength, usePixelRow)
  for (let i = 0; i < imageData.data.length; i++) {
    imageData.data[i] = fullPixelData[i]
  }
  ctx.putImageData(imageData, 0, 0)

  const imgBase64 = canvas.toDataURL('image/png')

  // // data:image/png;base64
  return imgBase64.replace('data:image/png;base64,', '')
}

export function decompress2img(dataStr: string) {
  const imgBase64 = `data:image/png;base64,${dataStr}`
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = imgBase64
    img.onload = (e: Event) => {
      const imgEl = e.target as HTMLImageElement
      const width = imgEl.width
      const height = imgEl.height
      
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(imgEl, 0, 0)
      const imageData = ctx.getImageData(0, 0, width, height)
      console.log(imageData, imageData.data)
      // let canvas = document.createElement('canvas');
      // let gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
      // gl.activeTexture(gl.TEXTURE0);
      // let texture = gl.createTexture();
      // gl.bindTexture(gl.TEXTURE_2D, texture);
      // const framebuffer = gl.createFramebuffer();
      // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgEl);
      // gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
      // let data = new Uint8Array(imgEl.width * imgEl.height * 4);
      // gl.readPixels(0, 0, imgEl.width, imgEl.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      // console.log(data)
    }
  })
}

export function justNumber(rawData: any[], p = 0) {
  const rowCount = rawData.length
  const colKey = Object.keys(rawData[0] || {})
  const timeKeyIndex = colKey.indexOf('time')
  timeKeyIndex > -1 && colKey.splice(timeKeyIndex, 1)
  const pow = Math.pow(10, p)
  const twoDimensionalArray = new Array(rowCount).fill(0).map(() => []) as number[][]
  for (const [index, rawRow] of rawData.entries()) {
    const twoDimensionalArrayRow = twoDimensionalArray[index]
    for (const key of colKey) {
      let value = rawRow[key]
      if (!isValidNumber(value)) {
        value = 65535
      }
      twoDimensionalArrayRow.push(Math.round(value * pow) / pow)
    }
  }
  return {
    colKeys: colKey,
    numbers: twoDimensionalArray.flat()
  }
}

export function decimalToBase256(decimal: number, bit = 2) {
  const max = Math.pow(256, bit) - 1
  if (decimal < 0 || decimal > max) {
      throw new Error(`输入的十进制整数超出范围（0到${max}）。`);
  }
  
  let result = [];
  for (let i = 0; i < bit; i++) {
      result.unshift(decimal % 256)
      decimal = Math.floor(decimal / 256)
  }
  
  return result
}

function isValidNumber(value: any, special: any[] = [999999]) {
  try {
    value = parseFloat(value)
  } catch (error) {
    /* empty */
  }
  return !(!(value || value === 0) || typeof value !== 'number' || special.some((sv) => sv == value))
}
