<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as L from 'leaflet'
import type GeoJSON from 'geojson'
import { useInitMap } from './composition/useInitMap'
import henan_border from './composition/geojson/henan_border.json'
import test_png from '@/views/Map/pages/plugintest/composition/geojson/410000.png'
import line_png from '@/views/Map/pages/plugintest/t2-2023061501.png'

const geoserverUrl = 'http://221.122.67.145:8323'
const tilesCfg = [
  { path: geoserverUrl + '/geoserver/chinaMap/wms', options: {  layers: 'chinaMap:chinaMap' }, wms: true },
  // { path: geoserverUrl + '/geoserver/chinaMap/wms', layers: 'chinaMap:chinaMap_zhengzhou' }
]
const panesCfg = [
  { name: 'plugin-test-pane', zIndex: 1005 },
  { name: 'shadow-layer', zIndex: 1010 },
  { name: 'line-pane', zIndex: 1030 },
  { name: 'area-pane', zIndex: 1040 },
  { name: 'border-pane', zIndex: 1050 },
]
const layerCfg = [
  { pane: 'station-point', name: 'stationPoint' },
]

const mapElRef = ref<HTMLDivElement>()
const { mapInstance, addGeoArea, addGeoJsonLine  } = useInitMap({
  mapElRef,
  panes: panesCfg,
  layerInfo: layerCfg,
  // tiles: tilesCfg,
  shadow: {
    enable: true,
    border: henan_border as GeoJSON.FeatureCollection,
    mask: { enable: true }
  },
  mapOpts: {
    center: [44.1507, 123.3545]
  }
})

onMounted(() => {
  mapInstance.value?.on('click', e => {
    console.log(`lat: ${e.latlng.lat.toFixed(4)}, lng: ${e.latlng.lng.toFixed(4)}`)
  })
  addGeoArea({
    maxZoom: 16,
    wrapSize: 400,
    tileSize: 512,
    pane: 'area-pane',
    layers: [
      {
        name: '芒市',
        data: test_png,
        type: 'polygon',
        index: 1,
        style: {
          strokeColor: '#67879c',
          storkeWidth: 1,
          fillColor: '#1b3152'
        }
      }
    ],
  })
  // addGeoJsonLine([{
  //   name: 'tl',
  //   type: 'gbf',
  //   data: '/glimg/tongliao/numerical_model/ec/surf/json/2023061500/t2-2023061501.png',
  //   style: {
  //     width: 2,
  //     color: '#3388ff'
  //   }
  // }], { pane: 'line-pane' })
})
const img = new Image()
img.onload = function () {
  console.log('load')
}
img.onerror = function () {
  console.log('error')
}
img.src = '/glimg/zzdata/numerical_model/ec/surf/json/2022122212/t2-2022122509.png'
fetch('/glimg/tongliao/numerical_model/ec/surf/json/2023061500/t2-2023061501.png').then(res => {
  return res.arrayBuffer()
}).then(buffer => {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  var base64String = btoa(binary);
  console.log(base64String); // 这里是Base64编码的图像数据
}).catch((error) => {
  console.log(error)
})
</script>

<template>
  <div class="plugin-test">
    <div class="map-container" ref="mapElRef"></div>
  </div>
</template>

<style scoped lang="scss">
.plugin-test {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .map-container {
    flex: 1;
    min-height: 0;
    :deep(.shadow-layer) {
      transform: translate(4px, 8px);
    }
  }
}
</style>