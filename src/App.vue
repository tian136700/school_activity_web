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

onMounted(() => {
  const devtoolsBadge = document.getElementById('vue-devtools')
  if (devtoolsBadge) {
    devtoolsBadge.remove()
  }
})
</script>

