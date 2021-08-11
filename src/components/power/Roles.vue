<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col :span="24"><el-button round type="primary">添加角色</el-button></el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleslist" stripe style="width: 100%">
        <el-table-column type="expand">
          <!-- 展开列 -->
          <template v-slot="scope">
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'vcenter', index === 0 ? 'bdtop' : 'vcenter']"
            >
              <!--第一列用来渲染一级权限  -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                >
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二列渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"> </el-table-column>
        <el-table-column prop="" label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的dialog对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showRightDialogVisible"
      @close="cleanDefKeys"
      width="50%"
    >
      <!-- 树形控件 :data是绑定数据源 :props传递的数据 -->
      <el-tree
        :data="showRightTree"
        :props="TreeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        roleslist: [],
        //分配权限的绑定数据
        showRightDialogVisible: false,
        showRoleDialogVisible: false,
        //接收分配数据的后端数据
        showRightTree: [],
        //树形控件的属性绑定对象 children展示的children，label展示data数据中展示的元素
        TreeProps: {
          children: "children",
          label: "authName",
        },
        //默认选择节点的id数值
        defKeys: [],
        //当前分配权限的角色id
        roleID: "",
      };
    },
    created() {
      this.getRolesList();
    },
    methods: {
      async getRolesList() {
        const { data: res } = await this.$http.get("/roles");
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取用户列表失败");
        this.$message.success("获取成功！");
        this.roleslist = res.data;
        console.log(this.roleslist);
      },
      //通过id删除tag权限
      async removeRightById(role, rightId) {
        const confirmResult = await this.$confirm(
          "此操作将永久删除该权限, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((error) => error);
        // console.log(confirmResult);
        if (confirmResult !== "confirm") {
          return this.$message.info("取消了删除！");
        }
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("删除权限失败！");
        }
        role.children = res.data;
      },
      //展示分配权限dialog对话框
      async showSetRightDialog(role) {
        //获取所有权限数据
        const { data: res } = await this.$http.get("rights/tree");
        //点击当前分配权限获取对应id值
        this.roleID = role.id;
        this.getLeafKeys(role, this.defKeys);
        console.log(
          this.defKeys + "这是函数传的值是接收的值，将arr中的值传给this.defKeys"
        );
        this.showRightDialogVisible = true;
        if (res.meta.status !== 200) return this.$message.error("请求数据失败！");
        this.showRightTree = res.data;
        // return console.log(this.showRightTree);
      },
      //获取默认节点 通过递归的形式，获取角色下三级权限的id，保存到defKeys 数组中
      getLeafKeys(node, arr) {
        //这个 ! 理解为：不存在
        // index===0 ? 这个问号理解为 是否index===0 'a' : 'b'  冒号为否则b
        if (!node.children) {
          return arr.push(node.id);
        }
        //对node这个节点进行递归函数，判断此node中是否还含有children
        node.children.map((item) => this.getLeafKeys(item, arr));
      },
      //在关闭dialog时清除defkey数组默认展示的值
      cleanDefKeys() {
        this.defKeys = [];
      },
      //点击确定后dialog进行的事件
      async allotRights() {
        //获取所有全选和半选的id 调用ele中的全选和半选方法即可
        const key = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ];
        console.log(key + "这是选中的el-tree中的值");
        //通过逗号对key数组进行分割
        const idStr = key.join(",");
        //进行网络请求
        const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, {
          rids: idStr,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("分配权限失败！");
        }
        this.$message.success("分配权限成功！");
        this.getRolesList();
        this.showRightDialogVisible = false;
      },
    },
  };
</script>

<style lang="less" scoped>
    .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-tag {
    margin: 6px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
