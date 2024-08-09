<script setup lang="ts">
import moment from 'moment'
import { compressNumbers, decompressNumbers } from './script/pakoCompress'
import './test/handleRaw'

function isValidNumber(value: any, special: any[] = [999999]) {
  try {
    value = parseFloat(value)
  } catch (error) {
    /* empty */
  }
  return !(!(value || value === 0) || typeof value !== 'number' || special.some((sv) => sv == value))
}
function decimalToBase256(decimal: number) {
    if (decimal < 0 || decimal > Math.pow(256, 4) - 1) {
        throw new Error("输入的十进制整数超出范围（0到4294967295）。");
    }
    
    let result = [];
    for (let i = 0; i < 4; i++) {
        result.unshift(decimal % 256)
        decimal = Math.floor(decimal / 256)
    }
    
    return result
}
function stringToAsciiCodes(inputString: string) {
    if (!/^[a-zA-Z_][a-zA-Z_0-9,]+$/.test(inputString)) {
        throw new Error("输入的字符串不是合法的标识符。");
    }
    let asciiCodes = [];
    for (let i = 0; i < inputString.length; i++) {
        asciiCodes.push(inputString.charCodeAt(i));
    }
    return asciiCodes;
}

const cols = ['power']
function genRandomData() {
  const day = moment().format('YYYY-MM-DD')
  return new Array(96).fill(0).map((item, index) => {
    let hour: any = index / 4
    hour = hour < 10 ? `0${hour}` : hour
    let minute: any = index % 4 * 15
    minute = minute < 10 ? `0${minute}` : minute
    const colObj: any = {}
    cols.forEach((el) => {
      colObj[el] = Math.round(Math.random() * 99999999 * 10) / 10
    })
    return {
      time: `${day} ${Math.floor(hour)}:${minute}`,
      ...colObj
    }
  })
}

function clickEvent() {
  const testData = genRandomData()
  compress(testData, 1)

  const justNumberArray = justNumber(testData)
  const compressStr = compressNumbers(justNumberArray)
  console.log(compressStr, `${compressStr},240808,1,96,power,pre`)
  const uncompress = decompressNumbers(compressStr)
  console.log(justNumberArray, uncompress)
}

function justNumber(rawData: any[]) {
  const rowCount = rawData.length
  const colKey = Object.keys(rawData[0] || {})
  const timeKeyIndex = colKey.indexOf('time')
  timeKeyIndex > -1 && colKey.splice(timeKeyIndex, 1)
  const twoDimensionalArray = new Array(rowCount).fill(0).map(() => []) as number[][]
  for (const [index, rawRow] of rawData.entries()) {
    const twoDimensionalArrayRow = twoDimensionalArray[index]
    for (const key of colKey) {
      let value = rawRow[key]
      if (!isValidNumber(value)) {
        value = 4294967295
      }
      twoDimensionalArrayRow.push(value)
    }
  }
  return twoDimensionalArray.flat()
}

function compress(rawData: any[], p = 1) {
  console.log(rawData)
  // 日期，数据精度，行数，列数，列字段长度
  // 20240808 1 96 2 9 power,pre
  const rowCount = rawData.length
  const colKey = Object.keys(rawData[0] || {})
  // const timeKeyIndex = colKey.indexOf('time')
  // timeKeyIndex > -1 && colKey.splice(timeKeyIndex, 1)
  const twoDimensionalArray = justNumber(rawData)
  // for (const [index, rawRow] of rawData.entries()) {
  //   const twoDimensionalArrayRow = twoDimensionalArray[index]
  //   for (const key of colKey) {
  //     let value = rawRow[key]
  //     if (!isValidNumber(value)) {
  //       value = 4294967295
  //     }
  //     twoDimensionalArrayRow.push(value)
  //   }
  // }
  const time = parseInt(moment(rawData[0].time, 'YYYY-MM-DD HH:mm').format('YYYYMMDD')) // 时间
  const colCount = colKey.length // 列数
  const colKeyString = colKey.join(',')
  const colKeyStringLength = Math.ceil(colKeyString.length / 4) // 字段名所占的像素数
  const colKeyStringCode = stringToAsciiCodes(colKeyString) // 字段名的acsii码
  const colKeyStringCodeBytes = new Array(colKeyStringLength * 4).fill(0).map((item, index) => colKeyStringCode[index] ?? item) // 补齐
  const valueArray = twoDimensionalArray.flat() // 所有数据值
  const ctrlHeadBytes = [time, p, rowCount, colCount, colKeyStringLength].map(item => decimalToBase256(item)).flat() // 头部控制数据字节
  const dataBytes = valueArray.map(item => decimalToBase256(Math.round(item * Math.pow(10, p)))).flat() // 数据字节
  console.log(time, p, rowCount, colCount, colKeyStringLength, colKeyStringCodeBytes, valueArray)
  console.log(ctrlHeadBytes, colKeyStringCodeBytes, dataBytes)
  const allBytes = [...ctrlHeadBytes, ...colKeyStringCodeBytes, ...dataBytes] // 所有字节
  const dataPixelCount = Math.ceil(allBytes.length / 4)
  const sideLength = Math.ceil(Math.sqrt(dataPixelCount))
  const usePixelRow = Math.ceil(dataPixelCount / sideLength)
  
  const fullPixelData = new Array(sideLength * usePixelRow * 4).fill(0).map((item, index) => allBytes[index] ?? item)
  const canvas = document.createElement('canvas')
  canvas.width = sideLength
  canvas.height = usePixelRow
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const imageData = ctx.getImageData(0, 0, sideLength, usePixelRow)
  for (let i = 0; i < imageData.data.length; i++) {
    imageData.data[i] = fullPixelData[i]
  }
  ctx.putImageData(imageData, 0, 0)

  const imgBase64 = canvas.toDataURL('image/png')
  console.log(valueArray.join(','))
  console.log(imgBase64)
}
</script>

<template>
  <div class="compress-test">
    <el-button @click="clickEvent">压缩</el-button>
  </div>
</template>

<style scoped lang="scss">
.compress-test {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #fff;
}
</style>