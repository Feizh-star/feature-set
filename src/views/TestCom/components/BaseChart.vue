<script setup lang="ts">
import { watch, ref, shallowReactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useResizeObserver } from '@vueuse/core'

const props = defineProps<{
  data: any
  options: echarts.EChartsCoreOption
}>()

/* eslint-disable */
const emits = defineEmits<{
  (e: "data-change", chart: echarts.ECharts, data: any, oldData: any, options: echarts.EChartsCoreOption): void;
  (
    e: "size-change",
    chart: echarts.ECharts,
    sizeInfo: DOMRectReadOnly,
    data: any,
    options: echarts.EChartsCoreOption
  ): void;
}>();
/* eslint-ensable */

const chartEl = ref<HTMLElement>();
const chart = shallowReactive({
  echart: null as echarts.ECharts | null,
});

watch(
  () => props.data,
  (newData, oldData) => {
    if (chart.echart) {
      emits("data-change", chart.echart as echarts.ECharts, newData, oldData, props.options);
    }
  }
);

onMounted(() => {
  init();
  resizeObserver();
});

function init() {
  if (!chartEl.value) return;
  const chartRectInfo = chartEl.value.getBoundingClientRect();
  chart.echart = echarts.init(chartEl.value);
  props.options && chart.echart.setOption(props.options);
  emits("data-change", chart.echart as echarts.ECharts, props.data, props.data, props.options);
  emits("size-change", chart.echart as echarts.ECharts, chartRectInfo, props.data, props.options);
}

// 监听图表容器尺寸变化
function resizeObserver() {
  if (!chartEl.value) return;
  let oldWidth = "";
  let oldHeight = "";
  useResizeObserver(chartEl.value, entries => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    const widthStr = width.toFixed(0);
    const heightStr = height.toFixed(0);
    if (widthStr !== oldWidth || heightStr !== oldHeight) {
      chart.echart && chart.echart.resize();
      emits("size-change", chart.echart as echarts.ECharts, entry.contentRect, props.data, props.options);
    }
    oldWidth = widthStr;
    oldHeight = heightStr;
  });
}
</script>

<template>
  <div class="chart-container">
    <div class="chart-el" ref="chartEl"></div>
  </div>
</template>

<style scoped lang="less">
.chart-container {
  width: 100%;
  height: 100%;
  .chart-el {
    width: 100%;
    height: 100%;
  }
}
</style>
