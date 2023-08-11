<script setup lang="ts">
import RealElement from "@/components/HeFei/RealElement.vue";
import StationMonitor from "@/components/HeFei/StationMonitor.vue";
import RadarProduct from "@/components/HeFei/RadarProduct.vue";
import ThreeForecast from "@/components/HeFei/ThreeForecast.vue";
import SevenForecast from "@/components/HeFei/SevenForecast.vue";
import RealWarning from "@/components/HeFei/RealWarning.vue";
import WarningStatistics from "@/components/HeFei/WarningStatistics.vue";
import DeviceMonitor from "@/components/HeFei/DeviceMonitor.vue";
import DiskMonitor from "@/components/HeFei/DiskMonitor.vue";

const monitorSel = ref();
const monitorOptions = ref([
  {
    value: '选项1',
    label: '选项1',
  },
  {
    value: '选项2',
    label: '选项2',
  },
]);

const radarIndex = ref(0)
function switchProduct() {
  radarIndex.value = (radarIndex.value + 1) % 3
}
</script>

<template>
  <div class="same-vue-page">
    <div class="hefei-test">
      <el-scrollbar>
        <div style="display: inline-flex;">
          <div class="column">
            <div class="column-header">
              <div class="header-title">监测</div>
              <div class="header-feature">
                <el-select v-model="monitorSel" placeholder="请选择" style="width: 108px">
                  <el-option
                    v-for="item in monitorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column-content">
              <div class="item real-element">
                <RealElement title="实时气象要素" show-header />
              </div>
              <div class="item station-monitor">
                <StationMonitor title="站点实况监控" show-header />
              </div>
              <div class="item radar-product" @click="switchProduct">
                <RadarProduct title="臭氧激光雷达产品" v-show="radarIndex === 0" show-header />
                <RadarProduct title="气溶胶激光雷达产品" v-show="radarIndex === 1" show-header />
                <RadarProduct title="风廓线雷达产品" v-show="radarIndex === 2" show-header />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="column-header">
              <div class="header-title">预报</div>
              <div class="header-feature">
                <el-select v-model="monitorSel" placeholder="请选择" style="width: 108px">
                  <el-option
                    v-for="item in monitorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column-content">
              <div class="item three-forecast">
                <ThreeForecast title="逐3小时预报" show-header />
              </div>
              <div class="item seven-forecast">
                <SevenForecast title="7天预报" show-header />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="column-header">
              <div class="header-title">预警</div>
              <div class="header-feature">
                <el-select v-model="monitorSel" placeholder="请选择" style="width: 108px">
                  <el-option
                    v-for="item in monitorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column-content">
              <div class="item real-warning">
                <RealWarning title="实时预警信息" show-header />
              </div>
              <div class="item warning-statistics">
                <WarningStatistics title="预警统计" show-header />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="column-header">
              <div class="header-title">信息化</div>
              <div class="header-feature">
                <el-select v-model="monitorSel" placeholder="请选择" style="width: 108px">
                  <el-option
                    v-for="item in monitorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="column-content">
              <div class="item device-monitor">
                <DeviceMonitor title="设备监控" show-header />
              </div>
              <div class="item disk-monitor">
                <DiskMonitor title="磁盘监控" show-header />
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.same-vue-page {
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .hefei-test {
    flex: 1;
    min-height: 0;
    padding: 10px;
    border: 1px solid #dddddd;
    background-color: #020B17;
    color: #efefef;
  }
  .column {
    width: 531px;
    padding-right: 44px;
    display: flex;
    flex-direction: column;
    .column-header {
      height: 40px;
      padding: 0 72px;
      background: url("@/assets/hefei/column-header.png") no-repeat 0px 0px/contain;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #C1CDDB;
      font-size: 26px;
    }
    .column-content {
      flex: 1;
      min-height: 0;
      .item {
        padding-top: 16px;
      }
      .real-element {
        height: 242px;
      }
      .station-monitor {
        height: 342px;
      }
      .radar-product {
        height: 348px;
      }
      .three-forecast {
        height: 466px;
      }
      .seven-forecast {
        height: 466px;
      }
      .real-warning {
        height: 248px;
      }
      .warning-statistics {
        height: 684px;
      }
      .device-monitor {
        height: 736px;
      }
      .disk-monitor {
        height: 196px;
      }
    }
  }
}
:deep(.el-input__wrapper) {
  --el-input-bg-color: transparent;
}
</style>