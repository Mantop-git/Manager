<template>
  <div>
    <!-- 面包屑 导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框input -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="orderList" index-text="当前序列" style="width: 100%" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" width="180">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.order_pay == 0">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货 " width="80"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180">
          <template v-slot="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作 " width="200">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showAddressDialog"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location-information"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 下面分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        :model="addressRuleForm"
        :rules="addressRules"
        ref="addressRuleRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressRuleForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressRuleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--显示物流的对话框  -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="50%"
      @close="progressdialogClose"
    >
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(progress, index) in progressInfo"
          :key="index"
          :timestamp="progress.ftime"
        >
          {{ progress.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from "./citydata.js";

  export default {
    name: "Order",
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 3,
          // user_id:'',
          // pay_status:'',
        },
        //total总数据
        total: 0,
        orderList: [],
        //dialog对话框
        addressDialogVisible: false,
        progressDialogVisible: false,
        //form表单数据
        addressRuleForm: {
          address1: [],
          address2: "",
        },
        //form表单数据验证规则
        addressRules: {
          address1: [{ required: true, message: "请选择省市区县", trigger: "blur" }],
          address2: [{ required: true, message: "请选择详细地址", trigger: "blur" }],
        },
        //物流信息
        progressInfo: [],

        //cityData 重名可以省略
        // cityData:cityData
        cityData,
        //cascader 的props
      };
    },
    created() {
      this.getOrderList();
    },
    methods: {
      async getOrderList() {
        const { data: res } = await this.$http.get("/orders", { params: this.queryInfo });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.total = res.data.total;
        this.orderList = res.data.goods;
        console.log(res);
      },
      //handleSizeChange
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      //handleCurrentChange
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      //showAddressDialog
      showAddressDialog() {
        this.addressDialogVisible = true;
      },
      async showProgressDialog() {
        const { data: res } = await this.$http.get("/kuaidi/1106975712662");
        if (res.meta.status !== 200) return this.$meesage.error(res.meta.message);
        this.$message.success(res.meta.message);
        console.log(res);
        this.progressInfo = res.data;
        this.progressDialogVisible = true;
      },
      // handleChange
      handleChange() {
        console.log(this.addressRuleForm.address1);
      },
      // dialogClose
      dialogClose() {
        this.$refs.addressRuleRef.resetFields();
      },
      progressdialogClose() {},
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-table {
    margin: 15px 0;
  }
  .el-cascader {
    width: 100%;
  }
</style>
