<script setup lang="ts">
import moment from 'moment'
import Timeline48 from '@/components/TimeLine48/Index.vue'

function debounce(fn: (...args: any[]) => any, delay: number, immediate?: boolean) {
  let timer: number | null = null
  let exed = false
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    if (immediate && !exed) {
      fn.call(this, ...args)
      exed = true
    }
    timer = setTimeout(() => {
      if (!immediate && !exed) fn.call(this, ...args)
      timer = null
      exed = false
    }, delay) as any as number
  }
}

const elementList = ref([
  { label: '要素1', value: 'e1' },
  { label: '要素2', value: 'e2' },
  { label: '要素3', value: 'e3' },
  { label: '要素4', value: 'e4' },
])

const prevHours = ref(24)
const nextHours = ref(24)
const prevDelta = ref(1)
const nextDelta = ref(1)
const prevInterval = ref(2)
const nextInterval = ref(2)
const selectElement = ref('')
const originTime = ref('202309080800')
const defaultTime = ref('')
const selectTime = ref('')
const timelineList = ref<string[]>([])
function timelineChange(origin: string, list: string[]) {
  timelineList.value = list
}

watch(selectElement, () => {
  console.log('1. element change')
  debounceAction(selectTime.value)
  if (Math.random() > 0.4) {
    setTimeout(() => {
      selectTime.value = timelineList.value[Math.floor(Math.random() * timelineList.value.length)]
    }, Math.floor(Math.random() * 71 + 30));
  }
})
watch(selectTime, (newTime) => {
  console.log('2. time change')
  debounceAction(newTime)
})

function action(time: string) {
  console.log(`现在是${moment(time, 'YYYYMMDDHHmm').format('M月D日H时m分')}，请求已发送`)
}
const debounceAction = debounce(function (time) {
  action(time)
}, 200)

/* 
 * 
*/
onMounted(() => {
  window.addEventListener('resize', debounce(function (e) {
    console.log(e)
  }, 500, true))
})
</script>

<template>
  <div class="time-squence">
    <el-form inline>
      <el-form-item>
        <el-radio-group v-model="selectElement" size="small">
          <el-radio-button v-for="item in elementList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="prevHours">
        <el-input-number
          v-model="prevHours"
          :min="0"
          :max="48"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="prevDelta">
        <el-input-number
          v-model="prevDelta"
          :min="0"
          :max="48"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="nextHours">
        <el-input-number
          v-model="nextHours"
          :min="0"
          :max="48"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="nextDelta">
        <el-input-number
          v-model="nextDelta"
          :min="0"
          :max="48"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="prevInterval">
        <el-input-number
          v-model="prevInterval"
          :min="1"
          :max="48"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="nextInterval">
        <el-input-number
          v-model="nextInterval"
          :min="1"
          :max="48"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div class="timeline-container">
      <Timeline48
        :prevHours="prevHours"
        :nextHours="nextHours"
        :prevDelta="prevDelta"
        :nextDelta="nextDelta"
        :prevInterval ="prevInterval"
        :nextInterval ="nextInterval"
        v-model:selected="selectTime"
        :origin="originTime"
        v-model:default="defaultTime"
        @timeline-change="timelineChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-squence {
  padding-top: 20px;
  .timeline-container {
    background-color: rgb(16, 23, 32);
    padding-top: 65px;
  }
}
</style>