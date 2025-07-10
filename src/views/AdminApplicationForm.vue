<template>
  <div class="application-page">
    <el-card class="application-card">
      <h2 class="title">申请后台管理员</h2>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" disabled />
        </el-form-item>

        <el-form-item label="学号">
          <el-input v-model="form.student_id" disabled />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="form.phone" disabled />
        </el-form-item>

        <el-form-item label="申请理由" prop="reason">
          <el-input
              type="textarea"
              v-model="form.reason"
              :rows="4"
              placeholder="请简要说明您申请管理员的理由"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">提交申请</el-button>
          <el-button @click="$router.push('/')">返回主页</el-button>
          <el-button type="info" @click="showStatus">查询申请进度</el-button>
        </el-form-item>

        <el-dialog v-model="statusVisible" title="申请进度" width="500px">
          <div v-if="statusData">
            <p><strong>申请理由：</strong> {{ statusData.reason }}</p>
            <p><strong>申请状态：</strong> {{ statusText }}</p>
            <p><strong>提交时间：</strong> {{ formatDate(statusData.created_at) }}</p>
            <p><strong>审核时间：</strong> {{ formatDate(statusData.updated_at) }}</p>
          </div>
          <div v-else>
            <el-empty description="暂无申请记录" />
          </div>
          <template #footer>
            <el-button @click="statusVisible = false">关闭</el-button>
          </template>
        </el-dialog>


      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'


const userStore = useUserStore()
const router = useRouter()
const form = ref({
  name: '',
  student_id: '',
  phone: '',
  reason: '',
})
const formRef = ref(null)

const rules = {
  reason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    { max: 1000, message: '理由不能超过1000字', trigger: 'blur' },
  ],
}

onMounted(async () => {
  if (!userStore.user) {
    await userStore.initUser()
  }

  if (!userStore.user) {
    ElMessage.error('未登录，请先登录')
    router.push('/login')
    return
  }

  // 填充用户基础信息
  const user = userStore.user
  form.value.name = user.name
  form.value.student_id = user.student_id
  form.value.phone = user.phone
})

// 提交申请
const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const res = await request.post(
          '/admin-applications',
          { reason: form.value.reason },
          {
            // headers: {
            //   Authorization: `Bearer ${token}`
            // }
          }
      )

      ElMessage.success(res.data.message || '申请提交成功')
      form.value.reason = ''
    } catch (e) {
      console.error(e)
      const msg = e.response?.data?.message || '提交失败'
      ElMessage.error(msg)
    }
  })
}

//申请进度查询
const statusVisible = ref(false)
const statusData = ref(null)

const showStatus = async () => {
  try {
    const res = await request.get('/admin-applications/status')
    statusData.value = res.data.data
    statusVisible.value = true
  } catch (e) {
    ElMessage.error(e.response?.data?.message || '查询失败')
  }
}

const statusText = computed(() => {
  const status = statusData.value?.status
  if (status === 0) return '审核中'
  if (status === 1) return '已通过，请用你的前台用户名和密码登录此网址：http://activity.test/admin'
  if (status === 2) return '已拒绝'
  return '未知状态'
})
const formatDate = (dateStr) => {
  // 使用 dayjs 格式化时间
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped>
.application-page {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.application-card {
  width: 500px;
  padding: 30px;
  border-radius: 12px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}
@media (max-width: 768px) {
  /* 页面整体布局 */
  .application-page {
    padding: 30px 12px;
  }

  .application-card {
    width: 100%;
    padding: 20px;
    border-radius: 10px;
  }

  .title {
    font-size: 20px;
    margin-bottom: 16px;
    text-align: center;
  }

  /* 表单样式调整 */
  .el-form {
    font-size: 14px;
  }

  .el-form-item {
    flex-wrap: wrap;
  }

  .el-form-item .el-input,
  .el-form-item .el-select,
  .el-form-item .el-textarea {
    width: 100%;
  }

  .el-form-item .el-button {
    margin-top: 10px;
  }

  /* 弹窗适配 */
  .el-dialog {
    width: 90% !important;
    max-width: 400px;
  }

  .el-dialog__body {
    font-size: 14px;
    padding: 16px;
    word-break: break-word;
  }

  .el-dialog__body p {
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .el-dialog__footer {
    padding: 12px 16px;
    text-align: center;
  }

  .el-dialog__footer .el-button {
    width: 100%;
    max-width: 200px;
  }
}
@media (max-width: 768px) {
  /* 页面整体布局 */
  .application-page {
    padding: 30px 12px;
  }

  .application-card {
    width: 100%;
    padding: 20px;
    border-radius: 10px;
  }

  .title {
    font-size: 20px;
    margin-bottom: 16px;
    text-align: center;
  }

  /* 表单样式调整 */
  .el-form {
    font-size: 14px;
  }

  .el-form-item {
    flex-wrap: wrap;
  }

  .el-form-item .el-input,
  .el-form-item .el-select,
  .el-form-item .el-textarea {
    width: 100%;
  }

  .el-form-item .el-button {
    margin-top: 10px;
  }

  /* 弹窗适配 */
  .el-dialog {
    width: 90% !important;
    max-width: 400px;
  }

  .el-dialog__body {
    font-size: 14px;
    padding: 16px;
    word-break: break-word;
  }

  .el-dialog__body p {
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .el-dialog__footer {
    padding: 12px 16px;
    text-align: center;
  }

  .el-dialog__footer .el-button {
    width: 100%;
    max-width: 200px;
  }
}


</style>
