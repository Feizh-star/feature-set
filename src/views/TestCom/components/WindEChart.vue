<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'
import type echarts from 'echarts'
import { getWindShaftPath } from '@/utils/tools'
import { point } from 'leaflet'

const userYYYYMMDDHHmm = 'YYYY-MM-DD HH:mm'

const dynamicComponent = shallowRef()
onMounted(() => {
  import('./BaseChart.vue').then(module => {
    dynamicComponent.value = module.default
  })
})

const data = ref(genRandomData())
const options = {
  tooltip: {
    show: true,
    formatter: `{b}<br/>{c}m/s`,
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      color: '#e4f1ff',
      formatter: timeWithMMDD,
    },
    axisTick: {
      show: false,
    },
    data: [],
  },
  grid: {
    left: 5,
    top: 30,
    right: 5,
    bottom: 20,
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    name: 'm/s',
    nameGap: 8,
    nameTextStyle: {
      color: '#e4f1ff',
    },
    axisLabel: {
      textStyle: {
        color: '#e4f1ff',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#3f4f5e',
        type: 'dashed',
      },
    },
  },
  dataZoom: [
    {
      type: 'slider',
      start: 0,
      end: 30,
      handleIcon: 'path://M 100 100 a 50 50 0 1 0 0.00001 0',
      handleStyle: {
        color: '#5477e2',
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
        },
      },
      selectedDataBackground: {
        lineStyle: {
          opacity: 0,
        },
        areaStyle: {
          opacity: 0,
        },
      },
      borderColor: 'transparent',
      backgroundColor: '#3f4f5e',
      fillerColor: '#5477e2',
      showDetail: false,
      zoomLock: true,
      brushSelect: false,
    },
  ],
  series: [
    {
      data: [],
      type: 'line',
      smooth: true,
      barWidth: 10,
      itemStyle: {
        color: '#129bff',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 1,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(18, 156, 255, 0)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(18, 156, 255, 0.41)', // 100% 处的颜色
            },
          ],
        },
      },
      symbol: '',
    },
  ],
}

function windDataHandler(chart: echarts.ECharts, data: Array<any>) {
  const xAxisData = data.map(item => item.time)
  const maxValue = Math.max(...data.map(item => item.value))
  const yAxisMax = Math.ceil((maxValue + 10) / 10) * 10
  const series1Data = data.map(item => {
    const symbolPath = `path://${getWindShaftPath(item.value)}`
    return {
      value: item.value,
      symbol: symbolPath,
      symbolSize: 30,
      symbolKeepAspect: true,
      symbolRotate: item.dir,
      itemStyle: {
        color: '#ffffff',
      },
    }
  })
  chart.setOption({
    xAxis: {
      data: xAxisData,
    },
    yAxis: {
      max: yAxisMax,
    },
    series: [
      {
        data: series1Data,
      },
    ],
  })
}

function timeWithMMDD(time: string) {
  let HHmm = moment(time, userYYYYMMDDHHmm).format('HH:mm')
  let MMDD = moment(time, userYYYYMMDDHHmm).format('MM/DD')
  return `${HHmm}\n${MMDD}`
}

function genRandomData() {
  const res = []
  const startTime = moment().format(userYYYYMMDDHHmm)
  for (let i = 0; i < 24; i++) {
    res.push({
      time: moment(startTime, userYYYYMMDDHHmm).add(i, 'hour').format(userYYYYMMDDHHmm),
      value: Math.floor((Math.random() * 30 + 1) * 10) / 10,
      dir: Math.floor((Math.random() * 361))
    })
  }
  return res
}


function getWindShaftImg(speed: number, color: string = '#333333') {
  const path = getWindShaftPath(speed)
  const pointStr: any = path.match(/(M|L)\d+\s\d+/g)
  if (!pointStr) return ''
  const points: {
    type: 'lineTo' | 'moveTo'
    point: [number, number]
  }[] = pointStr.map((item: string) => {
    const point1 = item.split(/\s/)
    const startAction = point1[0]?.[0] || 'L'
    return {
      type: startAction === 'L' ? 'lineTo' : 'moveTo', // 不是L就是M
      point: [point1[0]?.replace(/(M|L)/, '') || 0, point1[1] || 0]
    }
  })
  const xMax = Math.max(...points.map(item => item.point[0]))
  const yMax = Math.max(...points.map(item => item.point[1]))
  const canvas = document.createElement('canvas')
  canvas.width = xMax
  canvas.height = yMax
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  for (const pt of points) {
    const actionName = pt.type
    const point = pt.point
    ;(ctx as any)[actionName](point[0], point[1])
  }
  ctx.fillStyle = color
  ctx.fill()
  const dataUrl = canvas.toDataURL()
  return dataUrl
}
</script>

<template>
  <div class="echart-wind-shaft">
    <component :is="dynamicComponent" :data="data" :options="options" @data-change="windDataHandler" />
    <div class="svg-img">
      <img :src="getWindShaftImg(18.8)" alt="">
    </div>
  </div>
</template>

<style scoped lang="scss">
.echart-wind-shaft {
  width: 100%;
  height: 400px;
  max-width: 600px;
  background-color: #101720;
  .chart-container {
    width: 100%;
    height: 100%;
  }
  .svg-img {
    margin-top: 20px;
  }
}
</style>