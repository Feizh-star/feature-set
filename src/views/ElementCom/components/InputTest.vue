<script setup lang="ts">
import vLimitNumber from '@/directives/vLimitNumber.js'

const numberInput1 = reactive({
  altitude: ''
})

const numberInput2 = ref('')
const limitObj2 = { data: numberInput2, key: 'value', p: 2 }


const numberInput3 = ref('')
const limitObj3 = { data: numberInput3, key: 'value', min: 0, max: 999999 }

const numberInput = ref('')
const limitObj = { data: numberInput, key: 'value', p: 2, min: 0, max: 999999 }
</script>

<template>
  <div class="input-test">
    <el-form
      label-width="80px"
    >
      <el-form-item label="整数">
        <el-input
          v-model="numberInput1.altitude"
          placeholder="限输入整数"
          v-limit-number="{ data: numberInput1, key: 'altitude' }"
        ></el-input>
      </el-form-item>
      <el-form-item label="小数">
        <el-input
          v-model="numberInput2"
          placeholder="限最多两位小数"
          v-limit-number="limitObj2"
        ></el-input>
      </el-form-item>
      <el-form-item label="范围">
        <el-input
          v-model="numberInput3"
          placeholder="0 ~ 999999"
          v-limit-number="limitObj3"
        ></el-input>
      </el-form-item>
      <el-form-item label="input标签">
        <input
          v-model="numberInput"
          placeholder="高度"
          v-limit-number="limitObj"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">

</style>