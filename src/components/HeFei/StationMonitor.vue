<script setup lang="ts">
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import LabelSelect from "@/components/HeFei/LabelSelect.vue";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';
const modules = [Navigation];


const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})
// 时间
const time = ref("");

// 站点选择
const monitorSel = ref();
const monitorOptions = ref([
  { value: 'ss', label: '蜀山站', },
]);

</script>

<template>
  <div class="base-block">
    <div class="header-container">
      <BlockHeader :title="title" time="" v-if="showHeader"/>
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
      <div class="main-content">
        <swiper
          loop
          :slidesPerView="1.3"
          :navigation="true"
          :centeredSlides="true"
          :loopAdditionalSlides="3"
          :spaceBetween="10"
          :modules="modules"
        >
          <swiper-slide v-for="i in 9" :key="i">
            <div class="carousel-item">{{ i }}</div>
          </swiper-slide>
        </swiper>
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
      padding-top: 10px;
      :deep(.swiper) {
        width: 100%;
        height: 100%;
        .swiper-slide {
          width: 60%;
        }
        .swiper-button-prev,
        .swiper-button-next {
          transform: scale(0.5);
        }
        .carousel-item {
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          background: #fff;
        }
        .swiper-slide-prev,
        .swiper-slide-next {
          position: relative;
          &::after {
            content: "";
            display: block;
            position: absolute;
            inset: 0;
          }
          .carousel-item {
            transform: scaleY(0.8);
          }
        }
        .swiper-slide-prev {
          &::after {
            background-image: linear-gradient(-90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9) 30%);
          }
        }
        .swiper-slide-next {
          &::after {
            background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9) 30%);
          }
        }
      }
    }
  }
}
</style>