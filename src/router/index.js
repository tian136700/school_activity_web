import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // 首页组件
import ActivityList from '@/views/ActivityList.vue'; // 活动列表组件

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/activities',
        name: 'ActivityList',
        component: ActivityList
    },
    // 你可以在这里添加其他路由
];

const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 History 模式
    routes // 将路由配置传入 createRouter
});

export default router;
