<script setup lang="ts">
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
</style>