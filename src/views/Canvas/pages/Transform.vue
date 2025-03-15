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
  const size = 20
  const startX = width - 2 * size
  const startY = height - 2 * size
  
  ctx.globalAlpha = 0.9

  for (let i = 1; i < 31; i++) {
    debugger
    // 保留旧图形与新图形重叠的部分，其余透明。保留的部分，会应用globalAlpha和fillStyle的透明度
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillRect(0, 0, width, height)

    debugger
    // ctx.globalCompositeOperation = 'lighter' // 新图形和旧图形叠加时，会把新旧图形颜色值相加
    ctx.globalCompositeOperation = 'source-over' // 新图形覆盖旧图形
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(startX - 10 * i, startY - 10 * i, size, size)
    
    // 保留旧图形与新图形重叠的部分，其余透明。保留的部分，会应用globalAlpha和fillStyle的透明度
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
  }
  // // 保留旧图形与新图形重叠的部分，其余透明。保留的部分，会应用globalAlpha和fillStyle的透明度
  // ctx.globalCompositeOperation = 'destination-in'
  // ctx.fillStyle = 'rgba(0, 0, 0, 1)'
  // ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
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
    background-image: radial-gradient(#aaa, #333);
    // background-color: #cccccc;
  }
}
</style>