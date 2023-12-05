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
</script>

<template>
  <div class="mock-test">

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