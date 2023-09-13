<script setup lang="ts">
import { computed, nextTick, ref, watch, onBeforeUnmount } from 'vue'
import VueDatePicker from 'vue-datepicker-next'
import { useResizeObserver } from '@vueuse/core'
import 'vue-datepicker-next/index.css'
import 'vue-datepicker-next/locale/zh-cn.es'
import parseIcon from './assets/parse.png'
import runIcon from './assets/run.png'
import prevIcon from './assets/prev.png'
import nextIcon from './assets/next.png'
import moment from 'moment'

const userYYYYMMDDHHmm = 'YYYY-MM-DD HH:mm'
const userHHmm = 'HH:mm'

interface ITimelineProps {
  disableStart?: Date | null
  origin?: string
  default?: string
  selected: string
  prevHours?: number
  nextHours?: number
  prevDelta?: number
  nextDelta?: number
  prevInterval?: number
  nextInterval?: number
  valueFormatter?:string
}

const props = withDefaults(defineProps<ITimelineProps>(), {
  disableStart: null,
  valueFormatter: 'YYYYMMDDHHmm',
  origin: moment().minute(0).format('YYYYMMDDHHmm'),
  default: moment().minute(0).format('YYYYMMDDHHmm'),
  prevHours: 24,
  nextHours: 24,
  prevDelta: 1,
  nextDelta: 1,
  prevInterval: 2,
  nextInterval: 2,
})
/* eslint-disable */
const emits = defineEmits<{
  (e: "update:selected", value: string): void;
  (e: "update:default", value: string): void;
  (e: "timeline-change", selectTime: string, timeList: string[], formatStr: string): void;
}>();
/* eslint-enable */
const innerSelected = computed({
  get() {
    return props.selected
  },
  set(value: string) {
    emits('update:selected', value)
  },
})
watch(innerSelected, newSelTime => {
  const index = timeList.value.findIndex(item => item === newSelTime)
  if (index === -1) {
    // eslint-disable-next-line no-console
    console.warn('无效的时间，不在当前时间轴上')
  } else {
    selectTimeIndex.value = index
    const tickItemEl = tickItemRefs[selectTimeIndex.value]
    const handleEl = tickItemEl?.getElementsByClassName('click-handle')[0] as HTMLElement
    handleEl?.click()
  }
}, {
  // default现在时间变化后，innerSelected变化，但DOM还是旧的handleEl?.click()又会把innerSelected设置为旧的选中时间
  // 所以需要再DOM更新后再处理
  flush: 'post'
})
// 现在 时刻，这样写只是为了使外界能够通过v-model的方式拿到 现在 时刻的值
const innerDefaultTime = computed({
  get() {
    return props.default
  },
  set(value: string) {
    emits('update:default', value)
  },
})
const justOneEdge = computed(() => props.nextHours === 0 || props.prevHours === 0)
const hasFeature = computed(() => props.nextHours !== 0)
const hasHistory = computed(() => props.prevHours !== 0)

// 时间轴选择的时刻，真正的 现在 时刻
const innerOriginTime = ref('')
watch(
  () => props.origin,
  newOrigin => {
    innerOriginTime.value = newOrigin
  },
  { immediate: true }
)

const tickItemRefs: Array<HTMLElement> = [] // tick元素列表

const selectTimeIndex = ref() // 选择时刻对应的在timeList中的索引
const prevCount = computed(() => Math.ceil(props.prevHours / props.prevDelta)) // 过去时间的刻度数量
const nextCount = computed(() => Math.ceil(props.nextHours / props.nextDelta)) // 未来时间的刻度数量
// originTime变化时，重新计算新的时间轴
const timeList = computed(() => {
  const origin = innerOriginTime.value
  const prevDelta = props.prevDelta
  const nextDelta = props.nextDelta
  const prevCountVal = prevCount.value
  const nextCountVal = nextCount.value
  const historyTimes: string[] = []
  const futureTimes: string[] = []
  for (let i = 1; i < prevCountVal + 1; i++) {
    let currentClock = moment(origin, props.valueFormatter)
    const hisClockStr = currentClock.subtract((prevCountVal + 1 - i) * prevDelta, 'hour').format(props.valueFormatter)
    historyTimes.push(hisClockStr)
  }
  for (let i = 1; i < nextCountVal + 1; i++) {
    let currentClock = moment(origin, props.valueFormatter)
    const futClockStr = currentClock.add(i * nextDelta, 'hour').format(props.valueFormatter)
    futureTimes.push(futClockStr)
  }
  const result = [...historyTimes, origin, ...futureTimes]
  emits('timeline-change', origin, result, props.valueFormatter)
  return result
})
// 根据时间轴上的时间获取当前时刻的刻度宽度比例：即一个刻度代表几个小时
const getOneTickHours = (time: string) => {
  const origin = moment(innerOriginTime.value, props.valueFormatter).toDate().getTime()
  const current = moment(time, props.valueFormatter).toDate().getTime()
  const result = current - origin >= 0 ? props.nextDelta : props.prevDelta
  return result
}
const getIntervalByIndex = (index: number) => (index >= prevCount.value ? props.nextInterval : props.prevInterval)
// “现在”时间变化时，重置所选时间，computed会计算新的时间轴
watch(
  () => innerOriginTime.value,
  newVal => {
    innerDefaultTime.value = newVal
    innerSelected.value = newVal
    selectTimeIndex.value = prevCount.value
  },
  { immediate: true }
)
// 过去时长，过去分度，未来时长，未来分度变化，都要把当前选择的时间设置为“现在时间”
watch([() => props.prevHours, () => props.prevDelta, () => props.nextHours, () => props.nextDelta], () => {
  innerSelected.value = innerOriginTime.value
  selectTimeIndex.value = prevCount.value
  debounceResizeFunc(timeLineContainerRefs.value)
}, { flush: 'post' })

// 当时间轴内容变化时，所选时间会重置，重新设置tip的位置
const timeLineContainerRefs = ref() // 每个刻度的html元素，用于计算tip位置
const observers = [] as any[] // useResizeObserver实例，用于stop
const selectTipLeft = ref(0) // 当前选中时刻的刻度距左侧的距离
const miniEveryWidth = ref(0) // 最小分度的div宽度
const nextHistory = computed(() => `calc(100% - ${miniEveryWidth.value}px)`) // 当只有过去时间时，最后补齐的长度
const currentTickRate = ref(0) // “现在”origin时刻占总长度的比例
// 时间序列初始化后，设置 最小分度的div宽度 “现在”origin时刻占总长度的比例 当前选中时刻的刻度距左侧的距离
watch(
  timeList,
  () => {
    nextTick(() => {
      observers.forEach(item => item?.stop())
      observers.splice(0, observers.length)
      const observer = useResizeObserver(timeLineContainerRefs.value, entries => {
        const entry = entries[0]
        debounceResizeFunc(entry.target as HTMLElement)
      })
      observers.push(observer)
    })
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  observers.forEach(item => item?.stop())
})
function debounceResizeFunc(element: HTMLElement) {
  const totalWidth = element.offsetWidth
  const everyWidth = totalWidth / (props.prevHours + (props.nextHours / props.nextDelta + 1) * props.nextDelta)
  const historyTickEls = tickItemRefs.slice(0, prevCount.value)
  const currentTickLeft = historyTickEls.reduce((prev, current) => prev + current.getBoundingClientRect().width, 0)
  currentTickRate.value = Math.round((currentTickLeft / totalWidth) * 10000) / 100
  const position = (totalWidth * currentTickRate.value) / 100
  miniEveryWidth.value = everyWidth
  selectTipLeft.value = position
}

// 事件处理
const runing = ref(false)
let runingTimer: ReturnType<typeof setInterval> | null = null
const runingIcon = computed(() => (runing.value ? runIcon : parseIcon))
/**
 * 点击刻度，选择时间，并设置tip位置
 * @param e 事件对象
 * @param index 索引
 * @param clock 时间
 */
function selectTimeEvent(e: Event, index: number, clock: string) {
  const handle = e.target as HTMLElement
  const item = handle.parentNode as HTMLElement
  const position = item.offsetLeft
  selectTipLeft.value = position
  innerSelected.value = clock
  selectTimeIndex.value = index
}
/**
 * 上一个，下一个
 * @param type 类型
 */
function nextAndPrevTick(type: 'prev' | 'next') {
  let nextIndex = 0
  if (type === 'next') {
    nextIndex = selectTimeIndex.value + 1
  } else {
    nextIndex = selectTimeIndex.value - 1
    nextIndex = nextIndex < 0 ? 0 : nextIndex
  }
  selectTimeIndex.value = nextIndex % timeList.value.length
  const tickItemEl = tickItemRefs[selectTimeIndex.value]
  const handleEl = tickItemEl.getElementsByClassName('click-handle')[0] as HTMLElement
  handleEl?.click()
}
/**
 * 播放暂停
 */
function clickRuning() {
  runing.value = !runing.value
  if (runing.value) {
    nextAndPrevTick('next')
    runingTimer = setInterval(() => {
      nextAndPrevTick('next')
    }, 1000)
  } else {
    runingTimer && clearInterval(runingTimer)
  }
}
onBeforeUnmount(() => {
  runingTimer && clearInterval(runingTimer)
})

/**
 * 禁止disableStart指定日期之后的时间选择-日期
 * @param date Date
 */
function disableDate(date: Date) {
  return props.disableStart ? date > props.disableStart : false
}
/**
 * 禁止disableStart指定日期之后的时间选择-时间
 * @param date Date
 */
function disableTime(date: Date) {
  return props.disableStart ? date > props.disableStart : false
}
/**
 * 将时间格式化
 */
function timeFormatter(time: string, f1: string, f2: string) {
  let result = ''
  try {
    result = moment(time, f1).format(f2)
  } catch (error) {
    result = ''
  }
  return result
}
function futureLastMaxWidth(index: number, lastIndex: number) {
  return props.nextHours > 0 && index === lastIndex ? `${Math.min(miniEveryWidth.value, 30)}px` : 'revert'
}
/**
 * 还原 innerOriginTime 为 props.origin
 */
function refreshInnerOriginTime() {
  innerOriginTime.value = props.origin
}
</script>

<template>
  <div class="timeline-48">
    <div class="timeline-inner">
      <div class="timeline-dselect">
        <VueDatePicker
          type="datetime"
          v-model:value="innerOriginTime"
          :format="userYYYYMMDDHHmm"
          :value-type="valueFormatter"
          :disabled-date="disableDate"
          :disabled-time="disableTime"
          :show-minute="false"
          :confirm="true"
          :clearable="false"
          :hour-step="1"
          confirm-text="确定"
        />
        <!-- @confirm="confirmFunc" -->
        <div class="refresh-btn" @click="refreshInnerOriginTime">
          <span class="timeline-iconfont icon-shuaxin" />
        </div>
      </div>
      <div class="ctrl-btns">
        <div class="ctrl-icon"><img :src="prevIcon" @click="nextAndPrevTick('prev')" /></div>
        <div class="ctrl-icon-center">
          <img :src="runingIcon" @click="clickRuning" />
        </div>
        <div class="ctrl-icon"><img :src="nextIcon" @click="nextAndPrevTick('next')" /></div>
      </div>
      <div class="time-line">
        <div class="top-tips" :style="{ visibility: !justOneEdge ? 'visible' : 'hidden' }">
          <div class="both history-24">过去{{ prevHours }}小时</div>
          <div class="current">
            <span class="current-tip">现在</span>
          </div>
          <div class="both future-24">未来{{ nextHours }}小时</div>
        </div>
        <div class="time-line-main">
          <div class="show-line">
            <div class="prev-history" v-show="hasHistory" :style="{ width: Math.min(miniEveryWidth, 30) + 'px' }" />
            <div class="past" v-show="hasHistory" />
            <div class="next-history" v-show="!hasFeature" :style="{ width: Math.min(miniEveryWidth, 30) + 'px' }" />
            <div class="prev-future" v-show="!hasHistory" :style="{ width: Math.min(miniEveryWidth, 30) + 'px' }" />
            <div class="future" v-show="hasFeature" />
          </div>
          <div class="line-ticks" ref="timeLineContainerRefs">
            <div
              class="tick-item"
              v-for="(clock, index) in timeList"
              :style="{ flex: getOneTickHours(clock), maxWidth: futureLastMaxWidth(index, timeList.length - 1) }"
              :key="clock + Math.random().toString(36).slice(2, 12)"
              :ref="el => tickItemRefs[index] = el as HTMLElement"
            >
              <div class="click-handle" @click="(e: Event) => selectTimeEvent(e, index, clock)" />
              <div
                class="time-text"
                v-show="(prevCount > 0 ? index % prevCount : index) % getIntervalByIndex(index) === 0"
                @click="(e: Event) => selectTimeEvent(e, index, clock)"
              >
                {{ timeFormatter(clock, valueFormatter, userHHmm) }}
              </div>
            </div>
            <div class="datetime-tips">
              <span>{{ timeFormatter(innerSelected, valueFormatter, userYYYYMMDDHHmm) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.timeline-48 {
  --history24-text-color: #66f6ff;
  --future24-text-color: #5477e2;
  --tips-text-color: #ffffff;
  --time-text-color: #ffffff;
  --left-line-bgc: #354985;
  --right-line-border: #0073ff;
  --refresh-color: #5182ff;

  --top-tip-fontsize: 12px;
  --line-padding-left: 32px;
  --line-padding-right: 32px;
  --show-line-height: 10px;
  --refresh-fontsize: 24px;
}
.timeline-48 {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  :deep(*) {
    box-sizing: border-box;
  }
  .timeline-inner {
    width: 100%;
    height: 100%;
    display: flex;
    .ctrl-btns {
      padding-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 100%;
        cursor: pointer;
      }
      .ctrl-icon {
        height: 40%;
      }
      .ctrl-icon-center {
        height: 60%;
        padding: 0 10px;
      }
    }
  }
  .time-line {
    flex: 1;
    min-width: 0;
    padding-right: var(--line-padding-right);
    display: flex;
    flex-direction: column;
    .top-tips {
      height: 14px;
      display: flex;
      padding-left: var(--line-padding-left);
      font-size: var(--top-tip-fontsize);
      .current {
        width: 0;
        position: relative;
        .current-tip {
          position: absolute;
          bottom: calc(50%);
          transform: translateX(-50%);
          white-space: nowrap;
          color: var(--tips-text-color);
          background-image: linear-gradient(#46a2fb, #3a65f9);
          padding: 3px 8px;
        }
      }
      .both {
        text-align: center;
      }
      .history-24 {
        width: v-bind("currentTickRate + '%'");
        color: var(--history24-text-color);
      }
      .future-24 {
        width: v-bind("100 - currentTickRate + '%'");
        color: var(--future24-text-color);
      }
    }
    .time-line-main {
      flex: 1;
      min-height: 0;
      padding-top: 3px;
      padding-left: var(--line-padding-left);
      .show-line {
        width: 100%;
        height: var(--show-line-height);
        display: flex;
        position: relative;
        .prev-history {
          position: absolute;
          right: 100%;
          height: 100%;
          background-color: var(--left-line-bgc);
        }
        .next-history {
          position: absolute;
          left: v-bind(nextHistory);
          height: 100%;
          background-color: var(--left-line-bgc);
        }
        .prev-future {
          position: absolute;
          right: 100%;
          height: 100%;
          border: 1px dashed var(--right-line-border);
          border-right: none;
        }
        .past {
          width: v-bind("currentTickRate + '%'");
          height: 100%;
          background-color: var(--left-line-bgc);
        }
        .future {
          width: v-bind("100 - currentTickRate + '%'");
          height: 100%;
          border: 1px dashed var(--right-line-border);
          border-left: none;
        }
      }
      .line-ticks {
        width: 100%;
        height: 0;
        display: flex;
        position: relative;
        .tick-item {
          height: 0;
          flex: 1;
          min-width: 0;
          position: relative;
          &::before {
            content: '';
            display: inline-block;
            width: 1px;
            height: 5px;
            background-color: #fff;
            position: absolute;
            top: 1px;
            // left: 50%;
            // transform: translateX(-50%);
          }
          .click-handle {
            width: v-bind("miniEveryWidth + 'px'");
            height: var(--show-line-height);
            position: absolute;
            bottom: 0;
            // left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
          }
          .time-text {
            position: absolute;
            top: 8px;
            // left: 50%;
            cursor: pointer;
            transform: translateX(-50%);
            height: 30px;
            color: var(--time-text-color);
            font-size: 12px;
          }
        }
        .datetime-tips {
          position: absolute;
          bottom: 23px;
          left: v-bind("selectTipLeft + 'px'");
          transform: translateX(-50%);
          transition: all 0.3s ease;
          white-space: nowrap;
          color: var(--tips-text-color);
          background-image: linear-gradient(#46a2fb, #3a65f9);
          padding: 3px 8px;
          &::before {
            @size-width: 12px;
            @size-height: 18px;
            content: '';
            display: block;
            position: absolute;
            top: calc(100% - 1px);
            left: 50%;
            transform: translateX(-50%);
            width: @size-width;
            height: @size-height;
            box-sizing: border-box;
            // background-image: linear-gradient(#3a65f9, #315ff9);
            border-top: (@size-height / 2) solid #3a65f9;
            border-left: (@size-width / 2) solid transparent;
            border-right: (@size-width / 2) solid transparent;
            border-bottom: (@size-height / 2) solid transparent;
          }
          &::after {
            @size-width: 5px;
            @size-height: 28px;
            content: '';
            display: none;
            position: absolute;
            top: calc(100% + 5px);
            left: 50%;
            transform: translateX(-50%);
            width: @size-width;
            height: @size-height;
            box-sizing: border-box;
            background-image: radial-gradient(farthest-side ellipse at 50% 50%, #3ac6f9, #358fd4, #3574d400);
          }
        }
      }
    }
  }
  .timeline-dselect {
    position: absolute;
    left: 10px;
    bottom: calc(100% + 10px);
    .refresh-btn {
      position: absolute;
      left: calc(100% + 20px);
      top: 50%;
      transform: translateY(-50%);
      color: var(--refresh-color);
      cursor: pointer;
    }
  }
  @font-face {
    font-family: 'timeline-iconfont'; /* Project id 4232915 */
    src: url('./assets/iconfont/iconfont.woff2?t=1693475277181') format('woff2'),
      url('./assets/iconfont/iconfont.woff?t=1693475277181') format('woff'),
      url('./assets/iconfont/iconfont.ttf?t=1693475277181') format('truetype');
  }

  .timeline-iconfont {
    font-family: 'timeline-iconfont' !important;
    font-size: var(--refresh-fontsize);
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-shuaxin:before {
    content: '\e644';
  }
}
</style>
