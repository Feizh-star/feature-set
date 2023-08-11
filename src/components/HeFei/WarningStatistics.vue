<script setup lang="ts">
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import LabelSelect from "@/components/HeFei/LabelSelect.vue";
import BaseChart from "@/components/HeFei/BaseChart.vue";
import WarningCycle from "@/components/HeFei/WarningStatistic/index.vue";
import warningRadar from "@/components/HeFei/DisasterClassificationStatistics/index.vue";
import type * as echarts from "echarts"

const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})
// 时间
const time = ref("2023-08-03 11:00");

// 周期选择
const periodSel = ref('1');
const periodOptions = ref([
  { value: '1', label: '近三个月', },
]);

// 区域选择
const areaSel = ref('1');
const areaOptions = ref([
  { value: '1', label: '市区', },
]);

// 环形图测试数据
const warningData = ref([
  { color: '#2a8fe7', label: '蓝色预警', count: 40 },
  { color: '#e08700', label: '橙色预警', count: 40 },
  { color: '#fcce16', label: '黄色预警', count: 40 },
  { color: '#f04864', label: '红色预警', count: 20 },
  { color: '#c4c4c4', label: '预警提示', count: 40 },
])
// 雷达图测试数据
const radarData = ref([
  { color: '#2a8fe7', name: '大风', value: 75 },
  { color: '#e08700', name: '暴雨', value: 60 },
  { color: '#fcce16', name: '大雾', value: 80 },
  { color: '#f04864', name: '干旱', value: 70 },
  { color: '#c4c4c4', name: '高温', value: 100 },
])
</script>

<template>
  <div class="base-block">
    <div class="header-container">
      <BlockHeader :title="title" :time="time" v-if="showHeader"/>
    </div>
    <div class="block-body">
      <div class="station-selection">
        <div class="selection-item">
          <LabelSelect label="周期选择：" v-model="periodSel">
            <el-option
              v-for="item in periodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </LabelSelect>
        </div>
        <div class="selection-item">
          <LabelSelect label="区域选择：" v-model="areaSel" direction="right">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </LabelSelect>
        </div>
      </div>
      <div class="main-content">
        <div class="count-statistics">
          <WarningCycle :data="warningData"/>
        </div>
        <div class="type-statistics">
          <warningRadar :max="100" :datas="radarData"/>
          <!-- <BaseChart :data="radarData" :options="option" @data-change="setData"/> -->
        </div>
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
      display: flex;
      .selection-item {
        width: 50%;
      }
    }
    .main-content {
      flex: 1;
      min-height: 0;
      padding-top: 10px;
      .count-statistics {
        height: 42%;
        :deep(.module .row .circle) {
          width: 118px;
          height: 117px;
          padding-top: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          > div:first-child {
            font-size: 18px;
            padding-bottom: 5px;
          }
        }
      }
      .type-statistics {
        height: 58%;
        padding-top: 10px;
        position: relative;
      }
    }
  }
}
</style>