<script setup lang="ts">
import moment from "moment";
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import LabelSelect from "@/components/HeFei/LabelSelect.vue";
import BaseChart from "@/components/HeFei/BaseChart.vue";
import type * as echarts from "echarts"
import { getIcon } from "./js/getWeatherIcon"

const pinPath = 'path://M108,151H94c-1.08-.37-2.14-.82-3.24-1.08-20.47-5-33.44-17.69-38.42-38.1-1-3.88-2.49-4.64-6-4.63-15.12.06-30.24-.11-45.36-.19V94c15-.08,30-.29,44.92-.17,3.9,0,5.65-.84,6.75-5,5-18.94,17.3-30.95,36.13-36.32,1.73-.5,3.71-.17,5.2-1.49h14a21.71,21.71,0,0,0,2.76,1c20.16,4.63,33.16,16.92,38.56,36.81,1.14,4.18,2.87,5,6.76,5,15-.12,29.95.09,44.92.17v13c-15.12.08-30.24.25-45.36.19-3.49,0-5.16.69-6,4.63-2.86,13.88-10.83,24.35-22.74,32C121.09,147.51,114.45,149,108,151Z'
const dateFormatter = "YYYYMMDDHHmm"
const axisLabelColor = "#DCE4F5"; // 坐标轴文本颜色
const legendAndLabelColor = "#ADB7CB"; // 图例和折线图label文本颜色
const labelBorderColor = "#020B17"; // 折线图label文本边框颜色
const splitLineColor = "#1C2D3C"; // y轴分割线颜色
const lineColor = "#44ABD1"; // 折线颜色
const barColor = "#0ECAB0"; // 柱状图颜色

const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})
// 时间
const time = ref("2023-08-03 11:00");

// 站点选择
const monitorSel = ref();
const monitorOptions = ref([
  { value: 'ss', label: '蜀山站', },
]);

const data = [
  {time: '2023080305', tem: 31.7, rain: 0.5, winDir: "偏东风", winLevel: 3, weather: "晴"},
  {time: '2023080308', tem: 22.5, rain: 3.5, winDir: "偏东风", winLevel: 3, weather: "小雨"},
  {time: '2023080311', tem: 20, rain: 4.6, winDir: "偏东风", winLevel: 3, weather: "中雨"},
  {time: '2023080314', tem: 15, rain: 11.6, winDir: "偏东风", winLevel: 3, weather: "多云"},
  {time: '2023080317', tem: 8, rain: 0, winDir: "偏东风", winLevel: 3, weather: "小雪"},
  {time: '2023080320', tem: 7, rain: 6, winDir: "偏东风", winLevel: 3, weather: "大雨"},
  {time: '2023080323', tem: 11, rain: 3, winDir: "偏东风", winLevel: 3, weather: "中雨"},
]
const option = {
  legend: {
    data: [
      { name: '温度', icon: pinPath, itemStyle: { color: lineColor } }, 
      { name: '降水', }
    ],
    textStyle: {
      color: legendAndLabelColor,
    }
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      formatter: function (value: string) {
        const list = value.split(",")
        const time = list[0]
        let hour = moment(time, dateFormatter).hour()
        let minute = moment(time, dateFormatter).minute()
        const timeLabel = `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`
        return `{time|${timeLabel}}\n{dir|${list[1]}}\n{level|${list[2]}级}`
      },
      rich: {
        time: {
          color: axisLabelColor,
          padding: [0, 0, 10, 0]
        },
        dir: {
          color: axisLabelColor,
          padding: [0, 0, 10, 0]
        },
        level: {
          color: axisLabelColor
        }
      },
    }
  },
  yAxis: [
    {
      type: 'value',
      name: "℃",
      nameTextStyle: {
        color: axisLabelColor,
      },
      axisLabel: {
        color: axisLabelColor,
      },
      splitLine: {
        show: false,
      }
    },
    {
      type: 'value',
      name: "mm",
      nameTextStyle: {
        color: axisLabelColor,
      },
      axisLabel: {
        color: axisLabelColor,
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor
        }
      }
    },
  ],
  series: [
    {
      data: [],
      name: '温度',
      type: 'line',
      smooth: true,
      lineStyle: {
        color: lineColor,
        width: 3,
      },
      label: {
        show: true,
        formatter: "{c}℃",
        color: legendAndLabelColor,
        textBorderColor : labelBorderColor,
        textBorderWidth : 3,
      },
    },
    {
      data: [],
      name: '降水',
      yAxisIndex: 1,
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        color: barColor,
        borderRadius: [7, 7, 0, 0],
      }
    }
  ]
};
function setData(chart: echarts.ECharts, data: Array<any>) {
  const xAxisData = data.map(item => `${item.time},${item.winDir},${item.winLevel}`)
  const series1Data = data.map(item => ({
    value: item.tem,
    symbol: "image://" + getIcon(item.weather),
    symbolSize: 20,
  }))
  const series2Data = data.map(item => item.rain)
  chart.setOption({
    xAxis: {
      data: xAxisData
    },
    series: [
      {
        data: series1Data,
      },
      {
        data: series2Data,
      },
    ]
  })
}
</script>

<template>
  <div class="base-block">
    <div class="header-container">
      <BlockHeader :title="title" :time="time" v-if="showHeader"/>
    </div>
    <div class="block-body">
      <div class="station-selection">
        <LabelSelect label="站点选择：" v-model="monitorSel">
          <el-option
            v-for="item in monitorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </LabelSelect>
      </div>
      <div class="main-content">
        <BaseChart :data="data" :options="option" @data-change="setData"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.base-block {
  --block-width: 100%;
  --block-height: 100%;
  --block-header-height: 35px;
  --font-size: 14px;

  --header-icon-color: #4eb4ff;
}
.base-block {
  width: var(--block-width);
  height: var(--block-height);
  font-size: var(--font-size);
  display: flex;
  flex-direction: column;
  .block-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    .station-selection {
      padding-top: 10px;
    }
    .main-content {
      flex: 1;
      min-height: 0;
      padding-top: 10px;
    }
  }
}
</style>