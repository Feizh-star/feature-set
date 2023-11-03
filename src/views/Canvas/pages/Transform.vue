<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvasRef = ref()
onMounted(() => {
  setSize(canvasRef.value)
  // transformTest(canvasRef.value)
  testGlobalCompositeOperation(canvasRef.value)
})

function setSize(canvas: HTMLCanvasElement, width = 500, height = 400) {
  canvas.width = width
  canvas.height = height
}

function transformTest(canvas: HTMLCanvasElement) {
  const r = 100
  const Pi = Math.PI
  const width = canvas.width
  const height = canvas.height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '24px sans-serif'

  ctx.translate(width / 2 + Math.cos(Pi / 2) * r, height / 2 + Math.sin(Pi / 2) * r)
  // ctx.rotate(Math.PI / 2)

  ctx.fillText('E', 0, 0)
  ctx.restore()
}
function testGlobalCompositeOperation(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const width = canvas.width
  const height = canvas.height
  const gradient = ctx.createRadialGradient(0, 0, 20, 0, 0, 70)
  gradient.addColorStop(0, '#fff')
  gradient.addColorStop(0.6, '#ffffff00')
  gradient.addColorStop(1, '#ffffff00')
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, 50, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  for (let i = 1; i <= 10; i++) {
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(0, 0, width, height);
    ctx.restore()

    ctx.save()
    ctx.translate(width / 2 - 10 * i, height / 2 + 10 * i)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}
</script>

<template>
  <div class="canvas-transform">
    <div class="canvas-container">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas-transform {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 8px;
  .canvas-container {
    display: inline-block;
    border: 1px solid #cccccc;
    // background-image: radial-gradient(#aaa, #333);
    background-color: orange;
  }
}
</style>