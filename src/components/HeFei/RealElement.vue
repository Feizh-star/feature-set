<script setup lang="ts">
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import LabelSelect from "@/components/HeFei/LabelSelect.vue";

// 图标
import icon1 from "@/assets/hefei/eleicon/大气压@2x.png";
import icon2 from "@/assets/hefei/eleicon/风速@2x.png";
import icon3 from "@/assets/hefei/eleicon/降水@2x.png";
import icon4 from "@/assets/hefei/eleicon/能见度@2x.png";
import icon5 from "@/assets/hefei/eleicon/温度@2x.png";
import icon6 from "@/assets/hefei/eleicon/湿度@2x.png";

const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})
// 时间
const time = ref("2023-08-02 11:00");

// 站点选择
const monitorSel = ref();
const monitorOptions = ref([
  { value: 'ss', label: '蜀山站', },
]);

// 要素列表
const eles = reactive([
  {
    name: "温度",
    icon: icon5,
    unit: "℃",
    key: "tem",
    value: "",
    parse: (value: any) => value
  },
  {
    name: "降水",
    icon: icon3,
    unit: "mm",
    key: "rain",
    value: "",
    parse: (value: any) => value
  },
  {
    name: "湿度",
    icon: icon6,
    unit: "%",
    key: "rhu",
    value: "",
    parse: (value: any) => value
  },
  {
    name: "风速",
    icon: icon2,
    unit: "m/s",
    key: "speed",
    value: "",
    parse: (value: any) => value
  },
  {
    name: "能见度",
    icon: icon4,
    unit: "m",
    key: "vis",
    value: "",
    parse: (value: any) => value
  },
  {
    name: "大气压",
    icon: icon1,
    unit: "kpa",
    key: "pressure",
    value: "",
    parse: (value: any) => value
  },
])
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
      <div class="element-list">
        <div class="element-item" v-for="item in eles" :key="item.key">
          <div class="ele-icon">
            <img :src="item.icon" />
          </div>
          <div class="ele-info">
            <div class="ele-name">{{ item.name || "" }}</div>
            <div class="ele-value">{{ item.parse(item.value || "--") }}{{ item.unit || "" }}</div>
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
  --ele-name-color: #A7F1FF;
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
    .element-list {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-wrap: wrap;
      .element-item {
        width: 33.33%;
        height: 50%;
        display: flex;
        padding-top: 10px;
        .ele-icon {
          display: flex;
          align-items: center;
          > img {
            height: 100%;
            max-height: 70px;
          }
        }
        .ele-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          .ele-name {
            padding-bottom: 8px;
            color: var(--ele-name-color);
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>