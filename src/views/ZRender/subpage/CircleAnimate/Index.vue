<script setup lang='ts'>
import * as zrender from 'zrender'
import type { ZRender } from '@/types/zrender'
import { useCircleAnimate } from './hooks/circle-animate'
import type { IZIns, TzInstance } from './hooks/circle-animate'

const z1Ref = ref<HTMLDivElement>()
const zInstance = reactive<IZIns>({
  zr: {} as ZRender,
})
function initZIns(zIns: TzInstance, el: HTMLDivElement) {
  zIns.zr = zrender.init(el)
}
onMounted(() => {
  initZIns(zInstance, z1Ref.value as HTMLDivElement)
})

/**
 * 画圆，并添加动画
 */
const {
  startAnimate,
  stopAnimate,
} = useCircleAnimate({ zInstance })

</script>

<template>
  <div class="zrender-guide">
    <section>
      <el-button type="primary" @click="startAnimate">开始动画</el-button>
      <el-button type="primary" @click="stopAnimate">结束动画</el-button>
    </section>
    <div class="z-1" ref="z1Ref"></div>
  </div>
</template>

<style lang='scss' scoped>
.zrender-guide {
  .z-1 {
    width: 600px;
    height: 400px;
    border: 1px solid #cccccc;
  }
}
</style>