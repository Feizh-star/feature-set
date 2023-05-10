<script setup lang='ts'>
import { ref } from 'vue';
import * as zrender from 'zrender'
import { download } from '@/utils/tools'

import type GeoJSON from 'geojson'
import type { ZRender, ZCircle } from '@/types/zrender'

interface IZIns {
  zr: ZRender
}
type TzInstance = ReturnType<typeof reactive<IZIns>>

function initZIns(zIns: TzInstance, el: HTMLDivElement) {
  zIns.zr = zrender.init(el)
}
onMounted(() => {
  initZIns(zInstance, z1Ref.value as HTMLDivElement)
})

const z1Ref = ref<HTMLDivElement>()
const zInstance = reactive<IZIns>({
  zr: {} as ZRender,
})

function clickEvent() {
  const polygon = new zrender.Polygon({
    shape: {
      points: [
        [10, 10],
        [10, 30],
        [30, 30],
        [30, 10],
        [10, 10],
      ]
    }
  })
  zInstance.zr.add(polygon)
  polygon.on('click', function (e) {
    console.log(e)
  })
}

function loadAdCode(e: Event) {
  const btnEl = e.target as HTMLElement
  const fileInput = btnEl.getElementsByTagName('input')[0]
  fileInput.click()
}
function handleAdCode(e: Event) {
  const fileInput = e.target as HTMLInputElement
  const file = fileInput.files && fileInput.files[0]
  const fr = new FileReader()
  fr.onloadend = function () {
    const content = this.result as string
    const reg = /\d{6}/g
    const matchRes = content.match(reg) as Array<any>
    const set = new Set<string>()
    matchRes.forEach(code => set.add(code))
    const filterRes = [...set]
    fetchByCodes(filterRes)
  }
  fr.readAsText(file as any as Blob)
}

function fetchByCodes(codes: Array<string>) {
  console.log(codes)
  let currentCodeIndex = 0
  async function delayFetch(index: number) {
    try {
      const code = codes[index]
      const geoData = await fetchGeoJson(code)
      download(`${code}.json`, new Blob([geoData]))
    } catch (error) {
      console.log(error)
    }
    index++
    if (index < codes.length) {
      setTimeout(() => {
        delayFetch(index)
      }, 100)
    }
  }

  delayFetch(currentCodeIndex)
}
function fetchGeoJson(adcode: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`)
      .then(res => res.ok ? res.arrayBuffer() : Promise.reject())
      .then(res => resolve(res))
      .catch(error => reject(error))
  })
}
// fetch(`https://geo.datav.aliyun.com/areas_v3/bound/411328_full.json`)
//       .then(res => console.log(res))
</script>

<template>
  <div class="zrender-page">
    <section class="z-btns">
      <el-button @click="clickEvent">按钮</el-button>
      <!-- <el-button @click="loadAdCode">
        <input type="file" name="加载编码" style="display: none;" @click.stop @change="handleAdCode">
        加载编码
      </el-button> -->
    </section>
    <div class="z-container" ref="z1Ref">
      <div ref="resultDiv" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.zrender-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 8px;
  display: flex;
  flex-direction: column;
  .z-container {
    flex: 1;
    min-height: 0;
  }
}
</style>