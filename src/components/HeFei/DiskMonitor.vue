<script setup lang="ts">
import moment from "moment";
import BlockHeader from "@/components/HeFei/BlockHeader.vue";
import DiskChart from "@/components/HeFei/MonitorChart/DiskChart.vue";
import { diskMonitorApi } from "./js/api"

const userYYYYMMDDHHmm = "YYYY-MM-DD HH:mm"
const userYYYYMMDDHHmmss = "YYYY-MM-DD HH:mm:ss"

const props = withDefaults(defineProps<{
  title?: string;
  showHeader?: boolean
}>(), {
  title: "",
  showHeader: false,
})
// 时间
const time = ref("");
// 数据
const deviceList = ref<Array<{
  ip: string;
  title: string;
  total: number;
  used: number;
  residue: number;
}>>([])

async function getData() {
  try {
    const res: any = await diskMonitorApi();
    if (res.code != 200) throw new Error("diskMonitorApi");
    const updateTime = res.data?.updateTime;
    const serverList = res.data?.serverList || []
    time.value = updateTime ? moment(res.data.updateTime, userYYYYMMDDHHmmss).format(userYYYYMMDDHHmm) : "";
    deviceList.value = serverList.map((item: any) => {
      const total = parseFloat(parseFloat(item.totalCapacity)?.toFixed(0) || "1")
      const residue = parseFloat(parseFloat(item.surplusCapacity)?.toFixed(0) || "1")
      const used = parseFloat((total - residue)?.toFixed(0) || "0")
      return {
        ip: item.ip || "",
        title: item.serverName || "",
        total: total,
        used: used,
        residue: residue
      }
    })
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="base-block">
    <div class="header-container">
      <BlockHeader :title="title" :time="time" v-if="showHeader"/>
    </div>
    <div class="block-body">
      <div class="station-selection">
      </div>
      <div class="main-content">
        <div class="device-list">
          <el-scrollbar>
            <div class="device-item" v-for="item in deviceList" :key="item.title">
              <DiskChart :ip="item.ip" :title="item.title" :total="item.total" :used="item.used" :residue="item.residue"/>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.base-block {
  --block-width: 100%;
  --block-height: 100%;
  --block-header-height: 35px;
  --font-size: 14px;

  --header-icon-color: #4eb4ff;
}
.base-block {
  width: var(--block-width);
  height: var(--block-height);
  font-size: var(--font-size);
  display: flex;
  flex-direction: column;
  .block-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    .station-selection {
      padding-top: 10px;
    }
    .main-content {
      flex: 1;
      min-height: 0;
      .device-list {
        height: 100%;
        .device-item {
          height: 135px;
          padding-top: 10px;
        }
      }
    }
  }
}
</style>