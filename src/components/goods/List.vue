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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            :clearable="true"
            @clear="cleanInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6"
          ><el-button type="primary" icon="el-icon-search" @click="goAddPage">添加商品</el-button></el-col
        >
      </el-row>
      <!-- table表单 -->
      <el-table :data="goodlist" style="width: 100%" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="450">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格 (元)" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量 (KG)" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200">
          <template v-slot="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="182">
          <template v-slot='scope'>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodsByID(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 25, 40, 80]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "List",
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10,
        },
        //获取的goodlist数据
        goodlist: [],
        //底部分页总数据
        total: 0,
      };
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      //根据分页获取对应商品列表
      async getGoodsList() {
        const { data: res } = await this.$http.get("/goods", { params: this.queryInfo });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        console.log(res);
        this.goodlist = res.data.goods;
        this.total = res.data.total;
      },
      //当每页条数改变时触发
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      //当前页改变时
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      //点击clearable触发的事件
      cleanInput() {
        this.queryInfo.query = null;
        this.getGoodsList();
      },
      //删除商品by id
      async deleteGoodsByID(id) {
        //使用catch捕获错误后 返回一个字符串
         const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirmResult)
        if(confirmResult=='cancel'){
          return this.$message.info('已经取消删除！')
        }
        //否则就是进行网络请求
        const {data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200) return this.$message.error('删除失败!')
        this.$message.success('删除成功！')
        this.getGoodsList();
      },
      //前往添加商品页面
      goAddPage(){
        this.$router.push('/goods/add')
      }
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
  .el-table {
    margin-top: 15px;
    font-size: 15px;
    font-weight: 600;
  }
</style>
