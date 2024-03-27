<script setup lang="ts">
import * as L from 'leaflet'
import huaian_border from '@/libs/map/geojson/huaian_border.png'
import huaian_county from '@/libs/map/geojson/huaian_county.png'
import ha_county_name from '@/libs/map/geojson/ha_county_name.png'
import test from '@/libs/map/geojson/huaian_border.json'
import { useInitMap } from '@/libs/map/useInitMap'
import type { IMarkerItem, ICommonMarkerOption } from '@/libs/map/useMarkers'

const geoserverUrl = 'http://1.119.169.101:10042'
const tilesCfg: Parameters<typeof useInitMap>[0]['tiles'] = [
  // {
  //   name: 'radar',
  //   path: geoserverUrl + '/geoserver/global/wms',
  //   options: { layers: 'global:global_province_city_county_town' },
  //   type: 'wms',
  //   show: true,
  // },
  {
    name: 'radar',
    show: true,
    type: 'hclTile',
    options: {},
  },
]
// http://t0.tianditu.gov.cn/cia_w/wmts?tk=42139ec25fe7ae771affe917de5c9ecf
const panesCfg = [
  { name: 'shadow-layer', zIndex: 1010 },
  { name: 'line-pane', zIndex: 1030 },
  { name: 'area-pane', zIndex: 1040 },
  { name: 'border-pane', zIndex: 1050 },
  { name: 'station-pane', zIndex: 1065 },
]
const layerCfg = [{ pane: 'station-point', name: 'stationPoint' }]
// 区县边界配置
const geojsonAreaConfig = {
  enable: true,
  option: {
    maxZoom: 16,
    wrapSize: 400,
    tileSize: 512,
    pane: 'area-pane',
    layers: [
      {
        name: '淮安',
        data: huaian_border,
        type: 'polygon',
        index: 1,
        style: {
          strokeColor: 'rgba(124, 129, 134, 0.7)',
          storkeWidth: 1,
          fillColor: 'rgba(35, 169, 242, 0.2)',
        },
      },
      {
        name: '淮安',
        data: huaian_county,
        type: 'polygon',
        index: 1,
        style: {
          strokeColor: 'rgba(124, 129, 134, 0.7)',
          storkeWidth: 1,
          fillColor: 'rgba(35, 169, 242, 0.2)',
        },
      },
    ],
  },
}
// 区县标注配置
const geojsonPointConfig = {
  enable: true,
  option: {
    zIndex: 1060,
    layers: [
      // layers不通过 addGeoPointLayers 添加是因为不在初始化时添加的layer的showZoom会失效
      {
        name: '淮安标注',
        data: ha_county_name,
        showZoom: [7, 9],
        style: {
          lineWidth: 0,
          strokeStyle: '',
          key: 'XNAME',
          showTxt: true,
          txtColor: '#467aa8',
          font: '10px Arial',
        },
      },
    ],
  },
}

const mapElRef = ref<HTMLDivElement>()
const {
  mapInstance,
  addGlStainImg,
  updateGlStainImgUrl,
  hasGlStainImgLayer,
  removeGlStainImg,
  addMarkers,
  removeMarkers,
} = useInitMap({
  mapElRef,
  panes: panesCfg,
  layerInfo: layerCfg,
  tiles: tilesCfg,
  mapOpts: {
    zoom: 8,
    center: [33.32, 119.01],
  },
  geojsonAreaConfig,
  geojsonPointConfig,
  shadow: {
    enable: false,
    border: test as any,
    mask: { enable: true },
  },
})

function getMap() {
  return mapInstance.value
}

/* ********************************************************************************************* */
function setColorStainImg(
  url: string,
  color: Parameters<typeof addGlStainImg>[1],
  scale: Parameters<typeof addGlStainImg>[2],
  options: { [p: string]: any } = {}
) {
  addGlStainImg(url, color, scale, {
    zIndex: 1030,
    ...options,
  })
}
function changeColorStainImgUrl(url: string) {
  updateGlStainImgUrl(url)
}
function removeColorStainImg() {
  removeGlStainImg()
}
function hasColorStainImgLayer() {
  return hasGlStainImgLayer()
}

/* ********************************************************************************************* */
// 根据类型画站点
function addStations(
  type: string,
  stations: IMarkerItem[],
  commonOption?: ICommonMarkerOption,
  options?: L.MarkerOptions
) {
  const cOpt = commonOption || {}
  const opt = options || {
    pane: 'station-point',
    icon: L.divIcon({
      iconAnchor: [3, 3],
      className: 'station-icon', //#409eff
      html: `
        <div class="round-point country"></div>
      `,
    }),
  }
  addMarkers(type, stations, cOpt, opt)
}
// 根据类型清除站点
function removeStations(type: string) {
  removeMarkers(type)
}

/* ********************************************************************************************* */
defineExpose({
  getMap,
  // 色斑图
  setColorStainImg,
  changeColorStainImgUrl,
  removeColorStainImg,
  hasColorStainImgLayer,
  // 格点
  addStations,
  removeStations,
})
</script>

<template>
  <div class="live-map">
    <div class="map-container" ref="mapElRef"></div>
  </div>
</template>

<style scoped lang="less">
.live-map {
  width: 100%;
  height: 100%;
  .map-container {
    height: 100%;
    min-height: 0;
  }
  :deep(.station-icon) {
    .station-inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      .round-point {
        width: 40%;
        height: 40%;
        background: #fff;
        border-radius: 50%;

        // box-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
      }

      .wind-shaft {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40%;
        height: 40%;
        background: transparent;

        > img {
          height: 20px;
        }
      }

      .station-value,
      .station-name {
        position: absolute;
        bottom: calc(100%);
        left: 50%;
        color: #fff;
        white-space: nowrap;
        transform: translateX(-50%);
      }

      .station-value {
        bottom: calc(100%);
        font-size: 12px;
        line-height: 14px;
        text-shadow: 1px 0 2px #333333, 0 1px 2px #333333, -1px 0 2px #333333, 0 -1px 2px #333333;
      }
      .wind-shaft + .station-value {
        bottom: calc(100% + 6px);
      }

      .station-name {
        top: calc(100%);
        font-size: 10px;
        text-shadow: 1px 0 2px #333333, 0 1px 2px #333333, -1px 0 2px #333333, 0 -1px 2px #333333;
      }
    }
  }
}
</style>
