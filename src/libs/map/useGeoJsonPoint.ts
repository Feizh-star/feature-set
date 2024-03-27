import { shallowRef } from 'vue'
import type * as L from 'leaflet'
import type { ShallowRef } from 'vue'
import { DrawGeojsonPoints } from 'hcl_n'

export interface IUseGeoJsonPoint {
  mapIns: ShallowRef<L.Map | null>
  cfg?: { enable: boolean; option: IAnyObject }
}

export function useGeoJsonPoint({ mapIns, cfg }: IUseGeoJsonPoint) {
  const geoJsonPointLayer = shallowRef<ReturnType<typeof DrawGeojsonPoints> | null>(null)
  const addGeoPoint = (cfg: { [p: string]: any }) => addGeoPointFunc(mapIns, geoJsonPointLayer, cfg)
  const addGeoPointLayers = (layers: any[]) => addGeoPointLayersFunc(geoJsonPointLayer, layers)
  const removeGeoPointLayers = (layers: string[]) =>
    removeGeoPointLayersFunc(geoJsonPointLayer, layers)
  const removeGeoPoint = () => removeGeoPointFunc(mapIns, geoJsonPointLayer)
  onMounted(() => {
    if (cfg?.enable) {
      addGeoPoint(cfg.option)
    }
  })
  onBeforeUnmount(() => {
    removeGeoPoint()
  })
  return {
    addGeoPoint,
    addGeoPointLayers,
    removeGeoPointLayers,
    removeGeoPoint,
    geoJsonPointLayer,
  }
}
function addGeoPointFunc(
  mapIns: ShallowRef<L.Map | null>,
  geoJsonPointIns: ShallowRef<ReturnType<typeof DrawGeojsonPoints> | null>,
  cfg: { [p: string]: any }
) {
  if (!mapIns.value) return
  geoJsonPointIns.value = new DrawGeojsonPoints({
    ...cfg,
  }).addTo(mapIns.value!)
}
function addGeoPointLayersFunc(
  geoJsonPointIns: ShallowRef<ReturnType<typeof DrawGeojsonPoints> | null>,
  layers: any[]
) {
  if (geoJsonPointIns.value?.addData) {
    layers.forEach((layer) => {
      geoJsonPointIns.value.addData(layer)
    })
  }
}
function removeGeoPointLayersFunc(
  geoJsonPointIns: ShallowRef<ReturnType<typeof DrawGeojsonPoints> | null>,
  layers: string[]
) {
  if (geoJsonPointIns.value?.removeData) {
    layers.forEach((layerName) => {
      geoJsonPointIns.value.removeData(layerName)
    })
  }
}
function removeGeoPointFunc(
  mapIns: ShallowRef<L.Map | null>,
  geoJsonPointIns: ShallowRef<ReturnType<typeof DrawGeojsonPoints> | null>
) {
  if (!mapIns.value) return
  if (!geoJsonPointIns.value) return
  mapIns.value.removeLayer(geoJsonPointIns.value)
  geoJsonPointIns.value = null
}
