<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="form-item">
    <div class="form-label" v-if="label">{{ label || '' }}</div>
    <div class="form-com">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-item {
  display: flex;
  padding: 8px 16px;

  .form-label {
    display: inline-flex;
    align-items: center;
    min-width: 86px;
    padding-right: 16px;
  }

  .form-com {
    display: inline-flex;
    align-items: center;
  }
}
</style>
