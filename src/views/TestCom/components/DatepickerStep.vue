<script setup lang="ts">
import moment from 'moment'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import 'vue-datepicker-next/locale/zh-cn.es'
import vDatepickerStep from '@/directives/v-datepicker-step'

const todayMoment = moment()
const formData = reactive({
  year: todayMoment.format('YYYY'),
  month: todayMoment.format('YYYYMM'),
  date: todayMoment.format('YYYYMMDD'),
  hour: todayMoment.format('YYYYMMDDHH00'),
  minute: todayMoment.format('YYYYMMDDHHmm'),
  second: todayMoment.format('YYYYMMDDHHmmss'),
  range: [moment().subtract(7, 'd').format('YYYYMMDDHH00'), moment().subtract(4, 'd').format('YYYYMMDDHH00')],
  interval: moment().subtract(1, 'day').format('YYYYMMDD1200')
})

function disableDate(date: Date) {
  return date > moment().toDate()
}
function disableTime(date: Date) {
  return date > moment().toDate()
}

const yearValue = ref(todayMoment.format('YYYY'))
const yearStepEnable = ref(true)
const yearCfg = {
  bind: yearValue,
  key: 'value',
  enable: yearStepEnable
}
</script>

<template>
  <div class="datepicker-step">
    <div class="current-moment">
      <span>最新时间(禁选截止时间)：{{ todayMoment.format('YYYY-MM-DD HH:mm:ss') }}</span>
    </div>
    <el-form label-width="120px">
      <el-form-item label="逐年">
        <DatePicker
          v-datepicker-step="yearCfg"
          type="year"
          v-model:value="yearValue"
          format="YYYY"
          value-type="YYYY"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
        <div style="padding-left: 8px">
          <el-switch v-model="yearStepEnable" />
        </div>
      </el-form-item>
      <el-form-item label="逐月">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'month', enable: true }"
          type="month"
          v-model:value="formData.month"
          format="YYYY-MM"
          value-type="YYYYMM"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
      <el-form-item label="逐日">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'date', enable: true }"
          type="date"
          v-model:value="formData.date"
          format="YYYY-MM-DD"
          value-type="YYYYMMDD"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
      <el-form-item label="逐时">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'hour', enable: true }"
          type="datetime"
          v-model:value="formData.hour"
          format="YYYY-MM-DD HH:00"
          value-type="YYYYMMDDHH00"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
      <el-form-item label="逐分">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'minute', enable: true }"
          type="datetime"
          v-model:value="formData.minute"
          format="YYYY-MM-DD HH:mm"
          value-type="YYYYMMDDHHmm"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
      <el-form-item label="逐秒">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'second', enable: true }"
          type="datetime"
          v-model:value="formData.second"
          format="YYYY-MM-DD HH:mm:ss"
          value-type="YYYYMMDDHHmmss"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
      <el-form-item label="范围">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'range', enable: true }"
          type="datetime"
          :range="true"
          show-hour
          v-model:value="formData.range"
          format="YYYY-MM-DD HH:00"
          value-type="YYYYMMDDHH00"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
      <el-form-item label="时分秒间隔自定">
        <DatePicker
          v-datepicker-step="{ bind: formData, key: 'interval', enable: true }"
          type="datetime"
          v-model:value="formData.interval"
          format="YYYY-MM-DD HH:mm"
          value-type="YYYYMMDDHHmm"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :hour-options="[8, 12, 20]"
          :minute-step="10"
          :clearable="true"
          :confirm="true"
          confirm-text="确定" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.datepicker-step {
  .current-moment {
    padding: 16px;
  }
}
html.dark {
  .datepicker-step {
    .current-moment {
      color: #eeeeee;
    }
    :deep(.el-form) {
      .el-form-item__label {
        --el-text-color-regular: #eeeeee;
      }
    }
  }
}
</style>
