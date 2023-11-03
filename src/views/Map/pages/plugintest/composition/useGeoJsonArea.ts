import { shallowRef } from 'vue'
import type * as L from 'leaflet'
import type { ShallowRef } from 'vue'
import { drawGeojsons } from 'hcl_n'

export function useGeoJsonArea({ mapIns }: { mapIns: ShallowRef<L.Map | null> }) {
  const geoJsonAreaLayer = shallowRef<ReturnType<typeof drawGeojsons> | null>(null)
  const addGeoArea = (cfg: { [p: string]: any }) => addGeoAreaFunc(mapIns, geoJsonAreaLayer, cfg)
  const removeGeoArea = () => removeGeoAreaFunc(mapIns, geoJsonAreaLayer)
  onBeforeUnmount(() => {
    removeGeoArea()
  })
  return {
    addGeoArea,
    removeGeoArea,
    geoJsonAreaLayer
  }
}
function addGeoAreaFunc(mapIns: ShallowRef<L.Map | null>, geoJsonAreaIns: ShallowRef<ReturnType<typeof drawGeojsons> | null>, cfg: { [p: string]: any }) {
  if (!mapIns.value) return
  geoJsonAreaIns.value = new drawGeojsons({
    ...cfg
  }).addTo(mapIns.value!)
}
function removeGeoAreaFunc(mapIns: ShallowRef<L.Map | null>, geoJsonAreaIns: ShallowRef<ReturnType<typeof drawGeojsons> | null>) {
  if (!mapIns.value) return
  if (!geoJsonAreaIns.value) return
  mapIns.value.removeLayer(geoJsonAreaIns.value)
  geoJsonAreaIns.value = null
}