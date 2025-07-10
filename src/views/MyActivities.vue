<template>
  <div class="my-activities-page">
    <Header :user="user" @logout="logout" />

    <main class="main container">
      <h2 class="section-title">我报名的活动</h2>

      <div v-if="loading" class="loading">加载中...</div>

      <el-empty
          v-else-if="activities.length === 0"
          description="暂无报名的活动"
      />

      <el-row v-else :gutter="20" class="activity-list">
        <el-col :span="8" v-for="item in activities" :key="item.id">
          <el-card shadow="hover" class="activity-card" @click="goDetail(item.id)">
            <h3>{{ item.title }}</h3>
            <p><strong>时间：</strong>{{ format(item.start_time) }} - {{ format(item.end_time) }}</p>
            <p><strong>地点：</strong>{{ item.location }}</p>
            <p><strong>状态：</strong>{{ statusText(item.status) }}</p>
          </el-card>
        </el-col>
      </el-row>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import Header from './Header.vue';
import Footer from './Footer.vue';

// 模拟用户（可换成实际用户 store 数据）
const user = ref({ id: 1, name: '测试用户', avatar: 'https://via.placeholder.com/40x40' })
const logout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}


const goDetail = (id) => {
  router.push(`/activities/${id}`)
}

const router = useRouter()
const activities = ref([])
const loading = ref(true)

const format = (time) => dayjs(time).format('YYYY-MM-DD HH:mm')
const statusText = (status) => {
  switch (status) {
    case 0: return '未开始'
    case 1: return '进行中'
    case 2: return '已结束'
    default: return '未知'
  }
}


onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录后查看活动')
    return router.push('/login')
  }

  try {
    const res = await request.get('/activity-signups/my-activities')
    activities.value = res.data.data
  } catch (e) {
    console.error(e)
    ElMessage.error('获取我的活动失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.my-activities-page {
  background: #f5f7fa;
  min-height: 100vh;
}

.main.container {
  width: 1200px;
  margin: 0 auto;
  padding: 30px 15px;
}
.activity-card {
  cursor: pointer;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.loading {
  text-align: center;
  font-size: 18px;
  padding: 80px 0;
  color: #999;
}

.activity-card {
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 12px;
  background: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.activity-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.activity-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}
.activity-card p {
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
}
</style>
