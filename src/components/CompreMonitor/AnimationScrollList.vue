<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from "vue";
import { useResizeObserver } from "@vueuse/core";
import type { ElScrollbar } from "element-plus";

const props = withDefaults(defineProps<{
  list: Array<any>;
  index: number;
}>(), {
  list: () => [],
  index: 0
})

// 保存每个元素的偏移量
const listItemOffset: Array<{ self: number; offset: number, offsetBottom: number; observer: { stop: () => void } }> = []
const listItemRefs = ref([]);
watch(() => props.list, () => {
  nextTick(() => {
    listItemOffset.forEach(item => item?.observer?.stop())
    listItemOffset.splice(0, listItemOffset.length);
    listItemRefs.value.forEach((item: HTMLElement, index) => {
      const lastOffsetBottom = listItemOffset[index - 1]?.offsetBottom || 0;
      const observer = useResizeObserver(item, (entries) => {
        const entry = entries[0]
        const height = entry.target.clientHeight
        const delta = height - listItemOffset[index].self;
        listItemOffset[index].self = height;
        listItemOffset[index].offset = listItemOffset[index - 1]?.offsetBottom || 0;
        listItemOffset[index].offsetBottom = listItemOffset[index].offset + height;
        for (let p = index + 1; p < listItemOffset.length; p++) {
          listItemOffset[p].offset += delta;
          listItemOffset[p].offsetBottom += delta;
        }
      });
      listItemOffset.push({
        self: item.clientHeight,
        offset: lastOffsetBottom,
        offsetBottom: lastOffsetBottom + item.clientHeight,
        observer: observer
      });
    })
  })
}, { immediate: true })
onBeforeUnmount(() => {
  listItemOffset.forEach(item => item?.observer?.stop())
})

// 获取元素和组件的引用
let scrollbarEl: HTMLElement | null = null;
const animationScrollRef = ref();
const scrollbarRef = ref();
onMounted(() => {
  const scrollbarEls = animationScrollRef.value.getElementsByClassName("el-scrollbar__wrap")
  scrollbarEl = scrollbarEls?.length > 0 ? scrollbarEls[0] : null
});
// 滚动到指定位置
watch(() => props.index, (newVal) => {
  if (scrollbarRef.value) {
    scrollTo({
      scrollbarCom: scrollbarRef.value,
      el: scrollbarEl as HTMLElement,
      to: listItemOffset[newVal].offset,
      duration: 300,
    });
  }
});

// 滚动动画
const EaseInOutQuad = function (t: number, b: number, c: number, d: number) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}
const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    // @ts-ignore
    window.webkitRequestAnimationFrame ||
    // @ts-ignore
    window.mozRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60) }
})()
function move(vueCom: typeof ElScrollbar, key: "scrollTop" | "scrollLeft", amount: number) {
  if (key === "scrollTop") {
    vueCom.setScrollTop(amount)
  }
  if (key === "scrollLeft") {
    vueCom.setScrollLeft(amount)
  }
}
function position(el: HTMLElement, key: "scrollTop" | "scrollLeft") {
  const scrollDistance = el[key];
  return scrollDistance;
}
function scrollTo({
  scrollbarCom,
  el,
  to,
  duration,
  scrollKey,
  callback
}: {
  scrollbarCom: typeof ElScrollbar,
  el: HTMLElement, 
  to: number, 
  duration: number, 
  scrollKey?: "scrollTop" | "scrollLeft", 
  callback?: (to: number) => void
}) {
  if (!el) return null
  to = to || 0
  scrollKey = scrollKey || 'scrollTop'
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  const start = position(el, scrollKey)
  const change = to - start
  const increment = 20
  let currentTime = 0
  const animateScroll = function () {
    currentTime += increment
    if (currentTime < duration) {
      let val: number = EaseInOutQuad(currentTime, start, change, duration)
      move(scrollbarCom, scrollKey!, val)
      requestAnimFrame(animateScroll)
    } else {
      move(scrollbarCom, scrollKey!, to)
      if (callback && typeof (callback) === 'function') {
        callback(to)
      }
    }
  }
  animateScroll()
}
</script>

<template>
  <div class="animation-scroll" ref="animationScrollRef">
    <el-scrollbar ref="scrollbarRef">
      <div class="list-item" v-for="(item, index) in list" :key="index" ref="listItemRefs">
        <slot :props="item"></slot>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="less">
.animation-scroll {
  width: 100%;
  height: 100%;
  .list-item {
    padding-bottom: 10px;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>