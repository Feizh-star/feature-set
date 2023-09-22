import { onMounted, shallowRef, shallowReactive } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapHcMin } from 'hcl'
import ShadowMask from './ShadowMask'
import type { PartialShadowMaskOption } from './ShadowMask'
import { useGeoJsonArea } from './useGeoJsonArea'

interface IAnyObject {
  [p: string]: any
}
export interface IPaneInfo {
  name: string
  zIndex: number
}
export interface ITileInfo {
  path: string
  layers: string
  options?: IAnyObject
}
export interface ILayerInfo {
  name: string
  pane: string
}
interface IMask {
  enable: boolean
  zIndex?: number
  border?: GeoJSON.FeatureCollection
  style?: {
    fillColor: string
    fillOpacity: number
  }
}
type TMask = IMask & PartialShadowMaskOption
export interface IUseInitMap<M = TMask> {
  mapElRef: Ref<HTMLElement | undefined>
  mapOpts?: L.MapOptions
  panes?: Array<IPaneInfo>
  tiles?: Array<ITileInfo>
  layerInfo?: Array<ILayerInfo>
  mask?: M
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

export function useInitMap({ mapElRef, mapOpts, panes, tiles, hclMapConfig, layerInfo, mask }: IUseInitMap) {
  const mapInstance = shallowRef<L.Map | null>(null)
  const layerGroups = shallowReactive<IAnyObject>({})
  const shadowMaskLayer = shallowRef<ShadowMask | null>(null)
  const hclMapLayer = shallowRef<ReturnType<typeof MapHcMin> | null>(null)
  const { addGeoArea, removeGeoArea, geoJsonAreaLayer } = useGeoJsonArea({ mapIns: mapInstance })
  onMounted(() => {
    mapElRef.value && initMap(mapInstance, mapElRef.value, mapOpts || {})
    if (mapInstance.value) {
      addPanes(mapInstance, panes || [])
      if (hclMapConfig) {
        addHclMapLayer(mapInstance, hclMapLayer, hclMapConfig)
      } else {
        addTiles(mapInstance, tiles || [])
      }
      addHclMapLayer(mapInstance, hclMapLayer, {})
      addLayers(mapInstance, layerGroups, layerInfo || [])
      initShadowMask(mapInstance, shadowMaskLayer, mask || { enable: false })
    }
  })
  return {
    mapInstance,
    layerGroups,
    shadowMaskLayer,
    hclMapLayer,
    // 添加行政区域
    addGeoArea,
    removeGeoArea,
    geoJsonAreaLayer
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
    L.tileLayer
      .wms(url, {
        layers: tileInfo.layers,
        format: 'image/png',
        transparent: true,
        ...options,
      })
      .addTo(mapIns.value!)
  })
}
function addHclMapLayer(mapIns: ShallowRef<L.Map | null>, hclMapLayer: ShallowRef<ReturnType<typeof MapHcMin> | null>, cfg: IAnyObject) {
  if (!mapIns.value) return
  // 添加瓦片
  hclMapLayer.value = new MapHcMin({
    style: mapStyle,
    // 瓦片越大，地图越不精细,当前为固定的，如需要更改，请提需求
    tileSize: 1024,
    // 地图更新频率，越小，瓦片化越小，但是浏览器性能消耗变高
    updateInterval: 50,
    //地图向外延申像素，越大，瓦片化越小，但是浏览器消耗变高
    wrapSize: 400,
    url: 'http://221.122.67.142:3388/tile/',
    ...cfg
  }).addTo(mapIns.value!)
}

function addLayers(mapIns: ShallowRef<L.Map | null>, layerGroupsRecords: IAnyObject, layerGroupsList: Array<ILayerInfo>) {
  if (!mapIns.value) return
  layerGroupsList.forEach(layerInfo => {
    layerGroupsRecords[layerInfo.name] = new L.LayerGroup([], { pane: layerInfo.pane }).addTo(mapIns.value!)
  })
}

function initShadowMask(mapIns: ShallowRef<L.Map | null>, shadowMaskIns: ShallowRef<ShadowMask | null>, option: TMask) {
  if (!mapIns.value) return
  if (!option.enable) return
  shadowMaskIns.value = new ShadowMask(mapIns.value!, option)
  option.border && shadowMaskIns.value.setShadowMask(option.border)
}
