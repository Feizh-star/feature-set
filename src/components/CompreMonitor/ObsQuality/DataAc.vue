<script setup lang="ts">
import { ref, computed } from "vue";
import type * as echarts from "echarts";
import BaseChart from "../BaseChart.vue";

const gradientColor = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 1,
  y2: 1,
  colorStops: [{
      offset: 0, color: '#34bbfb' // 0% 处的颜色
  }, {
      offset: 1, color: '#1886f5' // 100% 处的颜色
  }],
}

// 左侧
const leftData = reactive({
  clock: 9,
  centerTop: 600,
  centerBottom: 900,
});
const lengthOfSide = ref(0);
const centerSide = computed(() => lengthOfSide.value * 0.3913043 + "px");
const leftOptions = {
  series: [
    {
      type: 'gauge',
      radius: "60%",
      startAngle: 90,
      endAngle: -90,
      min: 0,
      max: 12,
      progress: {
        show: false,
      },
      pointer: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: [[1, '#175c90']],
          width: 8,
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 0
        }
      ]
    },
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 24,
      radius: "72%",
      progress: {
        show: true,
        width: 6,
      },
      pointer: {
        show: false
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 24,
          itemStyle: {
            color: gradientColor,
          },
        }
      ]
    },
    {
      type: 'gauge',
      radius: "60%",
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 24,
      splitNumber: 24,
      progress: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 0,
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        distance: 0,
        length: 3,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -26,
        color: '#33b9fa',
        fontSize: 12,
        formatter: function (value: number) {
          if (value === 24 || value % 6 !== 0) {
            return '';
          }
          return value + (value < 10 ? ' ' : '');
        }
      },
      pointer: {
        length: "96%",
        show: true,
      },
      anchor: {
        show: false,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        show: false,
        valueAnimation: true,
        fontSize: 80,
        offsetCenter: [0, '70%']
      },
      itemStyle: {
        color: "#ff8200",
      },
      data: [
        {
          value: 0,
        }
      ]
    },
  ]
};
function leftDataHandler(chart: echarts.ECharts, data: any) {
  chart.setOption({
    series: [
      {},
      {},
      {
        data: [
          {
            value: data.clock,
          }
        ]
      }
    ]
  })
}
// 根据容器尺寸及百分比设置options中某些只能用固定宽度的值
function leftSizeChange(chart: echarts.ECharts, rect: DOMRectReadOnly, data: any) {
  const { width, height } = rect;
  lengthOfSide.value = Math.min(width, height);
  const percent = data.centerBottom !== 0 ? data.centerTop / data.centerBottom : 0;
  const offsetDeg = Math.round(percent * 360);
  chart.setOption({
    series: [
      {
        startAngle: 90,
        endAngle: Math.max(90 - offsetDeg, -270),
        axisLine: {
          lineStyle: {
            width: Math.round(lengthOfSide.value * 0.06956521),
          }
        },
      },
      {
        progress: {
          width: Math.round(lengthOfSide.value * 0.05217391),
        },
      },
      {
        axisLabel: {
          distance: - Math.round(lengthOfSide.value * 0.2260869),
        }
      }
    ]
  })
}

// 右侧
const rightData = reactive({
  clock: 9,
  percent: 45
})
const rightSideLength = ref(0);
const centerCircleSize = computed(() => rightSideLength.value * 0.57 + "px");
const rightOptions = {
  tooltip: {
    show: false,
    trigger: 'item',
    formatter: '{a}<br/>{b}:{c}',
  },
  legend: {
    show: false,
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['76%', '65%'],
      emphasis: {
        scale: false,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}
function rightSizeChange(chart: echarts.ECharts, rect: DOMRectReadOnly) {
  const { width, height } = rect;
  rightSideLength.value = Math.min(width, height);
}
function rightDataHandler(chart: echarts.ECharts, data: any) {
  const seriesData = [
    { 
      name: '', 
      value: data.percent / 100, 
      itemStyle: {
        color: gradientColor,
      },
    },
    { 
      name: '', 
      value: (100 - data.percent) / 100,
      itemStyle: {
        color: "#133870",
      },
    },
  ]
  chart.setOption({
    series: [
      {
        data: seriesData
      },
    ]
  })
}
function addPrevZero(n: number) {
  if (!n) return "0";
  return n < 10 ? `0${n}` : `${n}`;
}
</script>

<template>
  <div class="data-ac">
    <div class="title">
      <span>数据获取</span>
    </div>
    <div class="charts">
      <div class="chart left-chart">
        <BaseChart :data="leftData" :options="leftOptions" @data-change="leftDataHandler" @size-change="leftSizeChange"/>
        <div class="left-center">
          <div class="left-center-data">
            <div class="lcd-number">{{ leftData.centerTop || 0 }}</div>
            <div class="split-line"></div>
            <div class="lcd-number">{{ leftData.centerBottom || 0 }}</div>
          </div>
        </div>
      </div>
      <div class="chart right-chart">
        <BaseChart :data="rightData" :options="rightOptions" @data-change="rightDataHandler" @size-change="rightSizeChange"/>
        <div class="right-center">
          <div class="right-center-data">
            <div class="rcd-number">{{ rightData.percent || 0 }}%</div>
            <div class="split-line"></div>
            <div class="rcd-number">{{ addPrevZero(rightData.clock) }}时</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.data-ac {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .charts {
    .chart {
      .left-center {
        width: v-bind(centerSide);
        height: v-bind(centerSide);
        // 渐变边框
        border-radius: 50%;
        border: 2px solid transparent;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        background-image: linear-gradient(to right, #031530, #031530), linear-gradient(135deg, #35bbfb, #1886f5);
      }
      .right-center {
        width: v-bind(centerCircleSize);
        height: v-bind(centerCircleSize);
      }
    }
  }
}
</style>