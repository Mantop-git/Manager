<template>
  <div>
    <!-- 面包屑 导航-->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>商品管理</el-breadcrumb-item>

      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->

    <el-card>
      <!-- 警告提示框 -->

      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        closeable="false"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->

      <el-row class="cat_opt">
        <el-col>
          <span> 选择商品分类: </span>

          <!-- 选择商品分类的联级选择框 -->

          <el-cascader
            v-model="selectedCateKey"
            :options="CateList"
            :props="{ expandTrigger: 'hover', ...cateProp }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs标签页 -->

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="medium"
            @click="showDialog"
            round
            :disabled="isBtnDisabled"
            >动态参数</el-button
          >
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="medium"
            @click="showDialog"
            round
            :disabled="isBtnDisabled"
            >静态属性</el-button
          >
        </el-tab-pane>
      </el-tabs>

      <!-- 参数列表 -->

      <el-table
        :data="CateList"
        style="width: 100%"
        stripe
        border
        :tree-props="{ children: 'children', hasChildren: 'true ' }"
      >
        >
        <el-table-column type="expand"> </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="cat_name" label="参数名称" width="500px">
        </el-table-column>
        <el-table-column label="操作" width="500px">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 对话框dialog -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="paramsDialogClosed"
    >
      <!-- 验证表单 -->
      <el-form
        :model="paramsForm"
        :rules="paramsRules"
        ref="paramsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        //级联选择器绑定的数据源，后端获取的数据
        CateList: [],
        //级联选择器选中后的key
        selectedCateKey: [],
        //Props对应的prop
        cateProp: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
        },
        //tabs标签页双向绑定的值
        activeName: "many",
        //table绑定的数据
        tableList: [{}],
        //dialogvisable
        paramsDialogVisible: false,
        //验证表单
        paramsForm: {
          attr_name: "",
        },
        //验证规则
        paramsRules: {
          attr_name: [
            { required: true, message: "请输入参数名称", trigger: "blur" },
            { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
          ],
        },
      };
    },
    //判断添加属性按钮是否可用
    computed: {
      //如果按钮禁用返回true，否则false
      isBtnDisabled() {
        if (this.selectedCateKey.length !== 1) {
          return true;
        }
        return false;
      },
      //动态绑定dialog的title
      titleText() {
        if (this.activeName === "many") {
          return "动态属性";
        }
        return "静态属性";
      },
      //当前选中的三级分类id
      cateId() {
        if (this.selectedCateKey.length == 3) {
          return this.selectedCateKey[2];
        } else {
          return null;
        }
      },
    },
    created() {
      this.getCateList();
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get("/categories");
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类列表失败！");
        }
        this.CateList = res.data;
        console.log(this.CateList);
      },
      //联级对应的handleChange
      async handleChange() {
        //证明不是选中的三级分类
        if (this.selectedCateKey.length !== 3) {
          this.$message.info("你选中的不是三级分类！");
          console.log(this.selectedCateKey);
          // return (this.selectedCateKey = []);
        }
        //当选中的是第三级分类,发起请求
        const { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          {
            param: { sel: this.activeName },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("获取参数列表失败!");
        console.log(res.data);
      },
      //tabs点击绑定的事件
      handleTabClick() {
        console.log(this.activeName);
      },

      //点击按钮展示dialog
      showDialog() {
        this.paramsDialogVisible = true;
      },
      //关闭dialog清空表单
      paramsDialogClosed() {
        this.$refs.paramsFormRef.resetFields();
      },
      //D点击确定，添加参数
      addParams() {
        this.$refs.paramsFormRef.validate(async valid => {
          if (!valid) {
            return;
          }
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.paramsForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加参数失败！");
          }
          this.$message.success("添加参数成功！");
          this.getCateList();
          this.paramsDialogVisible = true;
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .cat_opt {
    margin: 15px 0px;
  }
</style>
