import type { MockMethod } from 'vite-plugin-mock'
import moment from 'moment'
import areaStations from '../stations/all-stations'
import allAreas from '../stations/all-areas'
type TAreaKey = keyof typeof areaStations
type TStation = (typeof areaStations)['市辖区'][number]
type TArea = (typeof allAreas)[number]
interface IStationDataQuery {
  dataType: string // 数据类型，二级目录
  stime: string // 起始时间
  etime: string // 结束时间
  area: TAreaKey // 区县名称
  stationType?: string // 站点类型，基本站、所有站点

  needAppearTime?: boolean // 是否需要出现时间

  rainType?: string // 雨量过滤条件，gt10,gt25,gt50,gt100
  areafaceType?: string // 区域面雨量类型，1小时雨量...
  peakType?: string // 峰值类型，1小时峰值-整点，1小时峰值-10分钟滚动，3小时峰值

  temRange?: string // 温度范围过滤条件，gt35,gt37,gt40
  temCalc?: string // 日最高气温计算方式，08-08，20-20；日平均气温计算方式，4时次，24时次
  temDiffType?: string // 变温类型，1小时变温，3小时变温...

  windRange?: string // 风力选择，gt0，gt7，gt8，gt9，gt10

  visRange?: string // 能见度选择，lt1000，lt500，lt200，lt50

  stationList?: string // 用英文逗号隔开的站点id
}

const allStation: TStation[] = []
for (const key in areaStations) {
  allStation.push(...areaStations[key as TAreaKey])
}

export default [
  {
    url: '/mock/stationData', // 模拟的链接
    method: 'get', // 请求方式
    timeout: 300, // 超时时间
    statusCode: 200, // 返回的http状态码
    /**
     * 
     * [ { stationName: '', stationIdC: '', value: 10, time: '----' } ]
     */
    response: ({ query }: { query: IStationDataQuery }) => {
      const { dataType, stime, etime } = query
      let {
        area,
        stationList
      } = query
      area = area || ''
      stationList = stationList || ''

      let rowList: { station: string; value?: number | string; time?: string }[] = []
      if (dataType === 'rainAreaface') {
        // 区域可多选
        let foundAreas: (TArea & {station: string})[] = []
        if (area) {
          const areaIdMap = new Map(allAreas.map(item => [item.code, item]))
          foundAreas = area.split(',').map(id => {
            const areaInfo = areaIdMap.get(id) as TArea
            return { ...areaInfo, station: areaInfo.name }
          })
          rowList = foundAreas
        }
      } else {
        // 站点
        let foundStationList: (TStation & {station: string})[] = []
        // 先确定stationList
        if (stationList) {
          const stationIdMap = new Map(allStation.map(item => [item.stationIdC, item]))
          foundStationList = stationList.split(',').map(id => {
            const stationInfo = stationIdMap.get(id) as TStation
            return { ...stationInfo, station: stationInfo.stationName }
          })
        } else if (area) {
          foundStationList = (areaStations[area] || []).map(item => ({ ...item, station: item.stationName }))
        }
        rowList = foundStationList
      }
      // 给每一行填值
      rowList.forEach(row => {
        // YYYYMMDDHHmm
        row.value = Math.floor(Math.random() * 20)

        const startMs = moment(stime, 'YYYYMMDDHHmm').toDate().getTime()
        const endMs = moment(etime, 'YYYYMMDDHHmm').toDate().getTime()
        const randomMs = Math.floor(Math.random() * Math.abs(endMs - startMs) + Math.min(startMs, endMs))
        row.time = moment(new Date(randomMs)).format('YYYY-MM-DD HH:mm')
      })
      return {
        code: 200,
        message: 'success',
        data: () => rowList
      }
    }
  }
] as MockMethod[]