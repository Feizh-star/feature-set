<script setup lang="ts">

function handleDownload() {
  
}
</script>

<template>
  <div class="month-report">
    <div class="title">
      <span>数据周报</span>
    </div>
    <div class="report-list">
      <el-scrollbar>
        <div class="document-item" v-for="n in 10" :key="n">
          <div class="doc-title">
            <div class="title-nowrap">
              <span>{{ "综合气象观测数据质量周报.doc" }}</span>
            </div>
          </div>
          <div class="download-icon">
            <img src="@/assets/compre/icons/download.png" @click="handleDownload"/>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="less">
.month-report {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .report-list {
    flex: 1;
    min-height: 0;
    .document-item {
      padding-bottom: 5px;
      display: flex;
      .doc-title {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        padding-left: 8px;
        font-size: 14px;
        .title-nowrap {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .download-icon {
        width: 30px;
        display: flex;
        align-items: center;
        padding: 0 5px;
        > img {
          width: 100%;
          transform: translateY(-2px);
          cursor: pointer;
        }
      }
    }
  }
}
</style>