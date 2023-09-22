import * as L from 'leaflet'
const TestPlugin = L.Layer.extend({
	// 初始化函数
	initialize: function(color: string, points: [number, number][]) {
		this.color = color;
    this.points = points;
		// 图层容器，其实就是一个一个的div，通过appendChild可以添加我们创建的canvas
		this.pane = "overlayPane"
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
			this._map.getPanes()[this.pane].removeChild(this._canvas)
		} catch (e) {
			console.log(111)
		}
	},
	createCanvas() {
		try {
			//如果存在旧的canvas，就删除旧的canvas
			this._map.getPanes()[this.pane].removeChild(this.canvas)
		} catch (e) {
			console.log(111)
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
    const screenPoints = this.points.map((p: [number, number]) => {
      const convert = this._map.latLngToContainerPoint([p[1], p[0]])
      return [convert.x, convert.y]
    })
		const ctx = this.canvas.getContext("2d");
		ctx.fillStyle = this.color;
    ctx.beginPath()
    for (let i = 0; i < screenPoints.length; i++) {
      ctx[i === 0 ? 'moveTo' : 'lineTo'](...screenPoints[i])
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
		L.DomUtil.setTransform(this._canvas, offset, scale)
	},
	moveEvent: function() {
		this.createCanvas()
		this.draw()
	}
})

export default TestPlugin