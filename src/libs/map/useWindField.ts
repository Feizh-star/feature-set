import { shallowRef } from 'vue'
import type * as L from 'leaflet'
import type { ShallowRef } from 'vue'
// import { windyLayer } from 'hcl'
import windyLayer from '@/libs/map/plugins/windyLayer.js'

export interface IUseWindField {
  mapIns: ShallowRef<L.Map | null>
}
type TWindFieldLayer = ReturnType<typeof windyLayer> | null

export function useWindField({ mapIns }: IUseWindField) {
  const windFieldLayer = shallowRef<TWindFieldLayer>(null)
  const drawWindField = (url: string, options: { [p: string]: any }) => {
    drawWindFieldFunc(mapIns, windFieldLayer, url, options)
  }
  const removeWindField = () => removeWindFieldFunc(mapIns, windFieldLayer)
  onBeforeUnmount(() => {
    removeWindField()
  })
  return {
    drawWindField,
    removeWindField,
  }
}

/**
 * 绘制风流场
 */
function drawWindFieldFunc(
  mapIns: ShallowRef<L.Map | null>,
  windFieldLayer: ShallowRef<TWindFieldLayer>,
  url: string,
  options: { [p: string]: any } = {}
) {
  if (!mapIns.value) return
  if (windFieldLayer.value) {
    removeWindFieldFunc(mapIns, windFieldLayer)
  }
  windFieldLayer.value = new windyLayer({
    url: url,
    latmin: -90,
    latmax: 90,
    lonmin: 0,
    lonmax: 359.5,
    interval: 0.5,
    density: 0.04,
    maxAge: 100,
    vscale: 0.05,
    fadeStyle: 'rgba(0, 0, 0, 1)',
    strokeColor: '#ffffff',
    galpha: 0.95,
    global: false,
    ...options,
  }).addTo(mapIns.value)
}

/**
 * 移除风场
 */
function removeWindFieldFunc(
  mapIns: ShallowRef<L.Map | null>,
  windFieldLayer: ShallowRef<TWindFieldLayer>
) {
  if (!mapIns.value) return
  if (!windFieldLayer.value) return
  mapIns.value.removeLayer(windFieldLayer.value)
  windFieldLayer.value = null
}
