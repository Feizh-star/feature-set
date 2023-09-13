import * as L from 'leaflet'
import * as turf from '@turf/turf'
import type { IBaseChart } from './BaseChart'
import { merge } from './utils/tools'
import { simplify, truncate, judgeArea, flipLngLat } from './utils/turf'
import type { LMap } from './map'

interface ISimple {
  minDrill: number,
  tolerance: number,
  precision: number,
  highQuality: boolean,
  includeZ: boolean
}

interface IEvent {
  onclick: (e: any, f: GeoJSON.Feature) => void
  onmouseover: (e: any, f: GeoJSON.Feature) => void
  onmouseout: (e: any, f: GeoJSON.Feature) => void
  ondrill: (e: any, f: GeoJSON.Feature) => void
}
interface IGeoInfo {
  geoData: GeoJSON.FeatureCollection
  border: GeoJSON.FeatureCollection
}
type TLayerGroupOpt = L.LayerOptions & {
  zIndex: number
  [p: string]: any
}
type TDrillEvts = { ondrill?: (...arg: any[]) => void }
export interface DrillOption<S = ISimple, I = L.PathOptions, E = IEvent> {
  enable: boolean
  enableActive: boolean
  simple: S
  itemStyle: I
  itemStyleActive: I
  borderStyle: I
  event: E
  layerGroup: TLayerGroupOpt
  drillEvents: TDrillEvts
}
export type PartialDrillOption = Partial<DrillOption<Partial<ISimple>, Partial<L.PathOptions>, Partial<IEvent>>>

const defaultOpt: DrillOption = {
  event: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onclick: (e: any, f: GeoJSON.Feature) => {  },
    onmouseover: (e: any, f: GeoJSON.Feature) => {  },
    onmouseout: (e: any, f: GeoJSON.Feature) => {  },
    ondrill: (e: any, f: GeoJSON.Feature) => {  },
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },
  layerGroup: {
    pane: 'drill-layer',
    zIndex: 1200,
  },
  enable: true,
  enableActive: true,
  simple: {
    minDrill: 0,
    tolerance: 0,
    precision: 8,
    highQuality: false,
    includeZ: false
  },
  itemStyle: {
    color: '#47495f',
    fillColor: '#343e99',
    fillOpacity: 0.6,
    weight: 1
  },
  itemStyleActive: {
    color: '#47495f',
    fillColor: '#bbe1ee',
    fillOpacity: 0.6,
    weight: 1
  },
  borderStyle: {
    color: '#313796',
    fillColor: 'transparent',
    weight: 2
  },
  drillEvents: {
    ondrill(this: Drill, e: any, f: GeoJSON.Feature, p: GeoJSON.FeatureCollection) {
      this.getLmap.getShadowMaskLayer.setShadowMask(p)
      setTimeout(() => this.getLmap.setView(f), 90)
    }
  }
}

class Drill implements IBaseChart {
  layer!: L.LayerGroup
  private zIndex: number = 50
  private map!: L.Map
  private lmap!: LMap
  private options: DrillOption = defaultOpt
  private geoData!: GeoJSON.FeatureCollection
  private border!: GeoJSON.FeatureCollection
  private geoInfoStack: Array<Partial<IGeoInfo>> = []
  private borderFeatureGroup: L.FeatureGroup | null = null
  private shapeFeatureMap: WeakMap<L.Polygon | L.Polyline, L.FeatureGroup> = new WeakMap()
  private featureGroupMap: WeakMap<L.FeatureGroup, GeoJSON.Feature> = new WeakMap()
  private currentDrillCode: number = -1
  private justClickFeature: boolean = false
  get getLmap() { return this.lmap }

  constructor(mapIns: LMap, opts: PartialDrillOption = {}) {
    merge(this.options, opts)
    this.lmap = mapIns
    this.map = mapIns.map
    this.initLayerGroup()
    this.map.on('click', (e) => {
      const {lat, lng} = e.latlng
      const borderFeatures = this.borderFeatureGroup!.getLayers().map(f => (f as any).toGeoJSON())
      const isOut = !borderFeatures.some(f => {
        const Polygon = JSON.parse(JSON.stringify(f))
        Polygon.geometry.type = 'Polygon'
        return turf.booleanPointInPolygon([lng, lat], Polygon)
      })
      // 当刚刚点击了图形后，即使isOut === true（点小岛时会偶现），也不触发clickout
      if (this.justClickFeature) {
        this.justClickFeature = false
      } else if (isOut) {
        this.clickout()
      }
    })
  }
  private initLayerGroup() {
    const paneName = this.options.layerGroup.pane as string
    const paneZIndex = this.options.layerGroup.zIndex as number
    let pane = this.map.getPane(paneName);
    if (!pane) {
      pane = this.map.createPane(paneName)
      pane.style.zIndex = `${paneZIndex}`
    } else {
      pane.style.zIndex = paneZIndex ? `${paneZIndex}` : pane.style.zIndex
    }
    this.layer = new L.LayerGroup()
    this.layer.addTo(this.map)
  }

  public setFeature(geoInfo: Partial<IGeoInfo>) {
    if (!this.layer) throw new Error('layer图层容器不存在，请确认是否初始化')
    if (!geoInfo.geoData) return
    this.clearDrill()
    this.geoData = geoInfo.geoData

    const { simple: { minDrill, tolerance, precision, highQuality, includeZ } } = this.options
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    turf.featureEach(this.geoData, (currentFeature, featureIndex) => {
      const featureGroup = new L.FeatureGroup()
      const needActive = this.currentDrillCode === currentFeature.properties?.adcode
      const style = needActive ? this.options.itemStyleActive : this.options.itemStyle
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      turf.flattenEach(currentFeature, (currentFlatten, flattenIndex, multiFlattenIndex) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const properties = currentFlatten.properties // center, name
        const geometry = currentFlatten.geometry
        const ma = parseFloat(`${minDrill}`) || 0
        // 抽希
        if (geometry.type === 'Polygon' && judgeArea(geometry.coordinates, { limit: ma * 1000000, type: 'lt' })) return
        let gmy = currentFlatten.geometry
        if (geometry.type === 'Polygon') {
          const simplified = simplify(currentFlatten as turf.AllGeoJSON, {tolerance, highQuality})
          const truncated = truncate(simplified, { precision, coordinates: includeZ ? 3 : 2 }) as GeoJSON.Feature
          gmy = truncated.geometry
        }
        // 画多边型路径
        let filpLine: L.LatLngExpression[]
        let shape: L.Polygon | L.Polyline
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let marker: L.Marker
        switch (gmy.type) {
          case 'Polygon':
            (gmy as GeoJSON.Polygon).coordinates.forEach(line => {
              filpLine = flipLngLat(line) as L.LatLngExpression[]
              shape = L.polygon(filpLine, {
                pane: this.options.layerGroup.pane as string,
                ...style
              })
              shape.addTo(featureGroup)
              this.shapeFeatureMap.set(shape, featureGroup)
            })
            break
          case 'LineString':
            filpLine = flipLngLat((gmy as GeoJSON.LineString).coordinates) as L.LatLngExpression[]
            shape = L.polyline(filpLine, {
              pane: this.options.layerGroup.pane as string,
              ...style
            })
            shape.addTo(featureGroup)
            this.shapeFeatureMap.set(shape, featureGroup)
            break
        }
      })
      featureGroup.addTo(this.layer)
      this.featureGroupMap.set(featureGroup, currentFeature)
      featureGroup.on('click', (e) => {
        this.justClickFeature = true
        this.handleClick(e, currentFeature)
      })
      featureGroup.on('mouseover', (e) => {
        this.handleMouseover(e, currentFeature)
      })
      featureGroup.on('mouseout', (e) => {
        this.handleMouseout(e, currentFeature)
      })
    })
    if (geoInfo.border) {
      this.border = geoInfo.border
      this.setBorder(this.border)
    }
    return this
  }
  private handleClick(e: L.LeafletMouseEvent, f: GeoJSON.Feature) {
    // 默认的点击效果
    if (this.options.enable) {
      // 保存一下当前的geodata和border
      this.geoInfoStack.push({ geoData: this.geoData, border: this.border })
      // evts.onclick.call(this, e, f)
      fetchGeoJson(f.properties!.adcode).then(res => {
        const packageFeature = featureCollectionPackage(f)
        this.setFeature({
          geoData: res,
          border: packageFeature
        })
        this.getLmap.getShadowMaskLayer.setShadowMask(packageFeature)
        setTimeout(() => {
          this.getLmap.setView(f)
          // 外部注册的钻取事件
          this.options.event.ondrill.call(this, e, f)
        }, 90)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch(error => {
        // 没有下级geojson了，要把已经保存的上级geojson移除，并刷新图层
        this.drillGeoDataError()
      })
    }
    // 外部注册的点击事件
    this.options.event.onclick.call(this, e, f)
  }
  private handleMouseover(e: L.LeafletMouseEvent, f: GeoJSON.Feature) {
    // 默认的hover效果
    if (this.options.enableActive) {
      this.defaultMouseInOut(e, f, 'in')
    }
    this.options.event.onmouseover.call(this, e, f)
  }
  private handleMouseout(e: L.LeafletMouseEvent, f: GeoJSON.Feature) {
    // 去除默认的hover效果
    if (this.options.enableActive) {
      this.defaultMouseInOut(e, f, 'out')
    }
    this.options.event.onmouseout.call(this, e, f)
  }
  /**
   * 默认的鼠标进出效果
   * @param e zrender.ElementEvent 事件对象
   * @param f GeoJSON.Feature 当前区域的feature
   * @param type 'in' | 'out' 鼠标进入或离开
   */
  private defaultMouseInOut(e: L.LeafletMouseEvent, f: GeoJSON.Feature, type: 'in' | 'out') {
    this.currentDrillCode = type === 'in' ? f.properties?.adcode || -1 : -1
    const style = type === 'in' ? this.options.itemStyleActive : this.options.itemStyle
    const currentFeatureGroup = this.shapeFeatureMap.get(e.layer)
    const featureLayers = currentFeatureGroup?.getLayers() || []
    currentFeatureGroup?.bringToFront()
    featureLayers.forEach(shape => {
      if ((shape as any).setStyle) (shape as any).setStyle({...style})
    })
    if (type === 'out') {
      this.borderFeatureGroup?.bringToFront()
    }
  }
  public clearDrill() {
    this.layer.clearLayers()
  }
  public update() {
    if (this.geoData) this.setFeature({ geoData: this.geoData, border: this.border })
  }

  public setBorder(border: GeoJSON.FeatureCollection) {
    if (!this.layer) throw new Error('layer图层容器不存在，请确认是否初始化')
    if (!border) return
    const { simple: { minDrill, tolerance, precision, highQuality, includeZ } } = this.options
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    turf.featureEach(border, (currentFeature, featureIndex) => {
      const featureGroup = new L.FeatureGroup()
      const style = this.options.borderStyle
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      turf.flattenEach(currentFeature, (currentFlatten, flattenIndex, multiFlattenIndex) => {
        const geometry = currentFlatten.geometry
        const ma = parseFloat(`${minDrill}`) || 0
        // 抽希
        if (geometry.type === 'Polygon' && judgeArea(geometry.coordinates, { limit: ma * 1000000, type: 'lt' })) return
        let gmy = currentFlatten.geometry
        if (geometry.type === 'Polygon') {
          const simplified = simplify(currentFlatten as turf.AllGeoJSON, {tolerance, highQuality})
          const truncated = truncate(simplified, { precision, coordinates: includeZ ? 3 : 2 }) as GeoJSON.Feature
          gmy = truncated.geometry
        }
        // 画多边型路径
        let filpLine: L.LatLngExpression[]
        switch (gmy.type) {
          case 'Polygon':
            (gmy as GeoJSON.Polygon).coordinates.forEach(line => {
              filpLine = flipLngLat(line) as L.LatLngExpression[]
              L.polyline(filpLine, {
                pane: this.options.layerGroup.pane as string,
                ...style
              }).addTo(featureGroup)
            })
            break
          // case 'LineString':
          //   filpLine = flipLngLat((gmy as GeoJSON.LineString).coordinates) as L.LatLngExpression[]
          //   L.polyline(filpLine, {
          //     pane: this.options.layerGroup.pane as string,
          //     ...style
          //   }).addTo(featureGroup)
          //   break
        }
      })
      featureGroup.addTo(this.layer)
      this.borderFeatureGroup = featureGroup
    })
  }
  public clickout() {
    this.returnUpOneLevel()
  }
  /**
   * 当向下钻取获取geojson失败（即已到达最后一层时），清理geoInfoStack中多余的geojson
   */
  public drillGeoDataError() {
    this.geoInfoStack.pop()
  }
  private returnUpOneLevel() {
    const geoInfo = this.geoInfoStack.pop()
    if (!geoInfo) return
    this.setFeature(geoInfo)
    if (this.layer && geoInfo.border) {
      const lmap = this.lmap
      lmap.setMapShadowMask(geoInfo.border)
      lmap.setView(geoInfo.border.features[0])
    }
  }
  public forEachFeatureGroup() {
    // todo: 遍历所有FeatureGroup，给callback传递featureGroup和geojson的Feature
  }
}


export function featureCollectionPackage(f: GeoJSON.Feature): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: [f]
  }
}

export function fetchGeoJson(adcode: string): Promise<GeoJSON.FeatureCollection> {
  return new Promise((resolve, reject) => {
    fetch(`/geojson/${adcode}.json`)
      .then(res => res.json())
      .then(res => resolve(res))
      .catch(error => reject(error))
  })
}

export default Drill