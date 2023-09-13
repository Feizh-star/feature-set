import * as L from 'leaflet'
import * as turf from '@turf/turf'
import * as zrender from 'zrender'
import type { Map, LatLng } from 'leaflet'
import { merge } from './tools'

interface IShadowStyle {
  fillColor: string
  fillOpacity: number
}
type TBorderShapes = Array<{
  enable?: boolean
  offsetX?: number
  offsetY?: number
  z?: number
  style?: {
    [p: string]: any
  }
}>
export interface IShadowBorder {
  dpi: number
  borderShapes: TBorderShapes
}
export interface ShadowMaskOption<C = IShadowStyle, S = IShadowBorder> {
  zIndex: number
  pane: string
  style: C
  shadowBorders: S
}
export type ZRender = ReturnType<typeof zrender.init>
export type PartialShadowMaskOption = Partial<ShadowMaskOption<Partial<IShadowStyle>, Partial<IShadowBorder>>>

const defaultPane = 'shadow-mask'
const genDefaultOpt: () => ShadowMaskOption = () => ({
  zIndex: 1000,
  pane: defaultPane,
  style: {
    fillColor: '#000000',
    fillOpacity: 0.85,
  },
  shadowBorders: {
    dpi: window.devicePixelRatio,
    borderShapes: [
      {
        enable: false,
        offsetX: 0,
        offsetY: 0,
        z: 30,
        style: {
          stroke: '#c800ff',
          fill: 'transparent',
          lineWidth: 2,
          shadowBlur: 30,
          shadowColor: '#c800ff',
        },
      },
      {
        enable: false,
        offsetX: 6,
        offsetY: 6,
        z: 20,
        style: {
          stroke: 'transparent',
          fill: '#bcc6db',
          lineWidth: 0,
        },
      },
      {
        enable: false,
        offsetX: 10,
        offsetY: 10,
        z: 10,
        style: {
          stroke: 'transparent',
          fill: '#a1b7e5',
          lineWidth: 0,
        },
      },
    ],
  },
})

class ShadowMask {
  static shadowBorderZIndexDelta = 10
  private map: Map
  private shadowBorderZr: ZRender | null = null
  private shadowBorderZrRoot: zrender.Group = new zrender.Group()
  private options: ShadowMaskOption
  private shadowMaskLayer: L.Polygon | null = null
  private border!: GeoJSON.FeatureCollection

  constructor(map: Map, opts: PartialShadowMaskOption = {}) {
    this.options = genDefaultOpt()
    merge(this.options, opts)
    this.map = map
    this.initShadowMaskLayer()
  }
  private initShadowMaskLayer() {
    const { map } = this
    this.options.pane = this.options.pane || defaultPane
    let pane = map.getPane(this.options.pane)
    if (!pane) {
      pane = map.createPane(this.options.pane)
      pane.style.zIndex = `${this.options.zIndex}`
    } else {
      pane.style.zIndex = this.options.zIndex ? `${this.options.zIndex}` : pane.style.zIndex
    }

    map.createPane(this.shadowBorderPaneName).style.zIndex = `${
      parseFloat(pane.style.zIndex) + ShadowMask.shadowBorderZIndexDelta
    }`
    const myRenderer = L.canvas({ padding: 0, pane: this.shadowBorderPaneName })
    myRenderer.addTo(map)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { _container: container } = myRenderer
    this.shadowBorderZr = zrender.init(container, {
      // devicePixelRatio: this.options.shadowBorders.dpi,
    })
    this.shadowBorderZr.add(this.shadowBorderZrRoot)
    myRenderer.on('update', () => {
      this.setShadowBorder()
    })
  }
  private get shadowBorderPaneName() {
    return this.options.pane + '-shadow-border'
  }

  public setShadowMask(border: GeoJSON.FeatureCollection) {
    if (!border) throw new Error('没有border')
    this.border = border
    const bgPolygon = genMaskPolygonByGeoJSON(border)
    this.clearShadowMask()
    this.shadowMaskLayer = L.polygon(bgPolygon as unknown as LatLng[][], {
      pane: this.options.pane,
      color: 'transparent',
      fillColor: this.options.style?.fillColor,
      fillOpacity: this.options.style?.fillOpacity,
    }).addTo(this.map)
    this.setShadowBorder()
  }
  public setShadowBorder() {
    if (!this.options.shadowBorders.borderShapes.some(s => s.enable)) return
    if (!this.shadowBorderZr) throw new Error('zrender图层容器不存在，请确认是否初始化')
    if (!this.border) return
    this.shadowBorderZrRoot.removeAll()
    const lmap = this.map
    const shapesCfgs = this.options.shadowBorders.borderShapes
    const paths: Array<Array<zrender.Polygon | zrender.Polyline>> = []
    const compoundPaths: Array<zrender.CompoundPath> = []
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    turf.featureEach(this.border, (currentFeature, featureIndex) => {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      turf.flattenEach(currentFeature, (currentFlatten, flattenIndex, multiFlattenIndex) => {
        const geometry = currentFlatten.geometry
        const gmy = geometry
        // 画多边型路径
        switch (gmy.type) {
          case 'Polygon':
            ;(gmy as GeoJSON.Polygon).coordinates.forEach(line => {
              genPath(line as Array<[number, number]>, lmap, shapesCfgs, 'Polygon', paths)
            })
            break
          case 'LineString':
            genPath(
              (gmy as GeoJSON.LineString).coordinates as Array<[number, number]>,
              lmap,
              shapesCfgs,
              'Polygon',
              paths
            )
            break
        }
      })
    })
    for (const [index, path] of paths.entries()) {
      if (!shapesCfgs[index].enable) continue
      const cp = new zrender.CompoundPath({
        silent: true,
        z: shapesCfgs[index].z,
        shape: {
          paths: path,
        },
        style: {
          ...shapesCfgs[index].style,
        },
      })
      this.shadowBorderZrRoot.add(cp)
      compoundPaths.push(cp)
    }
  }

  public clearShadowMask() {
    if (this.shadowMaskLayer) {
      this.map.removeLayer(this.shadowMaskLayer)
    }
  }
}

function genMaskPolygonByGeoJSON(geoData: GeoJSON.FeatureCollection) {
  const geoDataTemp = turf.clone(geoData as unknown as turf.AllGeoJSON)
  const bgPolygon = [
    [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
      [90, -180],
    ], // outer ring
  ]
  const outerRingDirection = turf.booleanClockwise(turf.lineString(bgPolygon[0])) // 外部轮廓方向
  turf.flattenEach(geoDataTemp, function (currentFeature) {
    const polygonArray = currentFeature.geometry.coordinates[0]
    const innerRingDirection = turf.booleanClockwise(turf.lineString(polygonArray))
    if (innerRingDirection === outerRingDirection) {
      polygonArray.reverse()
    }
    polygonArray.forEach((item: any) => item.reverse())
    bgPolygon.push(polygonArray)
  })
  return bgPolygon
}

function genPath(
  line: Array<[number, number]>,
  lmap: L.Map,
  shapesCfgs: TBorderShapes,
  shapeType: 'Polygon' | 'Polyline',
  paths: Array<Array<zrender.Polygon | zrender.Polyline>>
) {
  const p = line.map(point => {
    const convert = lmap.latLngToContainerPoint([point[1], point[0]])
    const result = []
    for (const cfg of shapesCfgs) {
      result.push([convert.x + (cfg.offsetX || 0), convert.y + (cfg.offsetY || 0)])
    }
    return result
  })
  for (const [index] of shapesCfgs.entries()) {
    const path = new zrender[shapeType]({
      shape: {
        points: p.map(item => item[index]),
      },
    })
    if (!paths[index]) paths[index] = []
    paths[index].push(path)
  }
}
export default ShadowMask
