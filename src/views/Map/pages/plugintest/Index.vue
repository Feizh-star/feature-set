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
    enable: false,
    border: henan_border as GeoJSON.FeatureCollection,
    mask: { enable: false }
  },
  mapOpts: {
    zoom: 5,
    center: [40.1507, 118.3545]
  },
  // hclMapConfig: {
  //   style: {
  //     sea: {
  //       fillStyle: 'red'
  //     },
  //     world: {
  //       type: 'polygon',
  //       fillStyle: '#1A222D',
  //       strokeStyle: '#263845',
  //       lineWidth: 1
  //     },
  //     china: {
  //       type: 'polygon',
  //       fillStyle: '#11161D',
  //       strokeStyle: '#3B576A',
  //       lineWidth: 1
  //     },
  //     province: {
  //       type: 'polygon',
  //       fillStyle: '#11161D',
  //       strokeStyle: '#3B576A',
  //       lineWidth: 1
  //     },
  //     shi: {
  //       type: 'polygon',
  //       fillStyle: '#11161D',
  //       strokeStyle: '#3B576A',
  //       lineWidth: 1
  //     },
  //     xian: {
  //       type: 'polygon',
  //       fillStyle: '#11161D',
  //       strokeStyle: '#3B576A',
  //       lineWidth: 1
  //     },
  //     xiangzhen: {
  //       type: 'polygon',
  //       fillStyle: '#11161D',
  //       strokeStyle: '#3B576A',
  //       lineWidth: 1
  //     },
  //     river1: {
  //       type: 'polygon',
  //       fillStyle: '#14497D'
  //     },
  //     provincePoint: {
  //       type: 'point',
  //       fillStyle: 'red',
  //       // font: "20px 宋体",
  //       fontSize: 20,
  //       fontFamily: '宋体',
  //       labelKey: 'SNAME',
  //       textHeight: 20,
  //       color: '#5678A4'
  //     },
  //     shenghui: {
  //       type: 'point',
  //       radius: 6,
  //       fillStyle: '#00B7D7',
  //       strokeWidth: 3,
  //       strokeStyle: '#1C65C3',
  //       // font: "20px 宋体",
  //       fontSize: 20,
  //       fontFamily: '宋体',
  //       labelKey: 'dname',
  //       textHeight: 20,
  //       color: '#5678A4'
  //     },
  //     shiPoint: {
  //       type: 'point',
  //       radius: 4,
  //       strokeWidth: 3,
  //       strokeStyle: '#04C9CB',
  //       // font: "20px 宋体",
  //       fontSize: 16,
  //       fontFamily: '宋体',
  //       labelKey: 'dname',
  //       textHeight: 20,
  //       color: '#5678A4'
  //     },
  //     xianPoint: {
  //       type: 'point',
  //       radius: 3,
  //       // strokeWidth: 1,
  //       // strokeStyle: "black",
  //       // font: "20px 宋体",
  //       fontSize: 16,
  //       fontFamily: '宋体',
  //       labelKey: 'XNAME',
  //       textHeight: 20,
  //       color: '#5678A4'
  //     },
  //     xiangzhenPoint: {
  //       type: 'point',
  //       radius: 3,
  //       // strokeWidth: 1,
  //       // strokeStyle: "black",
  //       // font: "20px 宋体",
  //       fontSize: 16,
  //       fontFamily: '宋体',
  //       labelKey: 'name_x1',
  //       textHeight: 20,
  //       color: '#5678A4'
  //     },
  //     jiuduanxian: {
  //       type: 'line',
  //       strokeStyle: '#009EFF',
  //       lineWidth: 1
  //     }
  //   }
  // }
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
  // console.log(base64String); // 这里是Base64编码的图像数据
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