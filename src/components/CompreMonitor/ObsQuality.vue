<script setup lang="ts">
// import { computed, ref } from "vue";
import ColHeader from "./ColHeader.vue";
import DataAc from "./ObsQuality/DataAc.vue";
import QualityCtrl from "./ObsQuality/QualityCtrl.vue";
import InfoStat from "./ObsQuality/InfoStat.vue";
import WarningInfo from "./ObsQuality/WarningInfo.vue";
import MonthReport from "./ObsQuality/MonthReport.vue";

// eslint-disable-next-line
const props = withDefaults(defineProps<{
    title?: string;
  }>(),
  {
    title: "",
  }
);

function loadFile(e: Event) {
  const btnEl = (e.currentTarget || e.target) as HTMLElement;
  const fileInput = btnEl.getElementsByTagName('input')[0];
  fileInput.click()
}
function fileChange(e: Event) {
  const fileInput = e.target as HTMLInputElement
  const file = fileInput.files![0]
  console.log(file);
}
</script>

<template>
  <div class="observe-quality">
    <ColHeader title="观测质量">
      <template #residue>
        <div class="import">
          <div class="import-button" @click="loadFile">
            <input type="file" name="选择表格" style="display: none;" @click.stop @change="fileChange">
            <img class="import-icon" src="@/assets/compre/icons/import.png" />
            <span>导入</span>
          </div>
        </div>
      </template>
    </ColHeader>
    <div class="observe-quality-list">
      <div class="list-item week-report-box">
        <div class="item-inner">
          <MonthReport />
        </div>
      </div>
      <div class="list-item quality-ctrl-box">
        <div class="item-inner">
          <QualityCtrl />
        </div>
      </div>
      <div class="list-item data-acq-box">
        <div class="item-inner">
          <DataAc />
        </div>
      </div>
      <div class="list-item info-stat-box">
        <div class="item-inner">
          <InfoStat />
        </div>
      </div>
      <div class="list-item warning-info-box">
        <div class="item-inner">
          <WarningInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.observe-quality {
  box-sizing: border-box;
  color: #ffffff;
  &:deep(*) {
    box-sizing: border-box;
  }
}
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// 子组件的通用样式
.children-common-style {
  .title {
    padding: 8px 8px;
    font-size: 14px;
    font-weight: bold;
    color: var(--subtitle-color);
  }
  .charts {
    flex: 1;
    min-height: 0;
    display: flex;
    .chart {
      width: 50%;
      height: 100%;
      position: relative;
      .left-center {
        .absolute-center();
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;.left-center-data {
          text-align: center;
          .lcd-number {
            color: #33b9fa;
          }
        }
        .split-line {
          width: 30px;
          height: 3px;
          margin: 1px 0;
          background-image: radial-gradient(ellipse, #33b9fa, #031530);
        }
      }
      .right-center {
        .absolute-center();
        font-size: 14px;
        border-radius: 50%;
        background-image: linear-gradient(135deg, #35bbfb, #1886f5);
        .right-center-data {
          text-align: center;
          .absolute-center();
          .split-line {
            width: 30px;
            height: 3px;
            margin: 1px 0;
            background-image: radial-gradient(ellipse, #c4ddf1, #1886f5);
          }
        }
      }
    }
  }
}
.observe-quality {
  height: 100%;
  display: flex;
  flex-direction: column;
  .observe-quality-list {
    background-color: var(--body-bgc);
    padding: var(--body-padding);
    flex: 1;
    min-height: 0;
    .list-item {
      padding-bottom: 10px;
      &:last-child {
        padding-bottom: 0;
      }
      &.week-report-box {
        height: 20%;
      }
      &.quality-ctrl-box {
        height: 23%;
      }
      &.data-acq-box {
        height: 23%;
      }
      &.info-stat-box {
        height: 18%;
      }
      &.warning-info-box {
        height: 16%;
      }
      :deep(.item-inner) {
        height: 100%;
        width: 100%;
        background-color: var(--chart-item-bgc);
        border: 1px solid var(--chart-item-border);
        .children-common-style();
      }
    }
  }
  .import {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    .import-button {
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      > span {
        padding-left: 5px;
        color: #5477e2;
      }
    }
    .import-icon {
      width: 16px;
    }
  }
}
.header-feature {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>