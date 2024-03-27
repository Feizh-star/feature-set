import * as L from 'leaflet'
import type { ShallowRef } from 'vue'

// marker组中的单个marker结构
export interface IMarkerItem {
  geoInfo: {
    lat: number
    lng: number
  }
  event?: (
    type: 'click' | 'mouseover' | 'mousemove' | 'mouseout',
    e: L.LeafletMouseEvent,
    info: IMarkerItem,
    markerInfoMap: Map<L.Marker, IMarkerItem>
  ) => void
  options?: L.MarkerOptions
  [p: string]: any
}
type MarkerMapEvents = 'zoomanim' | 'zoom' | 'zoomstart' | 'zoomend'
export interface ICommonMarkerOption {
  mapEvents?: {
    name: MarkerMapEvents
    handler: (e: L.LeafletEvent, markerInfoMap: Map<L.Marker, IMarkerItem>) => void
  }[]
}
interface IMarkerGroup {
  layer: L.LayerGroup
  markerInfoMap: Map<L.Marker, IMarkerItem>
  commonOption: ICommonMarkerOption
  mapEventRecord: { name: MarkerMapEvents; handler: (event: L.LeafletEvent) => void }[]
}

export function useMarkers({ mapIns }: { mapIns: ShallowRef<L.Map | null> }) {
  const markerMap: Map<string, IMarkerGroup> = new Map()
  const addMarkers = (
    name: string,
    markers: IMarkerItem[],
    commonOption: ICommonMarkerOption = {},
    options: L.MarkerOptions = {}
  ) => addMarkersFunc(mapIns, markerMap, name, markers, commonOption, options)
  const removeMarkers = (name: string) => removeMarkersFunc(mapIns, markerMap, name)
  onBeforeUnmount(() => {
    for (const name of markerMap.keys()) {
      removeMarkers(name)
    }
  })
  return {
    addMarkers,
    removeMarkers,
  }
}

/**
 * 添加一组marker
 * @param name 名称，不能重复
 * @param markers IMarkerItem[] marker列表
 * @param options L.MarkerOptions
 * @returns
 */
function addMarkersFunc(
  mapIns: ShallowRef<L.Map | null>,
  markerMap: Map<string, IMarkerGroup>,
  name: string,
  markers: IMarkerItem[],
  commonOption: ICommonMarkerOption = {},
  options: L.MarkerOptions = {}
) {
  if (!mapIns.value) return
  removeMarkersFunc(mapIns, markerMap, name)
  const markerGroup = {
    layer: new L.LayerGroup(),
    markerInfoMap: new Map(),
    commonOption: commonOption,
    mapEventRecord: [],
  }
  markerMap.set(name, markerGroup)
  for (const marker of markers) {
    const moptions = marker.options || options
    const newMarker = L.marker([marker.geoInfo.lat, marker.geoInfo.lng], moptions).addTo(
      markerGroup.layer
    )
    markerGroup.markerInfoMap.set(newMarker, marker)
    newMarker.on('click', (e) =>
      marker.event?.call(newMarker, 'click', e, marker, markerGroup.markerInfoMap)
    )
    newMarker.on('mouseover', (e) =>
      marker.event?.call(newMarker, 'mouseover', e, marker, markerGroup.markerInfoMap)
    )
    newMarker.on('mousemove', (e) =>
      marker.event?.call(newMarker, 'mousemove', e, marker, markerGroup.markerInfoMap)
    )
    newMarker.on('mouseout', (e) =>
      marker.event?.call(newMarker, 'mouseout', e, marker, markerGroup.markerInfoMap)
    )
  }
  markerGroup.layer.addTo(mapIns.value)
  handleMapEventsForMarkersFunc(mapIns, markerMap, name)
}
/**
 * 移除一组marker
 * @param name 名称
 */
function removeMarkersFunc(
  mapIns: ShallowRef<L.Map | null>,
  markerMap: Map<string, IMarkerGroup>,
  name: string
) {
  const markerGroup = markerMap.get(name)
  removeMapEventsForMarkersFunc(mapIns, markerMap, name)
  if (markerGroup?.layer) {
    markerGroup?.layer.clearLayers()
  }
  if (markerGroup?.markerInfoMap) {
    markerGroup.markerInfoMap.clear()
  }
  markerMap.delete(name)
}
/**
 * 为一组marker添加commonOption.mapEvents指定的地图事件
 * @param name string
 * @returns void
 */
function handleMapEventsForMarkersFunc(
  mapIns: ShallowRef<L.Map | null>,
  markerMap: Map<string, IMarkerGroup>,
  name: string
) {
  if (!mapIns.value) return
  const markerGroup = markerMap.get(name)
  if (!markerGroup) return
  const mapEvents = markerGroup.commonOption.mapEvents || []
  for (const mapEventCfg of mapEvents) {
    const eventHandler = (e: L.LeafletEvent) =>
      mapEventCfg.handler.call(mapIns.value, e, markerGroup.markerInfoMap)
    mapIns.value.on(mapEventCfg.name, eventHandler)
    markerGroup.mapEventRecord.push({ name: mapEventCfg.name, handler: eventHandler })
  }
}
/**
 * 移除已经为一组marker添加的commonOption.mapEvents指定的地图事件
 * @param name string
 * @returns void
 */
function removeMapEventsForMarkersFunc(
  mapIns: ShallowRef<L.Map | null>,
  markerMap: Map<string, IMarkerGroup>,
  name: string
) {
  if (!mapIns.value) return
  const markerGroup = markerMap.get(name)
  if (!markerGroup) return
  const mapEventRecords = markerGroup.mapEventRecord || []
  for (const record of mapEventRecords) {
    mapIns.value.off(record.name, record.handler)
  }
  markerGroup.mapEventRecord = []
}
