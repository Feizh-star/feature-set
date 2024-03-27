<script setup lang="ts">
import TestMap from '@/views/Map/pages/plugintest/components/TestMap.vue'
import { useWindField } from './compositions/useWindField'
const mapRef = shallowRef()

useWindField({ mapRef })
</script>

<template>
  <div class="plugin-test">
    <div class="map-container">
      <TestMap ref="mapRef" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.plugin-test {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .map-container {
    flex: 1;
    min-height: 0;
    :deep(.shadow-layer) {
      transform: translate(4px, 8px);
    }
  }
}
</style>