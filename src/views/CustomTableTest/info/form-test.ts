import { baseForm } from './useForm'
import type { IFormCfg } from './useForm'
import { ref } from 'vue'

const rainAmountList = [
  { label: '≥10（mm）', value: 'r-10', isLeaf: true },
  { label: '≥25（mm）', value: 'r-25', isLeaf: true },
  { label: '≥50（mm）', value: 'r-50', isLeaf: true },
  { label: '≥100（mm）', value: 'r-100', isLeaf: true }
]
const areaPlane = [
  { label: '1小时雨量', value: 'ap-1', isLeaf: true },
  { label: '3小时雨量', value: 'ap-3', isLeaf: true },
  { label: '6小时雨量', value: 'ap-6', isLeaf: true },
  { label: '12小时雨量', value: 'ap-12', isLeaf: true },
  { label: '24小时雨量', value: 'ap-24', isLeaf: true },
  { label: '累计雨量', value: 'ap-total', isLeaf: true }
]
const rainHighList = [
  {
    label: '1小时峰值',
    value: 'rh-1',
    isLeaf: false,
    children: [
      { label: '整点峰值', value: 'rh-1h-clock', isLeaf: true },
      { label: '10分钟滚动峰值', value: 'rh-1h-10m', isLeaf: true }
    ]
  },
  { label: '3小时峰值', value: 'rh-3', isLeaf: true },
  { label: '6小时峰值', value: 'rh-6', isLeaf: true },
  { label: '12小时峰值', value: 'rh-12', isLeaf: true }
]
export const elementTree = [
  {
    label: '雨量',
    value: 'rain',
    isLeaf: false,
    children: [
      ...[
        { label: '小时内雨量', value: 'rain-hour' },
        { label: '整点雨量', value: 'rain-clock' },
        { label: '3小时雨量', value: 'rain-3h' },
        { label: '6小时雨量', value: 'rain-6h' },
        { label: '12小时雨量', value: 'rain-12h' },
        { label: '累积雨量', value: 'rain-total' },
        { label: '06-06雨量', value: 'rain-0606' },
        { label: '08-08雨量', value: 'rain-0808' },
        { label: '20-20雨量', value: 'rain-2020' }
      ].map(item => ({
        label: item.label,
        value: item.value,
        isLeaf: false,
        children: [...rainAmountList]
      })),
      {
        label: '区域面雨量',
        value: 'rain-ap',
        isLeaf: false,
        children: [...areaPlane]
      },
      {
        label: '雨强峰值',
        value: 'rain-high',
        isLeaf: false,
        children: [...rainHighList]
      },
      {
        label: '日内逐时降水',
        value: 'rain-hind',
        isLeaf: true
      },
      ...[
        { label: '日内逐时降水', value: 'rain-hind' },
        { label: '月内逐日降水', value: 'rain-dinm' },
        { label: '连续雨日数', value: 'rain-days' },
        { label: '连续无降水日数', value: 'rain-nodays' }
      ].map(item => ({
        label: item.label,
        value: item.value,
        isLeaf: true
      }))
    ]
  },
  {
    label: '湿度',
    value: 'hum',
    isLeaf: false,
    children: [
      ...[
        { label: '相对湿度', value: 'hum-rhum' },
        { label: '露点湿度', value: 'hum-pohum' },
        { label: '水气压', value: 'hum-prs' }
      ].map(item => ({
        label: item.label,
        value: item.value,
        isLeaf: true
      }))
    ]
  }
]

export interface IMapSourceItem {
  tableCfg: any[]
  formCfg: IFormCfg[]
}
export type TMapSourceKeyValue = [string, IMapSourceItem]
interface ISelectItem {
  label: string
  value: string
}
interface IGetTreePathFormMapParams {
  firstLevel: ComputedRef<ISelectItem[]>
  secondLevel: ComputedRef<ISelectItem[]>
  thirdLevel: ComputedRef<ISelectItem[]>
  stationList: ComputedRef<ISelectItem[]>
}

function getTreePathFormMap({
  firstLevel,
  secondLevel,
  thirdLevel,
  stationList
}: IGetTreePathFormMapParams) {
  const mapSource: TMapSourceKeyValue[] = [
    // 小时内雨量、整点雨量、3小时雨量、6小时雨量、12小时雨量、累积雨量、06-06雨量、08-08雨量、20-20雨量
    ...[
      'rain-hour',
      'rain-clock',
      'rain-3h',
      'rain-6h',
      'rain-12h',
      'rain-total',
      'rain-0606',
      'rain-0808',
      'rain-2020'
    ]
      .map(
        item =>
          ['r-10', 'r-25', 'r-50', 'r-100'].map(item2 => [
            `rain,${item},${item2}`,
            {
              tableCfg: [],
              formCfg: [
                baseForm.get(item === 'rain-hour' ? 'dateTimeRange' : 'dateTime')?.(),
                baseForm.get('areaSelect')?.(),
                baseForm.get('dataTypeRadio')?.(),
                baseForm.get('levelSelect')?.(firstLevel, {
                  key: 'ele1',
                  elFormItem: { label: '雨量' }
                }),
                baseForm.get('levelSelect')?.(secondLevel, {
                  key: 'ele2',
                  elFormItem: { label: '雨量设置' }
                })
              ]
            }
          ]) as TMapSourceKeyValue[]
      )
      .flat(),
    // 区域面雨量-1、3、6、12、24小时雨量、累计雨量
    ...['ap-1', 'ap-3', 'ap-6', 'ap-12', 'ap-24', 'ap-total'].map(
      item =>
        [
          `rain,rain-ap,${item}`,
          {
            tableCfg: [],
            formCfg: [
              baseForm.get(item === 'ap-total' ? 'dateTimeRange' : 'dateTime')?.(),
              baseForm.get('areaSelect')?.(),
              baseForm.get('dataTypeRadio')?.(),
              baseForm.get('levelSelect')?.(firstLevel, {
                key: 'ele1',
                elFormItem: { label: '雨量' }
              }),
              baseForm.get('levelSelect')?.(secondLevel, {
                key: 'ele2',
                elFormItem: { label: '二级目录' }
              })
            ]
          }
        ] as TMapSourceKeyValue
    ),
    // 雨强峰值-1、3、6、12小时峰值
    ...['rh-1', 'rh-3', 'rh-6', 'rh-12'].map(item => {
      const forms = [
        baseForm.get('dateTime')?.(),
        baseForm.get('areaSelect')?.(),
        baseForm.get('dataTypeRadio')?.(),
        baseForm.get('levelSelect')?.(firstLevel, { key: 'ele1', elFormItem: { label: '雨量' } }),
        baseForm.get('levelSelect')?.(secondLevel, {
          key: 'ele2',
          elFormItem: { label: '二级目录' }
        })
      ]
      if (item === 'rh-1') {
        forms.push(
          baseForm.get('levelSelect')?.(thirdLevel, {
            key: 'ele3',
            elFormItem: { label: '三级目录' }
          })
        )
      }
      return [`rain,rain-high,${item}`, { tableCfg: [], formCfg: forms }] as TMapSourceKeyValue
    }),
    // 日内逐时降水
    [
      'rain,rain-hind',
      {
        tableCfg: [],
        formCfg: [
          baseForm.get('dateTimeRange')?.(),
          baseForm.get('areaSelect')?.(),
          baseForm.get('levelSelect')?.(firstLevel, { key: 'ele1', elFormItem: { label: '雨量' } }),
          baseForm.get('levelSelect')?.(stationList, {
            key: 'station',
            elFormItem: { label: '站点' }
          })
        ]
      }
    ] as TMapSourceKeyValue,
    // 月内逐日降水
    [
      'rain,rain-dinm',
      {
        tableCfg: [],
        formCfg: [
          baseForm.get('commonSelect')?.(
            [
              { label: '年', value: 'year' },
              { label: '月', value: 'month' }
            ],
            { key: 'timeType', elFormItem: { label: '时间类型' } }
          ),
          baseForm.get('dateTimeRange')?.(),
          baseForm.get('areaSelect')?.(),
          baseForm.get('levelSelect')?.(firstLevel, { key: 'ele1', elFormItem: { label: '雨量' } }),
          baseForm.get('levelSelect')?.(stationList, {
            key: 'station',
            elFormItem: { label: '站点' }
          })
        ]
      }
    ] as TMapSourceKeyValue,
    // 连续雨日数、连续无降水日数
    ...['rain-days', 'rain-nodays'].map(
      item =>
        [
          `rain,${item}`,
          {
            tableCfg: [],
            formCfg: [
              baseForm.get('dateTimeRange')?.(),
              baseForm.get('areaSelect')?.(),
              baseForm.get('dataTypeRadio')?.(),
              baseForm.get('levelSelect')?.(firstLevel, {
                key: 'ele1',
                elFormItem: { label: '雨量' }
              })
            ]
          }
        ] as TMapSourceKeyValue
    ),
    // 湿度-相对湿度、露点湿度、水气压
    ...['hum-rhum', 'hum-pohum', 'hum-prs'].map(
      item =>
        [
          `hum,${item}`,
          {
            tableCfg: [],
            formCfg: [
              baseForm.get('dateTime')?.(),
              baseForm.get('areaSelect')?.(),
              baseForm.get('dataTypeRadio')?.(),
              baseForm.get('levelSelect')?.(firstLevel, {
                key: 'ele1',
                elFormItem: { label: '湿度' }
              })
            ]
          }
        ] as TMapSourceKeyValue
    )
  ]
  const treePathFormMap = new Map()
  mapSource.forEach(item => treePathFormMap.set(item[0], item[1]))
  return treePathFormMap
}

export function useFormCfg() {
  const formRef = ref()
  const firstLevel = computed(() => {
    const firstLevelParentKey = treePath.value.split(',')[0]
    if (!firstLevelParentKey) return [] as ISelectItem[]
    const list = filterTreeNode(elementTree, firstLevelParentKey, { id: 'value' })?.children || [] as ISelectItem[]
    return list
  })
  const secondLevel = computed(() => {
    const secondLevelParentKey = treePath.value.split(',')[1]
    if (!secondLevelParentKey) return [] as ISelectItem[]
    const list = filterTreeNode(elementTree, secondLevelParentKey, { id: 'value' })?.children || [] as ISelectItem[]
    return list
  })
  const thirdLevel = computed(() => {
    const thirdLevelParentKey = treePath.value.split(',')[2]
    if (!thirdLevelParentKey) return [] as ISelectItem[]
    const list = filterTreeNode(elementTree, thirdLevelParentKey, { id: 'value' })?.children || [] as ISelectItem[]
    return list
  })
  const stationList = computed(() => [] as ISelectItem[])
  const treePathFormMap = getTreePathFormMap({ firstLevel, secondLevel, thirdLevel, stationList })
  // ref('rain,rain-hour,r-10')
  const treePath = computed(() => {
    const pathArray = ['rain', formData.value['ele1'],formData.value['ele2']]
    return pathArray.filter(item => item).join(',')
  })
  const formCfg = computed(() => {
    console.log(treePath.value)
    return treePathFormMap.get(treePath.value)?.formCfg
  })
  const formData = ref({
    ele1: 'rain-hour',
    ele2: 'r-10'
  })
  watch(formCfg, newCfg => {
    const fd: any = {}
    for (const item of newCfg) {
      if ((formData.value as any)[item.key]) {
        fd[item.key] = (formData.value as any)[item.key]
      } else {
        fd[item.key] = item.defaultValue || ''
      }
    }
    formData.value = fd
  }, { immediate: true })
  return {
    formRef,
    firstLevel,
    secondLevel,
    thirdLevel,
    stationList,
    treePathFormMap,
    formCfg,
    formData
  }
}

/**
 * 遍历树，查找指定的节点
 * @param {Array} data 树的根
 * @param {String} id 要查找的标识
 * @param {Object} keys 配置对象：children：指明使用哪个属性作为子级测表；id：指明哪个属性作为id（可以嵌套，例如：'data.id'）
 * @param {Function} compare 自定义比较函数，接收四个参数；树中节点的id值，要查找的id值，当前节点对象，当前节点对象的祖先列表；
 *                   compare 需返回1个boolean值，如果为true，则代表找到了目标
 * @return {Object | null} node：找到的节点对象，其上会多1个’_stack'属性，是1个数组，代表了当前节点在树中的路径（即所有根先）
 */
export function filterTreeNode(data: any, id: any, keys?: any, compare?: any, stack: any[] = []): any {
  const childrenKey = keys?.children || 'children'
  let idKey = keys?.id || 'id'
  idKey = idKey.split('.')
  let result = null
  const compareFunc = compare || ((a: any, b: any) => a === b)
  for (const node of data) {
    // 查找指定的键
    const nodeId = idKey.reduce((p: any, c: any) => p && p[c], node)
    const compareResult = compareFunc(nodeId, id, node, stack)
    if(compareResult) {
      result = {...node}
      break
    } else if (node[childrenKey]) {
      stack.push(node)
      result = filterTreeNode(node[childrenKey], id, keys, compare, stack)
      if (result) break
    } else {
      continue 
    }
  }
  if (!result) stack.pop()
  else result._stack = stack
  return result
}