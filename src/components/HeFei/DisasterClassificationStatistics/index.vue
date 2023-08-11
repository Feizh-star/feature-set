<template>
  <div class="radar-container" ref="rootElRef">
    <div class="title">气象灾害分类统计</div>
    <div class="popup" v-if="target" :style="{ left: `${elementX + 10}px`, top: `${elementY - 64}px` }">
      <div
        class="color"
        :style="{
          backgroundColor: target.color,
        }"
      ></div>
      <div class="label">{{ target.name }}</div>
      <div class="value">数量：{{ target.value }}个</div>
    </div>
    <div ref="refZr" class="panel"></div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, withDefaults } from "vue";
import type { Ref } from "vue";
import { useMouseInElement } from '@vueuse/core'
import { init, Group } from "zrender";
import type { ZRenderType } from "zrender";
import { createRoot, createBackgroud, getDataPosition, createSeries, createLabel } from "./main";

/** 通道定义 */
const props = withDefaults(
  defineProps<{
    max: number;
    datas: {
      name: string;
      value: number;
      color: string;
    }[];
  }>(),
  {
    max: 100,
    datas: () => [],
  }
);

/** 绘制雷达图 */
function draw() {
  root.removeAll();
  const r = root.y - 35;
  root.add(createBackgroud(r));
  const { datas, labels } = getDataPosition(
    props.datas.map(e => e.value),
    props.max,
    r
  );
  root.add(
    createSeries(
      datas,
      props.datas.map(e => e.color),
      i => {
        // clearTimeout(anim);
        target.value = props.datas[i];
      },
      () => {
        // anim = setTimeout(play, 3000);
        target.value = null
      }
    )
  );
  root.add(
    createLabel(
      labels,
      props.datas.map(e => e.name)
    )
  );
}

/** 监听参数变化 */
watch(() => [props.max, props.datas], draw);

const refZr: Ref<HTMLDivElement | null> = ref(null);
let zr: ZRenderType;
let root: Group;
// let anim = 0;

const target: Ref<typeof props.datas[0] | null> = ref(null);

/** 轮播提示框 */
// function play() {
//   const index = props.datas.indexOf(target.value!);
//   target.value = props.datas[(index + 1) % props.datas.length];
//   anim = setTimeout(play, 3000);
// }

function resize() {
  zr.resize();
  zr.clear();
  root = createRoot(refZr.value!.offsetWidth, refZr.value!.offsetHeight);
  draw();
  zr.add(root);
}

onMounted(() => {
  zr = init(refZr.value);
  root = createRoot(refZr.value!.offsetWidth, refZr.value!.offsetHeight);
  draw();
  zr.add(root);
  // play();
  window.addEventListener("resize", resize);
});
onBeforeUnmount(() => {
  zr.dispose();
  window.removeEventListener("resize", resize);
  // clearTimeout(anim);
});

const rootElRef = ref();
const { elementX, elementY } = useMouseInElement(rootElRef)
</script>
<style scoped lang="less">
.radar-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.title {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 18px;
  text-shadow: 0px 0px 10px rgba(78, 180, 255, 0.5);
}
.panel {
  width: 100%;
  height: 280px;
}
.popup {
  position: absolute;
  top: 75px;
  z-index: 1;
  height: 64px;
  width: 98px;
  // background-image: url("./assets/tooltip-bg.svg");
  // background-size: cover;
  border: 1px solid #386ea0;
  background-color: #0A1A34CE;
  color: #ffffff;
  .color {
    position: absolute;
    height: 6px;
    width: 6px;
    left: 12.25px;
    top: 16px;
  }
  .label {
    position: absolute;
    font-size: 14px;
    left: 26px;
    top: 10px;
  }
  .value {
    position: absolute;
    font-size: 12px;
    left: 12.25px;
    top: 38px;
  }
}
</style>
