<script setup lang="ts">
import { computed, ref } from "vue";
import ColHeader from "./ColHeader.vue";
import AnimationScrollList from "./AnimationScrollList.vue";

import testimg_url from "@/assets/compre/testimg/testimg.png";
import stationList from "./station";

// eslint-disable-next-line
const props = withDefaults(defineProps<{
    title?: string;
    station: string;
  }>(),
  {
    title: "",
  }
);
/* eslint-disable */
const emits = defineEmits<{
  (e: "update:station", s: string): void;
}>()
/* eslint-enable */

const selectOptions = ref(stationList);
const innerStation = computed({
  get() {
    return props.station;
  },
  set(value) {
    emits("update:station", value);
  }
})
const currentIndex = computed(() => {
  return selectOptions.value.findIndex(item => item.value === innerStation.value) || 0
})

const imgList = ref<Array<any>>([]);
onMounted(() => {
  setTimeout(() => {
    imgList.value = new Array(6).fill({
      src: testimg_url,
      title: "设备描述：肥东站属于区域站，始建2021年",
    })
  }, 500)
})
</script>

<template>
  <div class="live-action">
    <ColHeader title="实景监测">
      <template #residue>
        <div class="header-feature">
          <el-select v-model="innerStation" placeholder="请选择" style="width: 108px">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="full-screen">
            <img src="@/assets/compre/icons/fullscreen.png" />
          </div>
        </div>
      </template>
    </ColHeader>
    <div class="live-action-list">
      <AnimationScrollList :list="imgList" :index="currentIndex">
        <template v-slot="{ props }">
          <div class="item-img">
            <img :src="props.src" />
          </div>
          <div class="item-title">
            <span>{{ props.title }}</span>
          </div>
        </template>
      </AnimationScrollList>
    </div>
  </div>
</template>

<style scoped lang="less">
.live-action {
  box-sizing: border-box;
  color: #ffffff;
  &:deep(*) {
    box-sizing: border-box;
  }
}
.live-action {
  height: 100%;
  display: flex;
  flex-direction: column;
  .live-action-list {
    background-color: var(--body-bgc);
    padding: var(--body-padding);
    flex: 1;
    min-height: 0;
    .item-img {
      > img {
        width: 100%;
      }
    }
    .item-title {
      padding-top: 8px;
      line-height: 1.5;
      font-size: 12px;
    }
  }
}
.header-feature {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .full-screen {
    padding: 5px 10px 5px 5px;
    > img {
      height: 16px;
      cursor: pointer;
    }
  }
}
</style>