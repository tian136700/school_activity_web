<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2 class="title">登录</h2>

      <el-form :model="loginForm" :rules="loginRules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitLogin" :loading="loading">登录</el-button>
          <el-button @click="goToRegister">去注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const submitLogin = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      // 登录请求
      const response = await request.post('/authorizations', {
        username: loginForm.value.username,
        password: loginForm.value.password
      })

      const token = response.data.token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = token

      // 获取用户信息（假设后端有这个接口）
      const userRes = await request.get('/me')
      const userInfo = userRes.data

      // 保存用户信息到 Pinia
      userStore.login(userInfo)
      console.log('用户信息', userStore.user)
      ElMessage.success('登录成功')
      // 跳转首页后刷新
      router.push('/').then(() => {
        window.location.reload()
      })
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}


const goToRegister = () => {
  router.push('/register')
}
</script>


<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f3f5;
}

.login-card {
  width: 400px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}
</style>
