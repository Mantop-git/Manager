<template>
  <div>
    <!-- 面包屑导航 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>权限管理</el-breadcrumb-item>

      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 表单展示 -->
      <el-table :data="rightList" stripe style="width: 100%" border>
        <el-table-column type="index"> </el-table-column>

        <el-table-column prop="authName" label="权限名称" width="180"> </el-table-column>

        <el-table-column prop="path" label="路径" width="180"> </el-table-column>

        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">等级一</el-tag>

            <el-tag type="success" v-else-if="scope.row.level === '1'"> 等级二</el-tag>

            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        //权限列表内容
        rightList: [],
      };
    },
    created() {
      this.getRightList();
    },
    methods: {
      async getRightList() {
        const { data: res } = await this.$http.get("rights/list");
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取权限列表失败");
        return (this.rightList = res.data);
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
  }

  .el-table {
    text-align: center !important;
  }
</style>
