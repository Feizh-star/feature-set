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

const options = {
  title: {
    show: true,
    text: "",
    left: "center",
    bottom: 3,
    textStyle: {
      color: "#e4f1ff",
      fontSize: 12
    }
  },
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
      center: ['50%', '40%'],
      radius: ['74%', '56%'],
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

const leftData = reactive({
  percent: 50,
  title: "数据准确率"
});
const rightData = reactive({
  percent: 50,
  title: "观测可用率"
});;
const lengthOfSide = ref(0);
const centerCircleSize = computed(() => lengthOfSide.value * 0.5 + "px");

function dataHandler(chart: echarts.ECharts, data: any) {
  const seriesData = [
    { 
      name: '', 
      value: (100 - data.percent) / 100,
      itemStyle: {
        color: "#133870",
      },
    },
    { 
      name: '', 
      value: data.percent / 100, 
      itemStyle: {
        color: gradientColor,
        borderRadius: ['50%', '50%']
      },
    },
  ]
  chart.setOption({
    title: {
      text: data.title,
    },
    series: [
      {
        data: seriesData
      },
    ]
  })
}

function handleSizeChange(chart: echarts.ECharts, rect: DOMRectReadOnly) {
  const { width, height } = rect;
  lengthOfSide.value = Math.min(width, height);
}
</script>

<template>
  <div class="quality-ctrl">
    <div class="title">
      <span>数据获取</span>
    </div>
    <div class="charts">
      <div class="chart left-chart">
        <BaseChart :data="leftData" :options="options" @data-change="dataHandler" @size-change="handleSizeChange"/>
        <div class="left-center">
          <div class="left-center-data">
            <div class="lcd-number">
              <span class="big-number">{{ leftData.percent }}</span>
              <span class="center-unit">%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart right-chart" ref="rightChartEl">
        <BaseChart :data="rightData" :options="options" @data-change="dataHandler" @size-change="handleSizeChange"/>
        <div class="right-center">
          <div class="right-center-data">
            <div class="rcd-number">
              <span class="big-number">{{ rightData.percent }}</span>
              <span class="center-unit">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.quality-ctrl {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .charts {
    .chart {
      .left-center {
        width: v-bind(centerCircleSize);
        height: v-bind(centerCircleSize);
        top: 40% !important;
      }
      .right-center {
        background-image: none !important;
        width: v-bind(centerCircleSize);
        height: v-bind(centerCircleSize);
        top: 40% !important;
      }
      .big-number {
        color: var(--text-color);
        font-size: 22px;
      }
      .center-unit {
        color: var(--text-color);
      }
      .lcd-number,
      .rcd-number {
        transform: translateY(2px);
      }
    }
  }
}
</style>