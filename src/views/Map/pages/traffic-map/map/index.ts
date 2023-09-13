import { MMap } from '@/libs/leaflet/hefei/libs/map'
import type { ITileInfo, IPaneInfo, ILayerInfo } from '@/libs/leaflet/hefei/libs/map'

const geoserverUrl = 'http://221.122.67.145:8323'

const tilesCfg: Array<ITileInfo> = [
  { path: geoserverUrl + '/geoserver/chinaMap/wms', layers: 'chinaMap:chinaMap' },
  // { path: geoserverUrl + '/geoserver/chinaMap/wms', layers: 'chinaMap:chinaMap_zhengzhou' }
]

export function addMap(
  el: HTMLElement,
  mapCfg: L.MapOptions = {},
  panesCfg: Array<IPaneInfo> = [],
  layersCfg: Array<ILayerInfo> = []
) {
  return new MMap(el, mapCfg, {
    tiles: tilesCfg,
    panes: panesCfg,
    layers: layersCfg,
    mask: {
      enable: true,
      zIndex: 996,
      shadowBorders: {
        borderShapes: [
          {
            enable: true,
            offsetX: 3,
            offsetY: 3,
            z: 30,
            style: {
              stroke: '#2959b699',
              fill: 'transparent',
              lineWidth: 4,
              shadowBlur: 0,
            },
          },
          {
            enable: true,
            offsetX: 6,
            offsetY: 6,
            z: 20,
            style: {
              stroke: '#2959b644',
              fill: 'transparent',
              lineWidth: 4,
            },
          },
          {
            enable: false,
          },
        ],
      },
    },
  })
}