import { shallowRef } from 'vue'
import type * as L from 'leaflet'
import type { ShallowRef } from 'vue'
import { drawGeojsons } from 'hcl_n'

export interface IUseGeoJsonArea {
  mapIns: ShallowRef<L.Map | null>
  cfg?: { enable: boolean; option: IAnyObject }
}

export function useGeoJsonArea({ mapIns, cfg }: IUseGeoJsonArea) {
  const geoJsonAreaLayer = shallowRef<ReturnType<typeof drawGeojsons> | null>(null)
  const addGeoArea = (cfg: { [p: string]: any }) => addGeoAreaFunc(mapIns, geoJsonAreaLayer, cfg)
  const addGeoAreaLayers = (layers: any[]) => addGeoAreaLayersFunc(geoJsonAreaLayer, layers)
  const removeGeoAreaLayers = (layers: string[]) =>
    removeGeoAreaLayersFunc(geoJsonAreaLayer, layers)
  const removeGeoArea = () => removeGeoAreaFunc(mapIns, geoJsonAreaLayer)
  onMounted(() => {
    if (cfg?.enable) {
      addGeoArea(cfg.option)
    }
  })
  onBeforeUnmount(() => {
    removeGeoArea()
  })
  return {
    addGeoArea,
    addGeoAreaLayers,
    removeGeoAreaLayers,
    removeGeoArea,
    geoJsonAreaLayer,
  }
}
function addGeoAreaFunc(
  mapIns: ShallowRef<L.Map | null>,
  geoJsonAreaIns: ShallowRef<ReturnType<typeof drawGeojsons> | null>,
  cfg: { [p: string]: any }
) {
  if (!mapIns.value) return
  geoJsonAreaIns.value = new drawGeojsons({
    ...cfg,
  }).addTo(mapIns.value!)
}
function addGeoAreaLayersFunc(
  geoJsonAreaIns: ShallowRef<ReturnType<typeof drawGeojsons> | null>,
  layers: any[]
) {
  if (geoJsonAreaIns.value?.addData) {
    layers.forEach((layer) => {
      geoJsonAreaIns.value.addData(layer)
    })
  }
}
function removeGeoAreaLayersFunc(
  geoJsonAreaIns: ShallowRef<ReturnType<typeof drawGeojsons> | null>,
  layers: string[]
) {
  if (geoJsonAreaIns.value?.removeData) {
    layers.forEach((layerName) => {
      geoJsonAreaIns.value.removeData(layerName)
    })
  }
}
function removeGeoAreaFunc(
  mapIns: ShallowRef<L.Map | null>,
  geoJsonAreaIns: ShallowRef<ReturnType<typeof drawGeojsons> | null>
) {
  if (!mapIns.value) return
  if (!geoJsonAreaIns.value) return
  mapIns.value.removeLayer(geoJsonAreaIns.value)
  geoJsonAreaIns.value = null
}
