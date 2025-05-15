<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <h1>大学校园活动</h1>
      </div>

      <nav class="nav">
        <router-link to="/" class="active">首页</router-link>
        <router-link to="/activities">活动列表</router-link>
        <router-link to="/my-activities">我的活动</router-link>
        <router-link to="/about">关于我们</router-link>
      </nav>

      <div class="user-info">
        <el-dropdown v-if="userStore.user">
<span class="el-dropdown-link">
  <el-avatar
      :size="40"
      :src="userStore.user.avatar ||defaultAvatar"
  />
  {{ userStore.user.username || '未命名用户' }}
</span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">个人中心</el-dropdown-item>
<!--              <el-dropdown-item>我的报名</el-dropdown-item>-->
              <el-dropdown-item @click="$router.push('/admin-apply')">成为管理员</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div v-else>
          <el-button type="primary" size="small" @click="router.push('/login')">登录</el-button>
          <el-button size="small" @click="router.push('/register')">注册</el-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { watch } from 'vue'
import defaultAvatar from '@/assets/images/avatar.png'//默认头像引入

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  console.log('当前用户信息（延后打印）：', userStore.user)
})

watch(
    () => userStore.user,
    (newVal) => {
      if (newVal) {
        console.log('✅ 用户信息已加载:', newVal)
      }
    },
    { immediate: true }
)

const logout = () => {
  userStore.logout()
}
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
  font-size: xx-large;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.logo h1 {
  font-size: 45px;
  color: #9a1abd;
  margin: 0;
  white-space: nowrap;
}

/* 导航菜单 */
.nav {
  display: flex;
  gap: 24px;
  flex-grow: 1;
  justify-content: center;
}

.nav a {
  font-size: 16px;
  color: #666;
  text-decoration: none;
  position: relative;
  padding: 6px 0;
  transition: color 0.3s;
}

.nav a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #409EFF;
  transition: width 0.3s;
}

.nav a:hover,
.nav a.router-link-active {
  color: #409EFF;
}

.nav a:hover::after,
.nav a.router-link-active::after {
  width: 100%;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.el-dropdown-link .el-avatar {
  margin-right: 8px;
}

.el-button {
  padding: 6px 12px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    height: auto;
    padding: 10px 15px;
  }

  .nav {
    margin-top: 10px;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  .user-info {
    margin-top: 10px;
  }
}

</style>
