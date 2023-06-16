<template>
  <div class="horizontal-scroll-bar" :style="{ width: width, height: height }">
    <button
      class="btn"
      v-show="actived"
      :style="{ height: height }"
      @click="clickHandler(0)"
      @mousedown="longPress(0, 'down')"
      @mouseup="longPress(0, 'up')"
    >
      <span>&lt;</span>
    </button>
    <div 
      class="legend-row"
      :class="{ 'is-scroll': actived }"
      ref="scroll"
      :style="{ height: height, 'line-height': height }"
    >
      <div class="scroll-items" ref="scrollItems">
        <slot></slot>
      </div>
    </div>
    <button
      class="btn"
      v-show="actived"
      :style="{ height: height }"
      @click="clickHandler(1)"
      @mousedown="longPress(1, 'down')"
      @mouseup="longPress(1, 'up')"
    >
      <span>&gt;</span>
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
const EaseInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60) }
})()

function move(el, key, amount) {
  el.style.transform = `${key}(${-amount}px)`
}

function position(el, key) {
  const transform = el.style.transform
  const reg = new RegExp(`(?<=${key}\\()-?\\d+(?=(px)?\\))`)
  const disMatch = transform.match(reg)
  const dis = (disMatch && parseFloat(disMatch[0])) || 0
  return dis
}

function scrollTo({ el, to, duration, scrollKey, callback }) {
  if (!el) return null
  to = to || 0
  scrollKey = scrollKey || 'scrollTop'
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  const start = -position(el, scrollKey)
  const change = to - start
  const increment = 20
  let currentTime = 0
  const animateScroll = function () {
    currentTime += increment
    if (currentTime < duration) {
      let val = EaseInOutQuad(currentTime, start, change, duration)
      // debugger
      move(el, scrollKey, val)
      requestAnimFrame(animateScroll)
    } else {
      move(el, scrollKey, to)
      if (callback && typeof (callback) === 'function') {
        callback(to)
      }
    }
  }
  animateScroll()
}
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.call(this, ...args)
    }, delay)
  }
}

export default defineComponent({
  data() {
    return {
      actived: false,
      isMoving: false,
    }
  },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '32px'
    },
    duration: {
      type: Number,
      default: 200
    },
    itemSelector: {
      type: String,
      default: '.scroll-items > .scroll-item'
    }
  },
  mounted() {
    this.init()
    this._init = debounce(this.init, 150)
    window.addEventListener('resize', this._init)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this._init)
  },
  methods: {
    init() {
      this.actived = this.isScroll()
      this.getScrollWidthArr()
    },
    isScroll() {
      const scrollDiv = this.$refs.scroll
      if (!scrollDiv?.scrollWidth) return false
      const scrollWidth = scrollDiv.scrollWidth
      const clientWidth = scrollDiv.clientWidth
      return scrollWidth > clientWidth
    },
    getScrollWidthArr() {
      const scrollDiv = this.$refs.scroll
      if (!scrollDiv?.scrollWidth) return null
      const list = scrollDiv.querySelectorAll(this.itemSelector)
      const itemWidths = Array.prototype.map.call(list, item => item.offsetWidth)
      this.itemWidths = [0]
      for (let i = 1; i < itemWidths.length; i++) {
        let lastWidth = this.itemWidths[i - 1]
        this.itemWidths.push(lastWidth + itemWidths[i - 1])
      }
      if (this.actived) {
        scrollDiv.scrollLeft = 0
        this.scrollIndex = 0
      }
    },
    clickHandler(type) {
      // this.scrollHandler(type)
    },
    /**
     * 处理滚动，左0，右1
     */
    scrollHandler(type) {
      const scrollDiv = this.$refs.scroll
      const scrollItems = this.$refs.scrollItems
      if (!scrollDiv?.scrollWidth || this.isMoving) return null
      const currentScrollLeft = -position(scrollItems, 'translateX')
      const maxScrollDis = scrollItems.offsetWidth - scrollDiv.clientWidth
      if (type) {
        if (currentScrollLeft >= 0 && currentScrollLeft < maxScrollDis) {
          this.scrollIndex++
          const nextScrollLeft = this.itemWidths[this.scrollIndex]
          this.isMoving = true
          scrollTo({
            el: scrollItems,
            to: nextScrollLeft <= maxScrollDis ? nextScrollLeft : maxScrollDis,
            duration: this.duration,
            scrollKey: 'translateX',
            callback: (scrollLeft) => {
              this.isMoving = false
              if (Math.abs(scrollLeft - maxScrollDis) < 1) {
                this.$emit('arrived-edge', 1)
              }
            }
          })
        }
      } else {
        if (currentScrollLeft > 0 && currentScrollLeft <= maxScrollDis) {
          this.scrollIndex--
          this.isMoving = true
          scrollTo({
            el: scrollItems,
            to: this.itemWidths[this.scrollIndex],
            duration: this.duration,
            scrollKey: 'translateX',
            callback: (scrollLeft) => {
              this.isMoving = false
              if (Math.abs(scrollLeft - 0) < 1) {
                this.$emit('arrived-edge', 0)
              }
            }
          })
        }
      }
    },
    /**
     * 长按
     */
    longPress(type, mouseType) {
      if (mouseType === 'down') {
        this._readyToScroll = true
        setTimeout(() => {
          if (!this._readyToScroll) {
            this.scrollHandler(type)
            this._times = -1
            return null
          }
          clearInterval(this._timer)
          this._times = 0
          this._timer = setInterval(() => {
            this._times++
            this.scrollHandler(type)
          }, 500)
        }, 180)
      }
      if (mouseType === 'up') {
        this._readyToScroll = false
        clearInterval(this._timer)
        if (this._times === 0) this.scrollHandler(type)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.horizontal-scroll-bar {
  $btn-width: 40px;
  overflow: hidden;
  .btn {
    width: $btn-width;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    color: #333333;
    vertical-align: top;
    cursor: pointer;
    font-size: 18px;
    &:nth-child(1) {
      float: left;
    }
    &:nth-child(2) {
      float: right;
    }
  }
  .legend-row {
    width: 100%;
    float: left;
    display: flex;
    justify-content: center;
    overflow: hidden;
    // overflow-x: scroll;
    // margin-bottom: -17px;
    &.is-scroll {
      justify-content: left;
      width: calc(100% - #{$btn-width * 2});
    }
    .scroll-items {
      display: flex;
      flex-wrap: nowrap;
      :deep(.scroll-item) {
        white-space: nowrap;
      }
    }
  }
}
</style>