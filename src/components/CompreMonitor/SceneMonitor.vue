<script setup lang="ts">
import { computed, ref } from "vue";
import type * as echarts from "echarts";
import ColHeader from "./ColHeader.vue";
import SceneChart from "./SceneChart.vue";

import stationList from "./station";

import moment from "moment";
function genTestData(length: number, wind = false) {
  const currentDate = moment().minute(0);
  const res = []
  for (let c = 0; c < length; c++) {
    const item: { [p: string]: any } = {
      time: currentDate.subtract(1, 'hour').format("YYYY-MM-DD HH:mm"),
      value: Math.round(Math.random() * 50 * 100) / 100,
    }
    if (wind) item.dir = Math.round(Math.random() * 360 * 100) / 100
    res.unshift(item)
  }
  return res
}

// eslint-disable-next-line
const props = withDefaults(defineProps<{
    title?: string;
    station: string;
  }>(),
  {
    title: "",
  }
);
/* eslint-disable */
const emits = defineEmits<{
  (e: "update:station", s: string): void;
}>()
/* eslint-enable */

const selectOptions = ref(stationList);
const innerStation = computed({
  get() {
    return props.station;
  },
  set(value) {
    emits("update:station", value);
  }
})
const chartList = reactive([
  {
    type: "rain-bar" as const,
    title: "降水实况",
    subtitle: "过去24h降水实况",
    unit: "mm",
    data: genTestData(24),
    dataHandler: commonDataHandler,
  },
  {
    type: "time-line" as const,
    title: "温度实况",
    subtitle: "过去24h温度实况",
    unit: "℃",
    data: genTestData(24),
    dataHandler: commonDataHandler,
  },
  {
    type: "time-line" as const,
    title: "能见度实况",
    subtitle: "过去24h能见度实况",
    unit: "m",
    data: genTestData(24),
    dataHandler: commonDataHandler,
  },
  {
    type: "wind-line" as const,
    title: "风速实况",
    subtitle: "",
    unit: "m/s",
    data: genTestData(24, true),
    dataHandler: windDataHandler,
  },
])
function commonDataHandler(chart: echarts.ECharts, data: Array<any>) {
  const xAxisData = data.map(item => item.time)
  const series1Data = data.map(item => ({
    value: item.value,
  }))
  chart.setOption({
    xAxis: {
      data: xAxisData
    },
    series: [
      {
        data: series1Data,
      },
    ]
  })
}
function windDataHandler(chart: echarts.ECharts, data: Array<any>) {
  const xAxisData = data.map(item => item.time)
  const maxValue = Math.max(...data.map(item => item.value));
  const yAxisMax = Math.ceil((maxValue + 10) / 10) * 10
  const series1Data = data.map(item => ({
    value: item.value,
    symbol: `path://${getWindPath(item.value)}`,
    symbolSize: 24,
    symbolKeepAspect: true,
    symbolRotate: item.dir,
    itemStyle: {
      color: "#ffffff"
    }
  }))
  chart.setOption({
    xAxis: {
      data: xAxisData
    },
    yAxis: {
      max: yAxisMax,
    },
    series: [
      {
        data: series1Data,
      },
    ]
  })
}

//最大高度： 三角 * 2 + 长 * 3 + 短 * 4 = 35 * 2 + 7 * 15 = 175
//最小高度： 80
//竖杆 lingLength * 15 + triangleLength * 35 Math.max(x, )
//长杆 M0 ${i * 15} L35 ${i * 15} L35 ${i * 15 + 5} L0 ${i * 15 + 5}z 
//短杆 M0 ${i * 15} L20 ${i * 15} L20 ${i * 15 + 5} L0 ${i * 15 + 5}z 
//三角 M0 ${i * 35} L45 ${i * 35} L0 ${i * 35 + 30} L0 ${i * 35 + 25} L28 ${i * 35 + 5} L0 ${i * 35 + 5}z 
function getWindPath(speed: number) {
  const triGen = (i: number, y = 0) => `M0 ${i * 35 + y} L45 ${i * 35 + y} L0 ${i * 35 + 30 + y} L0 ${i * 35 + 25 + y} L28 ${i * 35 + 5 + y} L0 ${i * 35 + 5 + y}z `
  const longGen = (i: number, y = 0) => `M0 ${i * 15 + y} L35 ${i * 15 + y} L35 ${i * 15 + 5 + y} L0 ${i * 15 + 5 + y}z `
  const shortGen = (i: number, y = 0) => `M0 ${i * 15 + y} L20 ${i * 15 + y} L20 ${i * 15 + 5 + y} L0 ${i * 15 + 5 + y}z `
  const triConut = Math.floor(speed % 20 >= 19 ? speed / 20 + 1 : speed / 20);
  const longResidue = (speed - triConut * 20) < 0 ? 0 : speed - triConut * 20;
  const longCount = Math.floor(longResidue % 4 >= 3 ? longResidue / 4 + 1 : longResidue / 4);
  const shortResidue = (longResidue - longCount * 4) < 0 ? 0 : longResidue - longCount * 4;
  const shortCount = Math.floor(shortResidue % 2 >= 1 ? shortResidue / 2 + 1 : shortResidue / 2);
  let path = "";
  for (let i = 0; i < triConut; i++) {
    path += triGen(i);
  }
  for (let i = 0; i < longCount; i++) {
    path += longGen(i, triConut * 35);
  }
  for (let i = 0; i < shortCount; i++) {
    path += shortGen(i, triConut * 35 + longCount * 15);
  }
  const poleHeight = Math.min(Math.max(triConut * 35 + (longCount + shortCount) * 15 + 10, 80), 175)
  path += `M0 ${poleHeight} L0 0 L5 0 L5 ${poleHeight}z`
  return path;
}
</script>

<template>
  <div class="scene-monitor">
    <ColHeader title="实况监测">
      <template #residue>
        <div class="header-feature">
          <el-select v-model="innerStation" placeholder="请选择" style="width: 118px">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </template>
    </ColHeader>
    <div class="scene-monitor-list">
      <div class="scene-list-item" v-for="(item, index) in chartList" :key="index">
        <div class="item-inner">
          <SceneChart v-bind="item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.scene-monitor {
  box-sizing: border-box;
  color: #ffffff;
  &:deep(*) {
    box-sizing: border-box;
  }
}
.scene-monitor {
  height: 100%;
  display: flex;
  flex-direction: column;
  .scene-monitor-list {
    padding: var(--body-padding);
    flex: 1;
    min-height: 0;
    .scene-list-item {
      height: 24%;
      padding: 5px 0;
      &:last-child {
        height: 28%;
      }
      .item-inner {
        height: 100%;
        width: 100%;
        background-color: var(--chart-item-bgc);
        border: 1px solid var(--chart-item-border);
      }
    }
  }
}
.header-feature {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>