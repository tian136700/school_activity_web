<template>
  <div class="about-page">
    <Header :user="user" @logout="logout" />

    <main class="main container">
      <el-card class="about-card">
        <h2 class="title">关于我们</h2>
        <div class="content">
          <p>欢迎来到我们的活动平台！</p>
          <p>我们致力于为用户提供高质量的活动信息与便捷的报名体验。</p>
          <p>我们的目标是连接组织者与参与者，让每一次活动都值得被记住。</p>
          <p>如果您有任何建议或反馈，请随时联系我们。</p>

          <br />
          <p><strong>联系方式：</strong></p>
          <p>客服邮箱：support@eventlink.com</p>
          <p>联系电话：+86 400-123-4567</p>
          <p>微信客服：eventlink_service</p>
          <p>QQ 群：812345678</p>
          <p>办公地址：北京市朝阳区活动路88号 A座 6F</p>
        </div>


        <div class="button-group">
          <el-button type="primary" @click="$router.push('/')">
            返回主页
          </el-button>
        </div>
      </el-card>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import { ref } from 'vue'

const user = ref(null) // 这里可以根据你的逻辑传用户信息
const logout = () => {
  localStorage.removeItem('token')
  location.reload()
}
</script>

<style scoped>
.about-page {
  background: #f5f7fa;
  min-height: 100vh;
}

.main.container {
  width: 1000px;
  margin: 0 auto;
  padding: 40px 15px;
}

.about-card {
  padding: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.content p {
  font-size: 17px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
