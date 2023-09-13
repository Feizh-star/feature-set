<script setup lang="ts">
import { ref } from "vue";
import LiveAction from "@/components/CompreMonitor/LiveAction.vue";
import NewEquipment from "@/components/CompreMonitor/NewEquipment.vue";
import SceneMonitor from "@/components/CompreMonitor/SceneMonitor.vue";
import ObsQuality from "@/components/CompreMonitor/ObsQuality.vue";
const selectedStation = ref("");
</script>

<template>
  <div class="compre-monitor">
    <div class="compre-both compre-left">
      <LiveAction class="compre-column" v-model:station="selectedStation" />
      <NewEquipment class="compre-column" />
      <SceneMonitor class="compre-column" v-model:station="selectedStation" />
      <ObsQuality class="compre-column" />
    </div>
  </div>
</template>

<style scoped lang="less">
.compre-monitor {
  width: 100%;
  height: 100%;
  background-color: #070e16;
  position: relative;
}
.compre-both {
  position: absolute;
  height: 100%;
  display: flex;
  &.compre-left {
    left: 0;
  }
  &.compre-right {
    right: 0;
  }
  .compre-column {
    --body-padding: 10px;
    --body-bgc: #122438;
    --subtitle-color: #e4f1ff;
    --text-color: #e4f1ff;
    --chart-item-bgc: #031530;
    --chart-item-border: #00355d;
    width: 270px;
    padding-left: 10px;
    &:nth-child(3),
    &:nth-child(4) {
      padding-left: 0px;
      padding-right: 10px;
    }
  }
}

.compre-monitor {
  :deep(.el-input) {
    --el-select-input-focus-border-color: transparent;
    --el-select-border-color-hover: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-border-color: transparent;
    --el-input-bg-color: transparent;
    --value-color: #ffffff;
    --icon-color: #75BDFF;
    .el-input__inner {
      text-align: right;
      color: var(--value-color);
    }
    .el-select__icon {
      color: var(--icon-color);
    }
  }
}
</style>