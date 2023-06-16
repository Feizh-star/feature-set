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
  private map!: L.Map
  private shadowMaskLayer!: ShadowMask
  private drillLayer!: Drill
  private options: LMapOption = defaultOpts

  get getShadowMaskLayer() { return this.shadowMaskLayer }

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
    this.init(el, mOpts, opts)
      .addWmts('vec_w')
      .addWmts('cva_w')
      .initShadowMask()
      .initDrill()
  }

  private init(el: HTMLElement, mOpts: L.MapOptions, opts: IAnyObject) {
    this.map = L.map(el, {
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
  public getMap() {
    return this.map
  }
  private initShadowMask() {
    if (this.options.mask?.enable) {
      this.shadowMaskLayer = new ShadowMask(this.map, this.options.mask)
    }
    return this
  }
  private addWmts(type: TWmts) {
    L.tileLayer(getTianWmts(type), {}).addTo(this.map)
    return this
  }
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
  }
  public setView(f: GeoJSON.Feature) {
    const border = featureCollectionPackage(f)
    const boundary = turf.bbox(border)
    const [lngMin, latMin, lngMax, latMax] = boundary
    // console.log((latMin + latMax) / 2, (lngMin + lngMax) / 2)
    const lBoundary = [[latMin, lngMin], [latMax, lngMax]] as L.LatLngBoundsExpression
    this.map.fitBounds(lBoundary)
  }
  public setMapShadowMask(border: GeoJSON.FeatureCollection) {
    this.shadowMaskLayer.setShadowMask(border)
  }
}

function getTianWmts(type: TWmts) {
  return `https://t0.tianditu.gov.cn/${type}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${type.split('_')[0]}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${myKey}`
}