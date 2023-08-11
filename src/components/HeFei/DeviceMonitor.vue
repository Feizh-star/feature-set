<script setup lang="ts">
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import DeviceChart from "@/components/HeFei/MonitorChart/DeviceChart.vue";

const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})
// 时间
const time = ref("2023-08-02 11:00");

</script>

<template>
  <div class="base-block">
    <div class="header-container">
      <BlockHeader :title="title" :time="time" v-if="showHeader"/>
    </div>
    <div class="block-body">
      <div class="station-selection">
      </div>
      <div class="main-content">
        <div class="device-list">
          <div class="device-item" v-for="item in 3" :key="item">
            <DeviceChart :title="'臭氧激光雷达'" :data="[]"/>
          </div>
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
    }
    .main-content {
      flex: 1;
      min-height: 0;
      .device-list {
        height: 100%;
        display: flex;
        flex-direction: column;
        .device-item {
          flex: 1;
          min-height: 0;
          padding-top: 10px;
        }
      }
    }
  }
}
</style>