import { shallowRef } from 'vue'
import type { ShallowRef } from 'vue'
import type * as L from 'leaflet'
import { gridPoint } from 'hcl'
const rootUrl = 'http://221.122.67.145:8888/admin/code/getCode?key=KPWjQhnQE6LwNfIN'

type TGridLayerLayer = ReturnType<typeof gridPoint> | null

export function useGridLayer({ mapIns }: { mapIns: ShallowRef<L.Map | null> }) {
  const gridLayer = shallowRef<TGridLayerLayer>(null)
  const setGridLayerData = (gridUrl: string, dirUrlOrOptions: string | null, options: { [p: string]: any } = {}) => setGridLayerDataFunc(mapIns, gridLayer, gridUrl, dirUrlOrOptions, options)
  const updateGridImgUrl = (url: string, dirUrl?: string) => updateGridImgUrlFunc(gridLayer, url, dirUrl)
  const removeGridWind = () => removeGridWindFunc(mapIns, gridLayer)
  const hasGridLayer = () => !!gridLayer.value
  onBeforeUnmount(() => {
    removeGridWind()
  })
  return {
    setGridLayerData,
    updateGridImgUrl,
    removeGridWind,
    hasGridLayer
  }
}

/**
 * 绘制格点或风向杆
 * @param spdUrl
 * @param dirUrl
 * @param options
 */
function setGridLayerDataFunc(
  mapIns: ShallowRef<L.Map | null>,
  gridLayer: ShallowRef<TGridLayerLayer>,
  gridUrl: string,
  dirUrlOrOptions: string | null,
  options: { [p: string]: any } = {}
) {
  if (typeof dirUrlOrOptions === 'string') {
    // 风
    addGridWind(mapIns, gridLayer, gridUrl, dirUrlOrOptions, options)
  } else {
    // 其他
    addCommonGrid(mapIns, gridLayer, gridUrl, options)
  }
}
/**
 * 更新图片地址
 * @param url url
 * @param dirUrl dirUrl
 */
function updateGridImgUrlFunc(gridLayer: ShallowRef<TGridLayerLayer>, url: string, dirUrl?: string) {
  if (!gridLayer.value) return
  gridLayer.value.changeUrl(url, dirUrl || undefined)
}
/**
 * 添加风向杆格点
 */
function addGridWind(mapIns: ShallowRef<L.Map | null>, gridLayer: ShallowRef<TGridLayerLayer>, spdUrl: string, dirUrl: string, options: { [p: string]: any } = {}) {
  if (!mapIns.value) return
  if (!gridLayer.value) {
    gridLayer.value = new gridPoint({
      latmin: 31.7576,
      latmax: 43.6512,
      lonmin: 88.9501,
      lonmax: 112.5247,
      intervalZoom: 13,
      multiple: 0.25,
      interval: 0.05,
      pointSize: 15,
      font: '16px Arial',
      color: '#fff',
      shadowColor: '#333',
      shadowSize: 2,
      tOffsetX: 0,
      tOffsetY: 36,
      txtCenter: true,
      zindex: 1050,
      wind: true,
      windWidth: 2,
      windSize: 20,
      spdUrl: spdUrl,
      dirUrl: dirUrl,
      showSpeed: true,
      rootUrl: rootUrl,
      // speedScale: {
      //   r: 50,
      //   g: 30,
      //   b: 20,
      //   a: 1
      // },
      // dirScale: {
      //   r: 2,
      //   g: 2,
      //   b: 2,
      //   a: 2
      // },
      // scale: {
      //   r: 50,
      //   g: 30,
      //   b: 20,
      //   a: 1
      // },
      // valFormatter: function (val: number) {
      //   // val -= 30
      //   return String(Number(val.toFixed(decimal)))
      // },
      ...options
    }).addTo(mapIns.value)
  }
}
/**
 * 添加普通格点
 */
function addCommonGrid(mapIns: ShallowRef<L.Map | null>, gridLayer: ShallowRef<TGridLayerLayer>, gridUrl: string, options: { [p: string]: any } = {}) {
  if (!mapIns.value) return
  if (!gridLayer.value) {
    gridLayer.value = new gridPoint({
      url: gridUrl,
      latmax: 55,
      latmin: 17,
      lonmax: 136,
      lonmin: 72,
      intervalZoom: 11,
      multiple: 1.0,
      interval: 0.05,
      pointSize: 4,
      font: '16px Arial',
      color: '#fff',
      shadowColor: '#333',
      shadowSize: 2,
      tOffsetX: 0,
      tOffsetY: 24,
      txtCenter: true,
      zindex: 1050,
      rootUrl: rootUrl,
      // scale: {
      //   r: 50,
      //   g: 30,
      //   b: 20,
      //   a: 1
      // },
      // valFormatter: function (val: number) {
      //   // val -= 30
      //   return String(Number(val.toFixed(decimal)))
      // },
      ...options
    }).addTo(mapIns.value)
  }
}
/**
 * 移除格点图层
 */
function removeGridWindFunc(mapIns: ShallowRef<L.Map | null>, gridLayer: ShallowRef<TGridLayerLayer>) {
  if (!mapIns.value) return
  if (!gridLayer.value) return
  mapIns.value.removeLayer(gridLayer.value)
  gridLayer.value = null
}