<script setup lang="ts">
import BaseChart from "@/components/HeFei/BaseChart.vue";
import type * as echarts from "echarts"
import LeftImg from "@/assets/hefei/monitor/device-monitor.png";

const props = defineProps<{
  title: string;
  data: Array<{name: string; value: number}>
}>()

const data = [
  { name: "数据到报率", value: 1 },
  { name: "数据准确率", value: 0.8 },
  { name: "数据利用率", value: 0.5 },
]
const option = {
  title: {
    show: false
  },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value: number) => value + '%',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    show: false,
  },
  grid: {
    top: '3%',
    left: '3%',
    right: '10%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    max: 100,
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    }
  },
  yAxis: {
    type: 'category',
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#27334c',
      }
    },
    axisLabel: {
      textStyle: {
        color: '#fff',
      }
    },
    data: []
  },
  series: [
    {
      type: 'bar',
      barWidth: 10,
      label: {
        show: true,
        color: '#fff',
        position: 'right',
        formatter: '{c}%'
      },
      data: []
    },
  ]
}
function setData(chart: echarts.ECharts, data: Array<any>) {
  const yAxisData = data.map(item => item.name)
  const seriesData = data.map((item, index) => ({
    value: Math.round(item.value * 100),
    itemStyle: {
      color: index % 2 === 0 ? '#31FBFB' : '#129BFF'
    }
  }))
  chart.setOption({
    yAxis: {
      data: yAxisData
    },
    series: [
      {
        data: seriesData
      },
    ]
  })
}
</script>

<template>
  <div class="device-chart">
    <div class="device-title">
      <div class="title-text">
        {{ title || '' }}
      </div>
    </div>
    <div class="device-img-chart">
      <div class="left-img">
        <img :src="LeftImg"/>
      </div>
      <div class="right-chart">
        <div class="chart-container">
          <BaseChart :data="data" :options="option" @data-change="setData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.device-chart {
  --title-height: 32px;
  --title-fontsize: 16px;
}
.device-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .device-title {
    height: var(--title-height);
    line-height: var(--title-height);
    .title-text {
      padding-right: 3px;
      font-size: var(--title-fontsize);
      font-weight: 700;
      background-image: linear-gradient(#c2def6, #77c3fc);
      -webkit-background-clip:text;
      background-clip: text;
      color: transparent;
    }
  }
  .device-img-chart {
    flex: 1;
    min-height: 0;
    display: flex;
    .left-img {
      width: 72px;
      height: 100%;
      position: relative;
      > img {
        width: 100%;
        position: absolute;
        bottom: 5px;
      }
    }
    .right-chart {
      flex: 1;
      padding-left: 10px;
      .chart-container {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>