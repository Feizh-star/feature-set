import { ElForm, ElFormItem } from 'element-plus'
import { h, computed, defineComponent, useAttrs } from 'vue'

export default defineComponent({
  props: {
    forms: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const innerModelValue = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        ctx.emit('update:modelValue', value)
      }
    })
    const refList = ref([])
    const attrs = useAttrs()
    const formKey = computed(() => (props.forms, Math.random().toString(36).slice(2, 10)))
    const formItems: ReturnType<typeof h>[] = props.forms.map((item: any) => {
      return (
        <ElFormItem {...{ ...item.elFormItem, ref: refList.value }}>
          {() => {
            if (item.elFormItemSlot?.length > 0) {
              return item.elFormItemSlot.map((singleCom: any) =>
                h(
                  singleCom.component,
                  {
                    ...singleCom.componentProps,
                    modelValue: innerModelValue.value[item.key],
                    'onUpdate:modelValue': (value: any) => {
                      innerModelValue.value = {
                        ...innerModelValue.value,
                        [item.key]: value
                      }
                    }
                  },
                  singleCom.componentSlot || {}
                )
              )
            } else {
              return h(
                item.component,
                {
                  ...item.componentProps,
                  modelValue: innerModelValue.value[item.key],
                  'onUpdate:modelValue': (value: any) => {
                    innerModelValue.value = {
                      ...innerModelValue.value,
                      [item.key]: value
                    }
                  }
                },
                item.componentSlot || {}
              )
            }
          }}
        </ElFormItem>
      )
    })
    return () => (
      <ElForm {...{ ref: 'elform', ...attrs, key: formKey.value }}>{() => formItems}</ElForm>
    )
  }
})
