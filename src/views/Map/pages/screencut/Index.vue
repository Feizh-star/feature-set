<script setup lang="ts">
import { LMap } from './composition/map'
import { drawStains, drawLine } from './composition/draw'
import colors from './composition/colors'
import scales from './composition/scales'

import html2canvas from 'html2canvas'
import { download } from '@/utils/tools'

type TGraph = 'stain' | 'line'

const range = {
  latmin: 28.85,
  latmax: 38.85,
  lonmin: 107.85,
  lonmax: 119.1,
}

const mapRef = ref<HTMLDivElement>()
let mapIns: LMap

onMounted(() => {
  mapIns = new LMap(mapRef.value as HTMLDivElement, {
    center: [33.986549, 114.797788],
    zoom: 7,
    preferCanvas: true,
  }, {
    panes: [
      { name: 'stainLayerPane', zIndex: 1001 },
      { name: 'lineLayerPane', zIndex: 1003 },
    ],
    layers: [
      { name: 'stainLayer', pane: 'stainLayerPane' },
      { name: 'lineLayer', pane: 'lineLayerPane' },
    ]
  })
})

const colorsList = Object.keys(colors)
const scalesList = Object.keys(scales)
const colorEleType = ref('pre_1')
const scaleEleType = ref('pre_1')
function loadFile(e: Event) {
  const btnEl = e.target as HTMLElement
  const fileInput = btnEl.getElementsByTagName('input')[0]
  fileInput.click()
}
function getFileData(e: Event, type: TGraph) {
  const fileInput = e.target as HTMLInputElement
  const file = fileInput.files![0]
  switch (type) {
    case 'line':
      handleLine(file)
      break
    case 'stain':
      handleStain(file)
      break
  }
  fileInput.value = ''
}
// {"r":[1,216,216],"g":[167,93,5],"b":[125,5,5],"v":[0.1,7,40]} {"r":50,"g":25,"b":10,"a":1}
function handleStain(file: File) {
  const fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onloadend = function (e) {
    drawStains(e.target?.result || '', mapIns, { 
      ...range, 
      elementColor: colorEleType.value, 
      elementScale: scaleEleType.value,
      // color: {"r":[1,216,216],"g":[167,93,5],"b":[125,5,5],"v":[0.1,7,40]},
      // scale: {"r":50,"g":25,"b":10,"a":1}
    })
  }
}
async function handleLine(file: File) {
  const ab = await file.arrayBuffer()
  drawLine(ab, mapIns)
}
function clearDraw() {
  const lineLayer = mapIns.getLayersByName('lineLayer')
  const stainLayer = mapIns.getLayersByName('stainLayer')
  if (lineLayer) lineLayer.clearLayers()
  if (stainLayer) stainLayer.clearLayers()
}

const rightBottomEl = ref()
const leftTopEl = ref()
function curAreaImageByElements(lt: HTMLElement, rb: HTMLElement, filename?: string) {
  filename = filename || 'image'
  const body = document.body
  const ltLayoutInfo = lt.getBoundingClientRect()
  const rbLayoutInfo = rb.getBoundingClientRect()
  const top = ltLayoutInfo.top
  const left = ltLayoutInfo.left
  const bottom = rbLayoutInfo.top + rbLayoutInfo.height
  const right = rbLayoutInfo.left + rbLayoutInfo.width
  const areaWidth = right - left
  const areaHeight = bottom - top
  html2canvas(body, { useCORS: true, }).then(mcanvas => {
    const mctx = mcanvas.getContext('2d', { preserveDrawingBuffer: true }) as CanvasRenderingContext2D
    const imgData = mctx.getImageData(left, top, areaWidth, areaHeight)
    mcanvas.width = areaWidth
    mcanvas.height = areaHeight
    mctx.putImageData(imgData, 0, 0)
    // 将canvas转换为图像URL
    const imgURL = mcanvas.toDataURL("image/png");
    download(filename as string, imgURL);
  });
}
// function cutCanvasTemp() {
    // const cutCanvas = document.createElement('canvas')
    // cutCanvas.width = areaWidth
    // cutCanvas.height = areaHeight
    // const cctx = cutCanvas.getContext('2d', { preserveDrawingBuffer: true }) as CanvasRenderingContext2D
    // cctx.drawImage(mcanvas, left, top, areaWidth, areaHeight, 0, 0, areaWidth, areaHeight)
    // const imgURL = cutCanvas.toDataURL("image/png");
    // download(filename as string, imgURL);
// }
function exportImage() {
  curAreaImageByElements(leftTopEl.value, rightBottomEl.value)
}
</script>

<template>
  <div class="stain-test">
    <section class="z-btns">
      <el-form inline>
        <el-form-item label="要素color">
          <el-select v-model="colorEleType">
            <el-option
              v-for="(ele, index) in colorsList"
              :key="index"
              :value="ele"
              :label="ele"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="要素scale">
          <el-select v-model="scaleEleType">
            <el-option
              v-for="(ele, index) in scalesList"
              :key="index"
              :value="ele"
              :label="ele"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadFile">
            <input type="file" name="选择表格" style="display: none;" @click.stop @change="e => getFileData(e, 'stain')">
            色斑图
          </el-button>
          <el-button @click="loadFile">
            <input type="file" name="选择表格" style="display: none;" @click.stop @change="e => getFileData(e, 'line')">
            等值线
          </el-button>
          <el-button @click="clearDraw">清除</el-button>
          <el-button @click="exportImage">导出</el-button>
        </el-form-item>
      </el-form>
    </section>
    <div class="map-container" ref="mapRef"></div>
    <div class="legend-img" ref="rightBottomEl">
      <img src="/legends/pre_1.png" class="legend-imgel" alt="">
    </div>
    <div class="map-title" ref="leftTopEl">
      <span>河南</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stain-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  .map-container {
    flex: 1;
    min-height: 0;
  }
  .z-btns {
    padding: 8px 8px 0;
  }
  .legend-img {
    z-index: 9999;
    position: absolute;
    bottom: 20px;
    right: 20px;
    > img {
      width: 400px;
    }
  }
  .map-title {
    z-index: 9999;
    position: absolute;
    top: 80px;
    left: 20px;
  }
}
</style>