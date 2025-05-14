<template>
  <el-dialog :visible="visible" title="用户登录" width="400px" @update:visible="updateVisible">
    <el-form :model="loginForm" :rules="loginRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  props: {
    visible: Boolean,
    loginForm: Object,
    loginRules: Object
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    closeDialog() {
      this.updateVisible(false);
    },
    handleLogin() {
      this.$emit('login');
      this.closeDialog();
    }
  }
};
</script>
