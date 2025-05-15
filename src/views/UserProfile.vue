<template>
  <div class="profile-page">
    <el-card class="profile-card">
      <h2 class="title">个人中心</h2>

      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>

        <el-form-item label="院系">
          <el-select v-model="form.department_id" placeholder="请选择院系">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="form.major_id" :disabled="!majors.length" placeholder="请选择专业">
            <el-option v-for="major in majors" :key="major.id" :label="major.name" :value="major.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="班级">
          <el-select v-model="form.class_id" :disabled="!classes.length" placeholder="请选择班级">
            <el-option v-for="cls in classes" :key="cls.id" :label="`${cls.class_number}班`" :value="cls.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="入学年份">
          <el-input v-model="form.year" />
        </el-form-item>

        <el-form-item label="学号">
          <el-input v-model="form.student_id" />
        </el-form-item>

        <el-form-item label="头像">
          <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="customUpload"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">保存修改</el-button>
          <router-link to="/">
            <el-button style="margin-left: 10px;">返回主页</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

// 引入 Pinia 用户状态
const userStore = useUserStore()
const router = useRouter()

// 表单与状态
const form = ref({})
const formRef = ref(null)
const departments = ref([])
const majors = ref([])
const classes = ref([])

const token = localStorage.getItem('token')

// 页面加载时
onMounted(async () => {
  // 确保用户已登录
  if (!userStore.user) {
    await userStore.initUser()
  }

  if (!userStore.user) {
    ElMessage.error('未登录，请先登录')
    router.push('/login')
    return
  }

  // 初始化表单
  form.value = { ...userStore.user }

  // 获取院系
  try {
    const res = await request.get('/departments')
    departments.value = res.data
  } catch (e) {
    ElMessage.error('获取院系失败')
  }

  // 如果有初始 department/major，也尝试预加载联动数据
  if (form.value.department_id) {
    await loadMajors(form.value.department_id)
  }
  if (form.value.major_id) {
    await loadClasses(form.value.major_id)
  }
})

// 联动：获取专业
const loadMajors = async (departmentId) => {
  try {
    const res = await request.get(`/departments/${departmentId}/majors`)
    majors.value = res.data
  } catch (e) {
    ElMessage.error('获取专业失败')
  }
}

// 联动：获取班级
const loadClasses = async (majorId) => {
  try {
    const res = await request.get(`/majors/${majorId}/classes`)
    classes.value = res.data
  } catch (e) {
    ElMessage.error('获取班级失败')
  }
}

// 监听院系 -> 获取专业
watch(() => form.value.department_id, async (newId) => {
  if (!newId) return
  await loadMajors(newId)
  form.value.major_id = ''
  form.value.class_id = ''
})

// 监听专业 -> 获取班级
watch(() => form.value.major_id, async (newId) => {
  if (!newId) return
  await loadClasses(newId)
  form.value.class_id = ''
})

// 上传头像
const customUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('image', file)
  try {
    const res = await request.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    form.value.avatar = res.data.url
    onSuccess(res.data)
    ElMessage.success('上传成功')
  } catch (e) {
    onError(e)
    ElMessage.error('上传失败')
  }
}

const beforeAvatarUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) ElMessage.error('只能上传图片')
  if (!isLt2M) ElMessage.error('图片不能超过2MB')

  return isImage && isLt2M
}

// 提交保存
const submit = async () => {
  if (!userStore.user || !userStore.user.id) {
    ElMessage.error('未登录，无法保存')
    return
  }

  try {
    await request.put(`/users/${userStore.user.id}`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    ElMessage.success('保存成功')
    // 刷新页面，重新加载最新信息
    setTimeout(() => {
      window.location.reload()
    }, 1000) // 可选延迟 1 秒，确保提示能看到
  } catch (e) {
    ElMessage.error('保存失败，请重试')
  }
}
</script>


<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-card {
  width: 600px;
  padding: 30px;
  border-radius: 12px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
