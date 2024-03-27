import { shallowRef } from 'vue'
import type { ShallowRef } from 'vue'
import type * as L from 'leaflet'
import { glImgMin } from 'hcl'
const rootUrl = 'http://221.122.67.145:8888/admin/code/getCode?key=KPWjQhnQE6LwNfIN'

export interface IHclColorsRange {
  r: Array<number>
  g: Array<number>
  b: Array<number>
  v: Array<number>
  o: Array<number>
}
export interface IScaleProps {
  r: number
  g: number
  b: number
  a: number
}
type TGlStainImgLayer = ReturnType<typeof glImgMin> | null

export function useGlStainImg({ mapIns }: { mapIns: ShallowRef<L.Map | null> }) {
  const glStainImgLayer = shallowRef<TGlStainImgLayer>(null)
  const addGlStainImg = (
    url: string,
    color: IHclColorsRange,
    scale: IScaleProps,
    options: { [p: string]: any }
  ) => addGlStainImgFunc(mapIns, glStainImgLayer, url, color, scale, options)
  const updateGlStainImgUrl = (url: string) => updateGlStainImgUrlFunc(glStainImgLayer, url)
  const hasGlStainImgLayer = () => !!glStainImgLayer.value
  const getValueByPosition = (lat: number, lon: number) =>
    getValueByPositionFunc(glStainImgLayer, lat, lon)
  const removeGlStainImg = () => removeGlStainImgFunc(mapIns, glStainImgLayer)
  onBeforeUnmount(() => {
    removeGlStainImg()
  })
  return {
    addGlStainImg,
    updateGlStainImgUrl,
    hasGlStainImgLayer,
    getValueByPosition,
    removeGlStainImg,
  }
}

/**
 * 添加色斑图
 * @param url url
 * @param color 颜色配置
 * @param scale 缩放配置
 * @param options 其他选项
 */
function addGlStainImgFunc(
  mapIns: ShallowRef<L.Map | null>,
  glStainImgLayer: ShallowRef<TGlStainImgLayer>,
  url: string,
  color: IHclColorsRange,
  scale: IScaleProps,
  options: { [p: string]: any }
) {
  if (!mapIns.value) return
  removeGlStainImgFunc(mapIns, glStainImgLayer)
  try {
    glStainImgLayer.value = new glImgMin({
      url: url,
      linear: 0, //设置色斑图的渐变度
      latmin: 31.7576,
      latmax: 43.6512,
      lonmin: 88.9501,
      lonmax: 112.5247,
      scale: scale,
      flipy: 0,
      colors: color,
      grid: true,
      minOpacity: true,
      interval: 0.05,
      useCorrect: false,
      cut: false,
      cutUrl: '',
      cutlatmin: 30.9,
      cutlatmax: 32.6,
      cutlonmin: 116.5,
      cutlonmax: 118,
      rootUrl,
      ...options,
    })
    glStainImgLayer.value.setGetGridLatLng(true)
    glStainImgLayer.value.addTo(mapIns.value)
  } catch (error) {
    console.error(error)
  }
}
/**
 * 更新图片地址
 * @param url url
 */
function updateGlStainImgUrlFunc(glStainImgLayer: ShallowRef<TGlStainImgLayer>, url: string) {
  if (!glStainImgLayer.value) return
  glStainImgLayer.value.changeImage(url)
}
function getValueByPositionFunc(
  glStainImgLayer: ShallowRef<TGlStainImgLayer>,
  lat: number,
  lon: number
) {
  if (!glStainImgLayer.value) return null
  return glStainImgLayer.value.getGridDataByLatLng(lat, lon)
}
/**
 * 移除色斑图
 */
function removeGlStainImgFunc(
  mapIns: ShallowRef<L.Map | null>,
  glStainImgLayer: ShallowRef<TGlStainImgLayer>
) {
  if (!glStainImgLayer.value) return
  if (mapIns.value) {
    mapIns.value.removeLayer(glStainImgLayer.value)
    glStainImgLayer.value = null
  }
}
