<script setup>
import { ref } from 'vue'
import FileSaver from "file-saver"
import * as XLSX from "xlsx"
import { exportTable } from './hooks/export-eltable.js'
const tableData = [
  {
    date: '2016-05-03',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-02',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-08',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-06',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
  {
    date: '2016-05-07',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
  },
]

const tableRef = ref()
</script>

<template>
  <div class="">
    <section>
      <el-button @click="exportTable(tableRef)">导出</el-button>
    </section>
    <el-table :data="tableData" style="width: 100%" ref="tableRef">
      <el-table-column prop="date" label="日期" width="150"> </el-table-column>
      <el-table-column label="配送信息">
        <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
        <el-table-column label="地址">
          <el-table-column prop="province" label="省份" width="120">
          </el-table-column>
          <el-table-column prop="city" label="市区" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
          <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang='scss' scoped>

</style>