<script setup lang='ts'>
import { ref } from 'vue'
import moment from 'moment'
import DatePicker from "@/components/DatePicker.vue"
import type { TypeString } from './components/MyDatePickerGf.vue'
import { dateToString } from '@/utils/moment'
import vLimitNumber from '@/directives/vLimitNumber.js'

const selDate = ref(['2023-05-09 08:00'])
const endDate = '2023-05-09 08:00'
function disabledDate(currentData: Date) {
  const currentTime = currentData.getTime()
  const endTime = new Date(endDate).getTime()
  return currentTime - endTime > 0
}
const allHour: Array<number> = []
const allMinute: Array<number> = []
for (let i = 0; i < 60; i++) {
  if (i < 24) allHour.push(i)
  allMinute.push(i)
}
const restMinute = [0, 15, 30, 45]
const restHour = [8, 20]
function disabledMinute(a: any, b: any) {
  const dis = allMinute.filter(m => !restMinute.includes(m))
  return dis
}
function disabledHour(a: any, b: any) {
  const dis = allHour.filter(h => !restHour.includes(h))
  return dis
}



const numberInput = reactive({
  altitude: ''
})
const numberInputRef = ref('')
const limitObj = { data: numberInputRef, key: 'value', p: 2, min: 0, max: 999999 }
const numberInputRef1 = ref('')
const limitObj1 = { data: numberInputRef1, key: 'value', p: 2, min: 0, max: 999999 }
watch(numberInputRef, newVal => {
  console.log(newVal)
})

const datepickerType = ref<TypeString>('ten')
const types = ['datetime', 'week', 'month', 'year', 'ten', 'quarter']
const standardDateFormatter = "YYYY-MM-DD HH:mm:ss";

const pickedTime = ref([moment().format(standardDateFormatter)])
const hourOptions = ref<number[] | null>(null)
const minuteOptions = ref<number[] | null>(null)
const disableStart = computed(() => undefined)
const datepickerFormat = ref("")
const defaultTime = ref("")
function changeHandler(date: Date, type: TypeString, otype: string) {
  // console.log(date, type, otype)
}
watch(pickedTime, newVal => {
  console.log(JSON.stringify(newVal))
})
</script>

<template>
  <div class="element-com">
    <el-date-picker
      v-model="selDate[0]"
      style="width: 14.5rem; margin-left: 1.5rem"
      type="datetime"
      format="YYYY-MM-DD HH:mm"
      :clearable="false"
      :disabledDate="disabledDate"
      :disabled-minutes="disabledMinute"
      :disabled-hours="disabledHour"
    />

    <div style="margin-top: 20px">
      <el-radio-group v-model="datepickerType" size="small">
        <el-radio-button :label="t" v-for="t in types" :key="t"></el-radio-button>
      </el-radio-group>
      <br/>
      <DatePicker
        v-model="pickedTime"
        :type="datepickerType"
        :hour-options="hourOptions"
        :minute-options="minuteOptions"
        :disable-start="disableStart"
        :value-type="standardDateFormatter"
        :show-minute="true"
        :format="datepickerFormat"
        :default-time="defaultTime"
        :clearable="false"
        :hour-step="1"
        confirm
        confirm-text="确认"
        @change="changeHandler"
      />
    </div>
    
    <div style="margin-top: 20px">
      <el-input
        v-model="numberInput.altitude"
        placeholder="高度"
        v-limit-number="{ data: numberInput, key: 'altitude', p: 2, min: 0, max: 999999 }"
      ></el-input>
    </div>
    <div style="margin-top: 20px">
      <el-input
        v-model="numberInputRef"
        placeholder="高度"
        v-limit-number="limitObj"
      ></el-input>
    </div>
    <div style="margin-top: 20px">
      <input
        v-model="numberInputRef1"
        placeholder="高度"
        v-limit-number="limitObj1"
      />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.element-com {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
<style>
.el-time-spinner__item.is-disabled {
  display: none;
}
</style>

<style lang="less" scoped>

// 深色的旬季日期选择器
:deep(.dark-datepicker) {
  width: 180px;
  .mx-input,
  .custom-input {
    height: 32px;
    line-height: 32px;
    color: #eeeeee;
    background-color: rgba(4, 34, 61, 0.8) !important;
    box-shadow: inset 0px 0px 10px rgba(0, 255, 255, 0.2) !important;
    border: 1px solid !important;
    border-image-source: linear-gradient(
      221.54deg,
      rgba(85, 224, 255, 0) 3.16%,
      #55e0ff 71.22%,
      rgba(85, 224, 255, 0) 99.96%
    ) !important;
    border-image-slice: 1 !important;
    border-radius: 0px !important;
  }
  .custom-input {
    line-height: 18px;
  }
  .mx-icon-calendar,
  .mx-icon-clear {
    color: #eeeeee;
  }
  .mx-table-date th {
    text-align: center;
    color: #eeeeee;
  }
  .mx-btn {
    color: #eeeeee;
    &:hover {
      color: #1284e7;
    }
  }
  .mx-calendar-header-label {
    color: #eeeeee;
  }
  .mx-calendar-week-mode .mx-date-row {
    &:hover {
      background-color: #134774;
    }
    &.mx-active-week {
      background-color: #1284e7;
    }
    .mx-week-number {
      color: #eeeeee;
    }
  }
  .mx-datepicker-popup .mx-calendar-content .mx-date-row.mx-active-week .cell:hover {
    background-color: #1284e7;
  }
  .mx-datepicker-popup .mx-calendar-week-mode .mx-calendar-content .cell.not-current-month:hover {
    background-color: #134774;
  }
  .panel-style(mx-datepicker-popup, mx-calendar-content, cell);
  .panel-style(mx-time, mx-time-content, mx-time-item);
  .panel-style(@outclass, @innerclass, @cellclass) {
    .@{outclass} {
      border: 1px solid;
      border-image-source: linear-gradient(
        0deg,
        #55e0ff 0%,
        rgba(85, 224, 255, 0.05) 35.34%,
        rgba(85, 224, 255, 0.05) 88.47%,
        #55e0ff 100%
      ) !important;
      border-image-slice: 1;
      background-color: #07142a;
      box-shadow: inset 0px 0px 10px rgba(0, 255, 255, 0.2);
      .@{innerclass} {
        .@{cellclass} {
          color: #eeeeee;
          &.disabled:not(.not-current-month) {
            color: #9e9e9e;
            background-color: #3f3f3f;
            &:hover {
              background-color: #3f3f3f;
            }
          }
          &.not-current-month {
            color: #9e9e9e;
            &:hover {
              background-color: #07142a;
            }
          }
          &:hover {
            background-color: #134774;
          }
          &.active:not(.not-current-month) {
            background-color: #1284e7;
          }
        }
      }
    }
  }
  .mx-calendar-range {
    .mx-date-row,
    .mx-table-month {
      .cell {
        &.in-range:not(.not-current-month),
        &.hover-in-range:not(.not-current-month) {
          color: #eeeeee;
          background-color: #1284e7;
        }
        &.active:not(.not-current-month) {
          color: #eeeeee;
          background-color: #1284e7;
        }
      }
    }
  }
  .mx-btn-shortcut.disabled {
    color: #9e9e9e;
  }
  .mx-time {
    ul.mx-time-list {
      .mx-time-item.disabled {
        display: none;
      }
    }
  }
}
</style>