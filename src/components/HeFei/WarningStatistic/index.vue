<template>
  <div class="module">
    <img src="./assets/title.svg" alt="" />
    <div class="row">
      <div class="pie" ref="refPie">
        <div class="circle">
          <div>{{ sum }}</div>
          <div>预警总数(个)</div>
        </div>
        <div
          class="tooltip"
          v-if="target"
          :style="{
            left: mousePosition[0] + 10 + 'px',
            top: mousePosition[1] - 10 + 'px',
          }"
        >
          <span
            class="dot"
            :style="{
              background: target.color,
            }"
          ></span>
          {{ target.label }}<br />
          数量:{{ target.count }}个
        </div>
      </div>
      <div class="legend">
        <div v-for="e in props.data" :key="e.label" class="item">
          <span
            class="dot"
            :style="{
              background: e.color,
            }"
          ></span>
          <span class="label">{{ e.label }}:</span>
          <span class="pecent">{{ (sum ? (e.count / sum) * 100 : 0).toFixed(0) }}%</span>
          <span class="count">{{ e.count }}个</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, Ref, watch } from "vue";
import { PieChart } from "./PieChart";
import { DataItem } from "./type";

const props = defineProps<{
  data: DataItem[];
}>();

const target: Ref<DataItem | null> = ref(null);
const mousePosition = ref([0, 0]);

watch(
  () => props.data,
  () => {
    pieChart.data = props.data.map(e => {
      return {
        color: e.color,
        value: e.count,
      };
    });
  }
);

const sum = computed(() => {
  let res = 0;
  props.data.forEach(e => {
    res += e.count;
  });
  return res;
});
const refPie: Ref<HTMLDivElement | null> = ref(null);

let pieChart: PieChart;
onMounted(() => {
  pieChart = new PieChart(refPie.value!, {
    r1: 0.6,
    r2: 1.0,
    data: props.data.map(e => {
      return {
        color: e.color,
        value: e.count,
      };
    }),
    onMouseIn(i) {
      target.value = props.data[i];
    },
    onMouseOut() {
      target.value = null;
    },
  });
  refPie.value!.addEventListener("mousemove", e => {
    mousePosition.value = [e.offsetX, e.offsetY];
  });
});
</script>
<style lang="less" scoped>
.module {
  .row {
    height: 210px;
    .pie {
      width: 50%;
      position: relative;
      display: flex;
      justify-content: center;
    }
    color: #ffffff;
    display: flex;
    .circle {
      pointer-events: none;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 77.01px;
      height: 76px;
      border: 2px solid rgba(77, 212, 255, 0.5);
      border-radius: 50%;
      filter: drop-shadow(0px 0px 5px #4eb4ff);
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #ffffff;
      text-align: center;
      padding-top: 15px;
      box-sizing: border-box;
    }
    .legend {
      margin-top: 13px;
      .item {
        margin-bottom: 23px;
      }
      .dot {
        display: inline-block;
        border-radius: 50%;
        height: 10px;
        width: 10px;
        box-shadow: 0px 0px 10px #4eb4ff;
        margin-right: 26px;
      }
      .label {
        margin-right: 20px;
      }
      .pecent {
        margin-right: 20px;
      }
    }
  }
  .tooltip {
    background-image: url("./assets/panel.svg");
    background-size: 100% 100%;
    position: absolute;
    padding: 10px 40px;
    line-height: 20px;
    pointer-events: none;
    width: max-content;
    transform: translateY(-100%);
    .dot {
      width: 6px;
      height: 6px;
      display: inline-block;
      box-shadow: 0px 0px 10px #4eb4ff;
    }
  }
}
</style>
