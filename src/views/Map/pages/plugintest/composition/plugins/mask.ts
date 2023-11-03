import * as L from 'leaflet'
import * as turf from '@turf/turf'

const MapMask = L.Layer.extend({
	// 初始化函数
	initialize: function({color, geojson, pane}: {color: string, geojson: GeoJSON.FeatureCollection, pane: string}) {
		this.color = color;
    this.polygonArray = genMaskPolygonByGeoJSON(geojson);
		// 图层容器，其实就是一个一个的div，通过appendChild可以添加我们创建的canvas
		this.pane = pane
	},
	onAdd(map: L.Map) {
		// 图层添加到地图的时候，触发的操作
		this._map = map;
		this.createCanvas()
		this.draw();
		// 添加地图移动和缩放事件
		this._map.on("moveend", this.moveEvent, this)
		this._map.on("zoomanim", this.zoomEvent, this)
	},
	onRemove() {
		try {
			//删除旧的canvas
			this._map.getPanes()[this.pane].removeChild(this.canvas)
		} catch (e) {
			console.log('no old canvas')
		}
	},
	createCanvas() {
		try {
			//如果存在旧的canvas，就删除旧的canvas
			this._map.getPanes()[this.pane].removeChild(this.canvas)
		} catch (e) {
			console.log('no old canvas')
		}
		// 通过leaflet自带方法创建canvas，统计增加leaflet-layer的class
		const canvas = L.DomUtil.create('canvas', 'leaflet-layer');
		this.canvas = canvas
		const size = this._map.getSize()
		canvas.width = size.x;
		canvas.height = size.y;
		// 获取屏幕左上角的位置，并把canvas放到该位置
		const mbounds = this._map.getBounds()
		const new_position = this._map.latLngToLayerPoint([mbounds._northEast.lat, mbounds._southWest.lng])
		L.DomUtil.setPosition(this.canvas, new_position)
		// 把创建的canvas添加到地图中
		this._map._panes[this.pane].appendChild(this.canvas)
		// 添加动画，可以让图层跟随地图移动
		const animated = this._map.options.zoomAnimation && L.Browser.any3d
		L.DomUtil.addClass(this.canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'))
	},
	draw() {
		// 自定义的绘图函数
		const ctx = this.canvas.getContext("2d");
		ctx.fillStyle = this.color;
    ctx.beginPath()
		for (const polygon of this.polygonArray) {
			for (const [index, point] of polygon.entries()) {
				const convert = this._map.latLngToContainerPoint([point[0], point[1]])
				ctx[index === 0 ? 'moveTo' : 'lineTo'](convert.x, convert.y)
			}
		}
    ctx.closePath()
    ctx.fill()
	},
	zoomEvent: function() {
		//这个主要是为了地图缩放的时候，画布能跟着进行同步缩放，
		// 固定函数，直接抄过去就行
		const map = this._map
		const center = map._animateToCenter
		const zoom = map._animateToZoom
		const scale = map.getZoomScale(zoom)
		const offset = L.Layer ?
			map._latLngToNewLayerPoint(map.getBounds().getNorthWest(), zoom, center) :
			map
			.getCenterOffset(center)
			.multiplyBy(-scale)
			.subtract(map.getMapPanePos())
		L.DomUtil.setTransform(this.canvas, offset, scale)
	},
	moveEvent: function() {
		this.createCanvas()
		this.draw()
	}
})

function genMaskPolygonByGeoJSON(geoData: GeoJSON.FeatureCollection) {
  const geoDataTemp = turf.clone(geoData as unknown as turf.AllGeoJSON)
  const bgPolygon = [
    [[90, -180],[90, 180],[-90, 180],[-90, -180],[90, -180]], // outer ring
  ]
  const outerRingDirection = turf.booleanClockwise(turf.lineString(bgPolygon[0])) // 外部轮廓方向
  turf.flattenEach(geoDataTemp, function (currentFeature) {
    const polygonArray = currentFeature.geometry.coordinates[0]
    polygonArray.forEach((item: any) => item.reverse())
    const innerRingDirection = turf.booleanClockwise(turf.lineString(polygonArray))
    if (innerRingDirection === outerRingDirection) {
      polygonArray.reverse()
    }
    bgPolygon.push(polygonArray)
  })
  return bgPolygon
}

export default MapMask as new ({color, geojson, pane}: {color: string, geojson: GeoJSON.FeatureCollection, pane: string}) => L.Layer