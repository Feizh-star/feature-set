import canvasLayer from '@/libs/stain/L.canvasLayer.GlImg.js'
import { glImgMin } from "hcl";
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
  console.log(color, scale, data);
  // url，color, scale, range, otherOpts
  const a = new glImgMin({
    url: data,
    linear: 0, //设置色斑图的渐变度
    latmin: opt.latmin,
    latmax: opt.latmax,
    lonmin: opt.lonmin,
    lonmax: opt.lonmax,
    scale: scale,
    flipy: 0,
    colors: color,
    grid: true,
    minOpacity: true,
    interval:0.0025,
    useCorrect:false,
    // cut: true,
    // cutUrl: "/china.png",
    rootUrl: "http://221.122.67.145:8888/admin/code/getCode?key=KPWjQhnQE6LwNfIN",
  })
  console.log(a)
  a.addTo(layer);
    
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