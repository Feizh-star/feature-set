<script setup lang="ts">
import moment from 'moment'
import QRCode from 'qrcode'
import { compressNumbers, decompressNumbers, justNumber } from './script/pakoCompresscopy'
// import './test/handleRaw'
import { compress2img, decompress2img } from './script/compress2img'
import testData from './test/8天的数据.json'
import distData from './test/分布式数据.json'

function clickEvent() {
  testPakoQrcode()

  // 压缩进图片
  // const compressRes = compress2img(distData.data.current, {
  //   deltaTime: 15,
  //   group: 1,
  //   system: 1
  // })
  // console.log('compress2img', compressRes, compressRes.length)
  // decompress2img(compressRes)
}

function testPakoQrcode() {
  // // gzip
  // const { numbers } = justNumber(distData.data.current)
  const testData = distData.data.current.slice(0, 672)
  const compressStr = compressNumbers(testData, {
    deltaTime: 15,
    group: 1,
    system: 1
  })
  console.log(compressStr, compressStr.length)
  const uncompress = decompressNumbers(compressStr)
  // console.log(numbers, uncompress)

  const testStr = compressStr + compressStr + compressStr.substring(0, 175)
  console.log(testStr.length)
  QRCode.toDataURL(testStr)
  .then(url => {
    console.log(url)
  })
  .catch(err => {
    console.error(err)
  })
}

</script>

<template>
  <div class="compress-test">
    <el-button @click="clickEvent">压缩</el-button>
  </div>
</template>

<style scoped lang="scss">
.compress-test {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #fff;
}
</style>