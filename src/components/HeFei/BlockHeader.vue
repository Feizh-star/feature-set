<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string;
  time?: string;
}>(), {
  title: "",
  time: ""
})
</script>

<template>
  <div class="block-header">
    <div class="header-title">
      <div class="title-text">{{ title || "" }}</div>
    </div>
    <div class="header-right">
      <div class="current-time" v-if="!!time">
        <slot name="time">
          <span>数据时间：{{ time || "" }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.block-header {
  @title-left: 16px;
  height: var(--block-header-height);
  display: flex;
  position: relative;
  &::after {
    content: "";
    display: block;
    height: 5px;
    width: calc(100% - @title-left);
    background-image: linear-gradient(90deg, #163e62, #020b17);
    position: absolute;
    bottom: 5px;
    left: @title-left;
    z-index: 0;
  }
  .header-title {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0 @title-left;
    &::before {
      box-sizing: border-box;
      content: "";
      display: block;
      height: calc(var(--block-header-height) * 0.6);
      width: calc(var(--block-header-height) * 0.7);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      border-left: calc(var(--block-header-height) * 0.35) solid var(--header-icon-color);
      border-top: calc(var(--block-header-height) * 0.3) solid transparent;
      border-right: calc(var(--block-header-height) * 0.35) solid transparent;
      border-bottom: calc(var(--block-header-height) * 0.3) solid transparent;
    }
    .title-text {
      position: relative;
      padding-right: 3px;
      font-size: 22px;
      font-style: italic;
      font-weight: 700;
      background-image: linear-gradient(#c2def6, #77c3fc);
      -webkit-background-clip:text;
      background-clip: text;
      color: transparent;
      z-index: 1;
    }
  }
  .header-right {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    .current-time {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>