<script setup lang="ts">
import BaseChart from "@/components/HeFei/BaseChart.vue";
import type * as echarts from "echarts"
const usedSrc =
  'data:image/png;base64,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'
const residueSrc = 'data:image/png;base64,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'
const usedImg = new Image();
usedImg.src = usedSrc;
const residueImg = new Image();
residueImg.src = residueSrc;

const props = defineProps<{
  ip: string;
  title: string;
  total: number;
  used: number;
  residue: number;
}>()

const usedRate = computed(() => {
  return Math.round(props.used / props.total * 100)
})
const residueRate = computed(() => {
  return Math.round(props.residue / props.total * 100)
})

const option = {
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
      name: '磁盘容量',
      type: 'pie',
      radius: ['80%', '95%'],
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
function setData(chart: echarts.ECharts, data: any) {
  const seriesData = [
    { 
      name: '已用', 
      value: data.used, 
      itemStyle: {
        color: {
          image: usedImg,
          repeat: 'repeat'
        },
      },
    },
    { 
      name: '剩余', 
      value: data.residue,
      itemStyle: {
        color: {
          image: residueImg,
          repeat: 'repeat'
        },
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
</script>

<template>
  <div class="disk-chart">
    <div class="cycle-chart">
      <BaseChart :data="{ used, residue }" :options="option" @data-change="setData"/>
      <div class="total-info">
        <div class="total-gb">{{ total }}GB</div>
        <div class="total-label">总容量</div>
      </div>
    </div>
    <div class="disk-info">
      <div class="server-title">
        <span>{{ title || "" }}</span>
      </div>
      <div class="server-ip">
        <span>IP：{{ ip || "" }}</span>
      </div>
      <div class="server-legend">
        <div class="legend-item">
          <div class="used-icon"></div>
          <span class="legend-type">已用:</span>
          <span>{{ used }}G</span>
          <span class="legend-rate">{{ usedRate }}%</span>
        </div>
        <div class="legend-item">
          <div class="residue-icon"></div>
          <span class="legend-type">剩余:</span>
          <span>{{ residue }}G</span>
          <span class="legend-rate">{{ residueRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.disk-chart {
  --title-color: #31FBFB;
  --total-gb-color: #1DD1E3;

  --cycle-size: 120px;
  --cycle-center-size: 86px;
  --normal-fontsize: 18px;
  --small-fontsize: 14px;
  --big-fontsize: 22px;
}
.disk-chart {
  width: 100%;
  height: 100%;
  display: flex;
  .cycle-chart {
    width: var(--cycle-size);
    position: relative;
    .total-info {
      width: var(--cycle-center-size);
      height: var(--cycle-center-size);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #383c4a;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .total-gb {
        font-size: var(--normal-fontsize);
        color: var(--total-gb-color);
      }
      .total-label {
        font-size: var(--small-fontsize);
      }
    }
  }
  .disk-info {
    flex: 1;
    min-width: 0;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .server-title {
      color: var(--title-color);
      font-size: var(--normal-fontsize);
      font-weight: bold;
      padding-bottom: 8px;
    }
    .server-ip {
      font-size: var(--normal-fontsize);
      padding-bottom: 10px;
    }
    .server-legend {
      display: flex;
      font-size: var(--normal-fontsize);
      .legend-item {
        display: flex;
        align-items: flex-end;
        white-space: nowrap;
        flex-wrap: nowrap;
        & + .legend-item {
          padding-left: 8px;
        }
        .legend-type {
          padding-left: 4px;
        }
        .legend-rate {
          padding-left: 6px;
          font-size: var(--big-fontsize);
        }
      }
      .used-icon,
      .residue-icon {
        width: var(--normal-fontsize);
        height: var(--normal-fontsize);
        position: relative;
        bottom: 2px;
      }
      .used-icon {
        background-image: linear-gradient(90deg, #00FFDD, #5A6FF0);
      }
      .residue-icon {
        background-image: linear-gradient(90deg, #6C7083, #3A3D4C);
      }
    }
  }
}
</style>