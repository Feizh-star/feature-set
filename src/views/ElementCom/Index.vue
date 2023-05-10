<script setup lang='ts'>
import { ref } from 'vue'
import datepickertest from './components/datepickerTest.vue'
import MyDatePicker from './components/MyDatePicker.vue'
import type { TypeString } from './components/MyDatePicker.vue'
import { dateToString } from '@/utils/moment'

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

const dateTime = ref([dateToString(new Date(), 'YYYY-MM-DD HH:mm')])
const pickerType = ref<TypeString>('quarter')
watch(dateTime, (newVal) => {
  console.log(newVal)
})

const types = ['datetime', 'week', 'month', 'year', 'ten', 'quarter']

const value6 = ref(null)
watch(value6, (newVal) => {
  console.log(newVal)
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
    <datepickertest />

    <div style="margin-top: 20px">
      <el-radio-group v-model="pickerType" size="small">
        <el-radio-button :label="t" v-for="t in types" :key="t"></el-radio-button>
      </el-radio-group>
      <br/>
      <MyDatePicker 
        v-model="dateTime"

        :type="pickerType"
        :hour-options="[8, 20]"
        :minute-options="[0, 15, 30, 45]"
        :disable-start="new Date()"

        value-type="YYYY-MM-DD HH:mm"
        :show-minute="true"
        :clearable="true"
        :hour-step="1"
      />
        <!-- :disable-start="new Date()" -->
    </div>
    
    <div style="margin-top: 20px">
      <date-picker 
        v-model:value="value6" 
        type="month" 
        placeholder="Select"
        format="YYYY年MM月"
      ></date-picker>
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