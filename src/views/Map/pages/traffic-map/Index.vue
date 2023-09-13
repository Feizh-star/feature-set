<script setup lang="ts">
import { addMap } from './map/index'
import type { MMap, IMarkerItem, ICommonMarkerOption, IHclColorsRange, IScaleProps } from '@/libs/leaflet/hefei/libs/map'

/* ********************************************************************************************* */
const panesCfg = [
  { name: 'gd-pane', zIndex: 1005 },
  { name: 'shadow-mask', zIndex: 1010 },
  { name: 'color-stain', zIndex: 1020 },
  { name: 'border-pane', zIndex: 1030 },
  // { name: 'stain-image', zIndex: 1040 },
  { name: 'road-mesh', zIndex: 1050 },
  { name: 'station-point', zIndex: 1060 },
]
const layerCfg = [
  { pane: 'station-point', name: 'stationPoint' },
  { pane: 'road-mesh', name: 'roadMeshLayer' },
]

/* ********************************************************************************************* */
const mapContainer = ref()
const mapIsReady = ref(false) // 请勿在本组件之外修改
const mapInfo = shallowReactive({ MapIns: {} as MMap })
onMounted(() => {
  mapInfo.MapIns = addMap(mapContainer.value, { center: [31.8265, 117.2704], zoom: 9 }, panesCfg, layerCfg)
  mapIsReady.value = true

  mapInfo.MapIns.map.on('click', e => {
    console.log(`lat: ${e.latlng.lat.toFixed(4)}, lng: ${e.latlng.lng.toFixed(4)}`)
  })
})

function clearDraw() {
  
}
</script>

<template>
  <div class="stain-test">
    <section class="z-btns">
      <el-form inline>
        <el-form-item>
          <el-button @click="clearDraw">清除</el-button>
        </el-form-item>
      </el-form>
    </section>
    <div class="map-container" ref="mapContainer"></div>
  </div>
</template>

<style scoped lang="scss">
.stain-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .map-container {
    flex: 1;
    min-height: 0;
    outline: none;
  }
  .z-btns {
    padding: 8px 8px 0;
  }
}
</style>