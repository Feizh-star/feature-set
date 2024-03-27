import { shallowRef } from 'vue'
import type { ShallowRef } from 'vue'
import type * as L from 'leaflet'
import { GeojsonLines } from 'hcl_n'

type TAnyObject = { [p: string]: any }
type TGeojsonLinesLayer = ReturnType<typeof GeojsonLines> | null

export function useGeoJsonLine({ mapIns }: { mapIns: ShallowRef<L.Map | null> }) {
  const geojsonLineLayer = shallowRef<TGeojsonLinesLayer>(null)
  const addGeoJsonLine = (layers: Array<TAnyObject>, cfg?: TAnyObject) =>
    addGeoJsonLineFunc(mapIns, geojsonLineLayer, layers, cfg)
  const removeGeoJsonLine = (layerName: string) =>
    removeGeoJsonLineFunc(geojsonLineLayer, layerName)
  onBeforeUnmount(() => {
    removeGeoJsonLineInstanceFunc(mapIns, geojsonLineLayer)
  })
  return {
    addGeoJsonLine,
    removeGeoJsonLine,
  }
}

/**
 * 添加图层
 * @param layers 图层
 * @param cfg 初始配置
 * @returns
 */
function addGeoJsonLineFunc(
  mapIns: ShallowRef<L.Map | null>,
  geojsonLineLayer: ShallowRef<TGeojsonLinesLayer>,
  layers: Array<TAnyObject>,
  cfg?: TAnyObject
) {
  if (!mapIns.value) return
  if (!geojsonLineLayer.value && cfg) {
    geojsonLineLayer.value = new GeojsonLines({
      ...cfg,
      layers: [...layers],
    }).addTo(mapIns.value)
  }
  if (geojsonLineLayer.value) {
    for (const layer of layers) {
      geojsonLineLayer.value.addData({
        ...layer,
      })
    }
  }
}

function removeGeoJsonLineFunc(
  geojsonLineLayer: ShallowRef<TGeojsonLinesLayer>,
  layerName: string
) {
  if (!geojsonLineLayer.value) return
  geojsonLineLayer.value.removeData(layerName)
}

function removeGeoJsonLineInstanceFunc(
  mapIns: ShallowRef<L.Map | null>,
  geojsonLineLayer: ShallowRef<TGeojsonLinesLayer>
) {
  if (!geojsonLineLayer.value) return
  if (mapIns.value) {
    mapIns.value.removeLayer(geojsonLineLayer.value)
    geojsonLineLayer.value = null
  }
}
