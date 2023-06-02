<script setup lang='ts'>
import { wordBreak } from 'html2canvas/dist/types/css/property-descriptors/word-break';
import { ref } from 'vue';
import * as XLSX from "xlsx"


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
  "县区": "prefecture",
  "灾害类型": "disaster_type",
  "隐患点名称": "disaster_name",
  "地理位置": "address",
  "隐患点简介": "brief",
  "治理情况": "situation",
  "备注": "remark",
  "经度": "longitude",
  "纬度": "latitude",
  "点位名称": "camera"
}
function parseData(SheetNames: string[], Sheets: { [sheet: string]: XLSX.WorkSheet }) {
  const sheet2 = Sheets[SheetNames[2]]
  console.log(sheet2)
  const res = []

  let rowIndex = 2
  while (sheet2[`A${rowIndex}`]) {
    let colIndex = 'A'
    const rowObj = {} as { [prop: string]: any }
    rowObj['id'] = `disaster${rowIndex - 1}`
    while (colIndex.charCodeAt(0) <= 'K'.charCodeAt(0)) {
      const key = keyMap[sheet2[`${colIndex}1`].v as string]
      rowObj[key] = sheet2[`${colIndex}${rowIndex}`]?.v || ''
      colIndex = String.fromCharCode(colIndex.charCodeAt(0) + 1)
    }
    res.push(rowObj)
    rowIndex++
  }
  console.log(JSON.stringify(res, undefined, 2))
}
</script>

<template>
  <div class="read-excel">
    <el-button @click="loadFile">
      <input type="file" name="选择表格" style="display: none;" @click.stop @change="handleExcel">
      选择表格
    </el-button>
  </div>
</template>

<style lang='scss' scoped>
.read-excel {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>