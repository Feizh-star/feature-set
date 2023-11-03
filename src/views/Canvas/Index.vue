<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import './utils/handle-data'

onMounted(() => {
  setCanvasSize()
})
onBeforeUnmount(() => {
  removeCanvasObserver()
})

let observerObj: any = null
function setCanvasSize() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return
  observerObj = useResizeObserver(canvas, (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    canvas.width = width
    canvas.height = height
    refresh()
  })
}
function removeCanvasObserver() {
  if (!observerObj) return
  observerObj.stop()
}

interface IPointStyle {
  fillColor: string
}
interface IPointInitOption {
  x: number
  y: number
  dx: number
  dy: number
  r: number
  ctx: CanvasRenderingContext2D
  style?: IPointStyle
}
const defaultPointStyle = () => ({
  fillColor: '#ffffff'
})
class Point {
  x: number
  y: number
  dx: number
  dy: number
  r: number
  ctx: CanvasRenderingContext2D
  style: IPointStyle
  alive: number
  constructor({x, y, dx, dy, r, ctx, style }: IPointInitOption) {
    if (!ctx) throw new Error('context is necessary')
    this.ctx = ctx
    this.x = x || ctx.canvas.width / 2
    this.y = y || ctx.canvas.height / 2
    this.dx = dx || 5
    this.dy = dy || 5
    this.r = r || 10
    this.style = { ...defaultPointStyle(), ...(style || {}) }
    this.alive = Math.floor(Math.random() * 50 + 30)
  }
  updatePoint(x: number, y: number, r?: number) {
    if (r) this.r = r
    this.x = x
    this.y = y
  }
  runStep(dx: number, dy: number) {
    this.dx = dx
    this.dy = dy
    this.updatePoint(this.x + dx, this.y + dy)
    this.alive--
  }
}
const rafId = ref<any>(null)
const pointsList = new Set<Point>()
const pointUV = new Map<string, { u: number; v: number }>()
function addPoint(ctx: CanvasRenderingContext2D, ctxWidth: number, ctxHeight: number) {
  const startX = Math.floor(Math.random() * ctxWidth)
  const startY = Math.floor(Math.random() * ctxHeight)
  let startDX = Math.floor((Math.random() * 2 + 0.05) * 100) / 100
  let startDY = Math.floor((Math.random() * 2 + 0.05) * 100) / 100
  startDX = Math.random() > 0.5 ? startDX : -startDX
  startDY = Math.random() > 0.5 ? startDY : -startDY
  const point = new Point({
    x: startX,
    y: startY,
    dx: startDX,
    dy: startDY,
    r: 2,
    ctx: ctx,
  })
  pointsList.add(point)
}
function drawPoints(ctx: CanvasRenderingContext2D, points: Set<Point>) {
  if (points.size === 0) return
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, 0, width, height);
  ctx.restore()

  ctx.save()
  ctx.fillStyle = [...points][0].style.fillColor
  ctx.beginPath()
  for (const point of points) {
    const uv = pointUV.get(`[${Math.round(point.x)},${Math.round(point.y)}]`)
    if (uv) {
      point.runStep(uv.u, uv.v)
      const { x, y, r } = point
      ctx.moveTo(x, y - r)
      ctx.arc(x, y, r, 0, Math.PI * 2)
    }
    if (point.alive < 0 || point.x > width || point.x < 0 || point.y > height || point.y < 0) {
      points.delete(point)
      addPoint(ctx, width, height)
    }
  }
  ctx.fill()
  ctx.restore() 
}
function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  genUV(canvas.width, canvas.height)
  for (let i = 0; i < 3000; i++) {
    addPoint(context, canvas.width, canvas.height)
  }
  drawPoints(context, pointsList)
  running(context)
}
function running(ctx: CanvasRenderingContext2D) {
  drawPoints(ctx, pointsList)
  rafId.value = requestAnimationFrame(() => {
    running(ctx)
  })
}
function stop() {
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}
function genUV(width: number, height: number) {
  width = Math.round(width)
  height = Math.round(height)
  for (let i = -20; i < width + 20; i++) {
    for (let j = -20; j < height + 20; j++) {
      pointUV.set(`[${i},${j}]`, {
        u: Math.floor((Math.random() * 0.1 + 0.05) * 100) / 100,
        v: Math.floor((Math.random() * 3 + 0.05) * 100) / 100
      })
    }
  }
}
function clear() {
  stop()
  pointsList.clear()
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.clearRect(0, 0, canvas.width, canvas.height)
}
function runCtrl() {
  if (rafId.value) {
    stop()
  } else {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    if (!canvas) return
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    running(context)
  }
}
function refresh() {
  clear()
  init()
}
onMounted(() => {
  init()
})
</script>

<template>
  <div class="canvas-api-test">
    <div class="control-tool">
      <el-button @click="runCtrl">{{ !!rafId ? '暂停' : '开始' }}</el-button>
    </div>
    <div class="paint-area">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas-api-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .control-tool {

  }
  .paint-area {
    flex: 1;
    min-height: 0;
    background-image: radial-gradient(#aaa, #333);
    > canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>