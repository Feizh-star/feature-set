<script setup lang="tsx">
import CustomTable from '@/components/Table/CustomTable'
import Form from '@/components/Form/Form'
import { ElDatePicker, ElInput, ElOption, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'
import { useFormCfg } from './info/form-test'

const config1 = [
  {
    props: {
      label: "岗位编号",
      prop: "postId",
      minWidth: 180,
    },
  },
  {
    props: {
      label: "岗位名称",
      prop: "postName",
      minWidth: 180,
    },
    formatter(h: any, cfg: any, scope: any) {
      const content = cfg.deps.postName.find((item: any) => item.value === scope.row.postName)?.label || ''
      return h('span', content)
    },
    headerFormatter(h: any, cfg: any, scope: any) {
      console.log(cfg, scope)
      return h('span', '123')
    }
  },
  {
    props: {
      label: "岗位编码",
      prop: "postCode",
      minWidth: 180,
    },
    children: [
      {
        props: {
          label: "二级1",
          prop: "postCode1",
          minWidth: 180,
        },
      },
      {
        props: {
          label: "二级2",
          prop: "postCode2",
          minWidth: 180,
        },
      }
    ]
  },
  {
    props: {
      label: "岗位排序",
      prop: "postSort",
      minWidth: 180,
    },
  },
  {
    props: {
      label: "创建时间",
      prop: "createTime",
      minWidth: 180,
    },
  },
]
const config2 = [
  {
    props: {
      label: "岗位编号",
      prop: "postId",
      minWidth: 180,
    },
  },
  {
    props: {
      label: "岗位名称",
      prop: "postName",
      minWidth: 180,
    }
  },
  {
    props: {
      label: "创建时间",
      prop: "createTime",
      minWidth: 180,
    },
  },
]
const config = shallowRef(config1)
const testData = ref([
  { postId: '1', postName: '1', postCode: '3', postCode1: '3-1', postCode2: '3-2', postSort: '4', createTime: '2023' },
  { postId: '1', postName: '2', postCode: '3', postCode1: '3-1', postCode2: '3-2', postSort: '4', createTime: '2023' },
  { postId: '1', postName: '3', postCode: '3', postCode1: '3-1', postCode2: '3-2', postSort: '4', createTime: '2023' },
  { postId: '1', postName: '4', postCode: '3', postCode1: '3-1', postCode2: '3-2', postSort: '4', createTime: '2023' },
])
const deps = {
  postName: [
    { label: '岗位1', value: '1' },
    { label: '岗位2', value: '2' },
    { label: '岗位3', value: '3' },
    { label: '岗位4', value: '4' },
  ]
}

function selChange(a: any) {
  console.log(a)
}

const table = shallowRef()
onMounted(() => {
  console.log(table.value.$refs.eltable.clearSelection)
})

// const formRef = ref()
// const asyncList = ref<{label: string; value: string}[]>([])
// onMounted(() => {
//   setTimeout(() => {
//     asyncList.value = [
//       { label: '选项1', value: 's1' },
//       { label: '选项2', value: 's2' },
//       { label: '选项3', value: 's3' },
//     ]
//   }, 3000)
// })
// const formCfg = shallowRef([
//   {
//     key: 'input1',
//     modelEvent: 'onInput',
//     elFormItem: {
//       label: '输入框'
//     },
//     component: ElInput,
//     componentProps: {
//       maxlength: 10,
//       onChange: (value: string) => {
//         console.log('change', value)
//       }
//     },
//     componentSlot: {
//       prefix: () => h('span', '123')
//     }
//   },
//   {
//     key: 'sel1',
//     modelEvent: 'onChange',
//     elFormItem: {
//       label: '选择框'
//     },
//     component: ElSelect,
//     componentProps: {
//       placeholder: '选择一个',
//       onChange: (value: string) => {
//         console.log('change', value)
//       }
//     },
//     componentSlot: {
//       default: () => asyncList.value.map(item => h(ElOption, { label: item.label, value: item.value }))
//     }
//   },
//   {
//     key: 'date1',
//     defaultValue: '2023-11-16 00:00',
//     modelEvent: 'onChange',
//     elFormItem: {
//       label: '日期'
//     },
//     component: ElDatePicker,
//     componentProps: {
//       placeholder: '选择一个日期',
//       valueFormat: 'YYYY-MM-DD HH:mm',
//       type: 'datetime',
//       onChange: (value: string) => {
//         console.log('change', value)
//       }
//     }
//   },
//   {
//     key: 'datetimerange1',
//     modelEvent: 'onChange',
//     elFormItem: {
//       label: '日期范围'
//     },
//     component: ElDatePicker,
//     componentProps: {
//       startPlaceholder: "Start date",
//       endPlaceholder: "End date",
//       type: 'datetimerange',
//       onChange: (value: string) => {
//         console.log('change', value)
//       }
//     },
//     componentSlot: {
//       'range-separator': () => h('span', '///')
//     }
//   },
//   {
//     key: 'radio1',
//     modelEvent: 'onChange',
//     elFormItem: {
//       label: '二选一'
//     },
//     elFormItemSlot: [
//       {
//         component: ElRadio,
//         componentProps: {
//           label: 'r1'
//         },
//         componentSlot: {
//           default: () => '基本站'
//         }
//       },
//       {
//         component: ElRadio,
//         componentProps: {
//           label: 'r2'
//         },
//         componentSlot: {
//           default: () => '所有'
//         }
//       }
//     ]
//   }
// ])
// const formData = ref({})
// // watch(formCfg, newCfg => {
// //   const fd: any = {}
// //   for (const item of newCfg) {
// //     fd[item.key] = item.defaultValue || ''
// //   }
// //   formData.value = fd
// // }, { immediate: true })
// watch(formData, (newVal) => {
//   console.log('newVal', newVal)
// })

const {
  formRef,
  formCfg,
  formData
} = useFormCfg()
</script>

<template>
  <div class="custom-table-test">
    <div class="form-test">
      <Form v-model="formData" :forms="formCfg" ref="formRef" inline />
    </div>
    <CustomTable
      :data="testData"
      :columns="config"
      :deps="deps"
      border
      height="100%"
      ref="table"
    />
  </div>
</template>

<style scoped lang="scss">
.custom-table-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 16px;
  .form-test {
    padding-bottom: 16px;
  }
}
</style>