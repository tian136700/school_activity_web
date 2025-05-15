import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import axios from "axios";

export const useUserStore = defineStore('user', () => {
    const user = ref(null)

    const login = (userInfo) => {
        user.value = userInfo
    }

    const logout = () => {
        user.value = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
    }

    // 初始化：从 localStorage 取 token，然后拉用户信息
    const initUser = async () => {
        const token = localStorage.getItem('token')
        console.log('读取到 token:', token) // ✅ 调试点
        if (token) {
            axios.defaults.headers.common['Authorization'] = token
            try {
                const res = await request.get('/me')
                console.log('用户信息响应:', res.data) // ✅ 调试点
                user.value = res.data.data
            } catch (err) {
                console.error('获取用户信息失败:', err)
                logout()
            }
        }
    }


    return { user, login, logout, initUser }
})
