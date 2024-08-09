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
    let new_position = this._map._getMapPanePos().multiplyBy(-1)
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
  },
  buildData(re) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = function () {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const imgdata = ctx.getImageData(0, 0, img.width, img.height)
      const global = this.global
      const data = new Array(img.height - 1)
      const uadd = imgdata.data[0]
      const uscale = imgdata.data[1]
      const vadd = imgdata.data[4]
      const vscale = imgdata.data[5]
      for (let i = 0; i < img.height - 1; i++) {
        data[i] = new Array(img.width)
        for (let j = 0; j < img.width; j++) {
          const num = ((i + 1) * img.width + j) * 4
          const uv = [imgdata.data[num] / uscale - uadd, imgdata.data[num + 1] / vscale - vadd]
          data[i][j] = uv
        }
        if (global) {
          data[i].push(data[i][0])
        }
      }
      this.data = data
      this.buildColumns()
      this.ready = true
      this.run()
      if (re) {
        this.addAlpha()
      }
    }.bind(this)
    img.src = this.url
  },
  buildColumns() {
    const map = this._map
    const size = map.getSize()
    const zoom = map.getZoom()
    const latmin = this.latmin
    const lonmin = this.lonmin
    const latmax = this.latmax
    const lonmax = this.lonmax
    const data = this.data
    const columns = new Array(size.y)
    const vscale = this.vscale
    const oripx = this._map.getPixelBounds()
    const orix = oripx.min.x
    const oriy = oripx.min.y
    const interval = this.interval
    const scale = 256.0 * Math.pow(2.0, zoom)
    const pi2 = 2 * Math.PI
    const mypi2 = 360 / Math.PI
    for (let i = 0; i < size.y; i += 2) {
      const column = new Array(size.x)
      for (let j = 0; j < size.x; j += 2) {
        const px = orix + j
        const py = oriy + i
        const mx = (px / scale - 0.5) * 360
        const my = -(py / scale - 0.5) * pi2
        let lat = Math.atan(Math.exp(my)) * mypi2 - 90
        let lon = mx % 360
        lon = lon >= 0 ? lon : lon + 360
        if (lat < latmin || lat > latmax || lon < lonmin || lon > lonmax) {
          column[j] = column[j + 1] = [0, 0, 0]
          continue
        }
        const dj = (lon - lonmin) / interval
        const di = (lat - latmin) / interval
        const fi = Math.floor(di)
        const fj = Math.floor(dj)
        const g1 = data[fi][fj]
        const g2 = data[fi][fj + 1]
        const g3 = data[fi + 1][fj]
        const g4 = data[fi + 1][fj + 1]
        const x = dj - fj
        const y = di - fi
        const v1 = (1 - x) * (1 - y)
        const v2 = x * (1 - y)
        const v3 = y * (1 - x)
        const v4 = x * y
        const u = (g1[0] * v1 + g2[0] * v2 + g3[0] * v3 + g4[0] * v4) * vscale
        const v = (g1[1] * v1 + g2[1] * v2 + g3[1] * v3 + g4[1] * v4) * vscale
        column[j] = column[j + 1] = [u, v, Math.sqrt(u * u + v + v)]
      }
      columns[i] = columns[i + 1] = column
    }
    this.columns = columns
  },
  createParticles() {
    const size = this._map.getSize()
    const particlesNum = Math.floor(size.x * size.y * this.density * this.density)
    const particles = new Array(particlesNum)
    const maxAge = this.maxAge
    for (let i = 0; i < particlesNum; i++) {
      const x = Math.round(Math.random() * size.x)
      const y = Math.round(Math.random() * size.y)
      const age = Math.round(Math.random() * maxAge)
      particles[i] = {
        x, y, age, xt: x, yt: y
      }
    }
    this.particles = particles
  },
  draw() {
    const size = this._map.getSize()
    const maxAge = this.maxAge
    var g = this.ctx
    g.globalCompositionOperation = 'destination-in'
    g.fillRect(0, 0, size.x, size.y)
    g.globalCompositionOperation = 'lighter'
    g.globalAlpha = this.galpha
    g.beginPath()
    const particles = Array.from(this.particles)
    const columns = this.columns
    for (let i = 0; i < particles.length; i++) {
      const e = particles[i]
      if (e.age > maxAge) {
        e.age = 0
        const x = Math.round(Math.random() * size.x)
        const y = Math.round(Math.random() * size.y)
        e.x = e.xt = x
        e.y = e.yt = y
      }
      const xr = Math.round(e.x)
      const yr = Math.round(e.y)
      let v = columns[yr]
      if (!v) {
        e.age = maxAge + 1
        continue
      }
      v = v[xr]
      if (!v || !v[2]) {
        e.age = maxAge + 1
        continue
      }
      e.x = e.xt
      e.y = e.yt
      e.xt = e.x + v[0]
      e.yt = e.y + v[1]
      g.moveTo(e.x, e.y)
      g.lineTo(e.xt, e.yt)
      e.age = e.age + 1
    }
    g.stroke()
  },
  addAlpha() {
    this.galpha += 0.017
    if (this.galpha > this.maxAlpha) {
      this.galpha = this.maxAlpha
    } else {
      window.requestAnimationFrame(this.addAlpha.bind(this))
    }
  },
  run() {
    this.draw()
    this.play = window.requestAnimationFrame(this.run.bind(this))
  },
  changeData(url) {
    cancelAnimationFrame(this.play)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.galpha = 0
    this.url = url
    this.ready = false
    this.createParticles()
    this.buildData(true)
  },
  onRemove() {
    cancelAnimationFrame(this.play)
    this._map._container.children[0].removeChild(this.canvas)
    this.data = null
    this.columns = null
    this.particles = null
  }
})

export default windyLayer