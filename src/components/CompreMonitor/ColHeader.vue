<script setup lang="ts">
// eslint-disable-next-line
const props = withDefaults(defineProps<{
    title?: string;
  }>(),
  {
    title: "",
  }
);
</script>

<template>
  <div class="col-header">
    <div class="header-title">
      <div class="title-text">{{ title || "" }}</div>
    </div>
    <div class="header-residue">
      <slot name="residue"></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.col-header {
  --header-height: 34px;
  --header-icon-height: 16px;
  --header-icon-width: 4px;

  --header-icon-bgc: #ff7b00;
}
.col-header {
  @title-left: 16px;
  height: var(--header-height);
  display: flex;
  position: relative;
  .header-title {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0 @title-left;
    &::before {
      box-sizing: border-box;
      content: "";
      display: block;
      height: var(--header-icon-height);
      width: var(--header-icon-width);
      background-color: var(--header-icon-bgc);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
    .title-text {
      position: relative;
      padding-right: 3px;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .header-residue {
    flex: 1;
    min-width: 0;
  }
}
</style>