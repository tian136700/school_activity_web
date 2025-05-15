<template>
  <div class="activity-detail-page">
    <Header :user="user" @logout="logout" />

    <main class="main container">
      <div v-if="loading" class="loading">加载中...</div>

      <el-card v-else class="detail-card">
        <h2 class="title">{{ activity.title }}</h2>

        <!-- 图片纵向排列 -->
        <div v-if="activity.images.length" class="image-list">
          <img
              v-for="(img, index) in activity.images"
              :key="index"
              :src="img"
              class="activity-image"
              alt="活动图片"
          />
        </div>

        <div class="section">
          <p><strong>描述：</strong>{{ activity.description }}</p>
          <p><strong>地点：</strong>{{ activity.location }}</p>
          <p><strong>活动时间：</strong>{{ format(activity.start_time) }} - {{ format(activity.end_time) }}</p>
          <p><strong>报名截止：</strong>{{ format(activity.register_deadline) }}</p>
          <p><strong>参与人数上限：</strong>{{ activity.participant_limit }}</p>
          <p><strong>活动状态：</strong>{{ statusText }}</p>
          <p><strong>发布人：</strong>{{ activity.admin_user }}</p>
        </div>

        <div class="button-group">
          <!-- 根据是否已报名，显示不同按钮 -->
          <template v-if="hasSignedUp">
            <el-button type="danger" @click="cancelSignUp">取消报名</el-button>
          </template>
          <template v-else>
            <el-button
                type="success"
                :disabled="activity.status !== 1"
                @click="signUp"
            >
              立即报名
            </el-button>
          </template>


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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import dayjs from 'dayjs'
import Header from './Header.vue'
import Footer from './Footer.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)

const activity = ref({
  title: '',
  description: '',
  location: '',
  start_time: '',
  end_time: '',
  register_deadline: '',
  participant_limit: '',
  status: 0,
  admin_user: '',
  name: '',
  images: [],
})

const format = (time) => dayjs(time).format('YYYY-MM-DD HH:mm')

const statusText = computed(() => {
  switch (activity.value.status) {
    case 0: return '未开始'
    case 1: return '进行中'
    case 2: return '已结束'
    default: return '未知'
  }
})

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await request.get(`/activities/${id}`)
    activity.value = res.data.data

    hasSignedUp.value = await checkSignupStatus()
  } catch (e) {
    ElMessage.error('获取活动详情失败')
    await router.push('/')
  } finally {
    loading.value = false
  }
})

// 报名接口
const signUp = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    ElMessage.warning('请先登录后再报名')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return
  }

  try {
    const res = await request.post('/activity-signups', {
      activity_id: activity.value.id,
    })

    ElMessage.success(res.data.message || '报名成功')
    hasSignedUp.value = true
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '报名失败，请稍后重试')
  }
}

// 检查报名状态
const checkSignupStatus = async () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const res = await request.get('/activity-signups/check', {
      params: {
        activity_id: activity.value.id,
      },
    })
    return res.data.signed_up
  } catch (e) {
    console.error('检查报名状态失败', e)
    return false
  }
}

// 取消报名接口
const cancelSignUp = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录后操作')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return
  }

  try {
    const res = await request.delete('/activity-signups', {
      data: { activity_id: activity.value.id },
      headers: { Authorization: `Bearer ${token}` },
    })

    ElMessage.success(res.data.message || '取消报名成功')
    hasSignedUp.value = false
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '取消报名失败，请稍后重试')
  }
}

const hasSignedUp = ref(false)
</script>

<style scoped>
.activity-detail-page {
  background: #f5f7fa;
  min-height: 100vh;
}

.main.container {
  width: 1000px;
  margin: 0 auto;
  padding: 40px 15px;
}

.loading {
  font-size: 20px;
  text-align: center;
  padding: 80px 0;
  color: #666;
}

.detail-card {
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

.section p {
  margin-bottom: 12px;
  font-size: 17px;
  line-height: 1.7;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.activity-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}
</style>
