<template>
  <div class="campus-activities">
    <!-- Header -->
    <Header :user="user" @logout="logout" />


    <!-- Main Content -->
    <main class="main container">
      <!-- Category -->
      <section class="category">
        <h2 class="section-title">活动分类</h2>
        <div class="category-list">
          <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              @click="changeCategory(category.id)"
              :class="{ active: category.id === currentCategory }"
          >
            <i :class="category.icon"></i>
            <span>{{ category.name }}</span>
          </div>
        </div>
      </section>

      <!-- Hot Activities -->
      <section class="hot-activities">
        <h2 class="section-title">热门活动</h2>
        <div class="activity-list">
          <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card">
            <img :src="activity.image" alt="Activity Image" />
            <h3>{{ activity.title }}</h3>
            <p>参与人数：{{ activity.participants }}</p>
            <el-button type="primary">立即报名</el-button>
          </div>
        </div>
      </section>

      <!-- Announcements -->
      <section class="announcements">
        <h2 class="section-title">最新公告</h2>
        <div class="announcement-list">
          <div v-for="announcement in announcements" :key="announcement.id" class="announcement-item">
            <div class="announcement-date">
              <span class="day">{{ formatDay(announcement.date) }}</span>
              <span class="month">{{ formatMonth(announcement.date) }}</span>
            </div>
            <div class="announcement-content">
              <h3>{{ announcement.title }}</h3>
              <p>{{ announcement.content }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Login Dialog -->
    <LoginDialog v-model:visible="showLoginDialog" :loginForm="loginForm" :loginRules="loginRules" @login="handleLogin" />

    <!-- Register Dialog -->
    <RegisterDialog v-model:visible="showRegisterDialog" :registerForm="registerForm" :registerRules="registerRules" @register="handleRegister" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Header from './Header.vue';
import Footer from './Footer.vue';
import LoginDialog from './LoginDialog.vue';
import RegisterDialog from './RegisterDialog.vue';
import { ElMessage } from 'element-plus';

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    LoginDialog,
    RegisterDialog
  },
  setup() {
    const user = ref({
      id: 1,
      name: '张三',
      avatar: 'https://via.placeholder.com/40x40'
    });

    const showLoginDialog = ref(false);
    const showRegisterDialog = ref(false);

    const loginForm = ref({
      username: '',
      password: ''
    });

    const loginRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    };

    const registerForm = ref({
      username: '',
      studentId: '',
      password: '',
      confirmPassword: '',
      email: ''
    });

    const registerRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== registerForm.value.password) {
              callback(new Error('两次输入密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]
    };

    const categories = ref([
      { id: 1, name: '全部', icon: 'el-icon-menu' },
      { id: 2, name: '学术讲座', icon: 'el-icon-reading' },
      { id: 3, name: '文艺演出', icon: 'el-icon-video-camera' },
      { id: 4, name: '体育竞赛', icon: 'el-icon-basketball' },
      { id: 5, name: '志愿服务', icon: 'el-icon-help' },
      { id: 6, name: '社团活动', icon: 'el-icon-user' },
      { id: 7, name: '创新创业', icon: 'el-icon-lightbulb' }
    ]);
    const currentCategory = ref(1);

    const activities = ref([]);
    const isLoading = ref(false);

    const loadActivities = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get('http://activity.test/api/activities', {
          withCredentials: true, // ✅ 正确位置
        });
        activities.value = response.data;
      } catch (error) {
        console.error('活动加载失败:', error);
        ElMessage.error('活动数据获取失败，请稍后重试');
      } finally {
        isLoading.value = false;
      }
    };


    onMounted(() => {
      loadActivities();
    });

    const announcements = ref([
      { id: 1, title: '歌手大赛报名通知', content: '报名截止5月18日，快来参加！', date: '2023-05-12' },
      { id: 2, title: '科技文化节志愿者招募', content: '招募50名志愿者，参与科技文化节！', date: '2023-05-10' }
    ]);

    const filteredActivities = computed(() => {
      if (currentCategory.value === 1) return activities.value;
      return activities.value.filter(activity => activity.categoryId === currentCategory.value);
    });

    const changeCategory = (categoryId) => {
      currentCategory.value = categoryId;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formatDay = (dateString) => {
      const date = new Date(dateString);
      return date.getDate();
    };

    const formatMonth = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月`;
    };

    const handleLogin = () => {
      ElMessage.success('登录成功');
      showLoginDialog.value = false;
    };

    const handleRegister = () => {
      ElMessage.success('注册成功');
      showRegisterDialog.value = false;
    };

    const logout = () => {
      user.value = null;
      ElMessage.success('已退出登录');
    };

    return {
      user,
      showLoginDialog,
      showRegisterDialog,
      categories,
      currentCategory,
      activities,
      filteredActivities,
      announcements,
      isLoading,
      changeCategory,
      formatDate,
      formatDay,
      formatMonth,
      handleLogin,
      handleRegister,
      logout,
      loginForm,
      loginRules,
      registerForm,
      registerRules
    };
  }
};
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 15px;
}

/* Banner 样式 */
.banner {
  position: relative;
}

.banner img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 60px;
  left: 60px;
  color: #fff;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
}

.banner-content h2 {
  font-size: 36px;
  margin-bottom: 10px;
}

.banner-content p {
  font-size: 18px;
}

/* 活动分类样式 */
.category {
  margin: 40px 0;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  position: relative;
  padding-left: 10px;
  color: #333;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background-color: #409EFF;
  border-radius: 2px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.category-item {
  flex: 0 0 120px;
  height: 100px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-align: center;
  padding: 20px 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover,
.category-item.active {
  background-color: #f0f9ff;
  border-color: #409EFF;
  color: #409EFF;
}

.category-item i {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}

/* 活动列表样式 */
.hot-activities {
  margin: 40px 0;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.activity-card {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.activity-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.activity-card h3 {
  font-size: 18px;
  margin: 5px 0;
}

.activity-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

/* 公告样式 */
.announcements {
  margin: 40px 0;
}

.announcement-list {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.announcement-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-date {
  width: 60px;
  text-align: center;
  margin-right: 20px;
}

.announcement-date .day {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.announcement-date .month {
  font-size: 14px;
  color: #909399;
}

.announcement-content h3 {
  font-size: 16px;
  margin: 0 0 6px;
}

.announcement-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 992px) {
  .container {
    width: 100%;
  }

  .category-list {
    justify-content: center;
  }

  .activity-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
