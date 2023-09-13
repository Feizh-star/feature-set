import * as L from 'leaflet'
import * as turf from '@turf/turf'
import type { IAnyObject } from './types/common'
import Drill, { featureCollectionPackage, fetchGeoJson } from './Drill'
import type { PartialDrillOption } from './Drill'
import ShadowMask from './ShadowMask'
import type { PartialShadowMaskOption } from './ShadowMask'
import { merge } from './utils/tools'
// @ts-ignore
import border from './geojson/china_border.json'
const borderJson = border as GeoJSON.FeatureCollection

type TWmts = 'vec_w' | 'cva_w'
const myKey = '42139ec25fe7ae771affe917de5c9ecf'

interface IDrill {
  enable: boolean
}
interface IMask {
  enable: boolean
}
type TDrill = IDrill & PartialDrillOption
type TMask = IMask & PartialShadowMaskOption
export interface LMapOption<A = TDrill, M = TMask> {
  geojson: string | GeoJSON.FeatureCollection
  border: GeoJSON.FeatureCollection
  drill: A
  mask: M
}
export type TLMapOption = Partial<LMapOption>
const defaultOpts = {
  geojson: '100000',
  border: borderJson,
  drill: {
    enable: true
  },
  mask: {
    enable: true
  }
}

export class LMap {
  private leafletMap!: L.Map
  private shadowMaskLayer!: ShadowMask
  private drillLayer!: Drill
  private options: LMapOption = defaultOpts

  get getShadowMaskLayer() { return this.shadowMaskLayer }
  get map() { return this.leafletMap }

  /**
   * 地图构造函数
   * @param el 元素
   * @param mOpts leaflet地图配置对象
   * @param opts LMap的配置对象
   */
  constructor(el: HTMLElement, mOpts: L.MapOptions = {}, opts: TLMapOption = {}) {
    if (opts.border instanceof Object) {
      this.options.border = opts.border
      Reflect.deleteProperty(opts, 'border')
    }
    if (opts.geojson instanceof Object) {
      this.options.geojson = opts.geojson
      Reflect.deleteProperty(opts, 'geojson')
    }
    merge(this.options, opts)

    this.init(el, mOpts)
      .addWmts('vec_w')
      .addWmts('cva_w')
      .initShadowMask()
      .initDrill()
  }
  /**
   * 初始化地图实例
   * @param el 元素
   * @param mOpts leaflet地图配置对象
   * @returns this
   */
  private init(el: HTMLElement, mOpts: L.MapOptions) {
    this.leafletMap = L.map(el, {
      center: mOpts.center ? mOpts.center : [32.986549, 107.797788], // [32.986549, 107.797788], [33.874936, 113.5020695]
      zoom: mOpts.zoom ? mOpts.zoom : 4, // 
      maxZoom: 18,
      minZoom: 3,
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[-89, -180],[89, 180]],
      preferCanvas: true,
      ...mOpts
    })
    return this
  }
  /**
   * 设置蒙版和边框
   * @returns 
   */
  private initShadowMask() {
    if (this.options.mask?.enable) {
      this.shadowMaskLayer = new ShadowMask(this.map, this.options.mask)
    }
    return this
  }
  /**
   * 设置钻取
   */
  private initDrill() {
    this.drillLayer = new Drill(this, this.options.drill)
    const lmap = this
    const { geojson, border } = this.options
    if (typeof geojson === 'string') {
      fetchGeoJson(geojson).then(res => {
        lmap.drillLayer.setFeature({geoData: res, border: border})
        lmap.shadowMaskLayer.setShadowMask(border)
      })
    } else {
      lmap.drillLayer.setFeature({geoData: geojson, border: border})
      lmap.shadowMaskLayer.setShadowMask(border)
    }
    return this
  }
  public setView(f: GeoJSON.Feature) {
    const border = featureCollectionPackage(f)
    const boundary = turf.bbox(border)
    const [lngMin, latMin, lngMax, latMax] = boundary
    // console.log((latMin + latMax) / 2, (lngMin + lngMax) / 2)
    const lBoundary = [[latMin, lngMin], [latMax, lngMax]] as L.LatLngBoundsExpression
    this.map.fitBounds(lBoundary)
    return this
  }
  public setMapShadowMask(border: GeoJSON.FeatureCollection) {
    this.shadowMaskLayer.setShadowMask(border)
    return this
  }
  /**
   * 添加瓦片
   * @param type 天地图的瓦片的key
   * @returns 
   */
  private addWmts(type: TWmts) {
    L.tileLayer(getTianWmts(type), {}).addTo(this.map)
    return this
  }
}

function getTianWmts(type: TWmts) {
  return `https://t0.tianditu.gov.cn/${type}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${type.split('_')[0]}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${myKey}`
}