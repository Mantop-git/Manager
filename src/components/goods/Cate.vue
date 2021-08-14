<template>
  <div>
    <!-- 面包屑 导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :stripe="true"
        :expand-type="false"
        show-index
        index-text="当前序列"
        border
      >
        <!-- 是否有效 -->
        <!-- slot-scop不要在用，已经失效 -->
        <!-- v-slot:isok="scope" >>> slot="isok" v-slot='scope' -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <!-- v-slot:order=scope -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 下面分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 30]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 点击添加分类弹出对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!--添加分类的表单  -->
      <el-form
        ref="addformRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <el-cascader
            v-model="selectKeys"
            size="small"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              ...cascaderProps,
              children: 'children',
              checkStrictly: 'true',
            }"
            @change="parentCateChange"
            cleanable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "Cate",
        //获取数据的查询条件
        querInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        },

        //商品分类的数据列表，默认为空
        cateList: [],
        //父级数据
        parentCateList: [],
        //控制对话框
        addCateDialogVisible: false,
        //添加分类的表单对象
        addCateForm: {
          //将要添加的分类名称
          cat_name: "",
          //id
          cat_pid: 0,
          //分类等级
          cat_level: 0,
        },
        //cascaderProps对应的props
        cascaderProps: {
          // expandTrigger: "hover",
          value: "cat_id",
          label: "cat_name",
        },

        // 选中的父级的id数组
        selectKeys: [],
        //所有数据
        total: 0,
        //验证规则
        addCateFormRules: {
          cat_name: [
            { required: true, message: "请添加分类名称", trigger: "blur" },
            { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
          ],
        },
        //组件tree-table的colusms
        columns: [
          {
            label: "分类名称",
            prop: "cat_name",
            width: "400px",
          },
          {
            label: "是否有效",
            //让当前列为模板列
            type: "template",
            //模板列对应模板插槽为isok的替换当前模板
            template: "isok",
          },
          {
            label: "排序",
            type: "template",
            template: "order",
          },
          {
            label: "操作",
            type: "template",
            template: "option",
          },
        ],
      };
    },
    created() {
      this.getCateList();
    },
    methods: {
      //获取商品分类的数据
      async getCateList() {
        const { data: res } = await this.$http.get("categories", {
          params: this.querInfo,
        });
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取商品数据失败！");
        //把获取的数据保存到cateList
        this.cateList = res.data.result;
        //获取的总数据传给this.total
        this.total = res.data.total;
      },
      //监听pagesize的改变
      handleSizeChange(newSize) {
        this.querInfo.pagesize = newSize;
        this.getCateList();
      },
      //监听pagenum的改变
      handleCurrentChange(newPageNum) {
        this.querInfo.pagenum = newPageNum;
        this.getCateList();
      },
      //展示showAddCateDialog对话框
      showAddCateDialog() {
        this.getParentCateList();
        this.addCateDialogVisible = true;
      },
      //获取父级分类的数据
      async getParentCateList() {
        const { data: res } = await this.$http.get("/categories", {
          params: { type: 2 },
        });
        if (res.meta.status !== 200) return this.$message.error("获取父级数据失败！");
        console.log(res.data);
        this.parentCateList = res.data;
      },
      //选中项一旦确定选中触发这个函数
      parentCateChange() {
        console.log(this.selectKeys);
        //如果selectedKey的数组长度大于0则表示已经选中了父级分类
        if (this.selectKeys.length > 0) {
          //添加分类表单对象就赋予了一个新值
          this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
          //给添加分类表单对象赋予等级权限
          return (this.addCateForm.cat_level = this.selectKeys.length);
        } else {
          //否则就是为选中需要添加的表单对象
          //将添加表单对象的
        }
      },
      //点击确定添加新的分类
      addCate() {
        //对当前form表单进行效验看是否符合格式用validate函数，参数为一个回调函数，若不传入回调函数，则会返回一个 promise
        this.$refs.addformRef.validate(async valid => {
          //如果valid校验失败直接返回空，无法进行下一步
          if (!valid) return;
          //否则进行网络请求
          const { data: res } = await this.$http.post("categories", this.addCateForm);
          if (res.meta.status !== 201) return this.$message.error("添加分类失败！");
          this.$message.success("添加分类成功！");
          this.getCateList();
          this.addCateDialogVisible = false;
        });
        console.log(this.addCateForm);
      },
      //对话框关闭事件
      addCateDialogClose() {
        this.$refs.addformRef.resetFields();
        this.selectKeys = null;
        this.addCateForm.cat_name = "";
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-row {
    margin-bottom: 15px;
  }
  .el-card {
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>
