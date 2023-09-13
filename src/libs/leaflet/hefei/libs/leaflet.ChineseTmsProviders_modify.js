// this L.CRS.Baidu from https://github.com/muyao1987/leaflet-tileLayer-baidugaode/blob/master/src/tileLayer.baidu.js

if (L.Proj) {
  L.CRS.Baidu = new L.Proj.CRS(
    'EPSG:900913',
    '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
    {
      resolutions: (function () {
        level = 19
        var res = []
        res[0] = Math.pow(2, 18)
        for (var i = 1; i < level; i++) {
          res[i] = Math.pow(2, 18 - i)
        }
        return res
      })(),
      origin: [0, 0],
      bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244]),
    }
  )
}

L.TileLayer.ChinaProvider = L.TileLayer.extend({
  initialize: function (type, options) {
    // (type, Object)
    var providers = L.TileLayer.ChinaProvider.providers

    options = options || {}

    var parts = type.split('.')

    var providerName = parts[0]
    var mapName = parts[1]
    var mapType = parts[2]

    var url = providers[providerName][mapName][mapType]
    options.subdomains = providers[providerName].Subdomains
    options.key = options.key || providers[providerName].key

    if ('tms' in providers[providerName]) {
      options.tms = providers[providerName]['tms']
    }

    L.TileLayer.prototype.initialize.call(this, url, options)
  },
})

L.TileLayer.ChinaProvider.providers = {
  TianDiTu: {
    Normal: {
      Map: 'http://t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}', // 1-18
      Annotion: 'http://t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}',
    },
    Satellite: {
      Map: 'http://t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}', // 1-18 18层清晰
      Annotion: 'http://t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}',
    },
    Terrain: {
      Map: 'http://t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}', // 1-14
      Annotion: 'http://t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}',
    },
    Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    key: '86ef599e4ffe34440fc7f67a015e0621', // 王磊的 0ef2027d65facc59a8c0ddb371c44a49
  },

  GaoDe: {
    Normal: {
      Map: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', //3-18
    },
    Satellite: {
      Map: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', // 1-16
      Annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
    },
    Subdomains: ['1', '2', '3', '4'],
  },

  Google: {
    Normal: {
      Map: 'https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=UvHEkAooZPEI87pkyXBm', //1-18 18层清晰
      // Map:'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
    },
    Satellite: {
      Map: 'https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=UvHEkAooZPEI87pkyXBm', //1-18 18层清晰 地图和标注一起
      //Map:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      // Annotion: 'http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}',
    },
    Subdomains: [],
  },

  Geoq: {
    Normal: {
      Map: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      PurplishBlue: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      Gray: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
      Warm: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}',
    },
    Theme: {
      Hydro: 'http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}',
    },
    Subdomains: [],
  },

  OSM: {
    Normal: {
      Map: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    },
    Subdomains: ['a', 'b', 'c'],
  },

  Baidu: {
    Normal: {
      Map: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
    },
    Satellite: {
      Map: 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
      Annotion: 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020',
    },
    Subdomains: '0123456789',
    tms: true,
  },
}

L.tileLayer.chinaProvider = function (type, options) {
  return new L.TileLayer.ChinaProvider(type, options)
}

// 如果用于export import，结尾要这么写
// let chinaProvider = (type, options) => {
//   return new L.TileLayer.ChinaProvider(type, options)
// }
//  export default chinaProvider
