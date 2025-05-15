<template>
  <div class="register-page">
    <el-card class="register-card">
      <h2 class="title">注册</h2>

      <el-form :model="registerForm" :rules="registerRules" ref="formRef" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" placeholder="请再次输入密码" type="password" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="registerForm.gender" placeholder="请选择性别">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>

        <el-form-item label="院系" prop="department_id">
          <el-select v-model="registerForm.department_id" placeholder="请选择院系">
            <el-option
                v-for="dept in departments"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="专业" prop="major_id">
          <el-select v-model="registerForm.major_id" placeholder="请选择专业" :disabled="!majors.length">
            <el-option
                v-for="major in majors"
                :key="major.id"
                :label="major.name"
                :value="major.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="班级" prop="class_id">
          <el-select v-model="registerForm.class_id" placeholder="请选择班级" :disabled="!classes.length">
            <el-option
                v-for="cls in classes"
                :key="cls.id"
                :label="`${cls.class_number}班`"
                :value="cls.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="入学年份" prop="year">
          <el-input v-model="registerForm.year" placeholder="例如：2022" />
        </el-form-item>

        <el-form-item label="学号" prop="student_id">
          <el-input v-model="registerForm.student_id" placeholder="请输入学号" />
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="customUpload"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>





        <el-form-item>
          <el-button type="primary" @click="submitRegister" :loading="loading">注册</el-button>
          <el-button @click="goToLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)



//头像上传
const customUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await request.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const imageUrl = response.data.url
    registerForm.value.avatar = imageUrl // 设置表单中头像字段
    onSuccess(response.data) // 通知 el-upload 成功
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('上传失败', error)
    ElMessage.error('头像上传失败')
    onError(error)
  }
}
const beforeAvatarUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只支持 JPG / PNG / GIF / WEBP 格式')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
  }

  return isImage && isLt2M
}






//获取院系
const departments = ref([])

onMounted(async () => {
  try {
    const res = await request.get('/departments')
    departments.value = res.data
  } catch (error) {
    ElMessage.error('获取院系失败')
  }
})

//获取专业
const majors = ref([])




const registerForm = ref({
  name: '张三',
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  password: '123456',
  // confirmPassword: '123456',
  phone: '13800000000',
  gender: 'male', // 或 'female'
  department_id: 1, // 默认选中“计算机学院”等
  major_id: '',
  class_id: '',
  year: '2023',
  avatar: '', // 可填入默认头像链接，如 '/default-avatar.png'
  student_id: '2023123456'

})

watch(() => registerForm.value.department_id, async (newDeptId) => {
  if (!newDeptId) {
    majors.value = []
    registerForm.value.major_id = ''
    return
  }

  try {
    const res = await request.get(`/departments/${newDeptId}/majors`)
    majors.value = res.data
    registerForm.value.major_id = '' // 重置选择
  } catch (error) {
    ElMessage.error('获取专业失败')
  }
})

//获取班级
const classes = ref([])

watch(() => registerForm.value.major_id, async (newMajorId) => {
  if (!newMajorId) {
    classes.value = []
    registerForm.value.class_id = ''
    return
  }

  try {
    const res = await request.get(`/majors/${newMajorId}/classes`)
    classes.value = res.data
    registerForm.value.class_id = ''
  } catch (error) {
    ElMessage.error('获取班级失败')
  }
})
const registerRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  department_id: [{ required: true, message: '请选择院系', trigger: 'blur' }],
  major_id: [{ required: true, message: '请选择专业', trigger: 'blur' }],
  class_id: [{ required: true, message: '请选择班级', trigger: 'blur' }],
  year: [{ required: true, message: '请输入入学年份', trigger: 'blur' }],
  student_id: [{ required: true, message: '请输入学号', trigger: 'blur' }]
}


const submitRegister = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      console.log('提交数据:', registerForm.value)
      await request.post('/users', registerForm.value)
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } catch (error) {
      console.log(error)
      ElMessage.error(error.response?.data?.message || '注册失败，请检查信息')
    } finally {
      loading.value = false
    }
  })
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.register-card {
  width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  color: #333;
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
