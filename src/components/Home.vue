<template>
  <div>
    home组件
    <el-button type="info" @click="loginout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message('退出成功');
    }
  }
};
</script>

<style lang="less" scoped></style>
