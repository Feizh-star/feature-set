<script setup>
import { ref } from 'vue';
import HorScroll from '@/components/HorScroll/IndexV3.vue'
import TimeSquence from './components/TimeSquence.vue'
import WindEChart from './components/WindEChart.vue'
import DatepickerStep from './components/DatepickerStep.vue'



const datePicker = ref('2023-05-08 17:33')
function confirmFunc() {

}
/* *********************************************************************************************************** */
function fn1 () {
  let a = new Array(100000)
  let b = 3
  function fn2() {
    let c = [1, 2, 3]
  }
  fn2()
  return a
}
let res = []  
function myClick() {
  res.push(fn1())
}

let test_child
function myClickAddDom() {
  test_child = document.createElement('div')
  test_child.innerHTML = '我是一个放在全局变量上的div'
  document.querySelector('#test-root').appendChild(test_child)
}
function myClickRemove() {
  document.querySelector('#test-root').removeChild(test_child)
}
</script>

<template>
  <div class="test-timeline">
    <div class="hor-scroll-test" style="padding-top: 30px;">
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
    <div class="time-squence-container">
      <TimeSquence />
    </div>
    <div style="padding-top: 10px">
      <el-button @click="myClick">点击</el-button>
      <el-button @click="myClickAddDom">添加DOM</el-button>
      <el-button @click="myClickRemove">移除DOM</el-button>
    </div>
    <div class="wind-shaft-container">
      <WindEChart />
    </div>
    <div id="test-root">
      <!-- <img src="@/assets/images/error.png" alt="" /> -->
      <span>123</span>
    </div>
    <div class="test-datepicker-step">
      <DatepickerStep />
    </div>
    <div class="test-mask"></div>
  </div>
</template>

<style lang='scss' scoped>
.test-timeline {
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
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
.wind-shaft-container {
  display: flex;
  justify-content: center;
}
#test-root {
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    box-shadow: 3px 3px 5px 1px #333;
  }
  color: #aaa;
  font-size: 30px;
  font-weight: 700;
  text-shadow: 3px 3px 1px #333;
}
.test-mask {
  height: 373px;
  width: 230px;
  transform: rotate3d(1, 0, 0, 180deg);
  background-image: radial-gradient(100% 50% at 50% 110%, #00000000, #00000022 20%, #00000044 40%, #00000066 60%, #00000088 100%, #000000aa);
  
  // #000000ff 45%,
  //   #000000cc 55%,
  //   #00000088 75%,
  //   #00000055 85%,
  //   #00000000
}
</style>