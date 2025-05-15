// 引入 Vue 和其他需要的模块
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 导入配置好的路由
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'


// 创建 Vue 应用并挂载到 DOM 上
const app = createApp(App);
app.use(ElementPlus)
// 使用路由
app.use(router);
if (process.env.NODE_ENV === 'production') {
    app.config.devtools = false
}
app.use(createPinia())
// 挂载应用
app.mount('#app');
