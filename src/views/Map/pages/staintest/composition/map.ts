import * as L from 'leaflet'
import * as turf from '@turf/turf'
import type { IAnyObject } from '@/types/global/common'
import { merge } from '@/utils/tools'

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
  panes: Array<{name: string, zIndex?: number}>
  layers: Array<{name: string, pane?: string}>
}
export type TLMapOption = Partial<LMapOption<IArea>>
const defaultOpts = {
  area: {
    enable: true
  },
  mask: {
    enable: true
  },
  panes: [],
  layers: []
}

export class LMap {
  private map!: L.Map
  private options: LMapOption = defaultOpts
  private layerGroups: { [p: string]: L.LayerGroup } = {}

  constructor(el: HTMLElement, mOpts: L.MapOptions = {}, opts: TLMapOption = {}) {
    merge(this.options, opts)
    this.init(el, mOpts, opts)
      .initPanes()
      .initLayers()
      .addWmts('vec_w')
      .addWmts('cva_w')
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
  private addWmts(type: TWmts) {
    L.tileLayer(getTianWmts(type), {}).addTo(this.map)
    return this
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
  
  initPanes() {
    const { map, options } = this
    for (const item of options.panes) {
      map.createPane(item.name);
      map.getPane(item.name)!.style.zIndex = `${item.zIndex || 1000}`;
    }
    return this
  }
  initLayers() {
    const { map, options, layerGroups } = this
    for (const item of options.layers) {
      layerGroups[item.name] = new L.LayerGroup(undefined, { pane: item.pane || '' }).addTo(map)
    }
    return this
  }
  getLayersByName(name: string) {
    return this.layerGroups[name] || null
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
