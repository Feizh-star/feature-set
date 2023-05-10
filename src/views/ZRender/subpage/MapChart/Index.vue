<script setup lang='ts'>
import { LMap } from './libs/map'

const mapRef = ref<HTMLDivElement>()
let mapIns = null

onMounted(() => {
  mapIns = new LMap(mapRef.value as HTMLDivElement)
})
</script>

<template>
  <div class="map-chart">
    <section class="z-btns">
      <el-button>按钮</el-button>
    </section>
    <div class="map-container" ref="mapRef"></div>
  </div>
</template>

<style lang='scss' scoped>
.map-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .map-container {
    flex: 1;
    min-height: 0;
  }
}
</style>