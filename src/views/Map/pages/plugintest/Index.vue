<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInitMap } from './composition/useInitMap'
import TestPlugin from './composition/plugins/test'
import henan_border from './composition/geojson/henan_border.json'
import test_png from '@/views/Map/pages/plugintest/composition/geojson/410000.png'

const geoserverUrl = 'http://221.122.67.145:8323'
const tilesCfg = [
  { path: geoserverUrl + '/geoserver/chinaMap/wms', layers: 'chinaMap:chinaMap' },
  // { path: geoserverUrl + '/geoserver/chinaMap/wms', layers: 'chinaMap:chinaMap_zhengzhou' }
]
const panesCfg = [
  { name: 'shadow-mask', zIndex: 1010 },
  { name: 'border-pane', zIndex: 1030 },
]
const layerCfg = [
  { pane: 'station-point', name: 'stationPoint' },
]

const mapElRef = ref<HTMLDivElement>()
const { mapInstance, addGeoArea } = useInitMap({
  mapElRef,
  panes: panesCfg,
  layerInfo: layerCfg,
  tiles: tilesCfg,
  mask: {
    enable: false,
    zIndex: 996,
    border: henan_border,
    shadowBorders: {
      borderShapes: [
        {
          enable: true,
          offsetX: 0,
          offsetY: 0,
          z: 30,
          style: {
            stroke: '#2959b6',
            fill: 'transparent',
            lineWidth: 3,
            shadowBlur: 20,
            shadowColor: '#2959b6',
          },
        },
        {
          enable: false,
        },
        {
          enable: false,
        },
      ],
    },
  },
})

onMounted(() => {
  mapInstance.value?.on('click', e => {
    console.log(`lat: ${e.latlng.lat.toFixed(4)}, lng: ${e.latlng.lng.toFixed(4)}`)
  })
  addGeoArea({
    maxZoom: 16,
    wrapSize: 400,
    tileSize: 512,
    layers: [
      {
        name: '芒市',
        data: test_png,
        type: 'polygon',
        index: 1,
        style: {
          strokeColor: 'red',
          storkeWidth: 1,
          fillColor: 'rgba(100,255,0,0.3)'
        }
      }
    ],
  })
  const testLayer = new TestPlugin('red', [
    [112.1594, 34.5337],
    [115.1917, 34.3162],
    [112.7527, 32.6301],
  ])
  testLayer.addTo(mapInstance.value)
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
  }
}
</style>