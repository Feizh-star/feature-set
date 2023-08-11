<script setup>
import { ref } from 'vue';
import TimeLine from '@/components/company/TimeLine.vue';
import MyTimeLine from '@/components/TimeLine/TimeLine.vue';
import HorScroll from '@/components/HorScroll/IndexV3.vue'


const test_timeline = [
  "202207012100",
  "202207012106",
  "202207012112",
  "202207012118",
  "202207012124",
  "202207012130",
  "202207012136",
  "202207012142",
  "202207012148",
  "202207012154",
  "202207012200",
  "202207012206",
  "202207012212",
  "202207012218",
  "202207012224",
  "202207012230",
  "202207012236",
  "202207012242",
  "202207012248",
  "202207012254",
  "202207012300",
]
const timeList = ref([...test_timeline]) //时间轴
const tick = ref("")  // 15min时间轴的刻度。没有刻度不要传间隔多少显示一个。如果是分钟  xx_mm如果是小时:xx_HH.因为没有做时间显示标签的自适应，所以需要手动调使标签不重叠.几个建议值：12_mm 30_mm 12_HH  24_HH
const bound = ref(11) //用于展示两头颜色不同的时间轴，传入一个数字，从第几个时间开始分隔颜色，从0开始计数
const oriSel = ref(0)  //更新时间轴默认选中

const timer = ref("")  //时间轴播放是否开启
// const tFresh = ref(true)  //是否获取最新时次
const half = ref(false)  //是否区分实况预报
const hs = ref("")  //时间选择器小时步长
const ms = ref(6)  //时间选择器分钟步长
const dura = ref("1")  //时长
const obsTimeRange = ref(6)
const fcstTimeRange = ref(6)

const oriTime = ref("202207012206")  // 时间input显示时间
const defTime = ref(0)  //更新时间轴默认选中


/**
 * TimeLine
 */
// 修改日期，重新拼接时间轴
function tchange(VAL) {
  // tFresh.value = false
  oriTime.value = VAL
  defTime.value = 0
  timer.value = null
  refreshTimeList()
}
// 点击刷新按钮，获取最新时次
function autoFresh() {
  // tFresh.value = true
  oriTime.value = '202207012206'
  defTime.value = 0
  timer.value = null
  refreshTimeList()
}
// 用于时间轴播放，基本必须，传入一个参数，为当前播放定时器的id
function settimer(VAL) {
  timer.value = VAL
}
// 点击播放按钮，修改当前时次
function timeClick(ID, VAL) {
  defTime.value = ID
  console.log('timeClick', VAL)
}
// 刷新时间轴
function refreshTimeList() {
  createTimeList()
}
// 得到时间轴
function createTimeList() {
  timeList.value = [...test_timeline]
}


const datePicker = ref('2023-05-08 17:33')
function confirmFunc() {

}
</script>

<template>
  <div class="test-timeline">
    <TimeLine 
      class="timeline"
      :isAutoo="true"
      :timeArray="timeList"
      :startTime="oriTime"
      :select="defTime"
      :hourStep="hs"
      :minuteStep="ms"
      d-value-type="YYYYMMDDHHmm"
      @itemClick="timeClick"
      @timerRun="settimer"
      @inputTimeChange="tchange"
      @autoFresh="autoFresh"
      :timer="timer"
      :half="half"
      :tick="tick"
      :bound="bound"
      :obsTimeRange="obsTimeRange"
      :fcstTimeRange="fcstTimeRange"
    />

    <div class="hor-scroll-test" style="margin-top: 30px;">
      <HorScroll>
        <div 
          class="scroll-item"
          v-for="i in 32"
          :key="i"
        >
          <span>项目-{{ i }}</span>
        </div>
      </HorScroll>
    </div>
    <div style="margin-top: 30px;">
      <DatePicker
        type="datetime"
        v-model:value="datePicker"
        format="YYYY-MM-DD HH:mm"
        value-type="YYYY-MM-DD HH:mm"
        :show-minute="true"
        :confirm="true"
        :clearable="false"
        :hour-step="1"
        confirm-text="确定"
        @confirm="confirmFunc"
      ></DatePicker>
    </div>
    <div style="margin-top: 30px; width: 100%; height: 92px;">
      <MyTimeLine />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.test-timeline {
  height: 100%;
  background-color: #fff;
}
.hor-scroll-test {
  border: 1px solid #efefef;
  .scroll-item {
    width: 60px;
    &:nth-child(2n) {
      background-color: rgb(60, 195, 248);
    }
    &:nth-child(2n + 1) {
      background-color: rgb(255, 221, 119);
    }
  }
}
</style>