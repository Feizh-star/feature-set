import axios from 'axios';

const token = 'Bearer' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJQRVJNSVNTSU9OUyI6WyJhZG1pbiJdLCJBVVRIRU5USUNBVEVEIjp0cnVlLCJERVRBSUxTIjoie1wibmlja25hbWVcIjpcIuWuieWFqOeuoeeQhuWRmFwiLFwiaWRcIjoyLFwic3RhdHVzXCI6MX0iLCJpc3MiOiJoeGtqIiwiVVNFUl9JRCI6MiwiQURNSU4iOnRydWUsImV4cCI6MTY5MTYzMDQ2NCwiVVVJRCI6IjExZWU4OTdmYmI0ZjQ2YmRhNmU4NmQ5NmY3ODgyMjU0In0.QPYai2-PCc6KUloRKLLxkFteoW3lBnYxA79-alHyWfE'
const requireHeaders = {
  api: '/hefeiapi'
}
// 创建axios实例
const service = axios.create({
  // 超时
  timeout: 10000,
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = res.data.msg
    if (code === 401) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function predictionHour3Api() {
  return service({
    headers: {
      Authorization: token
    },
    url: requireHeaders.api + "/data-server-api/screen/weather/prediction-hour3",
    method: "GET",
  });
}

export function predictionDay7Api() {
  return service({
    headers: {
      Authorization: token
    },
    url: requireHeaders.api + "/data-server-api/screen/weather/prediction-day",
    method: "GET",
  });
}

export function radarMonitorApi() {
  return service({
    headers: {
      Authorization: token
    },
    url: requireHeaders.api + "/data-server-api/screen/monitor/radar",
    method: "GET",
  });
}

export function diskMonitorApi() {
  return service({
    headers: {
      Authorization: token
    },
    url: requireHeaders.api + "/data-server-api/screen/monitor/disk",
    method: "GET",
  });
}