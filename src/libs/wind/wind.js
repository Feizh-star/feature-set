import L from 'leaflet'
let windyLayer = L.Layer.extend({
  initialize: function (option) {
    Object.assign(this, option)
    this.ready = false
    this.zIndex = option.zIndex || 500
    this.maxAlpha = this.galpha
    this.data = []
    this.columns = []
    this.particles = []
  },
  onAdd(map) {
    this._map = map
    this.createElement()
    this.createParticles()
    this.buildData()
  },
  getEvents: function () {
    var events = {
      moveend: this.moveEndEvent,
      zoomanim: this.zoomanimEvent,
      resize: this.resizeEvent,
    }
    return events
  },
  zoomanimEvent() {
    const bounds = this._map.getBounds()
    var map = this._map
    var center = map._animateToCenter
    var zoom = map._animateToZoom
    var scale = map.getZoomScale(zoom)
    let offset = this._map._latLngBoundsToNewLayerBounds(bounds, zoom, center).min
    L.DomUtil.setTransform(this.canvas, offset, scale)
  },
  moveEndEvent() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.galpha = 0
    cancelAnimationFrame(this.play)
    let new_position = this._map._getMapPanelPos().multiplyBy(-1)
    L.DomUtil.setPosition(this.canvas, new_position)
    this.createParticles()
    this.buildColumns()
    this.run()
    this.addAlpha()
  },
  resizeEvent() {
    const size = this._map.getSize()
    this.canvas.width = size.x
    this.canvas.height = size.y
    this.ctx.fillStyle = this.fadeStyle
    this.ctx.strokeStyle = this.strokeColor
    this.ctx.lineWidth = 3
  },
  createElement() {
    let canvas = L.DomUtil.create('canvas', 'leaflet-layer')
    var animated = this._map.options.zoomAnimation && L.Browser.any3d
    L.DomUtil.addClass(
      canvas,
      'leaflet-zoom-' + (animated ? 'animated' : 'hide')
    )
    let size = this._map.getSize()
    canvas.width = size.x
    canvas.height = size.y
    canvas.style.position = 'absolute'
    canvas.style.left = 0
    canvas.style.zIndex = this.zIndex
    this._map._container.children[0].appendChild(canvas)
    this.ctx = canvas.getContext('2d')
    this.ctx.fillStyle = this.fadeStyle
    this.ctx.strokeStyle = this.strokeColor
    this.ctx.lineWidth = 3
    this.canvas = canvas
  }
})