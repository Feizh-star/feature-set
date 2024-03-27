<script setup lang="ts">
import { useAttrs, ref, watch, reactive, onActivated } from 'vue'
import vEllipsis, { type IVEllipsisValue } from './index'

const attrs = useAttrs()
const props = withDefaults(
  defineProps<{
    showUnfold?: boolean
    text?: string
  }>(),
  {
    showUnfold: false,
    text: '',
  }
)
const emits = defineEmits<{
  (e: 'ellipsis-change', value: boolean): void
  (e: 'fold-change', value: boolean): void
}>()

const innerFold = ref(true)
watch(innerFold, (newVal) => {
  emits('fold-change', newVal)
})
const isEllipsis = reactive({
  status: false,
})
watch(
  () => isEllipsis.status,
  (newVal) => {
    emits('ellipsis-change', newVal)
    innerFold.value = newVal
  }
)
function remainClick(status: boolean) {
  if (props.showUnfold) {
    innerFold.value = status
    emits('ellipsis-change', status)
  }
}

// 组件重新激活时，重置参数默认收起，修复路由缓存导致离开页面再进入，自动展开问题
onActivated(() => {
  isEllipsis.status = true
  innerFold.value = true
})
</script>

<template>
  <div class="vue-ellipsis-container">
    <div
      class="vue-ellipsis-inner vue-ellipsis-full-text"
      v-if="showUnfold && !innerFold && isEllipsis.status"
    >
      <span v-html="text || ''"></span>
      <span class="vue-ellipsis-fold" @click="() => remainClick(true)">收起</span>
    </div>
    <div
      class="vue-ellipsis-inner"
      v-else
      v-ellipsis="{
        line: 5,
        ...attrs,
        content: text || '',
        isEllipsis: isEllipsis,
        remain: showUnfold ? '展开' : '',
        remainClick: () => remainClick(false),
      } as IVEllipsisValue"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.vue-ellipsis-container {
  :deep(.vue-ellipsis-unfold),
  .vue-ellipsis-fold {
    color: #24acf2;
    cursor: pointer;
  }
}
</style>