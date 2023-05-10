import * as L from 'leaflet'
import * as turf from '@turf/turf'
import type { Map, LatLng } from 'leaflet'
import { merge } from './utils/tools'

interface IShadowStyle {
  fillColor: string
  fillOpacity: number
}
export interface ShadowMaskOption<C = IShadowStyle> {
  zIndex: number
  pane: string
  style: C
}
export type PartialShadowMaskOption = Partial<ShadowMaskOption<Partial<IShadowStyle>>>

const defaultPane = 'shadow-mask'
const defaultOpt: ShadowMaskOption = {
  zIndex: 990,
  pane: defaultPane,
  style: {
    fillColor: '#000000',
    fillOpacity: 0.85
  }
}

class ShadowMask {
  private map: Map
  private options: ShadowMaskOption = defaultOpt
  private shadowMaskLayer: L.Polygon | null = null

  constructor(map: Map, opts: PartialShadowMaskOption = {}) {
    merge(this.options, opts)
    this.map = map
    this.initShadowMaskLayer()
  }
  private initShadowMaskLayer() {
    const { map } = this
    this.options.pane = this.options.pane || defaultPane
    let pane = map.getPane(this.options.pane);
    if (!pane) {
      pane = map.createPane(this.options.pane)
      pane.style.zIndex = `${this.options.zIndex}`
    } else {
      pane.style.zIndex = this.options.zIndex ? `${this.options.zIndex}` : pane.style.zIndex
    }

  }

  public setShadowMask(border: GeoJSON.FeatureCollection) {
    const bgPolygon = genMaskPolygonByGeoJSON(border)
    this.clearShadowMask()
    this.shadowMaskLayer = L.polygon(bgPolygon as unknown as LatLng[][], {
      pane: this.options.pane,
      color: 'transparent', 
      fillColor: this.options.style?.fillColor,
      fillOpacity: this.options.style?.fillOpacity, 
    }).addTo(this.map)
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
    [[90, -180],[90, 180],[-90, 180],[-90, -180],[90, -180]], // outer ring
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

export default ShadowMask