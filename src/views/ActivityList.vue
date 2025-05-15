<template>
  <div class="activity-list-page">
    <Header :user="user" @logout="logout" />

    <main class="main container">
      <h2 class="section-title">全部活动</h2>

      <el-skeleton :loading="isLoading" animated>
        <div class="activity-list">
          <div
              v-for="activity in paginatedActivities"
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
        <div class="pagination">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="activities.length"
              :page-size="pageSize"
              @current-change="handlePageChange"
          />
        </div>
      </el-skeleton>
    </main>

    <Footer />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import { ElMessage } from 'element-plus';
import request from "@/utils/request.js";


export default {
  name: 'ActivityList',
  components: { Header, Footer },
  setup() {
    const activities = ref([]);
    const isLoading = ref(false);
    const currentPage = ref(1);
    const pageSize = 8;

    const loadActivities = async () => {
      isLoading.value = true;
      try {
        const response = await request.get('/activities', {
          withCredentials: true,
        });
        activities.value = response.data.data;
      } catch (error) {
        ElMessage.error('活动加载失败，请稍后重试');
      } finally {
        isLoading.value = false;
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const paginatedActivities = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return activities.value.slice(start, start + pageSize);
    });

    const formatTime = (dateStr) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${String(
          d.getMinutes()
      ).padStart(2, '0')}`;
    };

    onMounted(() => {
      loadActivities();
    });

    return {
      activities,
      paginatedActivities,
      currentPage,
      pageSize,
      formatTime,
      isLoading,
      handlePageChange,
    };
  },
};
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 15px;
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

.pagination {
  text-align: center;
  margin-top: 30px;
}

@media (max-width: 992px) {
  .container {
    width: 100%;
  }

  .activity-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
