import { h, defineComponent } from 'vue'
import { ElDatePicker, ElOption, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'
export const countyList = [
  {
    code: '320800',
    name: '全市',
    province: '32',
    city: '00',
    area: '00'
  },
  {
    code: '320803',
    name: '淮安区',
    province: '32',
    city: '08',
    area: '03'
  },
  {
    code: '320804',
    name: '淮阴区',
    province: '32',
    city: '08',
    area: '04'
  },
  {
    code: '320812',
    name: '清江浦区',
    province: '32',
    city: '08',
    area: '12'
  }
]

export type TFormTypes =
  | 'areaSelect'
  | 'dateTimeRange'
  | 'dateTime'
  | 'dataTypeRadio'
  | 'levelSelect'
  | 'commonSelect'
interface IAnyObject {
  [p: string]: any
}
export interface IFormCfg {
  key: string
  defaultValue?: any
  modelEvent?: string
  elFormItem?: IAnyObject
  elFormItemSlot?: {
    component?: ReturnType<typeof defineComponent> | string
    componentProps?: IAnyObject
    componentSlot?: {
      [p: string]: (
        ...args: any[]
      ) => ReturnType<typeof h> | Array<ReturnType<typeof h>> | string | number | boolean
    }
  }[]
  component?: ReturnType<typeof defineComponent> | string
  componentProps?: IAnyObject
  componentSlot?: {
    [p: string]: (
      ...args: any[]
    ) => ReturnType<typeof h> | Array<ReturnType<typeof h>> | string | number | boolean
  }
}

export const baseForm = new Map<TFormTypes, (...args: any[]) => IFormCfg>([
  [
    'areaSelect',
    (option: Partial<Omit<IFormCfg, 'component'>> = {}) => {
      const cfg = {
        key: 'area',
        modelEvent: 'onChange',
        elFormItem: {
          label: '区域选择：'
        },
        component: ElSelect,
        componentProps: {
          placeholder: '请选择'
        },
        componentSlot: {
          default: () => countyList.map(item => h(ElOption, { label: item.name, value: item.code }))
        }
      }
      const mergeOption = merge(cfg, option)
      return mergeOption
    }
  ],
  [
    'dateTimeRange',
    (option: Partial<Omit<IFormCfg, 'component'>> = {}) => {
      const cfg = {
        key: 'timeRange',
        defaultValue: [new Date(), new Date()] as [Date, Date],
        modelEvent: 'onChange',
        elFormItem: {
          label: '时间设置：'
        },
        component: ElDatePicker,
        componentProps: {
          startPlaceholder: '起始时间',
          endPlaceholder: '结束时间',
          type: 'datetimerange'
        }
      }
      const mergeOption = merge(cfg, option)
      return mergeOption
    }
  ],
  [
    'dateTime',
    (option: Partial<Omit<IFormCfg, 'component'>> = {}) => {
      const cfg = {
        key: 'datetime',
        modelEvent: 'onChange',
        elFormItem: {
          label: '时间设置：'
        },
        component: ElDatePicker,
        componentProps: {
          placeholder: '请选择',
          type: 'datetime'
        }
      }
      const mergeOption = merge(cfg, option)
      return mergeOption
    }
  ],
  [
    'dataTypeRadio',
    (option: Partial<Omit<IFormCfg, 'component'>> = {}) => {
      const cfg = {
        key: 'dataType',
        modelEvent: 'onChange',
        elFormItem: {
          label: '数据类型：'
        },
        component: ElRadioGroup,
        componentSlot: {
          default: () => [
            h(ElRadio, { label: 'base' }, () => '基本站'),
            h(ElRadio, { label: 'all' }, () => '全部站点')
          ]
        }
      }
      const mergeOption = merge(cfg, option)
      return mergeOption
    }
  ],
  [
    'levelSelect',
    (
      listRef: ComputedRef<{ label: string; value: string }[]> | Ref<{ label: string; value: string }[]> = ref([]),
      option: Partial<Omit<IFormCfg, 'component'>> = {}
    ) => {
      const cfg = {
        key: 'element',
        modelEvent: 'onChange',
        elFormItem: {
          label: '要素选择：'
        },
        component: ElSelect,
        componentProps: {
          placeholder: '请选择'
        },
        componentSlot: {
          default: () =>
            listRef.value.map(item => h(ElOption, { label: item.label, value: item.value }))
        }
      }
      const mergeOption = merge(cfg, option)
      return mergeOption
    }
  ],
  [
    'commonSelect',
    (
      list: { label: string; value: string }[] = [],
      option: Partial<Omit<IFormCfg, 'component'>> = {}
    ) => {
      const cfg = {
        key: 'element',
        modelEvent: 'onChange',
        elFormItem: {
          label: '要素选择：'
        },
        component: ElSelect,
        componentProps: {
          placeholder: '请选择'
        },
        componentSlot: {
          default: () => list.map(item => h(ElOption, { label: item.label, value: item.value }))
        }
      }
      const mergeOption = merge(cfg, option)
      return mergeOption
    }
  ]
])

/**
 * 合并对象：可排除指定的key不做深拷贝，不破坏内部结构
 * @param a
 * @param b
 * @returns
 */
export function merge(a: any, b: any, specialKeys = new Set(['component'])) {
  // 检查输入是否为对象
  if (typeof a !== 'object' || typeof b !== 'object') {
    throw new Error('merge 函数只能接受对象类型的参数')
  }

  // 遍历 b 的所有属性
  for (const key in b) {
    // 检查 b 当前属性是否为对象
    if (!specialKeys.has(key) && typeof b[key] === 'object') {
      // 如果 a 当前属性也为对象，则递归合并
      if (typeof a[key] === 'object') {
        merge(a[key], b[key])
      } else {
        // 否则直接复制 b 当前属性到 a 上
        a[key] = deepCopy(b[key])
      }
    } else {
      // 如果 b 当前属性不为对象，则直接覆盖 a 当前属性
      a[key] = b[key]
    }
  }

  return a
}

function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(deepCopy) as unknown as T
  }

  // 创建一个新的对象或数组
  const newObj = (Array.isArray(obj) ? [] : {}) as T

  // 递归复制属性值
  for (const key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key])
    }
  }
  return newObj
}
