<script setup lang='ts'>
import moment from 'moment'

const props = withDefaults(defineProps<{
  startTime: string;
  length: number;
  division: number,
  divisionType: 'day' | 'hour' | 'minute' | 'second'
  modelValue: string;
  formatter: string;
}>(), {
  startTime: moment().minute(0).second(0).format('YYYYMMDDHHmmss'),
  length: 20,
  division: 5,
  divisionType: 'minute',
  formatter: 'YYYYMMDDHHmmss',
})

const tickList = computed(() => {
  const formatter = props.formatter
  const length = props.length
  const division = props.division
  const divisionType = props.divisionType
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(moment(props.startTime, formatter).add(i * division, divisionType).format(formatter))
  }
  return result
})

// 工具函数
function getYear(time: string, formatter = props.formatter) {
  return `${moment(time, formatter).year()}`
}
function getMonth(time: string, formatter = props.formatter) {
  const result = moment(time, formatter).month() + 1
  return result < 10 ? `0${result}` : `${result}`
}
function getDate(time: string, formatter = props.formatter) {
  const result = moment(time, formatter).date()
  return result < 10 ? `0${result}` : `${result}`
}
function getHour(time: string, formatter = props.formatter) {
  const result = moment(time, formatter).hour()
  return result < 10 ? `0${result}` : `${result}`
}
function getMinute(time: string, formatter = props.formatter) {
  const result = moment(time, formatter).minute()
  return result < 10 ? `0${result}` : `${result}`
}
function getSecond(time: string, formatter = props.formatter) {
  const result = moment(time, formatter).second()
  return result < 10 ? `0${result}` : `${result}`
}

defineExpose({
  tickList
})
</script>

<template>
  <div class="time-line">
    <div class="time-line-header"></div>
    <div class="line-container">
      <ul>
        <li v-for="tick in tickList" :key="tick">{{ getHour(tick) }}:{{ getMinute(tick) }}</li>
      </ul>
    </div>
  </div>
</template>

<style lang='less' scoped>
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.time-line {
  height: 100%;
  display: flex;
  flex-direction: column;
  .time-line-header {
    height: 32px;
  }
  .line-container {
    flex: 1;
    width: 100%;
    > ul {
      display: flex;
      > li {
        flex: 1;
      }
    }
  }
}
</style>