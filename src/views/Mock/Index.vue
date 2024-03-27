<script setup lang="ts">
import axios from 'axios'
import { onMounted } from 'vue';

onMounted(() => {
  axios.get('/mock/stations', { params: { area: '金湖县' } }).then(res => {
    console.log(res.data)
  })

  const stationApiParams = {
    // dataType: 'rainAreaface',
    stime: '202311290800',
    etime: '202311291200',
    area: '金湖县'
  }
  axios.get('/mock/stationData', { params: { ...stationApiParams } }).then(res => {
    console.log(res.data.data)
  })
})

const rangeTest = ref<HTMLElement>()
const rangeTest1 = ref<HTMLElement>()
onMounted(() => {
  const el = rangeTest.value
  const el1 = rangeTest1.value
  if (!el || !el1) return
  // const boundingRect = el.children[0].getBoundingClientRect()
  // const boundingRect1 = el1.children[0].getBoundingClientRect()
  // console.log('el', boundingRect, boundingRect1)
  const range = document.createRange()
  range.setStart(el, 0)
  range.setEnd(el1, el1.childNodes.length)
  const rangeBoundingRect = range.getBoundingClientRect()
  console.log('range', rangeBoundingRect)
})
</script>

<template>
  <div class="mock-test">
    <div class="range-test" ref="rangeTest">
      文本节点
    </div>
    <div class="range-test" ref="rangeTest1" style="text-align: right;">
      文本节点文本节点
    </div>
  </div>
</template>

<style scoped lang="scss">
.mock-test {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #fff;
}
</style>