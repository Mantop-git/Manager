<template>
  <div>
    <!-- 面包屑 导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 搜索框 -->
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <!--在input输入框中 clearable 删除 增加事件 刷新数据@clear 绑定获取的后台数据 -->
              <!-- el-button 中 slot='append' 表示紧贴依赖组件的后面 prepend 紧贴前面 -->
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button></el-input
          ></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <!-- 用户列表单 -->
        <!-- el-table中有个:data 绑定后端数据  -->
        <el-table :data="userList" :stripe="true" border>
          <!-- 表单通过prop 传值 -->
          <!--type增加索引  -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateUpdata(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 分享按钮 -->
            <el-button type="warning" icon="el-icon-share" size="mini"></el-button>

            <!-- 悬停提示-->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <!-- 设置按钮 -->
              <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>
        <!-- 下面分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
        >
        </el-pagination>
        <!-- 弹出对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
          <!-- 添加用户的表单验证 -->
          <!-- 内容主体部分 -->

          <el-form
            :model="addForm"
            :rules="addRules"
            ref="ruleFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="tel">
              <el-input v-model="addForm.tel"></el-input>
            </el-form-item>
          </el-form>
          <!-- 页脚部分 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    //验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      //这里是对email.test()为true的话返回callback 否则
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error())
    };
    return {
      //获取后台用户列表参数，get中的params对象
      queryInfo: {
        //搜索动态绑定
        query: "",
        //当前页面的页数
        pagenum: 1,
        // 当前页面显示的多少条
        pagesize: 2,
      },
      userList: [],
      total: 0,
      //显示对话框 true 和 false
      addDialogVisible: false,
      //用户表单绑定的数据
      addForm: {
        username: "",
        password: "",
        email: " ",
        tel: "",
      },
      //验证规则
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
        ],
        tel: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      //发起get网络请求
      //GET请求要使用params，POST请求不需要
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取管理员列表失败");
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
    },
    // 处理分页  切换页面展示触发此函数 监听pagesize的改变
    //将当前组件的显示数据的条数 对应后端请求的数据
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
      console.log(newsize);
    },
    //监听 页码值的改变事件
    // 将当前组件的显示数据的多少页 对应后端请求的数据
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      //调用后端请求函数
      this.getUserList();
      //  console.log(newpage);
    },
    //用户状态更新 监听switch开关的改变 同步数据库数据
    async userStateUpdata(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      // console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        //既然更新状态用户失败，但是页面也仍然对开关进行了修改，所以要对开关进行一次取反
        return this.$message.error("更新状态用户失败！");
      }
      this.$message.success("更新用户状态成功");
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  //!important 是覆盖原来的box-shadow
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
