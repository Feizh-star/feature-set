<script setup lang="ts">
import type * as echarts from "echarts";
import moment from "moment";
import BaseChart from "./BaseChart.vue";

const userYYYYMMDDHHmm = "YYYY-MM-DD HH:mm"
const userYYYYMMDDHHmmss = "YYYY-MM-DD HH:mm:ss"

const props = defineProps<{
  type: "rain-bar" | "time-line" | "wind-line";
  title: string;
  subtitle: string;
  unit: string;
  data: Array<any>;
  dataHandler: (chart: echarts.ECharts, data: any, oldData: any, options: echarts.EChartsCoreOption) => void
}>()

const timeWithMMDD = function (time: string) {
  let HHmm = moment(time, userYYYYMMDDHHmm).format("HH:mm")
  let MMDD = moment(time, userYYYYMMDDHHmm).format("MM/DD")
  return `${HHmm}\n${MMDD}`
}
const timeWithoutMMDD = function (time: string) {
  let HHmm = moment(time, userYYYYMMDDHHmm).format("HH:mm")
  return `${HHmm}`
}
const options = computed(() => {
  const type = props.type
  const unit = props.unit
  const chartType = type === "rain-bar" ? "bar" : "line";
  const symbol = type === "wind-line" ? "" : "none";
  const dataZoomEnd = type === "wind-line" ? 20 : 40;
  const xAxisFormatter = type === "wind-line" ? timeWithMMDD : timeWithoutMMDD;
  return {
    tooltip: {
      show: true,
      valueFormatter: (value: any) => value + unit,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: "#e4f1ff",
        formatter: xAxisFormatter,
      },
      axisTick: {
        show: false
      },
      data: []
    },
    grid: {
      left: 5,
      top: 21,
      right: 5,
      bottom: 20,
      containLabel: true,
    },
    yAxis: {
      type: 'value',
      name: unit || "",
      nameGap: 8,
      nameTextStyle: {
        color: "#e4f1ff",
      },
      axisLabel: {
        textStyle: {
          color: "#e4f1ff",
        }
      },
      splitLine: {
        lineStyle: {
          color: "#3f4f5e",
          type: "dashed",
        }
      }
    },
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: dataZoomEnd,
        handleIcon: "path://M 100 100 a 50 50 0 1 0 0.00001 0",
        handleStyle: {
          color: "#5477e2",
          borderWidth: 0,
        },
        moveHandleSize: 0,
        height: 4,
        bottom: 10,
        dataBackground: {
          lineStyle: {
            opacity: 0,
          },
          areaStyle: {
            opacity: 0,
          }
        },
        selectedDataBackground: {
          lineStyle: {
            opacity: 0,
          },
          areaStyle: {
            opacity: 0,
          }
        },
        borderColor: "transparent",
        backgroundColor: "#3f4f5e",
        fillerColor: "#5477e2",
        showDetail: false,
        zoomLock: true,
        brushSelect: false,
      },
    ],
    series: [
      {
        data: [],
        type: chartType,
        smooth: true,
        barWidth: 10,
        itemStyle: {
          color: "#129bff",
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0, color: 'rgba(18, 156, 255, 0)' // 0% 处的颜色
            }, {
                offset: 1, color: 'rgba(18, 156, 255, 0.41)' // 100% 处的颜色
            }],
          }
        },
        symbol: symbol,
      }
    ]
  }
});
</script>

<template>
  <div class="scene-chart">
    <div class="chart-title">
      <span class="title">{{ title || "" }}</span>
      <span class="subtitle">{{ subtitle || "" }}</span>
    </div>
    <div class="scene-chart-container">
      <BaseChart :data="data" :options="options" @data-change="dataHandler"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.scene-chart {
  display: flex;
  flex-direction: column;
  height: 100%;
  .chart-title {
    display: flex;
    justify-content: space-between;
    color: var(--subtitle-color);
    padding: 8px 4px;
    .title {
      font-size: 14px;
    }
    .subtitle {
      font-size: 12px;
    }
  }
  .scene-chart-container {
    flex: 1;
    min-height: 0;
  }
}
</style>