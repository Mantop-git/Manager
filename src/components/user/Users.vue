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
        <!-- el-table中有个:data 绑定后端数据
        el-table中有个@change 与后端数据交互  
         -->
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
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delateUserById(scope.row.id)"
              ></el-button>
              <!-- 悬停提示-->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top-start"
                :enterable="false"
              >
                <!-- 设置按钮 -->
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
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
        <!-- 添加用户弹出的对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="diaClose"
        >
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
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- dialog的页脚部分 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 点击修改按钮展示的修改用户的对话框dialog -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
          <el-form
            ref="editFormRef"
            :model="editForm"
            :rules="editFormRules"
            label-width="80px"
          >
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
          return callback();
        }
        callback(new Error("请输入合法邮箱"));
      };
      var checkTel = (rule, value, callback) => {
        const regTelphone = /^[1][3reg5,7,8][0-9]{9}$/;
        if (regTelphone.test(value)) {
          return callback();
        }
        callback(new Error("请输入正确的手机号"));
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
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //用户表单绑定的数据
        addForm: {
          username: "",
          password: "",
          email: "",
          mobile: "",
        },

        //验证规则
        addRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 3, max: 12, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 3, max: 12, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
          ],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" },
          ],
          mobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { min: 3, max: 11, message: "请输入11位的手机号", trigger: "blur" },
            { validator: checkTel, trigger: "blur" },
          ],
        },
        editFormRules: {
          mail: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { min: 3, max: 16, message: "长度在 3 ~ 12 个字符", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" },
          ],
          mobile: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { min: 3, max: 11, message: "请输入11位的手机号", trigger: "blur" },
            { validator: checkTel, trigger: "blur" },
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
      //弹出dialog关闭时的监听事件
      diaClose() {
        return this.$refs.ruleFormRef.resetFields();
        this.addForm.username = Math.round(Math.random() * 155) + "mantop";
      },
      //点击确定添加用户
      addUser() {
        //校验表单是否合法，用一个参数接收
        this.$refs.ruleFormRef.validate(async (valid) => {
          //如果校验失败直接返回      校验失败valid打印false，否则打印true
          if (!valid) return;
          // console.log(valid);
          //校验成功进行promise网络请求
          const { data: res } = await this.$http.post("/users", this.addForm);
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success("添加用户成功！");
          //点击确定后，dialog对话框消失
          this.addDialogVisible = false;
          //刷新用户列表，直接发起获取用户列表的网络请求
          return this.getUserList();
        });
      },
      //点击编辑展示showEditDialog
      async showEditDialog(id) {
        const { data: res } = await this.$http.get("users/" + id);
        if (res.meta.status !== 200) return this.$message.error("查询用户失败");
        console.log(res);
        this.editForm = res.data;
        this.editDialogVisible = true;
        // console.log(id);
      },
      //修改对话框点击确定后的监听
      editUserInfo() {
        this.$refs.editFormRef.validate(async (valid) => {
          console.log(valid);
          if (!valid) return;
          const { data: res } = await this.$http.put("users/" + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          });
          if (res.meta.status !== 200) {
            return this.$message.error("更新用户失败");
          }
          //关闭对话框
          this.editDialogVisible = false;
          //重新调用数据刷新
          this.getUserList();
          return this.$message.success("更新成功");
        });
      },
      //通过id删除用户
      async delateUserById(id) {
        const confirmResult = await this.$confirm(
          "此操作将永久删除该用户, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        /*
        *删除的确定按钮返回的是一个promise对象，可以用async进行简化，
        接收后返回字符串  confirm
        点击取消之后会报错
        通过catch捕获异常之后返回字符串 cancel
        */
        console.log(confirmResult);
        if (confirmResult !== "confirm") {
          return this.$message.info("已取消删除");
        }
        const { data: res } = await this.$http.delete("users/" + id);
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("删除成功！");
        return this.getUserList();
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
