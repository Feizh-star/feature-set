import canvasLayer from '@/libs/stain/L.canvasLayer.GlImg.js'
import contourLayer from "@/libs/line/L.contourLayer.js"
import geobuf from "geobuf"
import Pbf from "pbf"
import colors from './colors'
import scales from './scales'
import type { LMap } from './map'

export function drawStains(data: any, mapInstance: LMap, opt: any) {
  const color = opt.color || colors[opt.elementColor]
  const scale = opt.scale || scales[opt.elementScale]
  const layer = mapInstance.getLayersByName('stainLayer')
  if (layer) layer.clearLayers()
  if (color === undefined || scale === undefined || !layer) return
  canvasLayer(data, color, {
    scale: scale,
    linear: 0.2,
    opacity: 0.9,
    pane: 'stainLayerPane',
    latmin: opt.latmin,
    latmax: opt.latmax,
    lonmin: opt.lonmin,
    lonmax: opt.lonmax,
  }).addTo(layer)
}

export function drawLine(data: any, mapInstance: LMap) {
  const layer = mapInstance.getLayersByName('lineLayer')
  if (layer) layer.clearLayers()
  if (!layer) return
  let geoData: any = null
  try {
    geoData = data && geobuf.decode(new Pbf(data))
  } catch (error) {
    console.error(error)
  }
  if (geoData) {
    contourLayer(geoData, {pane: 'lineLayerPane'}).addTo(layer)
  }
}