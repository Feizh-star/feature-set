<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </el-config-provider>
</template>

<style scoped>

</style>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}
* {
  box-sizing: border-box;
}

.page-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 8px;
  .page-btns {
    padding-bottom: 8px;
  }
  .page-main {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
