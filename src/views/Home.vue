<template>
  <div class="campus-activities">
    <Header :user="user" @logout="logout" />

    <main class="main container">

      <section class="hot-activities">
        <h2 class="section-title">热门活动</h2>
        <div class="activity-list">
          <div
              v-for="activity in activities"
              :key="activity.id"
              class="activity-card"
          >
            <img
                :src="activity.images[0]"
                alt="Activity Image"
                class="activity-image"
            />
            <h3>{{ activity.title }}</h3>
            <p>活动时间：{{ formatTime(activity.start_time) }} - {{ formatTime(activity.end_time) }}</p>
            <p>地点：{{ activity.location }}</p>
            <p>人数上限：{{ activity.participant_limit }}</p>
            <el-button type="primary" @click="$router.push(`/activities/${activity.id}`)">立即报名</el-button>
          </div>
        </div>
      </section>

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

    <Footer />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Header from './Header.vue';
import Footer from './Footer.vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request'

export default {
  name: 'Home',
  components: { Header, Footer, },
  setup() {
    // const user = ref({ id: 1, name: '张三', avatar: 'https://via.placeholder.com/40x40' });


    const activities = ref([]);
    const isLoading = ref(false);

    const announcements = ref([]);

    const loadActivities = async () => {
      isLoading.value = true;
      try {
        const response = await request.get('/activities', {
          withCredentials: true
        });

        const allActivities = response.data.data;

        // 只展示前4个热门活动
        activities.value = allActivities.slice(0, 4);

        // 用报名截止时间降序排序，取前2条作为公告
        announcements.value = allActivities
            .sort((a, b) => new Date(b.register_deadline) - new Date(a.register_deadline))
            .slice(0, 4)
            .map(item => ({
              id: item.id,
              title: item.title,
              content: item.description,
              date: item.register_deadline
            }));
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

    // const announcements = ref([
    //   { id: 1, title: '歌手大赛报名通知', content: '报名截止5月18日，快来参加！', date: '2023-05-12' },
    //   { id: 2, title: '科技文化节志愿者招募', content: '招募50名志愿者，参与科技文化节！', date: '2023-05-10' }
    // ]);



    const formatTime = (dateStr) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const formatDay = (dateStr) => new Date(dateStr).getDate();
    const formatMonth = (dateStr) => `${new Date(dateStr).getMonth() + 1}月`;


    return {
      activities,
      announcements,
      isLoading,
      formatTime,
      formatDay,
      formatMonth,
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

/* 平板（<=768px）适配 */
@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
    padding-left: 8px;
  }

  .activity-card h3 {
    font-size: 16px;
  }

  .activity-card p {
    font-size: 13px;
  }

  .activity-card {
    padding: 12px;
  }

  .announcement-date .day {
    font-size: 20px;
  }

  .announcement-date .month {
    font-size: 12px;
  }

  .announcement-content h3 {
    font-size: 15px;
  }

  .announcement-content p {
    font-size: 13px;
  }

  .el-button {
    width: 100%;
    font-size: 14px;
    padding: 10px 0;
  }
}

/* 手机小屏（<=480px）适配 */
@media (max-width: 480px) {
  .container {
    padding: 15px 10px;
  }

  .activity-list {
    grid-template-columns: 1fr; /* 单列布局 */
  }

  .announcement-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .announcement-date {
    margin-bottom: 10px;
  }

  .announcement-content h3 {
    font-size: 14px;
  }

  .announcement-content p {
    font-size: 12px;
  }

  .activity-card img {
    height: 140px;
  }
}


</style>
