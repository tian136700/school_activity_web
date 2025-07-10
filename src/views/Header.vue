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

      <template v-if="userStore.user">
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="40" :src="userStore.user.avatar || defaultAvatar" />
              {{ userStore.user.username || '未命名用户' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/admin-apply')">成为管理员</el-dropdown-item>
                <!-- ✅ 替换扫码签到项 -->
                <el-dropdown-item @click="handleScanClick">扫码签到</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>

      <template v-else>
        <div class="auth-buttons">
          <el-button type="primary" size="small" @click="router.push('/login')">登录</el-button>
          <el-button size="small" @click="router.push('/register')">注册</el-button>
        </div>
      </template>
    </div>

    <!-- ✅ 改为提示关注公众号 -->
    <el-dialog
        v-model="scanDialogVisible"
        title="扫码签到"
        width="90%"
        top="10vh"
        :close-on-click-modal="false"
    >
      <div style="text-align: center; padding: 20px;">
        <p style="font-size: 18px; margin-bottom: 20px;">
          请关注“xxx校园活动”微信公众号，进行绑定和签到
        </p>

      </div>
    </el-dialog>


  </header>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Html5Qrcode } from 'html5-qrcode'
import defaultAvatar from '@/assets/images/avatar.png'

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

// ✅ 扫码签到逻辑
const scanDialogVisible = ref(false)
const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
let scanner = null

const handleScanClick = () => {
  scanDialogVisible.value = true
}


const startScanner = async () => {
  const config = { fps: 10, qrbox: 250 }
  scanner = new Html5Qrcode("scanner")

  try {
    const devices = await Html5Qrcode.getCameras()
    console.log("找到的摄像头设备：", devices)

    if (devices && devices.length > 0) {
      const deviceId = devices[0].id
      await scanner.start(
          deviceId,
          config,
          (decodedText) => {
            scanner.stop()
            scanDialogVisible.value = false
            if (decodedText.includes('checkin')) {
              router.push(decodedText)
            } else {
              ElMessage.error('无效的二维码')
            }
          },
          (errorMessage) => {
            console.warn("扫描失败", errorMessage)
          }
      )
    } else {
      ElMessage.error("未检测到摄像头设备")
    }
  } catch (err) {
    console.error("摄像头初始化失败", err)
    ElMessage.error("摄像头初始化失败：" + err)
  }
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

/* ✅ 手机端横向适配 */
@media (max-width: 768px) {
  .container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    height: auto;
    padding: 8px 12px;
  }

  .logo h1 {
    font-size: 22px;
    margin: 0;
  }

  .nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }

  .nav a {
    padding: 4px 6px;
    font-size: 14px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }

  .auth-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .el-dropdown-link {
    font-size: 13px;
    display: flex;
    align-items: center;
  }

  .el-avatar {
    width: 32px !important;
    height: 32px !important;
  }

  .el-button {
    font-size: 13px;
    padding: 5px 10px;
    white-space: nowrap;
  }
}





</style>
