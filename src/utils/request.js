import axios from 'axios'

const request = axios.create({
    baseURL: 'http://activity.test/api',
    withCredentials: true,
    timeout: 5000
})

// 可选：添加拦截器统一加 token
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`

    }
    return config
})

export default request
