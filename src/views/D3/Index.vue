<script setup lang="ts">
import { useCycleChart } from '@/views/D3/composition/cycle-chart'

const { radianGradient } = useCycleChart()
</script>

<template>
  <div class="d3-test">
    <el-scrollbar>
      <div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
            <div class="grid-content bg-purple">
              <div class="radian-gradient" ref="radianGradient"></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="less">
.d3-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 8px;
  .grid-content {
    width: 100%;
    height: 100%;
  }
  .bg-purple {
    background-color: #efefef;
  }
  :deep(.el-row) {
    margin: 0 !important;
    .el-col {
      height: 400px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .radian-gradient {
    width: 100%;
    height: 100%;
  }
}
</style>