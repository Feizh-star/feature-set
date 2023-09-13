<script setup lang='ts'>
import { LMap } from '@/libs/leaflet/drill/map'
import * as L from 'leaflet'
import type GeoJSON from 'geojson'
// @ts-ignore
import border from '@/libs/leaflet/drill/geojson/henan_border.json'
const borderJson = border as GeoJSON.FeatureCollection

const mapRef = ref<HTMLDivElement>()
let mapIns: LMap | null = null

onMounted(() => {
  mapIns = new LMap(mapRef.value as HTMLDivElement, {
      center: [32.986549, 107.797788], // [32.986549, 107.797788], [33.874936, 113.5020695]
      zoom: 4, // 7 4
  }, {
    // geojson: '410000',
    // border: borderJson,
    mask: {
      enable: true,
      style: {
        fillColor: '#edf0f7',
        fillOpacity: 0.8
      },
      shadowBorders: {
        borderShapes: [
          {
            enable: true,
            offsetX: 3, 
            offsetY: 3, 
            z: 30,
            style: {
              stroke: '#bcc6db',
              fill: 'transparent',
              lineWidth: 4,
              shadowBlur: 0,
              shadowColor: '#c800ff'
            }
          },
          {
            enable: true,
            offsetX: 6,
            offsetY: 6,
            z: 20,
            style: {
              stroke: '#a1b7e5',
              fill: 'transparent',
              lineWidth: 6,
            }
          },
          {
            enable: false,
          }
        ]
      }
    },
    drill: {
      enable: true,
      enableActive: true,
      event: {
        // onclick: (e: any, f: GeoJSON.Feature) => { console.log('vue onclick', e, f) },
        // onmouseover: (e: any, f: GeoJSON.Feature) => { console.log('vue onmouseover', e, f) },
        // onmouseout: (e: any, f: GeoJSON.Feature) => { console.log('vue onmouseout', e, f) },
        // ondrill: (e: any, f: GeoJSON.Feature) => { console.log('vue ondrill', e, f) },
      },
      simple: {
        minDrill: 0,
        tolerance: 0,
        precision: 8,
        highQuality: false,
        includeZ: false
      },
      itemStyle: {
        color: '#47495f',
        fillColor: '#ffa73b',
        fillOpacity: 0.4,
        weight: 1
      },
      itemStyleActive: {
        color: '#ff0000',
        fillColor: '#effd3a',
        fillOpacity: 0.4,
        weight: 1
      },
      borderStyle: {
        color: '#47495f',
        weight: 3
      }
    }
  })
  markerLayerGroup.addTo(mapIns.getMap())
  mapIns.getMap().on('click', (e) => {
    console.log(e)
  })
})

const markers = [
  { position: [112.335205, 33.045507], name: '南阳市' },
  { position: [113.466796, 34.606084], name: '郑州市' },
  { position: [114.477539, 34.578952], name: '开封市' },
]
const paneCfg = { pane: 'test-mark', zIndex: 1350 }
const markerLayerGroup = L.layerGroup()
function addMarkers() {
  if (!mapIns) return
  const lmap = mapIns.getMap()
  let pane = lmap.getPane(paneCfg.pane);
  if (!pane) {
    pane = lmap.createPane(paneCfg.pane)
    pane.style.zIndex = `${paneCfg.zIndex}`
  } else {
    pane.style.zIndex = paneCfg.zIndex ? `${paneCfg.zIndex}` : pane.style.zIndex
  }
  markerLayerGroup.clearLayers()
  for (const m of markers) {
    const marker = L.marker([m.position[1], m.position[0]], { 
      icon: L.divIcon({ 
        html: `
          <div style="width: 10px; height: 10px; background-color: #74fe82; border-radius: 50%; border: 1px solid #333;"></div>
          <div style="color: #000000; white-space: nowrap;">
            ${m.name}
          </div>`,
        className: 'lmarker-area-name',
        iconAnchor: [m.name.length * 6, 6]
      }),
      pane: paneCfg.pane,
    })
    marker.bindPopup(`<div>123</div>`, {
      pane: paneCfg.pane,
      offset: [-11, -2]
    })
    marker.addTo(markerLayerGroup)
  }
}
function clearMarkers() {
  markerLayerGroup.clearLayers()
}
</script>

<template>
  <div class="map-chart">
    <section class="z-btns">
      <el-button @click="addMarkers">添加点</el-button>
      <el-button @click="clearMarkers">清除点</el-button>
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
  :deep(.lmarker-area-name) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
}
</style>