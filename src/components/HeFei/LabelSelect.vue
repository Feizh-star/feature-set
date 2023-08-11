<script setup lang="ts">

const props = withDefaults(defineProps<{
  label?: string;
  direction?: "left" | "right";
  modelValue: any;
}>(), {
  label: "",
  direction: "left",
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()


const innerValue = computed({
  get() {
    return props.modelValue
  },
  set(newVal: any) {
    emits('update:modelValue', newVal)
  }
});
</script>

<template>
  <div class="label-select" :class="{ 'd-right': direction === 'right' }">
    <div class="label">{{ label }}</div>
    <div class="select">
      <el-select v-model="innerValue" placeholder="请选择" style="width: 108px">
        <slot></slot>
      </el-select>
    </div>
  </div>
</template>

<style scoped lang="less">
.label-select {
  --label-color: #4EB4FF;
  --value-color: #EFEFEF;
  --border-color: #4EB4FF;
  --border-width: 3px;
  --hor-padding: 16px;
}
.label-select {
  display: flex;
  padding: 0 var(--hor-padding);
  border-left: var(--border-width) solid var(--border-color);
  background-image: linear-gradient(90deg, #29506e, #1b2631 40%, transparent);
  &.d-right {
    justify-content: flex-end;
    border-left: none;
    border-right: var(--border-width) solid var(--border-color);
    background-image: linear-gradient(-90deg, #29506e, #1b2631 40%, transparent);
  }
  .label {
    display: inline-flex;
    align-items: center;
    color: var(--label-color);
  }
  .select {
    :deep(.el-input) {
      --el-select-input-focus-border-color: transparent;
      --el-select-border-color-hover: transparent;
      --el-input-hover-border-color: transparent;
      --el-input-border-color: transparent;
      .el-input__inner {
        text-align: center;
        color: var(--value-color);
      }
      .el-select__icon {
        color: var(--value-color);
      }
    }
  }
}
</style>