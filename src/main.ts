import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'reset-css' // 重置样式
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont-colorful/iconfont.css'
import 'element-plus/dist/index.css'
import { defaultStylePlugin } from '@/style/variables' // 全局默认样式

//引入时间选择器
import DatePicker from "vue-datepicker-next"
import "vue-datepicker-next/index.css"
import "vue-datepicker-next/locale/zh-cn.es"

import 'leaflet/dist/leaflet.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(defaultStylePlugin)
app.use(DatePicker)

app.mount('#app')
