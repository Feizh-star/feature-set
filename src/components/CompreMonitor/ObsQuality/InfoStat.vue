<script setup lang="ts">
import { ref } from "vue";
import type * as echarts from "echarts";
import BaseChart from "../BaseChart.vue";

const colorMap = new Map([
  ["可信站点", "#165dff"],
  ["错误站点", "#f7ba1e"],
  ["无数据站点", "#14c9c9"],
  ["可疑站点", "#676767"],
])
const data = ref<Array<{ name: string; value: number }>>([
  { value: 1048, name: '可信站点' },
  { value: 735, name: '错误站点' },
  { value: 580, name: '无数据站点' },
  { value: 484, name: '可疑站点' },
]);
const options = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    left: '55%',
    top: "center",
    orient: "vertical",
    itemWidth: 10,
    itemHeight: 5,
    itemGap: 5,
    textStyle: {
      color: "#e4f1ff",
      fontSize: 12,
      lineHeight: 12
    }
  },
  series: [
    {
      name: '信息统计',
      type: 'pie',
      center: ["30%", "50%"],
      radius: '80%',
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '可信站点' },
        { value: 735, name: '错误站点' },
        { value: 580, name: '无数据站点' },
        { value: 484, name: '可疑站点' },
      ]
    }
  ]
}
function dataHandler(chart: echarts.ECharts, data: any) {
  const seriesData = (data as Array<{ name: string; value: number }>).map(item => {
    return {
      value: item.value,
      name: item.name,
      itemStyle: {
        color: colorMap.get(item.name)
      }
    }
  })
  chart.setOption({
    series: [
      {
        data: seriesData
      },
    ]
  })
}
</script>

<template>
  <div class="info-stat">
    <div class="title">
      <span>信息统计</span>
    </div>
    <div class="pie-chart">
      <BaseChart :data="data" :options="options" @data-change="dataHandler"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.info-stat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .pie-chart {
    flex: 1;
    min-height: 0;
  }
}
</style>