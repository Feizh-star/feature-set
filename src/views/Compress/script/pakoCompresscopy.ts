import pako from 'pako'
import moment from 'moment'

export interface ISysInfo {
  deltaTime: number
  group: number
  system: number
}

// 综合步骤
export function compressNumbers(data: any[], info: ISysInfo) {
  if (data.length === 0) {
    console.warn('数据长度为0！')
    return ''
  }
  if (!data[0].time) {
    console.warn('时间参数time不存在！')
    return ''
  }
  const startTime = moment(new Date(data[0].time.substring(0, 10))).diff(moment('2000-01-01 00:00:00'), 'days') // 从2000-01-01到今天的天数
  const numbers = justNumber(data)
  
  console.log('--原始：时间--', startTime)
  console.log('--原始：时间间隔--', info.deltaTime)
  console.log('--原始：电站群组--', info.group)
  console.log('--原始：系统编号--', info.system)
  console.log('--原始：数据--', numbers)
  // 各个部分的256进制数，用十进制数组表示
  // 时间-占2位
  const time256 = decimalToBase256(startTime, 2)
  // 时间间隔-占1位
  const deltaTime256 = decimalToBase256(info.deltaTime, 1)
  // 电站群组-占1位
  const group256 = decimalToBase256(info.group, 1)
  // 系统编号-占1位
  const system256 = decimalToBase256(info.system, 1)
  // 数据-每一个数字占2位
  const dataBytes256 = numbers.map(item => decimalToBase256(item, 2)).flat()

  // 要压缩的序列
  const numberList = [...time256, ...deltaTime256, ...group256, ...system256, ...dataBytes256]
  const buffer = new Uint8Array(numberList)
  const zipBuffer = pako.gzip(buffer)
  const base64Str = btoa(String.fromCharCode.apply(null, zipBuffer));
  return base64Str
}

/* *************************************************************************************** */



// 综合步骤
export function decompressNumbers(base64String) {
  let compressedBuffer = fromBase64String(base64String);
  let uint8Buffer = new Uint8Array(pako.ungzip(compressedBuffer).buffer);

  // 时间-占2位
  const time256 = uint8Buffer.slice(0, 2)
  const timeDay = base256ToDecimal(time256) // 从2000-01-01到今天的天数
  const startTime = moment('2000-01-01 00:00:00').add(timeDay, 'day').format('YYYY-MM-DD HH:mm:ss')
  // 时间间隔-占1位
  const deltaTime256 = uint8Buffer.slice(2, 3)
  const deltaTime = base256ToDecimal(deltaTime256)
  // 电站群组-占1位
  const group256 = uint8Buffer.slice(3, 4)
  const group = base256ToDecimal(group256)
  // 系统编号-占1位
  const system256 = uint8Buffer.slice(4, 5)
  const system = base256ToDecimal(system256)
  // 数据-每一个数字占2位
  const dataBytes256 = uint8Buffer.slice(5)
  const originData = []
  for (let i = 0; i < dataBytes256.length; i+=2) {
    const number256 = [dataBytes256[i], dataBytes256[i + 1]]
    const decimalNumber = base256ToDecimal(number256)
    originData.push(decimalNumber)
  }

  console.log('--时间--', startTime)
  console.log('--时间间隔--', deltaTime)
  console.log('--电站群组--', group)
  console.log('--系统编号--', system)
  console.log('--数据--', originData)

}

export function justNumber(rawData: any[], key: string = 'power', p = 0) {
  const pow = Math.pow(10, p)
  const twoDimensionalArray: number[] = []
  for (const rawRow of rawData) {
    let value = rawRow[key]
    if (!isValidNumber(value)) {
      value = 65535
    }
    twoDimensionalArray.push(Math.round(value * pow) / pow)
  }
  return twoDimensionalArray
}

function decimalToBase256(decimal: number, bit = 2) {
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
function base256ToDecimal(base256: number[]) {
  let result = 0
  const bit = base256.length
  for (let i = 0; i < bit; i++) {
    result += Math.pow(256, i) * base256[bit - 1 - i]
  }
  return result
}

// 从base64字符串转换为Uint8Array
function fromBase64String(base64) {
  let binaryString = atob(base64);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function isValidNumber(value: any, special: any[] = [999999]) {
  try {
    value = parseFloat(value)
  } catch (error) {
    /* empty */
  }
  return !(!(value || value === 0) || typeof value !== 'number' || special.some((sv) => sv == value))
}