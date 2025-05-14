<template>
  <el-dialog :visible="visible" title="用户注册" width="500px" @update:visible="updateVisible">
    <el-form :model="registerForm" :rules="registerRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="registerForm.studentId" placeholder="请输入学号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleRegister">注册</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'RegisterDialog',
  props: {
    visible: Boolean,
    registerForm: Object,
    registerRules: Object
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    closeDialog() {
      this.updateVisible(false);
    },
    handleRegister() {
      this.$emit('register');
      this.closeDialog();
    }
  }
};
</script>
