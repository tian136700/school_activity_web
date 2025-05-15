<template>
  <div id="app">
    <router-view></router-view> <!-- 用于显示路由匹配到的组件 -->
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* 这里可以写全局样式 */
:global(#vue-devtools) {
  display: none !important;
}
</style>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
//获取用户信息，如果登录的话
const userStore = useUserStore()
onMounted(() => {
  const devtoolsBadge = document.getElementById('vue-devtools')
  if (devtoolsBadge) {
    devtoolsBadge.remove()
  }

  userStore.initUser() // 🚨 非常关键，否则数据不会加载
})
</script>

