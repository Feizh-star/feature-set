import * as L from 'leaflet'
import * as turf from '@turf/turf'
import type { IAnyObject } from './types/common'
import Area from './Area'
import ShadowMask from './ShadowMask'
import { merge } from './utils/tools'
// @ts-ignore
import border from './geojson/china_border.json'
const borderJson = border as GeoJSON.FeatureCollection

type TWmts = 'vec_w' | 'cva_w'
const myKey = '42139ec25fe7ae771affe917de5c9ecf'

interface IArea {
  enable: boolean
}
interface IMask {
  enable: boolean
}
export interface LMapOption<A = IArea, M = IMask> {
  area: A
  mask: M
}
export type TLMapOption = Partial<LMapOption<IArea>>
const defaultOpts = {
  area: {
    enable: true
  },
  mask: {
    enable: true
  }
}

export class LMap {
  private map!: L.Map
  private shadowMaskLayer!: ShadowMask
  private options: LMapOption = defaultOpts

  constructor(el: HTMLElement, mOpts: L.MapOptions = {}, opts: TLMapOption = {}) {
    merge(this.options, opts)
    this.init(el, mOpts, opts)
      .addWmts('vec_w')
      .addWmts('cva_w')
      .initShadowMask()
      .initArea()
  }

  private init(el: HTMLElement, mOpts: L.MapOptions, opts: IAnyObject) {
    this.map = L.map(el, {
      center: mOpts.center ? mOpts.center : [32.986549, 107.797788], // [32.986549, 107.797788], [33.874936, 113.5020695]
      zoom: mOpts.zoom ? mOpts.zoom : 4, // 7
      maxZoom: 18,
      minZoom: 3,
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[-89, -180],[89, 180]],
      ...mOpts
    })
    return this
  }
  private initShadowMask() {
    if (this.options.mask?.enable) {
      this.shadowMaskLayer = new ShadowMask(this.map)
    }
    return this
  }
  private addWmts(type: TWmts) {
    L.tileLayer(getTianWmts(type), {}).addTo(this.map)
    return this
  }
  private initArea() {
    const area = new Area({
      itemStyleActive: {
        fill: '#ff000088',
      },
      borderStyle: {
        stroke: '#333333',
        shadowBlur: 10,
        shadowColor: '#f8be17'
      }
    })
    area.addTo(this.zRenderLayer)

    const lmap = this
    fetchGeoJson('100000').then(res => {
      area.setFeature({geoData: res, border: borderJson}, {
        onclick: function (e, f) {

          // 钻取，进入下一级
          fetchGeoJson(f.properties!.adcode).then(res => {
            const packageFeature = featureCollectionPackage(f)
            area.setFeature({
              geoData: res,
              border: packageFeature
            })
            lmap.shadowMaskLayer.setShadowMask(packageFeature)
            setTimeout(() => lmap.setView(f), 90)
          }).catch(error => {
            // 没有下级geojson了，要把已经保存的上级geojson移除，并刷新图层
            area.drillGeoDataError()
          })
        }
      })
      lmap.shadowMaskLayer.setShadowMask(borderJson)
    })
  }
  public latLngToPoint(latLng: [number, number]) {
    return this.map.latLngToContainerPoint(latLng)
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

function featureCollectionPackage(f: GeoJSON.Feature): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: [f]
  }
}

function fetchGeoJson(adcode: string): Promise<GeoJSON.FeatureCollection> {
  return new Promise((resolve, reject) => {
    fetch(`/geojson/${adcode}.json`)
      .then(res => res.json())
      .then(res => resolve(res))
      .catch(error => reject(error))
  })
}