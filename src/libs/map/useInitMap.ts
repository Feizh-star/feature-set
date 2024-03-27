import { onMounted, shallowRef, shallowReactive } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import * as turf from '@turf/turf'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapHcMin } from 'hcl'
import { useGeoJsonArea, type IUseGeoJsonArea } from './useGeoJsonArea'
import { useGeoJsonPoint, type IUseGeoJsonPoint } from './useGeoJsonPoint'
import { useGlStainImg } from './useGlStainImg'
import { useGridLayer } from './useGridLayer'
import { useGeoJsonLine } from './useGeoJsonLine'
import { useMarkers } from './useMarkers'
import { useTyphoon } from './useTyphoon'
import { useWindField } from './useWindField'
import MapMask from './plugins/mask'

interface IAnyObject {
  [p: string]: any
}
export interface IPaneInfo {
  name: string
  zIndex: number
}
export interface ITileInfo {
  name: string
  type: 'tileLayer' | 'wms' | 'hclTile'
  show: boolean
  path?: string
  options?: IAnyObject
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
  geojsonAreaConfig?: IUseGeoJsonArea['cfg']
  geojsonPointConfig?: IUseGeoJsonPoint['cfg']
}

const mapStyle = {
  sea: {
    fillStyle: '#14497D',
  },
  world: {
    type: 'polygon',
    fillStyle: '#1A222D',
    strokeStyle: '#263845',
    lineWidth: 1,
  },
  china: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1,
  },
  province: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1,
  },
  shi: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1,
  },
  xian: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1,
  },
  xiangzhen: {
    type: 'polygon',
    fillStyle: '#11161D',
    strokeStyle: '#3B576A',
    lineWidth: 1,
  },
  river1: {
    type: 'polygon',
    fillStyle: '#14497D',
  },
  provincePoint: {
    type: 'point',
    fillStyle: 'red',
    // font: "20px 宋体",
    fontSize: 20,
    fontFamily: '宋体',
    labelKey: 'SNAME',
    textHeight: 20,
    color: '#5678A4',
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
    color: '#5678A4',
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
    color: '#5678A4',
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
    color: '#5678A4',
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
    color: '#5678A4',
  },
  jiuduanxian: {
    type: 'line',
    strokeStyle: '#009EFF',
    lineWidth: 1,
  },
}
const shadowDefaultPane = 'shadow-layer'
const shadowDefaultPaneCfg = { name: shadowDefaultPane, zIndex: 1010 }
const maskDefaultPane = 'mask-layer'
const maskDefaultPaneCfg = { name: maskDefaultPane, zIndex: 1005 }

export function useInitMap({
  mapElRef,
  mapOpts,
  panes,
  tiles,
  layerInfo,
  shadow,
  geojsonAreaConfig,
  geojsonPointConfig,
}: IUseInitMap) {
  const mapInstance = shallowRef<L.Map | null>(null)
  const tileLayers = shallowReactive<IAnyObject>({})
  const selectTile = (names: string[]) => selectTileFunc(mapInstance, tileLayers, names)
  const layerGroups = shallowReactive<IAnyObject>({})
  const shadowLayer = L.layerGroup()
  const maskLayer = shallowRef<any>(null)
  onMounted(() => {
    mapElRef.value && initMap(mapInstance, mapElRef.value, mapOpts || {})
    if (mapInstance.value) {
      shadowLayer.addTo(mapInstance.value)
      addPanes(mapInstance, panes || [])
      // 添加瓦片
      const tilesList = tiles || []
      addTiles(mapInstance, tilesList, tileLayers)
      selectTile(
        tilesList.filter((item) => item.show).map((item) => item.name) || [tilesList[0].name || '']
      )

      addLayers(mapInstance, layerGroups, layerInfo || [])
      initShadow(shadowLayer, shadow || { enable: false })
      initMapMask(mapInstance, maskLayer, shadow || { enable: false })
    }
  })
  onBeforeUnmount(() => {
    shadowLayer.clearLayers()
    if (maskLayer.value && mapInstance.value?.hasLayer(maskLayer.value)) {
      mapInstance.value?.removeLayer(maskLayer.value)
    }
  })
  return {
    mapInstance,
    layerGroups,
    tileLayers,
    selectTile,
    // 添加行政区域
    ...useGeoJsonArea({ mapIns: mapInstance, cfg: geojsonAreaConfig }),
    ...useGeoJsonPoint({ mapIns: mapInstance, cfg: geojsonPointConfig }),
    // 添加色斑图
    ...useGlStainImg({ mapIns: mapInstance }),
    // 添加格点
    ...useGridLayer({ mapIns: mapInstance }),
    // 添加等值线
    ...useGeoJsonLine({ mapIns: mapInstance }),
    // 分组点标记
    ...useMarkers({ mapIns: mapInstance }),
    // 台风
    ...useTyphoon({ mapIns: mapInstance }),
    // 风流场
    ...useWindField({ mapIns: mapInstance }),
  }
}

function initMap(mapIns: ShallowRef<L.Map | null>, el: HTMLElement, mapOpts: L.MapOptions) {
  mapIns.value = L.map(el, {
    center: [33.56, 119.11],
    zoom: 6,
    maxZoom: 12,
    minZoom: 3,
    scrollWheelZoom: true,
    zoomControl: false,
    attributionControl: false,
    ...mapOpts,
  })
}

function addPanes(mapIns: ShallowRef<L.Map | null>, panesList: Array<IPaneInfo>) {
  if (!mapIns.value) return
  panesList.push(shadowDefaultPaneCfg, maskDefaultPaneCfg)
  panesList.forEach((paneInfo) => {
    mapIns.value!.createPane(paneInfo.name)
    const createdPane = mapIns.value!.getPane(paneInfo.name)
    if (createdPane) {
      createdPane.style.zIndex = `${paneInfo.zIndex}`
    }
  })
}

function addTiles(
  mapIns: ShallowRef<L.Map | null>,
  tilesList: Array<ITileInfo>,
  tileLayers: IAnyObject
) {
  if (!mapIns.value) return
  // 添加瓦片
  tilesList.forEach((tileInfo) => {
    const url = tileInfo.path || ''
    const rawOption = tileInfo.options || {}
    let layer: any
    let options: any
    switch (tileInfo.type) {
      case 'wms':
        options = {
          layers: rawOption.layers,
          format: 'image/png',
          transparent: true,
          ...rawOption,
        }
        layer = L.tileLayer.wms(url, options)
        break
      case 'tileLayer':
        options = { ...rawOption }
        layer = L.tileLayer(url, options)
        break
      case 'hclTile':
        options = {
          style: mapStyle,
          // 瓦片越大，地图越不精细,当前为固定的，如需要更改，请提需求
          tileSize: 1024,
          // 地图更新频率，越小，瓦片化越小，但是浏览器性能消耗变高
          updateInterval: 50,
          //地图向外延申像素，越大，瓦片化越小，但是浏览器消耗变高
          wrapSize: 400,
          url: `${import.meta.env.VITE_HCLTILE_URL || 'http://1.119.169.101:10041'}/tile/map/pbf/`,
          ...rawOption,
        }
        layer = new MapHcMin(options)
        break
      default:
        break
    }
    tileLayers[tileInfo.name] = {
      ...tileInfo,
      layer,
      options: options,
    }
  })
}
function selectTileFunc(mapIns: ShallowRef<L.Map | null>, tileLayers: IAnyObject, names: string[]) {
  if (!mapIns.value) return
  for (const key in tileLayers) {
    if (names.includes(key)) {
      if (tileLayers[key].type === 'hclTile' && !tileLayers[key].layer) {
        tileLayers[key].layer = new MapHcMin(tileLayers[key].options).addTo(mapIns.value)
      } else {
        if (mapIns.value.hasLayer(tileLayers[key].layer)) continue
        tileLayers[key].layer.addTo(mapIns.value)
      }
      tileLayers[key].show = true
    } else {
      if (tileLayers[key].layer && mapIns.value?.hasLayer(tileLayers[key].layer)) {
        mapIns.value?.removeLayer(tileLayers[key].layer)
      }
      tileLayers[key].show = false
      if (tileLayers[key].type === 'hclTile') {
        tileLayers[key].layer = null
      }
    }
  }
}

function addLayers(
  mapIns: ShallowRef<L.Map | null>,
  layerGroupsRecords: IAnyObject,
  layerGroupsList: Array<ILayerInfo>
) {
  if (!mapIns.value) return
  layerGroupsList.forEach((layerInfo) => {
    layerGroupsRecords[layerInfo.name] = new L.LayerGroup([], { pane: layerInfo.pane }).addTo(
      mapIns.value!
    )
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
      className: option.style?.className || 'shadow-layer',
    }).addTo(layerGroup)
  }
}

function initMapMask(
  mapIns: ShallowRef<L.Map | null>,
  maskLayer: ShallowRef<any>,
  option: IShadow
) {
  if (!mapIns.value) return
  if (!option.mask?.enable) return
  if (!option.border) return

  maskLayer.value = new MapMask({
    color: option.mask?.color || 'rgba(255, 255, 255, 0.6)',
    geojson: option.border as GeoJSON.FeatureCollection,
    pane: option.mask?.pane || maskDefaultPane,
  })
  maskLayer.value.addTo(mapIns.value as L.Map)
}
