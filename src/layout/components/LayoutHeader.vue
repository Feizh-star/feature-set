<template>
  <header class="layout-header">
    <div class="header-left">
      <div class="header-title">
        项目模板
      </div>
      <div class="header-time">
        {{ currentTime }}
      </div>
    </div>
    <div class="header-right">
      <div class="user-info">
        <div class="user-icon">
          <span class="iconfont icon-yonghu-copy"></span>
        </div>
        <div class="user-name">
          <div class="showpoint" title="用户名">用户名</div>
        </div>
      </div>
      <div class="header-icons">
        <!-- <span class="iconfont icon-kaiguan"></span> -->
        <img src="@/assets/images/exit2x.png" style="width: 66%;">
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const weekMap: any = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
}

const currentTime = ref(updateTime())

function updateTime() {
  type ns = number | string
  const dateIns = new Date()
  let fullYear = dateIns.getFullYear()
  let month: ns = dateIns.getMonth() + 1
  let date: ns = dateIns.getDate()
  let day: ns = dateIns.getDay()
  let hour: ns = dateIns.getHours()
  let minute: ns = dateIns.getMinutes()
  let second: ns = dateIns.getSeconds()
  month = month < 10 ? `0${month}` : month
  date = date < 10 ? `0${date}` : date
  hour = hour < 10 ? `0${hour}` : hour
  minute = minute < 10 ? `0${minute}` : minute
  second = second < 10 ? `0${second}` : second
  return `${fullYear}-${month}-${date} ${hour}:${minute}:${second} 星期${weekMap[day]}`
}
let interval: any
onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = updateTime()
  }, 1000)
})
onUnmounted(() => {
  interval && clearInterval(interval)
})

</script>

<style lang="scss" scoped>
$max-height: 68px; // header最大高度
$header-pl: 34px; // header padding-left
$header-pr: 70px; // header padding-right
$userinfo-width: 140px; // 用户信息宽度
$title-fs: 20px; // 标题字体大小
$icon-fs: 28px; // 右侧大icon大小
$default-space: 5px; // 默认小间距
$left-skew: 40deg; // 倾斜角度

$header-left-bgc: linear-gradient(90deg, #276bb4, #2b93ff); // header左侧背景色
$header-bgc: #3b7abd; // 头部背景色
$text-color: #ffffff; // 文本颜色
$left-shadow: 2px 0 6px 1px rgba(0, 0, 0, .2); // 头部左侧阴影

.layout-header {
  max-height: $max-height;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-color: $header-bgc;
  // background-image: url("@/assets/images/headerbg-copy2x.png");
  background-repeat: no-repeat;
  background-size: 101% 101%;
  background-position: -1px -1px;
  background-origin: padding-box;
  color: $text-color;
  overflow: hidden;
  .header-left {
    font-size: $title-fs;
    font-weight: bold;
    display: flex;
    padding-left: $header-pl;
    padding-right: $header-pr;
    background: $header-left-bgc;
    transform-origin: 0px 0px;
    transform: skew(#{-$left-skew}, 0deg);
    box-shadow: $left-shadow;
    .header-title,
    .header-time {
      display: inline-flex;
      align-items: center;
      transform-origin: 0px 0px;
      transform: skew($left-skew, 0deg);
    }
    .header-time {
      padding-left: $default-space;
    }
  }
  .header-right {
    display: flex;
    padding-right: $header-pl;
    .header-icons {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding-right: $default-space;
      cursor: pointer;
      .icon-kaiguan {
        font-size: $icon-fs;
        color: #ffffff;
      }
    }
    .user-info {
      max-width: $userinfo-width;
      padding-right: 16px;
      display: flex;
      cursor: pointer;
      .user-icon {
        padding-right: 8px;
        min-height: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-yonghu-copy {
          font-size: $icon-fs;
        }
      }
      .user-name {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        .showpoint {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>