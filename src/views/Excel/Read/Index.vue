<script setup lang='ts'>
import * as XLSX from "xlsx"
import geobuf from 'geobuf'
import Pbf from 'pbf'
import monitorPoint from './monitor-point.json'
import monitorList from './list.json'
import { differenceSet } from '@/utils/tools'

function loadFile(e: Event) {
  const btnEl = e.target as HTMLElement
  const fileInput = btnEl.getElementsByTagName('input')[0]
  fileInput.click()
}
// async function handleFileAsync(e) {
//   const file = e.target.files[0];
//   const data = await file.arrayBuffer();
//   /* data is an ArrayBuffer */
//   const workbook = XLSX.read(data);

//   /* DO SOMETHING WITH workbook HERE */
// }
async function handleExcel(e: Event) {
  const fileInput = e.target as HTMLInputElement
  const file = fileInput.files![0]
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  
  parseData(workbook.SheetNames, workbook.Sheets)
}

const keyMap: any = {
  "序号": "index",
  "名称": "name",
  "纬度": "lat",
  "经度": "lng",
  "网关": "wg",
  "IP": "ip",
  "掩码": "ym",
}
function parseData(SheetNames: string[], Sheets: { [sheet: string]: XLSX.WorkSheet }) {
  const sheet2 = Sheets[SheetNames[0]]
  console.log(sheet2)
  const res = []

  let rowIndex = 2
  while (sheet2[`A${rowIndex}`]) {
    let colIndex = 'A'
    const rowObj = {} as { [prop: string]: any }
    rowObj['id'] = `disaster${rowIndex - 1}`
    while (colIndex.charCodeAt(0) <= 'G'.charCodeAt(0)) {
      const key = keyMap[sheet2[`${colIndex}1`].v as string]
      rowObj[key] = sheet2[`${colIndex}${rowIndex}`]?.v || ''
      colIndex = String.fromCharCode(colIndex.charCodeAt(0) + 1)
    }
    res.push(rowObj)
    rowIndex++
  }
  res.forEach(item => {
    item.lat = parseFloat(item.lat)
    item.lng = parseFloat(item.lng)
  })
  console.log(JSON.stringify(res, undefined, 2))
}

function loadPng(e: Event) {
  const btnEl = e.target as HTMLElement
  const fileInput = btnEl.getElementsByTagName('input')[0]
  fileInput.click()
}
async function handlePng(e: Event) {
  const fileInput = e.target as HTMLInputElement
  const file = fileInput.files![0]
  const data = await file.arrayBuffer()
  
  const geojson = geobuf.decode(new Pbf(data))
  console.log(JSON.stringify(geojson, null, 2))
}
function addCode() {
  const monitorPointList = monitorPoint.map(a => ({ ...a, disaster_type: '监控' }))
  console.log(JSON.stringify(monitorPointList, null ,2))
}
</script>

<template>
  <div class="read-excel">
    <el-button @click="loadFile">
      <input type="file" name="选择表格" style="display: none;" @click.stop @change="handleExcel">
      选择表格
    </el-button>
    <el-button @click="loadPng">
      <input type="file" name="选择图片" style="display: none;" @click.stop @change="handlePng">
      选择图片
    </el-button>
    <el-button @click="addCode">添加id</el-button>
  </div>
</template>

<style lang='scss' scoped>
.read-excel {
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: rgba(236, 128, 220, 0.286);
}
</style>