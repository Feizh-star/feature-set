import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'
import { glImgMin } from 'hcl'
import './leaflet.ChineseTmsProviders_modify'
import ColorfulGeojson from './ColorfulGeojsonLine'
import type { ColorfulGeojsonOptions } from './ColorfulGeojsonLine'
import ShadowMask from './ShadowMask'
import type { PartialShadowMaskOption } from './ShadowMask'
import { merge } from './tools'
import { cutPng } from '../cut/hefei'
import hefei_border from '../geojson/hefei_border.json'
import hefei_county from '../geojson/340100.json'
const borderJson = hefei_border as GeoJSON.FeatureCollection
const hefeiCounty = hefei_county as GeoJSON.FeatureCollection
const rootUrl = 'http://221.122.67.145:8888/admin/code/getCode?key=KPWjQhnQE6LwNfIN'

export interface IHclColorsRange {
  r: Array<number>
  g: Array<number>
  b: Array<number>
  v: Array<number>
  o: Array<number>
}
export interface IScaleProps {
  r: number
  g: number
  b: number
  a: number
}
interface ILatLngRange {
  latmin: number
  latmax: number
  lonmin: number
  lonmax: number
}
export interface ITileInfo {
  path: string
  layers: string
  options?: {
    [p: string]: any
  }
}
export interface IBorder {
  geojson: GeoJSON.FeatureCollection
  style: { [p: string]: any }
}
export interface IPaneInfo {
  name: string
  zIndex: number
}
export interface ILayerInfo {
  name: string
  pane: string
}
interface IMask {
  enable: boolean
  zIndex?: number
  style?: {
    fillColor: string
    fillOpacity: number
  }
}
type TMask = IMask & PartialShadowMaskOption
export interface LMapOption<M = TMask> {
  tiles: Array<ITileInfo>
  panes: Array<IPaneInfo>
  layers: Array<ILayerInfo>
  border: GeoJSON.FeatureCollection
  area: GeoJSON.FeatureCollection
  borderPane: string
  borderStyle: {
    [p: string]: any
  }
  areaStyle: {
    [p: string]: any
  }
  maskPane: string
  mask: M
}

// marker组中的单个marker结构
export interface IMarkerItem {
  geoInfo: {
    lat: number
    lng: number
  }
  event?: (type: 'click' | 'mouseover' | 'mousemove' | 'mouseout', e: L.LeafletMouseEvent, info: IMarkerItem) => void
  options?: L.MarkerOptions
  [p: string]: any
}
type MarkerMapEvents = 'zoomanim' | 'zoom' | 'zoomstart' | 'zoomend'
export interface ICommonMarkerOption {
  mapEvents?: {
    name: MarkerMapEvents
    handler: (e: L.LeafletEvent, markerInfoMap: Map<L.Marker, IMarkerItem>) => void
  }[]
}
interface IMarkerGroup {
  layer: L.LayerGroup
  markerInfoMap: Map<L.Marker, IMarkerItem>
  // markers: { info: IMarkerItem; marker: L.Marker }[]
  commonOption: ICommonMarkerOption
  mapEventRecord: { name: MarkerMapEvents; handler: (event: L.LeafletEvent) => void }[]
}

export type TLMapOption = Partial<LMapOption>
const genDefaultOpts: () => LMapOption = () => ({
  tiles: [],
  panes: [],
  layers: [],
  border: borderJson,
  borderPane: 'border-pane',
  borderStyle: {
    fill: false,
    weight: 2,
    color: '#3388ff',
    fillOpacity: 0,
  },
  area: hefeiCounty,
  areaStyle: {
    fill: true,
    weight: 1,
    color: '#1f68a4',
    fillColor: '#1666e6',
    fillOpacity: 0.3,
  },
  maskPane: 'shadow-mask',
  mask: {
    enable: false,
    zIndex: 600,
    style: {
      fillColor: '#0a1b3a',
      fillOpacity: 0.1,
    },
  },
})

export class MMap {
  private leafletMap!: L.Map
  private options: LMapOption
  private shadowMaskLayer!: ShadowMask
  // 储存了所有的layerGroups————只包含通过layers参数创建的，可以通过getLayerByName方法获取到指定layerGroup
  public layerGroups: { [layerName: string]: L.LayerGroup } = {}
  // 获取leaflet 地图实例
  get map() {
    return this.leafletMap
  }


  constructor(el: HTMLElement, mOpts: L.MapOptions = {}, opts: TLMapOption = {}) {
    this.options = genDefaultOpts()
    if (opts.border instanceof Object) {
      this.options.border = opts.border
      Reflect.deleteProperty(opts, 'border')
    }
    merge(this.options, opts)
    this.init(el, mOpts)

    // 窗格
    this.addPanes()
    // 添加瓦片
    this.addTiles()
    // 添加图层组
    this.addLayers()
    // 设置边框
    this.initShadowMask()
    this.setBorder({
      geojson: this.options.border,
      style: this.options.borderStyle,
    })
    this.setAreas({
      geojson: this.options.area,
      style: this.options.areaStyle,
    })
  }

  private init(el: HTMLElement, mOpts: L.MapOptions) {
    this.leafletMap = L.map(el, {
      center: [31.69355520727145, 117.39990234375001],
      zoom: 9,
      maxZoom: 14,
      minZoom: 7,
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [
        [-89, -180],
        [89, 180],
      ],
      ...mOpts,
    })
    return this
  }
  private addTiles() {
    if (!this.leafletMap) return this
    // 添加瓦片
    this.options.tiles.forEach(tileInfo => {
      const url = tileInfo.path
      const options = tileInfo.options || {}
      L.tileLayer
        .wms(url, {
          layers: tileInfo.layers,
          format: 'image/png',
          transparent: true,
          ...options,
        })
        .addTo(this.leafletMap)
    })
    return this
  }
  private addPanes() {
    if (!this.leafletMap) return this
    this.options.panes.forEach(paneInfo => {
      this.leafletMap.createPane(paneInfo.name)
      const createdPane = this.leafletMap.getPane(paneInfo.name)
      if (createdPane) {
        createdPane.style.zIndex = `${paneInfo.zIndex}`
      }
    })
    return this
  }
  private addLayers() {
    if (!this.leafletMap) return this
    this.options.layers.forEach(layerInfo => {
      this.layerGroups[layerInfo.name] = new L.LayerGroup([], { pane: layerInfo.pane }).addTo(this.leafletMap)
    })
    return this
  }
  /**
   * 画边界线
   * @param border 描述border的geojson和style
   * @returns this
   */
  private setBorder(border: IBorder) {
    if (!this.leafletMap || !border.geojson) return this
    // 外层边框
    L.geoJSON(border.geojson, {
      pane: this.options.borderPane,
      style: border.style,
    }).addTo(this.leafletMap)
    return this
  }
  private initShadowMask() {
    if (this.options.mask?.enable) {
      this.shadowMaskLayer = new ShadowMask(this.map, this.options.mask)
      this.shadowMaskLayer.setShadowMask(this.options.border)
    }
    return this
  }
  /**
   * 画行政区域
   * @param area 描述内部边界线的geojson和style
   * @returns this
   */
  private setAreas(area: IBorder) {
    if (!this.leafletMap || !area.geojson) return this
    turf.featureEach(area.geojson, currentFeature => {
      const adcode = currentFeature.properties!.adcode
      const areaFeatureCollection = featureCollectionPackage(currentFeature)
      this.areaMap.set(`${adcode}`, {
        geojson: areaFeatureCollection,
        mapAreaInstance: L.geoJSON(areaFeatureCollection, { pane: this.options.borderPane, style: area.style }).addTo(
          this.leafletMap
        ),
      })
    })
    return this
  }

  /* ************************************************************************************************************************* */
  /* 行政区域样式 */
  /* ************************************************************************************************************************* */
  // 区域，如果有给area参数geojson的话，每个地图区域（一般是省市县区）都会保存在这里，可以进行属性维护
  private areaMap: Map<string, { geojson: GeoJSON.FeatureCollection; mapAreaInstance: L.GeoJSON }> = new Map()
  /**
   * 设置区域填充样式
   */
  setAreaStyle(adcode: string | number, style: L.GeoJSONOptions = {}, info: { [p: string]: any } = {}) {
    adcode = `${adcode}`
    const area = this.areaMap.get(adcode)
    if (!area) {
      // eslint-disable-next-line
      console.warn("setAreaStyle warning: adcode does not exist");
      return this
    }
    const mapGeojson = area.mapAreaInstance
    mapGeojson.setStyle(style)
    mapGeojson.on('mousemove', function (e) {
      info.mousemove(e, info)
    })
    mapGeojson.on('mouseout', function (e) {
      info.mouseout(e, info)
    })
  }
  /**
   * 重置区域填充样式
   */
  resetAreaStyle() {
    for (const [, area] of this.areaMap) {
      const mapGeojson = area.mapAreaInstance
      mapGeojson.resetStyle()
      mapGeojson.setStyle(this.options.areaStyle)
      mapGeojson.off('mousemove')
      mapGeojson.off('mouseout')
    }
  }
  
  /* ************************************************************************************************************************* */
  /* 填色可交互geojson，当前选中样式与鼠标悬浮样式会有冲突 */
  /* ************************************************************************************************************************* */
  // 填色的geojson，用于画填色的线路，目前只支持1个geojson，每个feature为一个单元，可以独立响应鼠标事件
  private colorfulGeojson!: ColorfulGeojson
  /**
   * 绘制填色geojson
   * @param geojson geojson
   * @param options ColorfulGeojsonOptions
   */
  addColorfulGeojson(geojson: GeoJSON.FeatureCollection, options?: ColorfulGeojsonOptions) {
    if (!this.colorfulGeojson) {
      this.colorfulGeojson = new ColorfulGeojson(this.leafletMap)
    }
    this.colorfulGeojson.setColorfulGeojson(geojson, options)
  }
  /**
   * 移除已经绘制的填色geojson
   */
  removeColorfulGeojson() {
    if (this.colorfulGeojson) {
      this.colorfulGeojson.removeColorfulGeojson()
    }
  }
  /**
   * 选择Feature
   */
  selectFeature(id: string) {
    this.colorfulGeojson.cancelSelectFeature(this.colorfulGeojson.getSelectionId())
    if (this.colorfulGeojson) {
      this.colorfulGeojson.selectFeature(id)
    }
  }
  /**
   * 取消选择Feature
   */
  cancelSelectFeature(id: string) {
    if (this.colorfulGeojson) {
      this.colorfulGeojson.cancelSelectFeature(id)
    }
  }
  
  /* ************************************************************************************************************************* */
  /* 分组点标记管理 */
  /* ************************************************************************************************************************* */
  // 点标记：可以一次性创建一组点标记，保存在这个Map中，然后可以根据名称删除
  private markerMap: Map<string, IMarkerGroup> = new Map()
  /**
   * 添加一组marker
   * @param name 名称，不能重复
   * @param markers IMarkerItem[] marker列表
   * @param options L.MarkerOptions
   * @returns
   */
  addMarkers(
    name: string,
    markers: IMarkerItem[],
    commonOption: ICommonMarkerOption = {},
    options: L.MarkerOptions = {}
  ) {
    this.removeMarkers(name)
    const markerGroup = {
      layer: new L.LayerGroup(),
      markerInfoMap: new Map(),
      commonOption: commonOption,
      mapEventRecord: [],
    }
    this.markerMap.set(name, markerGroup)
    for (const marker of markers) {
      const moptions = marker.options || options
      const newMarker = L.marker([marker.geoInfo.lat, marker.geoInfo.lng], moptions).addTo(markerGroup.layer)
      markerGroup.markerInfoMap.set(newMarker, marker)
      newMarker.on('click', e => marker.event?.call(newMarker, 'click', e, marker))
      newMarker.on('mouseover', e => marker.event?.call(newMarker, 'mouseover', e, marker))
      newMarker.on('mousemove', e => marker.event?.call(newMarker, 'mousemove', e, marker))
      newMarker.on('mouseout', e => marker.event?.call(newMarker, 'mouseout', e, marker))
    }
    markerGroup.layer.addTo(this.leafletMap)
    this.handleMapEventsForMarkers(name)
  }
  /**
   * 移除一组marker
   * @param name 名称
   */
  removeMarkers(name: string) {
    const markerGroup = this.markerMap.get(name)
    this.removeMapEventsForMarkers(name)
    if (markerGroup?.layer) {
      markerGroup?.layer.clearLayers()
    }
    if (markerGroup?.markerInfoMap) {
      markerGroup.markerInfoMap.clear()
    }
    this.markerMap.delete(name)
  }
  /**
   * 为一组marker添加commonOption.mapEvents指定的地图事件
   * @param name string
   * @returns void
   */
  handleMapEventsForMarkers(name: string) {
    const markerGroup = this.markerMap.get(name)
    if (!markerGroup) return
    const mapEvents = markerGroup.commonOption.mapEvents || []
    for (const mapEventCfg of mapEvents) {
      const eventHandler = (e: L.LeafletEvent) =>
        mapEventCfg.handler.call(this.leafletMap, e, markerGroup.markerInfoMap)
      this.leafletMap.on(mapEventCfg.name, eventHandler)
      markerGroup.mapEventRecord.push({ name: mapEventCfg.name, handler: eventHandler })
    }
  }
  /**
   * 移除已经为一组marker添加的commonOption.mapEvents指定的地图事件
   * @param name string
   * @returns void
   */
  removeMapEventsForMarkers(name: string) {
    const markerGroup = this.markerMap.get(name)
    if (!markerGroup) return
    const mapEventRecords = markerGroup.mapEventRecord || []
    for (const record of mapEventRecords) {
      this.leafletMap.off(record.name, record.handler)
    }
    markerGroup.mapEventRecord = []
  }
  
  /* ************************************************************************************************************************* */
  /* 色斑图图层管理 */
  /* ************************************************************************************************************************* */
  // 填色图实例
  private glStainImgLayer!: ReturnType<typeof glImgMin>
  /**
   * 添加色斑图
   * @param url url
   * @param color 颜色配置
   * @param scale 缩放配置
   * @param range 经纬度范围
   * @param options 其他选项
   */
  addGlStainImg(
    url: string,
    color: IHclColorsRange,
    scale: IScaleProps,
    range: ILatLngRange,
    options: { [p: string]: any }
  ) {
    this.removeGlStainImg()
    this.glStainImgLayer = new glImgMin({
      url: url,
      linear: 0, //设置色斑图的渐变度
      latmin: range.latmin,
      latmax: range.latmax,
      lonmin: range.lonmin,
      lonmax: range.lonmax,
      scale: scale,
      flipy: 0,
      colors: color,
      grid: true,
      minOpacity: true,
      interval: 0.05,
      useCorrect: false,
      cut: true,
      cutUrl: cutPng,
      cutlatmin: 30.9,
      cutlatmax: 32.6,
      cutlonmin: 116.5,
      cutlonmax: 118,
      rootUrl,
      ...options,
    })
    this.glStainImgLayer.setGetGridLatLng(true)
    this.glStainImgLayer.addTo(this.leafletMap)
    setTimeout(() => {
      if (typeof options.zIndex === 'number' && this.glStainImgLayer.canvas?.style) {
        this.glStainImgLayer.canvas.style.zIndex = options.zIndex
      }
    }, 400)
  }
  /**
   * 更新图片地址
   * @param url url
   */
  updateGlStainImgUrl(url: string) {
    if (this.glStainImgLayer) {
      this.glStainImgLayer.changeImage(url)
    }
  }
  getValueByPosition(lat: number, lon: number) {
    if (!this.glStainImgLayer) return null
    return this.glStainImgLayer.getGridDataByLatLng(lat, lon)
  }
  /**
   * 移除色斑图
   */
  removeGlStainImg() {
    if (this.glStainImgLayer) {
      this.leafletMap.removeLayer(this.glStainImgLayer)
      this.glStainImgLayer = null
    }
  }
  
  /* ************************************************************************************************************************* */
  /* 雷达图片图层管理 */
  /* ************************************************************************************************************************* */
  // 雷达图实例
  private radarImgLayer!: L.ImageOverlay | null
  /**
   * 添加雷达图片
   */
  addRadarImage(url: string, bounds: [number, number][], options: { [p: string]: any }) {
    bounds = bounds || [
      [28.5771, 115.3695],
      [35.4675, 120.0228],
    ]
    const mergeOpt = {
      pane: '',
      opacity: 1,
      ...options,
    }
    this.removeRadarImage()
    this.radarImgLayer = L.imageOverlay(url, bounds, mergeOpt).addTo(this.leafletMap)
  }
  /**
   * 移除雷达图片
   */
  removeRadarImage() {
    if (this.radarImgLayer) {
      this.leafletMap.removeLayer(this.radarImgLayer)
      this.radarImgLayer = null
    }
  }
  getLayerByName(layerName: string) {
    return this.layerGroups[layerName] || null
  }
}

export function featureCollectionPackage(f: GeoJSON.Feature): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [f],
  }
}
