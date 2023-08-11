<script setup lang="ts">
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import warningIcon1 from "@/assets/hefei/warning/w.png";

const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})

const info = reactive({
  icon: warningIcon1,
  title: "合肥市气象台发布高温橙色预警信号",
  detail: "合肥市气象台2023年07月11日09时17分变更发布高温橙色预警信号。预计今天我市大部分地区最高气温将升至37℃以上，请注意防范！"
})
</script>

<template>
  <div class="base-block">
    <div class="header-container">
      <BlockHeader :title="title" time="" v-if="showHeader"/>
    </div>
    <div class="block-body">
      <div class="station-selection">
      </div>
      <div class="main-content">
        <div class="warning-info">
          <div class="wi-left">
            <img :src="info.icon" />
          </div>
          <div class="wi-right">
            <span>{{ info.title }}</span>
          </div>
        </div>
        <div class="warning-detail">
          <el-scrollbar>
            <span>{{ info.detail }}</span>
          </el-scrollbar>
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
  --warning-title-fs: 18px;
  --warning-content-fs: 16px;

  --header-icon-color: #4eb4ff;
  --warning-title-color: #FF9400;
  --warning-content-color: #C1CDDB;
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
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: 0 16px;
      .warning-info {
        height: 45%;
        display: flex;
        .wi-left {
          display: flex;
          align-items: center;
          > img {
            height: 80%;
          }
        }
        .wi-right {
          flex: 1;
          min-width: 0;
          padding-left: 10px;
          display: flex;
          align-items: center;
          font-size: var(--warning-title-fs);
          color: var(--warning-title-color);
        }
      }
      .warning-detail {
        height: 55%;
        color: var(--warning-content-color);
        font-size: var(--warning-content-fs);
        letter-spacing: 3px;
        line-height: 26px;
      }
    }
  }
}
</style>