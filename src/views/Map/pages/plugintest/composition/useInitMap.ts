import { onMounted, shallowRef, shallowReactive } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import * as turf from '@turf/turf'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapHcMin } from 'hcl'
import { useGeoJsonArea } from './useGeoJsonArea'
import { useGlStainImg } from './useGlStainImg'
import { useGridLayer } from './useGridLayer'
import { useGeoJsonLine } from './useGeoJsonLine'
import { useMarkers } from './useMarkers'
import MapMask from '../composition/plugins/mask'

interface IAnyObject {
  [p: string]: any
}
export interface IPaneInfo {
  name: string
  zIndex: number
}
export interface ITileInfo {
  path: string
  options?: IAnyObject
  wms: boolean
}
export interface ILayerInfo {
  name: string
  pane: string
}
interface IShadow {
  enable: boolean
  pane?: string
  border?: GeoJSON.FeatureCollection
  mask?: {
    enable?: boolean
    pane?: string
    color?: string
  }
  style?: {
    weight: number
    color: string
    fillColor: string
    fillOpacity: number
    className: string
  }
}
export interface IUseInitMap<S = IShadow> {
  mapElRef: Ref<HTMLElement | undefined>
  mapOpts?: L.MapOptions
  panes?: Array<IPaneInfo>
  tiles?: Array<ITileInfo>
  layerInfo?: Array<ILayerInfo>
  shadow?: S
  hclMapConfig?: IAnyObject
}

const mapStyle = {
  sea: {
    fillStyle: '#14497D'
  },
  world: {
    type: 'polygon',
    fillStyle: '#1A222D',
    strokeStyle: '#263845',
    lineWidth: 1
  },
  china: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1
  },
  province: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1
  },
  shi: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1
  },
  xian: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1
  },
  xiangzhen: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1
  },
  river1: {
    type: 'polygon',
    fillStyle: '#14497D'
  },
  provincePoint: {
    type: 'point',
    fillStyle: 'red',
    // font: "20px 宋体",
    fontSize: 20,
    fontFamily: '宋体',
    labelKey: 'SNAME',
    textHeight: 20,
    color: '#5678A4'
  },
  shenghui: {
    type: 'point',
    radius: 6,
    fillStyle: '#00B7D7',
    strokeWidth: 3,
    strokeStyle: '#1C65C3',
    // font: "20px 宋体",
    fontSize: 20,
    fontFamily: '宋体',
    labelKey: 'dname',
    textHeight: 20,
    color: '#5678A4'
  },
  shiPoint: {
    type: 'point',
    radius: 4,
    strokeWidth: 3,
    strokeStyle: '#04C9CB',
    // font: "20px 宋体",
    fontSize: 16,
    fontFamily: '宋体',
    labelKey: 'dname',
    textHeight: 20,
    color: '#5678A4'
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
    color: '#5678A4'
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
    color: '#5678A4'
  },
  jiuduanxian: {
    type: 'line',
    strokeStyle: '#009EFF',
    lineWidth: 1
  }
}
const shadowDefaultPane = 'shadow-layer'
const shadowDefaultPaneCfg = { name: shadowDefaultPane, zIndex: 1010 }
const maskDefaultPane = 'mask-layer'
const maskDefaultPaneCfg = { name: maskDefaultPane, zIndex: 1005 }

export function useInitMap({ mapElRef, mapOpts, panes, tiles, hclMapConfig, layerInfo, shadow }: IUseInitMap) {
  const mapInstance = shallowRef<L.Map | null>(null)
  const layerGroups = shallowReactive<IAnyObject>({})
  const hclMapLayer = shallowRef<ReturnType<typeof MapHcMin> | null>(null)
  const shadowLayer = L.layerGroup()
  const maskLayer = shallowRef<any>(null)
  onMounted(() => {
    mapElRef.value && initMap(mapInstance, mapElRef.value, mapOpts || {})
    if (mapInstance.value) {
      shadowLayer.addTo(mapInstance.value)
      addPanes(mapInstance, panes || [])
      if (tiles) {
        addTiles(mapInstance, tiles || [])
      } else {
        addHclMapLayer(mapInstance, hclMapLayer, hclMapConfig || {})
      }
      addLayers(mapInstance, layerGroups, layerInfo || [])
      initShadow(shadowLayer, shadow || { enable: false })
      initMapMask(mapInstance, maskLayer, shadow || { enable: false })
    }
  })
  onBeforeUnmount(() => {
    shadowLayer.clearLayers()
    if (mapInstance.value?.hasLayer(maskLayer.value)) {
      mapInstance.value?.removeLayer(maskLayer.value)
    }
    if (mapInstance.value?.hasLayer(hclMapLayer.value)) {
      mapInstance.value?.removeLayer(hclMapLayer.value)
    }
  })
  return {
    mapInstance,
    layerGroups,
    hclMapLayer,
    // 添加行政区域
    ...useGeoJsonArea({ mapIns: mapInstance }),
    // 添加色斑图
    ...useGlStainImg({ mapIns: mapInstance }),
    // 添加格点
    ...useGridLayer({ mapIns: mapInstance }),
    // 添加等值线
    ...useGeoJsonLine({ mapIns: mapInstance }),
    // 分组点标记
    ...useMarkers({ mapIns: mapInstance })
  }
}

function initMap(mapIns: ShallowRef<L.Map | null>, el: HTMLElement, mapOpts: L.MapOptions) {
  mapIns.value = L.map(el, {
    center: [34.1618, 113.7524],
    zoom: 7,
    maxZoom: 13,
    minZoom: 3,
    scrollWheelZoom: true,
    zoomControl: false,
    attributionControl: false,
    ...mapOpts
  })
}

function addPanes(mapIns: ShallowRef<L.Map | null>, panesList: Array<IPaneInfo>) {
  if (!mapIns.value) return
  panesList.push(shadowDefaultPaneCfg, maskDefaultPaneCfg)
  panesList.forEach(paneInfo => {
    mapIns.value!.createPane(paneInfo.name)
    const createdPane = mapIns.value!.getPane(paneInfo.name)
    if (createdPane) {
      createdPane.style.zIndex = `${paneInfo.zIndex}`
    }
  })
}

function addTiles(mapIns: ShallowRef<L.Map | null>, tilesList: Array<ITileInfo>) {
  if (!mapIns.value) return
  // 添加瓦片
  tilesList.forEach(tileInfo => {
    const url = tileInfo.path
    const options = tileInfo.options || {}
    if (tileInfo.wms) {
      L.tileLayer
        .wms(url, {
          layers: options.layers,
          format: 'image/png',
          transparent: true,
          ...options,
        })
        .addTo(mapIns.value!)
    } else {
      L.tileLayer(url, options).addTo(mapIns.value!)
    }
  })
}
function addHclMapLayer(mapIns: ShallowRef<L.Map | null>, hclMapLayer: ShallowRef<ReturnType<typeof MapHcMin> | null>, cfg: IAnyObject) {
  if (!mapIns.value) return
  // 添加瓦片
  console.log(cfg)
  hclMapLayer.value = new MapHcMin({
    style: mapStyle,
    // 瓦片越大，地图越不精细,当前为固定的，如需要更改，请提需求
    tileSize: 1024,
    // 地图更新频率，越小，瓦片化越小，但是浏览器性能消耗变高
    updateInterval: 50,
    //地图向外延申像素，越大，瓦片化越小，但是浏览器消耗变高
    wrapSize: 400,
    url: 'http://221.122.67.142:3388/tile/map/pbf/',
    ...cfg
  }).addTo(mapIns.value!)
}

function addLayers(mapIns: ShallowRef<L.Map | null>, layerGroupsRecords: IAnyObject, layerGroupsList: Array<ILayerInfo>) {
  if (!mapIns.value) return
  layerGroupsList.forEach(layerInfo => {
    layerGroupsRecords[layerInfo.name] = new L.LayerGroup([], { pane: layerInfo.pane }).addTo(mapIns.value!)
  })
}

function initShadow(layerGroup: L.LayerGroup, option: IShadow) {
  if (!layerGroup) return
  if (!option.enable) return
  
  const polygons: any[] = []
  const borderTemp = turf.clone(option.border as unknown as turf.AllGeoJSON)
  turf.flattenEach(borderTemp, function (currentFeature) {
    const polygonArray = (currentFeature.geometry as any).coordinates[0]
    polygonArray.forEach((item: any) => item.reverse())
    polygons.push(polygonArray)
  })
  for (const item of polygons) {
    L.polygon(item, {
      pane: option.pane || shadowDefaultPane,
      weight: option.style?.weight || 0,
      color: option.style?.color || '#3681eb6c',
      fillColor: option.style?.fillColor || '#3681eb6c',
      fillOpacity: option.style?.fillOpacity || 0.6,
      className: option.style?.className || 'shadow-layer'
    }).addTo(layerGroup)
  }
}

function initMapMask(mapIns: ShallowRef<L.Map | null>, maskLayer: ShallowRef<any>, option: IShadow) {
  if (!mapIns.value) return
  if (!option.mask?.enable) return
  if (!option.border) return

  maskLayer.value = new MapMask({
    color: option.mask?.color || 'rgba(255, 255, 255, 0.6)',
    geojson: option.border as GeoJSON.FeatureCollection,
    pane: option.mask?.pane || maskDefaultPane
  })
  maskLayer.value.addTo(mapIns.value as L.Map)
}