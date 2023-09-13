<script setup lang="ts">
import { computed, ref } from "vue";
import ColHeader from "./ColHeader.vue";
import AnimationScrollList from "./AnimationScrollList.vue";

import testimg_url from "@/assets/compre/testimg/testimg.png";
import testimg_url1 from "@/assets/compre/testimg/testimg1.png";

// eslint-disable-next-line
const props = withDefaults(defineProps<{
    title?: string;
  }>(),
  {
    title: "",
  }
);

const selectOptions = ref([
  { label: "风廓线雷达", value: "w1" },
  { label: "X波段雷达", value: "w2" },
  { label: "微波辐射仪", value: "w3" },
  { label: "设备4", value: "w4" },
  { label: "设备5", value: "w5" },
  { label: "设备6", value: "w6" },
]);
const equipmentSel = ref("");
const currentIndex = computed(() => {
  return selectOptions.value.findIndex(item => item.value === equipmentSel.value) || 0
})

const imgList = ref<Array<any>>([]);
onMounted(() => {
  setTimeout(() => {
    imgList.value = new Array(6).fill({
      imgs: [
        {
          src: testimg_url1,
          desc: "",
        },
        {
          src: testimg_url,
          desc: "",
        },
      ],
      equipmentName: "风廓线雷达",
      createDate: "2022年10月6日",
      desc: "风廓线雷达是通过向高空发射不同方向的电磁波",
    })
  }, 500)
})
</script>

<template>
  <div class="new-equip">
    <ColHeader title="新型装备">
      <template #residue>
        <div class="header-feature">
          <el-select v-model="equipmentSel" placeholder="请选择" style="width: 118px">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </template>
    </ColHeader>
    <div class="new-equip-list">
      <AnimationScrollList :list="imgList" :index="currentIndex">
        <template v-slot="{ props }">
          <div class="item-img">
            <img :src="image.src" v-for="(image, index) in props.imgs" :key="index"/>
          </div>
          <div class="item-title">
            <div>设备名称：{{ props.equipmentName }}</div>
            <div>建站时间：{{ props.createDate }}</div>
            <div>{{ props.desc }}</div>
          </div>
        </template>
      </AnimationScrollList>
    </div>
  </div>
</template>

<style scoped lang="less">
.new-equip {
  box-sizing: border-box;
  color: #ffffff;
  &:deep(*) {
    box-sizing: border-box;
  }
}
.new-equip {
  height: 100%;
  display: flex;
  flex-direction: column;
  .new-equip-list {
    background-color: var(--body-bgc);
    padding: var(--body-padding);
    flex: 1;
    min-height: 0;
    :deep(.list-item) {
      position: relative;
      &:last-child {
        .item-title {
          bottom: 0px;
        }
      }
    }
    .item-img {
      > img {
        width: 100%;
        vertical-align: bottom;
      }
    }
    .item-title {
      width: 100%;
      padding: 4px;
      line-height: 1.5;
      font-size: 12px;
      position: absolute;
      bottom: 10px;
      background-color: rgba(34, 64, 98, 0.4);
    }
  }
}
.header-feature {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>