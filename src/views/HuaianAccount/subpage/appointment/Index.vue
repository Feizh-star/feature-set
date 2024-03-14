<script setup lang="tsx">
import moment from 'moment'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import 'vue-datepicker-next/locale/zh-cn.es'
import CustomTable, { type IColumn } from '../../components/CustomTable'
import FormItem from '../../components/FormItem.vue'
import vDatepickerStep from '../../directives/v-datepicker-step'
import { useTableCfg } from './compositions/useTableCfg'

import { ElButton } from 'element-plus'
import type { h } from 'vue'

const YYYYMMDDHHmm = 'YYYYMMDDHHmm'
const YYYYMMDDHHmmUser = 'YYYY-MM-DD HH:mm'
const datePickerProps = {
    type: 'datetime',
    format: YYYYMMDDHHmmUser,
    valueType: YYYYMMDDHHmm,
    showMinute: true,
    range: true,
    hourStep: 1,
    minuteStep: 1,
    placeholder: '请选择时间段'
}
const todayStartMoment = moment().hour(0).minute(0).second(0)
const formData = reactive({
  datetime: [todayStartMoment.clone().format(YYYYMMDDHHmm), todayStartMoment.clone().add(24, 'hour').format(YYYYMMDDHHmm)],
})

const { deps, config } = useTableCfg()
const testData = ref([
  { name: '张三', identityCode: '413986209932569851', phoneNumber: '17788889999', appointType: '1', count: 1, status: '未到场', appointTime: '2023-12-12 14:10', submitTime: '2023-12-10 14:10' },
  { name: '李四', identityCode: '413986209932569852', phoneNumber: '18877779999', appointType: '2', count: 4, status: '已到场', appointTime: '2023-12-12 14:10', submitTime: '2023-12-10 14:10' },
  { name: '王五', identityCode: '413986209932569853', phoneNumber: '19988887777', appointType: '1', count: 1, status: '已超时', appointTime: '2023-12-12 14:10', submitTime: '2023-12-10 14:10' },
])

const table = shallowRef()
onMounted(() => {
  console.log(table.value.$refs.eltable.clearSelection)
})
const handleReach = (scope: { row: any }) => {
  console.log(scope.row)
}
const handleDelete = (scope: { row: any }) => {
  console.log(scope.row)
}

</script>

<template>
  <div class="form-table-page">
    <div class="form-container">
      <FormItem label="选择时间：">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'datetime' }"
          v-bind="datePickerProps"
          :clearable="false"
          v-model:value="formData.datetime"
          :confirm="true"
          confirm-text="确定" />
      </FormItem>
      <FormItem>
        <el-button type="primary">查询</el-button>
        <el-button type="danger">重置</el-button>
      </FormItem>
    </div>
    <div class="table-container">
      <CustomTable
        :data="testData"
        :columns="config"
        :deps="deps"
        border
        height="100%"
        ref="table"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-table-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  .form-container {
    padding-bottom: 16px;
    display: flex;
  }
  .table-container {
    flex: 1;
    min-height: 0;
    :deep(.el-button.is-text:not(.is-disabled)) {
      &:active,
      &:focus,
      &:hover {
        --el-fill-color-light: transparent;
        --el-fill-color: transparent;
      }
    }
  }
}
</style>