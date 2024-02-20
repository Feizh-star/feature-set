<script setup lang="ts">
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import VueEllipsis from '@/directives/ellipsis/VueEllipsis.vue'

const props = defineProps<{
  pName: string
}>()
const formInline = reactive({
  user: '',
  region: '',
})
function onSubmit() {
  console.log('submit!');
}
onMounted(() => {
  console.log('sameVue!');
  formInline.user = props.pName
})

const target = ref(null)
const mx = ref(0)
const my = ref(0)
onMounted(() => {
  const { x, y } = useMouseInElement(target)
  watch(x, (newX) => {
    mx.value = newX
  })
  watch(y, (newY) => {
    my.value = newY
  })
})

const text = ref(`这是一段\
  很长很长很长很长很长很长很长很长很长很长很长\
  很长很长很长很长很长很长很长很长很长很长很长\
  很长很长很长很长很长很长很长很长很长很长很长\
  很长很长很长很长很长很长很长很长很长很长很长\
  很长很长很长很长很长很长很长很长很长很长很长\
  的文字。真的很长很长。`)
</script>

<template>
  <div class="same-vue-page">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div ref="target" class="test-mouse">
      <h1>Hello world</h1>
      <div>{{ mx }}</div>
      <div>{{ my }}</div>
    </div>
    <div class="test-text">
      <VueEllipsis :text="text || ''" :line="5" show-unfold />
    </div>
  </div>
</template>

<style scoped lang="scss">
.same-vue-page {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.test-mouse {
  width: 200px;
  height: 200px;
  border: 1px solid #efefef;
}
.test-text {
  width: 35%;
  text-align: justify;
}
</style>