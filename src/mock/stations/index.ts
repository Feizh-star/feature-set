import type { MockMethod } from 'vite-plugin-mock'
import areaStations from './all-stations'
type TAreaKey = keyof typeof areaStations
export default [
  {
    url: '/mock/stations', // 模拟的链接
    method: 'get', // 请求方式
    timeout: 300, // 超时时间
    statusCode: 200, // 返回的http状态码
    response: ({ query }: { query: { area: TAreaKey } }) => {
      const { area } = query
      const result = areaStations[area] || []
      if (result.length === 0) {
        for (const key in areaStations) {
          result.push(...areaStations[key as TAreaKey])
        }
      }
      return {
        code: 200,
        message: 'success',
        data: () => result
      }
    }
  }
] as MockMethod[]