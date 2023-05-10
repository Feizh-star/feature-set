<script setup lang='ts'>
import { ref } from 'vue'
import { isLeap } from '@/utils/tools'

const selDate = ref(['2023-05-09 08:00'])
const endDate = '2023-05-09 08:00'
function disabledDate(currentData: Date) {
  const currentTime = currentData.getTime()
  const endTime = new Date(endDate).getTime()
  return currentTime - endTime > 0
}

const value1 = ref(['2023-05-01 00:00', '2023-05-10 23:59'])
const currentMonth = ref(new Date(value1.value[0]))
const shortcuts = reactive([
  {
    text: '上旬',
    onClick() {
      const currentDate = new Date(currentMonth.value)
      const fullYear = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const date = '01'
      const dateEnd = '10'

      const newDate = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${date} 00:00`)
      const newDateEnd = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${dateEnd} 23:59`)
      // return a Date
      return [newDate, newDateEnd]
    },
  },
  {
    text: '中旬',
    onClick() {
      const currentDate = new Date(currentMonth.value)
      const fullYear = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const date = '11'
      const dateEnd = '20'

      const newDate = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${date} 00:00`)
      const newDateEnd = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${dateEnd} 23:59`)
      // return a Date
      return [newDate, newDateEnd]
    },
  },
  {
    text: '下旬',
    onClick() {
      const currentDate = new Date(currentMonth.value)
      const fullYear = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const date = '21'
      let dateEnd = '30'
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          dateEnd = '31'
          break
        case 2:
          dateEnd = isLeap(fullYear) ? '29' : '28'
          break
        default:
          dateEnd = '30'
      }

      const newDate = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${date} 00:00`)
      const newDateEnd = new Date(`${fullYear}-${month < 10 ? `0${month}` : month}-${dateEnd} 23:59`)
      // return a Date
      return [newDate, newDateEnd]
    },
  },
])
const tenDayFormat = computed(() => {
  const date = new Date(value1.value[0])
  const month = date.getDate()
  let num = ''
  if (month >= 1 && month <= 10) {
    num = '上旬'
  } else if (month >= 11 && month <= 20) {
    num = '中旬'
  } else if (month >= 21) {
    num = '下旬'
  }
  return `YYYY年MM月${num}`
})
function calendarChange(date: Date[]) {
  console.log(date)
  currentMonth.value = date[0]
}


const value2 = ref(['2023-01-01 00:00', '2023-03-31 23:59'])
const currentMonth2 = ref(new Date(value1.value[0]))
const shortcuts2 = reactive([
  {
    text: '第一季度',
    onClick() {
      const currentDate = new Date(currentMonth2.value)
      const fullYear = currentDate.getFullYear()

      const newDate = new Date(`${fullYear}-01-01 00:00`)
      const newDateEnd = new Date(`${fullYear}-03-31 23:59`)
      return [newDate, newDateEnd]
    },
  },
  {
    text: '第二季度',
    onClick() {
      const currentDate = new Date(currentMonth2.value)
      const fullYear = currentDate.getFullYear()

      const newDate = new Date(`${fullYear}-04-01 00:00`)
      const newDateEnd = new Date(`${fullYear}-06-30 23:59`)
      return [newDate, newDateEnd]
    },
  },
  {
    text: '第三季度',
    onClick() {
      const currentDate = new Date(currentMonth2.value)
      const fullYear = currentDate.getFullYear()

      const newDate = new Date(`${fullYear}-07-01 00:00`)
      const newDateEnd = new Date(`${fullYear}-09-30 23:59`)
      return [newDate, newDateEnd]
    },
  },
  {
    text: '第四季度',
    onClick() {
      const currentDate = new Date(currentMonth2.value)
      const fullYear = currentDate.getFullYear()

      const newDate = new Date(`${fullYear}-10-01 00:00`)
      const newDateEnd = new Date(`${fullYear}-12-31 23:59`)
      return [newDate, newDateEnd]
    },
  },
])
const quarterFormat = computed(() => {
  const date = new Date(value2.value[0])
  const month = date.getMonth() + 1
  let num = ''
  if (month >= 1 && month <= 3) {
    num = '一'
  } else if (month >= 4 && month <= 6) {
    num = '二'
  } else if (month >= 7 && month <= 9) {
    num = '三'
  } else if (month >= 10 && month <= 12) {
    num = '四'
  }
  return `YYYY年第${num}季度`
})
function inputSlotDataFormatter(inputSlotData: any) {
  return inputSlotData.value.split('~')[0] || inputSlotData.value
}
function calendarChange2(date: Date[]) {
  currentMonth2.value = date[0]
}

function confirmFunc() { }

</script>

<template>
  <div class="date-picker-next">
    <DatePicker
      type="datetime"
      v-model:value="selDate[0]"
      :disabled-date="disabledDate"
      format="YYYY-MM-DD HH:mm"
      value-type="YYYY-MM-DD HH:mm"
      :show-minute="true"
      :clearable="true"
      :hour-step="1"
      :hour-options="[8, 20]"
      :minute-options="[0, 15, 30, 45]"
    ></DatePicker>
  </div>
  <div class="date-picker-next">
    <DatePicker
      type="date"
      range
      v-model:value="value1"
      :shortcuts="shortcuts"
      :format="tenDayFormat"
      value-type="YYYY-MM-DD HH:mm"
      :show-minute="true"
      :clearable="true"
      :hour-step="1"
      :hour-options="[8, 20]"
      :minute-options="[0, 15, 30, 45]"
      popup-class="date-range-hideone"
      @calendar-change="calendarChange"
    >
      <template #input="param">
        <div class="custom-input">{{ inputSlotDataFormatter(param) }}</div>
      </template>
    </DatePicker>
  </div>
  <div class="date-picker-next">
    <DatePicker
      type="month"
      range
      v-model:value="value2"
      :shortcuts="shortcuts2"
      :format="quarterFormat"
      value-type="YYYY-MM-DD HH:mm"
      :show-minute="true"
      :confirm="true"
      :clearable="false"
      :hour-step="1"
      :hour-options="[8, 20]"
      :minute-options="[0, 15, 30, 45]"
      popup-class="date-range-hideone"
      confirm-text="确定"
      @confirm="confirmFunc"
      @calendar-change="calendarChange2"
    >
      <template #input="param">
        <div class="custom-input">{{ inputSlotDataFormatter(param) }}</div>
      </template>
    </DatePicker>
  </div>
</template>

<style lang='scss' scoped>
.date-picker-next {
  margin-top: 20px;
}
.custom-input {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  &:hover, 
  &:focus {
    border-color: #409aff;
  }
}
</style>
<style lang="scss">
.date-range-hideone {
  .mx-calendar-range {
    .mx-calendar:nth-child(2) {
      display: none;
    }
    .mx-date-row,
    .mx-table-month {
      .cell {
        pointer-events: none;
        &.active:not(.not-current-month) {
          color: #73879c;
          background-color: #dbedfb;
        }
      }
    }
  }
}
</style>