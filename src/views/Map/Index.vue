<script setup lang="ts">
import * as L from 'leaflet'
import { MapHcMin } from 'hcl'

type TWmts = 'vec_w' | 'cva_w'
const myKey = '42139ec25fe7ae771affe917de5c9ecf'
const mapStyle = {
  sea: {
    fillStyle: '#3D8DFF'
  },
  world: {
    type: 'polygon',
    fillStyle: '#696969',
    strokeStyle: '#DCDCDC',
    lineWidth: 1
  },
  china: {
    type: 'polygon',
    fillStyle: '#D2D2D2',
    strokeStyle: '#F4F4F4',
    lineWidth: 1
  },
  province: {
    type: 'polygon',
    fillStyle: '#D2D2D2',
    strokeStyle: '#F4F4F4',
    lineWidth: 1
  },
  shi: {
    type: 'polygon',
    fillStyle: '#D2D2D2',
    strokeStyle: '#F4F4F4',
    lineWidth: 1
  },
  xian: {
    type: 'polygon',
    fillStyle: '#D2D2D2',
    strokeStyle: '#F4F4F4',
    lineWidth: 1
  },
  xiangzhen: {
    type: 'polygon',
    fillStyle: '#D2D2D2',
    strokeStyle: '#F4F4F4',
    lineWidth: 1
  },
  river1: {
    type: 'polygon',
    fillStyle: 'blue'
  },
  provincePoint: {
    type: 'point',
    fillStyle: 'red',
    // font: "20px 宋体",
    fontSize: 20,
    fontFamily: '宋体',
    labelKey: 'SNAME',
    textHeight: 20,
    color: 'black'
  },
  shenghui: {
    type: 'point',
    radius: 6,
    fillStyle: 'black',
    strokeWidth: 3,
    strokeStyle: '#FFA300',
    // font: "20px 宋体",
    fontSize: 20,
    fontFamily: '宋体',
    labelKey: 'dname',
    textHeight: 20,
    color: 'black'
  },
  shiPoint: {
    type: 'point',
    radius: 3,
    strokeWidth: 1,
    strokeStyle: 'black',
    // font: "20px 宋体",
    fontSize: 16,
    fontFamily: '宋体',
    labelKey: 'dname',
    textHeight: 20,
    color: '#4B4B4B'
  },
  xianPoint: {
    type: 'point',
    radius: 3,
    // strokeWidth: 1,
    // strokeStyle: "black",
    // font: "20px 宋体",
    fontSize: 16,
    fontFamily: '宋体',
    labelKey: 'XNAME',
    textHeight: 20,
    color: '#4B4B4B'
  },
  xiangzhenPoint: {
    type: 'point',
    radius: 3,
    // strokeWidth: 1,
    // strokeStyle: "black",
    // font: "20px 宋体",
    fontSize: 16,
    fontFamily: '宋体',
    labelKey: 'name_x1',
    textHeight: 20,
    color: '#4B4B4B'
  },
  jiuduanxian: {
    type: 'line',
    strokeStyle: 'red',
    lineWidth: 1
  }
}

const mapRef = ref<HTMLDivElement>()
let mapIns = shallowReactive<{ map: L.Map | null }>({
  map: null
})

function getTianWmts(type: TWmts) {
  return `https://t0.tianditu.gov.cn/${type}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${
    type.split('_')[0]
  }&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${myKey}`
}
onMounted(() => {
  mapIns.map = L.map(mapRef.value as HTMLDivElement, {
    center: [32.986549, 107.797788], // [32.986549, 107.797788], [33.874936, 113.5020695]
    zoom: 4, // 7
    maxZoom: 18,
    minZoom: 3,
    scrollWheelZoom: true,
    zoomControl: false,
    attributionControl: false,
    maxBounds: [
      [-89, -180],
      [89, 180]
    ]
  })
  // L.tileLayer(getTianWmts('vec_w'), {}).addTo(mapIns.map)
  // L.tileLayer(getTianWmts('cva_w'), {}).addTo(mapIns.map)
  let hcmap = new MapHcMin({
    style: mapStyle,
    // 瓦片越大，地图越不精细,当前为固定的，如需要更改，请提需求
    tileSize: 1024,
    // 地图更新频率，越小，瓦片化越小，但是浏览器性能消耗变高
    updateInterval: 50,
    //地图向外延申像素，越大，瓦片化越小，但是浏览器消耗变高
    wrapSize: 400,
    url: ''
  }).addTo(mapIns.map)
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

<style lang="scss" scoped>
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
