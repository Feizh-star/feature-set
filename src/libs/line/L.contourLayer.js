import geojsonvt from 'geojson-vt'
import * as L from 'leaflet'
L.TileLayer.Contour = L.TileLayer.extend({
  initialize: function (data, option) {
    //地图初始化
    this.data = data
    this.option = option
    this.tileindex = ''
    this.lineWidth =option.lineWidth?option.lineWidth: 2
    this.outLine = null
    this.outLineColor = ''
    this.lineShadow = false
    this.options.pane = option.pane
    this.color = option.color ? option.color : '#3388FF'
    this.drawVal=typeof option.drawVal!=="undefined"?option.drawVal: true
    
  },
  // eslint-disable-next-line
  beforeAdd: function (map) {
    // console.log(map)
    this.tileindex = geojsonvt(this.data, {
      maxZoom: 16, // max zoom to preserve detail on; can't be higher than 24
      tolerance: this.option.tolerance ? this.option.tolerance : 0, // simplification tolerance (higher means simpler)
      extent: 256, // tile extent (both width and height)
      // buffer: 64,   // tile buffer on each side
      debug: 0, // logging level (0 to disable, 1 or 2)
      lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
      // promoteId: null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
      // generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
      indexMaxZoom: 5, // max zoom in the initial tile index
      indexMaxPoints: 100000, // max number of points per tile in the index
    })
  },
  getData: function (x, y, z) {
    try {
      return this.tileindex.getTile(z, x, y).features
    } catch (err) {
      return []
    }
  },
  // getColor(v) {
  // 	var color = "black"
  // 	var aaa = this.color.value
  // 	for (var i = 0; i < aaa.length; i++) {
  // 		if (v <= this.color.value[i]) {
  // 			color = this.color.color[i];
  // 			break
  // 		}
  // 	}
  // 	return color;
  // },
  createTile: function (coords, done) {
    var tile = document.createElement('canvas')
    var size = this.getTileSize()
    tile.width = size.x
    tile.height = size.y
    var ctx = tile.getContext('2d')
    if (this.tileindex == null) {
      return tile
    }
    var features = this.getData(coords.x, coords.y, coords.z)
    // var property = this.options.property;
    var color = this.color

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = this.lineWidth
    var that = this
    var drawJson = this.drawJson
    setTimeout(()=>{
      drawJson.call(that, features, ctx,that.drawVal)
      done(null, tile)
    }, 0)
    return tile
  },
  drawJson: function (features, ctx,drawVal) {
    if (features == null) {
      return
    }

    features.forEach(function (e) {
      ctx.beginPath()
      var ol = 0
      var oi = 0
      e.geometry.forEach(function (ev) {
        ev.forEach(function (o, i) {
          ol = o[0]
          oi = o[1]
          if (i == 0) {
            ctx.moveTo(o[0], o[1])
          } else {
            ctx.lineTo(o[0], o[1])
          }
        })
      })

      var keys = Object.keys(e.tags)

      var prop = ''

      for (var i = 0; i < keys.length; i++) {
        if (keys[i] == 'ID') {
          continue
        }
        if (keys[i] == 'area') {
          continue
        }
        prop = e.tags[keys[i]]
      }

      ctx.font = '15px Arial'
      if (drawVal) {
        ctx.fillText(Number(Number(prop).toFixed(1)), ol, oi)
      }
      // ctx.fillText(Number(Number(prop).toFixed(1)), ol, oi)

      ctx.stroke()
    })
  },
})

var contourLayer = function (data, options) {
  return new L.TileLayer.Contour(data, options)
}
export default contourLayer
