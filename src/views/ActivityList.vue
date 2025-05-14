<template>
  <div class="activity-list">
    <h1>活动列表</h1>
    <div v-if="activities.length > 0">
      <div v-for="activity in activities" :key="activity.id" class="activity-card">
        <h3>{{ activity.name }}</h3>
        <p>{{ activity.description }}</p>
        <router-link :to="'/activity/' + activity.id" class="view-details">查看详情</router-link>
      </div>
    </div>
    <div v-else>
      <p>暂无活动信息。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityList',
  data() {
    return {
      // 模拟一些活动数据
      activities: [
        { id: 1, name: '志愿者活动', description: '参与志愿服务，助力社会' },
        { id: 2, name: '科技创新比赛', description: '展示你的科技才华，赢得奖项' },
        { id: 3, name: '文艺演出', description: '展现才艺，感受艺术的魅力' }
      ]
    };
  }
};
</script>

<style scoped>
.activity-list {
  text-align: center;
}

.activity-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

.activity-card h3 {
  font-size: 1.2rem;
  color: #333;
}

.activity-card p {
  font-size: 1rem;
  color: #555;
}

.view-details {
  color: #007bff;
  text-decoration: none;
  font-size: 1rem;
}
</style>
