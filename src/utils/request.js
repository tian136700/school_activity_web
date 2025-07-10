import axios from 'axios'

const request = axios.create({
    baseURL: 'http://activity.test/api',
    // baseURL: 'https://36c3-118-175-230-40.ngrok-free.app/api',
    // baseURL: 'http://192.168.1.233:8000/api',

    withCredentials: true,
    timeout: 5000
})

// 添加拦截器统一加 token
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`

    }
    return config
})

export default request
