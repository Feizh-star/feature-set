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
function parseData(SheetNames: string[], Sheets: { [sheet: string]: XLSX.WorkSheet }) {
  const sheet1 = Sheets[SheetNames[0]]
  const sheet2 = Sheets[SheetNames[1]]
  console.log(sheet1, sheet2)
  const totalMap = new Map()
  const res = []

  let rowIndex = 1
  while (sheet2[`A${rowIndex}`]) {
    const nameObj = sheet2[`A${rowIndex}`]
    const valueObj = sheet2[`B${rowIndex}`]
    res.push({
      name: nameObj?.v || '',
      value: 0,
      rate: valueObj?.v || '',
    })

    const totalNameObj = sheet1[`A${rowIndex}`]
    const totalValueObj = sheet1[`B${rowIndex}`]
    totalMap.set(totalNameObj?.v || '', totalValueObj?.v || 0)
    rowIndex++
  }
  res.forEach(item => item.value = totalMap.get(item.name) || 0)
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