import {
  temAve,
  temMax,
  temMin,
  temDiff,
  rainTotal,
  rainMax,
  rainDay,
  rainNight,
  prsAve,
  prsMax,
  prsMin,
  prsSea,
  humAve,
  humMin,
  humMax,
  windAve,
  windMax,
  windHigh,
  windHour,
  sunHour,
  sunPert
} from './tablecfg'

const rainAmountList = (dateType: 'datetimerange' | 'datetime') => [
  { label: '≥10（mm）', value: 'r-10', dateType, isLeaf: true },
  { label: '≥25（mm）', value: 'r-25', dateType, isLeaf: true },
  { label: '≥50（mm）', value: 'r-50', dateType, isLeaf: true },
  { label: '≥100（mm）', value: 'r-100', dateType, isLeaf: true }
]
const areaPlane = Object.freeze([
  { label: '1小时雨量', value: 'ap-1', dateType: 'datetime', isLeaf: true },
  { label: '3小时雨量', value: 'ap-3', dateType: 'datetime', isLeaf: true },
  { label: '6小时雨量', value: 'ap-6', dateType: 'datetime', isLeaf: true },
  { label: '12小时雨量', value: 'ap-12', dateType: 'datetime', isLeaf: true },
  { label: '24小时雨量', value: 'ap-24', dateType: 'datetime', isLeaf: true },
  { label: '累计雨量', value: 'ap-total', dateType: 'datetimerange', isLeaf: true }
])

export const eleList = Object.freeze([
  {
    label: '雨量',
    value: 'rain',
    children: [
      {
        label: '小时内雨量',
        value: 'rain-hour',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetimerange'),
        tableCfg: rainTotal
      },
      {
        label: '整点雨量',
        value: 'rain-clock',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '3小时雨量',
        value: 'rain-3h',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '6小时雨量',
        value: 'rain-6h',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '12小时雨量',
        value: 'rain-12h',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '累积雨量',
        value: 'rain-total',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '06-06雨量',
        value: 'rain-0606',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '08-08雨量',
        value: 'rain-0808',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '20-20雨量',
        value: 'rain-2020',
        childrenLebel: '雨量设置',
        children: rainAmountList('datetime'),
        tableCfg: rainTotal
      },
      {
        label: '区域面雨量',
        value: 'rain-ap',
        childrenLebel: '三级目录',
        children: areaPlane,
        tableCfg: rainTotal
      },
      {
        label: '雨强峰值',
        value: 'rain-high',
        childrenLebel: '三级目录',
        children: [
          {
            label: '1小时峰值',
            value: 'rh-1h',
            childrenLebel: '四级目录',
            children: [
              { label: '整点峰值', value: 'rh-1h-clock', dateType: 'datetime', isLeaf: true },
              { label: '10分钟滚动峰值', value: 'rh-1h-10m', dateType: 'datetime', isLeaf: true }
            ]
          },
          {
            label: '3小时峰值',
            value: 'rh-3h',
            dateType: 'datetime',
            isLeaf: true
          },
          {
            label: '6小时峰值',
            value: 'rh-6h',
            dateType: 'datetime',
            isLeaf: true
          },
          {
            label: '12小时峰值',
            value: 'rh-12h',
            dateType: 'datetime',
            isLeaf: true
          }
        ],
        tableCfg: rainTotal
      },
      {
        label: '日内逐时降水',
        value: 'rain-hind',
        dateType: 'datetime',
        isLeaf: true,
        tableCfg: rainTotal
      },
      {
        label: '月内逐日降水',
        value: 'rain-dinm',
        dateType: 'datetime',
        isLeaf: true,
        tableCfg: rainTotal
      }
    ]
  },
  {
    label: '气温',
    value: 'tem',
    children: [
      { label: '日平均气温', value: 'tem-ave', tableCfg: temAve },
      { label: '日最高气温及时间', value: 'tem-max', tableCfg: temMax },
      { label: '日最低气温及时间', value: 'tem-min', tableCfg: temMin },
      { label: '日气温日较差', value: 'tem-diff', tableCfg: temDiff }
    ]
  },
  {
    label: '气压',
    value: 'prs',
    children: [
      { label: '日平均气压', value: 'prs-ave', tableCfg: prsAve },
      { label: '日最高气压', value: 'prs-max', tableCfg: prsMax },
      { label: '日最低气压', value: 'prs-min', tableCfg: prsMin },
      { label: '日平均海平面气压', value: 'prs-sea', tableCfg: prsSea }
    ]
  },
  {
    label: '湿度',
    value: 'hum',
    children: [
      { label: '日平均相对湿度', value: 'hum-ave', tableCfg: humAve },
      { label: '最小相对湿度及时间', value: 'hum-min', tableCfg: humMin },
      { label: '最大相对湿度及时间', value: 'hum-max', tableCfg: humMax }
    ]
  },
  {
    label: '风',
    value: 'wind',
    children: [
      { label: '日平均风速', value: 'wind-ave', tableCfg: windAve },
      { label: '日最大风向风速及时间', value: 'wind-max', tableCfg: windMax },
      { label: '日极大风向风速及时间', value: 'wind-high', tableCfg: windHigh },
      { label: '定时风向风速(小时)', value: 'wind-hour', tableCfg: windHour }
    ]
  },
  {
    label: '日照',
    value: 'sun',
    children: [
      { label: '日日照时数', value: 'sun-hour', tableCfg: sunHour },
      { label: '日日照百分比', value: 'sun-pert', tableCfg: sunPert }
    ]
  },
  {
    label: '天气现象',
    value: 'wea',
    children: [
      { label: '雾', value: 'fog' },
      { label: '霾', value: 'fog-bad' },
      { label: '大风', value: 'big-wind' },
      { label: '积雪', value: 'big-snow' },
      { label: '雷暴', value: 'thunderstorm' },
      { label: '冰雹', value: 'hailstone' },
      { label: '雨', value: 'rain' },
      { label: '雪', value: 'snow' }
    ]
  }
])
