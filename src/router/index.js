import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // 首页组件
import ActivityList from '@/views/ActivityList.vue'; // 活动列表组件
import UserProfile from '@/views/UserProfile.vue' // <-- 个人中心页面组件
import AdminApplicationForm from '@/views/AdminApplicationForm.vue'
import About from "@/views/About.vue";
//管理员申请

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
    {
        path: '/login',
        component: () => import('@/views/LoginPage.vue')
    },
    {
        path: '/register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/activities',
        component: () => import('@/views/ActivityList.vue')
    } ,
    {
        path: '/profile',
        name: 'UserProfile',
        component: UserProfile
    },
    {
        path: '/admin-apply',
        name: 'AdminApplication',
        component: AdminApplicationForm,
    },
    {
        path: '/activities/:id',
        name: 'ActivityDetail',
        component: () => import('@/views/ActivityDetail.vue'),
    },
    {//我已报名的活动列表
        path: '/my-activities',
        component: () => import('@/views/MyActivities.vue'),
        meta: { requiresAuth: true }
    },
    {//关于我们
        path: '/about',
        component: () => import('@/views/About.vue'),
    }


];

const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 History 模式
    routes // 将路由配置传入 createRouter
});

export default router;
