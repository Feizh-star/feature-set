<script setup lang="ts">
import { ref } from "vue";
import icon1 from "@/assets/compre/warning-icon/warning-icon1.png";
import icon2 from "@/assets/compre/warning-icon/warning-icon2.png";
import icon3 from "@/assets/compre/warning-icon/warning-icon3.png";
import icon4 from "@/assets/compre/warning-icon/warning-icon4.png";
import icon5 from "@/assets/compre/warning-icon/warning-icon5.png";

const infoList = ref([
  {
    icon: icon1,
    name: "数据获取",
    value: 1633,
  },
  {
    icon: icon2,
    name: "质量控制",
    value: 19,
  },
  {
    icon: icon3,
    name: "诊断勘误",
    value: 0,
  },
  {
    icon: icon4,
    name: "数据评估",
    value: 0,
  },
  {
    icon: icon5,
    name: "维护维修",
    value: 0,
  },
])
</script>

<template>
  <div class="warning-info">
    <div class="title">
      <span>信息统计</span>
    </div>
    <div class="info-items">
      <div class="info-items-inner">
        <div class="info-item" v-for="(item, index) in infoList" :key="index">
          <div class="item-img">
            <img :src="item.icon" />
          </div>
          <div class="item-data">
            <div class="data-number">{{ item.value }}</div>
            <div class="data-name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.warning-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .info-items {
    flex: 1;
    min-height: 0;
    padding: 0 8px;
    .info-items-inner {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      .info-item {
        width: 33.33%;
        height: 50%;
        display: flex;
        .item-img {
          width: 20px;
          display: flex;
          align-items: flex-end;
          > img {
            width: 100%;
            position: relative;
            bottom: 5px;
          }
        }
        .item-data {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 12px;
          color: var(--text-color);
          padding-left: 3px;
          white-space: nowrap;
          .data-number {
            font-size: 16px;
            padding-bottom: 3px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>