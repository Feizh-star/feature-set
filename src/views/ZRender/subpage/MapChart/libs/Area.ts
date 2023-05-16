import * as zrender from 'zrender'
import * as turf from '@turf/turf'
import type { ZRender, ZGroup } from './types/zrender'
import type ZRenderLayer from "./ZRenderLayer"
import type { IBaseChart } from './BaseChart'
import { merge } from './utils/tools'
import { simplify, truncate, judgeArea } from './utils/turf'

interface ISimple {
  minArea: number,
  tolerance: number,
  precision: number,
  highQuality: boolean,
  includeZ: boolean
}

interface IItemStyle {
  [prop: string]: any
}
interface IEvent {
  onclick: (e: zrender.ElementEvent, f: GeoJSON.Feature) => void
  onmouseover: (e: zrender.ElementEvent, f: GeoJSON.Feature) => void
  onmouseout: (e: zrender.ElementEvent, f: GeoJSON.Feature) => void
}
interface IGeoInfo {
  geoData: GeoJSON.FeatureCollection
  border: GeoJSON.FeatureCollection
}
export interface AreaOption<S = ISimple, I = IItemStyle, E = IEvent> {
  simple: S
  itemStyle: I
  itemStyleActive: I
  borderStyle: I
  event: E
}
export type PartialAreaOption = Partial<AreaOption<Partial<ISimple>, Partial<IItemStyle>, Partial<IEvent>>>

const defaultOpt = {
  event: {
    onclick: (e: zrender.ElementEvent, f: GeoJSON.Feature) => {  },
    onmouseover: (e: zrender.ElementEvent, f: GeoJSON.Feature) => {  },
    onmouseout: (e: zrender.ElementEvent, f: GeoJSON.Feature) => {  },
  },
  simple: {
    minArea: 0,
    tolerance: 0,
    precision: 8,
    highQuality: false,
    includeZ: false
  },
  itemStyle: {
    stroke: '#999999',
    fill: 'transparent',
    lineWidth: 1
  },
  itemStyleActive: {
    stroke: '#ff0000',
    fill: 'transparent',
    lineWidth: 1
  },
  borderStyle: {
    stroke: '#0000ff',
    fill: 'transparent',
    lineWidth: 3
  }
}

class Area implements IBaseChart {
  static borderZIndexDelta = 1
  static detailZIndexDelta = 2
  layer!: ZRenderLayer | null
  private zIndex: number = 50
  private root: ZGroup = new zrender.Group()
  private options: AreaOption = defaultOpt
  private geoData!: GeoJSON.FeatureCollection
  private border!: GeoJSON.FeatureCollection
  private geoInfoStack: Array<Partial<IGeoInfo>> = []
  private borderCompoundPath: zrender.CompoundPath | null = null
  private currentAreaCode: number = -1

  constructor(opts: PartialAreaOption = {}) {
    merge(this.options, opts)
    this.layer = null
  }

  public addTo(layer: ZRenderLayer) {
    if (this.layer === layer) return
    if (this.layer && this.layer !== layer) {
      throw new Error('图表已经被添加到其他图层！')
    }
    this.layer = layer
    layer.add(this)
  }

  public setFeature(geoInfo: Partial<IGeoInfo>, evts: Partial<IEvent> = {}) {
    if (!this.layer) throw new Error('layer图层容器不存在，请确认是否初始化')
    if (!geoInfo.geoData) return
    if (evts) merge(this.options, { event: {...evts} })
    this.clearArea()
    const lmap = this.layer.getMap()
    if (geoInfo.border) {
      this.border = geoInfo.border
      this.setBorder(this.border)
    }
    this.geoData = geoInfo.geoData

    const { simple: { minArea, tolerance, precision, highQuality, includeZ } } = this.options
    turf.featureEach(this.geoData, (currentFeature, featureIndex) => {
      const paths: Array<zrender.Polygon | zrender.Polyline> = []
      turf.flattenEach(currentFeature, (currentFlatten, flattenIndex, multiFlattenIndex) => {
        const geometry = currentFlatten.geometry
        const ma = parseFloat(`${minArea}`) || 0
        // 抽希
        if (geometry.type === 'Polygon' && judgeArea(geometry.coordinates, { limit: ma * 1000000, type: 'lt' })) return
        let gmy = currentFlatten.geometry
        if (geometry.type === 'Polygon') {
          const simplified = simplify(currentFlatten as turf.AllGeoJSON, {tolerance, highQuality})
          const truncated = truncate(simplified, { precision, coordinates: includeZ ? 3 : 2 }) as GeoJSON.Feature
          gmy = truncated.geometry
        }
        // 画多边型路径
        switch (gmy.type) {
          case 'Polygon':
            (gmy as GeoJSON.Polygon).coordinates.forEach(line => {
              const p = line.map(point => {
                const convert = lmap.latLngToPoint([point[1], point[0]])
                return [convert.x, convert.y]
              })
              paths.push(new zrender.Polygon({
                shape: {
                  points: p,
                },
              }))
            })
            break
          case 'LineString':
            paths.push(new zrender.Polyline({
              shape: {
                points: (gmy as GeoJSON.LineString).coordinates.map(point => {
                  const convert = lmap.latLngToPoint([point[1] as any as number, point[0] as any as number])
                  return [convert.x, convert.y]
                }),
              },
            }))
            break
        }
      })
      const needActive = this.currentAreaCode === currentFeature.properties?.adcode
      const z = needActive ? this.zIndex + 1 : this.zIndex
      const style = needActive ? this.options.itemStyleActive : this.options.itemStyle
      const compoundPath = new zrender.CompoundPath({
        z: z,
        shape: {
          paths: paths,
        },
        style: {
          ...style
        },
      })
      this.root.add(compoundPath)
      this.root.dirty()
      compoundPath.on('click', (e) => {
        this.handleClick(e, currentFeature, evts as IEvent)
      })
      // compoundPath.on('mouseover', (e) => {
      //   this.handleMouseover(e, currentFeature, evts as IEvent)
      // })
      // compoundPath.on('mouseout', (e) => {
      //   this.handleMouseout(e, currentFeature, evts as IEvent)
      // })
    })
    return this
  }
  private handleClick(e: zrender.ElementEvent, f: GeoJSON.Feature, evts: IEvent) {
    if (!evts.onclick) evts.onclick = this.options.event.onclick
    // todo：默认的点击效果
    // 保存一下当前的geodata和border
    this.geoInfoStack.push({ geoData: this.geoData, border: this.border })
    evts.onclick.call(this, e, f)
    // setTimeout(() => {
    //   if (this.layer) {
    //     const lmap = this.layer.getMap()
    //     lmap.setView(f)
    //   }
    // }, 90)
  }
  private handleMouseover(e: zrender.ElementEvent, f: GeoJSON.Feature, evts: IEvent) {
    if (!evts.onmouseover) evts.onmouseover = this.options.event.onmouseover
    // todo：默认的hover效果
    this.defaultMouseInOut(e, f, 'in')
    evts.onmouseover.call(this, e, f)
  }
  private handleMouseout(e: zrender.ElementEvent, f: GeoJSON.Feature, evts: IEvent) {
    if (!evts.onmouseout) evts.onmouseout = this.options.event.onmouseout
    // todo：去除默认的hover效果
    this.defaultMouseInOut(e, f, 'out')
    evts.onmouseout.call(this, e, f)
  }
  /**
   * 默认的鼠标进出效果
   * @param e zrender.ElementEvent 事件对象
   * @param f GeoJSON.Feature 当前区域的feature
   * @param type 'in' | 'out' 鼠标进入或离开
   */
  private defaultMouseInOut(e: zrender.ElementEvent, f: GeoJSON.Feature, type: 'in' | 'out') {
    const allCp = this.root.children().filter((cp: zrender.CompoundPath) => cp.id !== this.borderCompoundPath?.id)
    // 还是要全部还原，解决频繁缩放后偶现的多个区域active问题
    allCp.forEach((cp: zrender.CompoundPath) => cp.attr({ z: this.zIndex, style: { ...this.options.itemStyle } }))
    const currentCp = allCp.find((c: zrender.CompoundPath) => c.id === e.target.id)
    const style = type === 'in' ? this.options.itemStyleActive : this.options.itemStyle
    const z = type === 'in' ? this.zIndex + Area.detailZIndexDelta : this.zIndex
    this.currentAreaCode = type === 'in' ? f.properties?.adcode || -1 : -1
    currentCp?.attr({
      z,
      style: { ...style }
    })
  }
  public clearArea() {
    this.root.removeAll()
  }
  public update() {
    if (this.geoData) this.setFeature({ geoData: this.geoData, border: this.border })
  }

  public getRoot() {
    return this.root
  }

  public setBorder(border: GeoJSON.FeatureCollection) {
    if (!this.layer) throw new Error('layer图层容器不存在，请确认是否初始化')
    if (!border) return
    const lmap = this.layer.getMap()
    const paths: Array<zrender.Polygon | zrender.Polyline> = []
    turf.featureEach(border, (currentFeature, featureIndex) => {
      turf.flattenEach(currentFeature, (currentFlatten, flattenIndex, multiFlattenIndex) => {
        const geometry = currentFlatten.geometry
        const gmy = geometry
        // 画多边型路径
        switch (gmy.type) {
          case 'Polygon':
            (gmy as GeoJSON.Polygon).coordinates.forEach(line => {
              const p = line.map(point => {
                const convert = lmap.latLngToPoint([point[1], point[0]])
                return [convert.x, convert.y]
              })
              paths.push(new zrender.Polygon({
                shape: {
                  points: p,
                },
              }))
            })
            break
          case 'LineString':
            paths.push(new zrender.Polyline({
              shape: {
                points: (gmy as GeoJSON.LineString).coordinates.map(point => {
                  const convert = lmap.latLngToPoint([point[1] as any as number, point[0] as any as number])
                  return [convert.x, convert.y]
                }),
              },
            }))
            break
        }
      })
    })
    const compoundPath = new zrender.CompoundPath({
      z: this.zIndex + Area.borderZIndexDelta,
      silent: true,
      shape: {
        paths: paths,
      },
      style: {
        ...this.options.borderStyle
      },
    })
    this.borderCompoundPath = compoundPath
    this.root.add(compoundPath)
    this.root.dirty()
  }
  public clickout() {
    this.returnUpOneLevel()
  }
  /**
   * 当向下钻取获取geojson失败（即已到达最后一层时），清理geoInfoStack中多余的geojson
   */
  public drillGeoDataError() {
    this.geoInfoStack.pop()
    this.layer?.refresh()
  }
  private returnUpOneLevel() {
    const geoInfo = this.geoInfoStack.pop()
    if (!geoInfo) return
    this.setFeature(geoInfo)
    if (this.layer && geoInfo.border) {
      const lmap = this.layer.getMap()
      lmap.setMapShadowMask(geoInfo.border)
      lmap.setView(geoInfo.border.features[0])
    }
  }
}

export default Area