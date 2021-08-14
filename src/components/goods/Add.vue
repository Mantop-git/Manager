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
      <!-- Alert提示框 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 步骤条 step -->
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs便签页 -->
      <el-form
        :model="addform"
        :rules="formRules"
        ref="ruleFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addform.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addform.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_number">
              <el-input v-model="addform.goods_number"></el-input>
            </el-form-item>
            <!-- 联级选择器 -->
            <el-form-item label="商品分类" prop="good_cat">
              <el-cascader
                v-model="addform.goods_cat"
                :options="cateList"
                @change="handleChange"
                :props="{ ...cateProps }"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item1.attr_name"
              prop=""
              v-for="item1 in goodsParams"
              :key="item1.attr_id"
            >
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  :label="lable"
                  v-for="(lable, i) in item1.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals">{{ item.attr_vals }}</el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headersObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 评论的依赖组件 -->
            <quill-editor ref="myQuillEditor" v-model="addform.goods_introduce" />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" round class="addGoodsBtn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览的dialog -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="PreviewUrl" class="PreviewImg" alt="" />
    </el-dialog>
  </div>
</template>

<script>
  //lodash 用 _ 命名类似于 jquery $
  import _ from 'lodash'

  export default {
    name: "Add",
    data() {
      return {
        /*
          *当前tabs便签绑定的活跃的索引，
          tab绑定的是字符串，在step绑定的是数字，双向绑定两者对应索引
          数值转字符串
  num + ' '
  长的像数值的字符串转数值，让它减0就可以
  如: strVal = '1'
  strVal - 0
          */
        activeIndex: 0,
        //
        addform: {
          goods_name: "asd",
          goods_price: '0',
          goods_weight: '10',
          goods_number: '0',
          //商品所属的分类数组
          goods_cat: [1, 4, 24],
          //图片的数组
          pics: [],
          //商品的详细介绍
          goods_introduce: "",
          attrs:[]
        },
        //验证规则
        formRules: {
          goods_name: [
            { required: true, message: "请输入商品名称", trigger: "blur" },
            { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
          ],
          goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
          goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
          goods_cat: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
          goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        },
        //dialog配置
        previewVisible: false,

        //获取的后台数据保存
        //联级选择器的相关配置
        cateList: [],
        cateProps: {
          expandTrigger: "hover",
          label: "cat_name",
          value: "cat_id",
          children: "children",
        },
        //获取的参数列表 后台，动态值
        goodsParams: [],
        //only参数传来的值,后台，静态值
        onlyTableData: [],
        //上传图片的url地址 upload
        uploadUrl: "https://lianghj.top:8888/api/private/v1/upload",
        //s上传图片的请求头
        headersObj: {
          Authorization: window.sessionStorage.getItem("token"),
        },
        //组件upload点击on-preview用于预览图片的url
        PreviewUrl: "",
      };
    },
    created() {
      this.getCateList();
    },
    computed: {
      //获取的三级id 用于网络请求的对应参数
      isThreeGreade() {
        if (this.addform.goods_cat.length === 3) {
          return this.addform.goods_cat[2];
        }
        return null;
      },
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get("categories");
        if (res.meta.status !== 200) return this.$message.error("获取数据列表失败！");
        console.log(res);
        this.cateList = res.data;
      },
      //级联选择器选中触发
      handleChange() {
        //z只让级联选择器选的是第三级 ,
        if (this.addform.goods_cat.length !== 3) {
          this.addform.goods_cat.length = [];
        }
        console.log(this.addform.goods_cat);
      },
      //tabs离开前的事件,返回两个参数
      beforeTabLeave(activeName, oldActiveName) {
        console.log("即将离开的tabs的name是：" + oldActiveName);
        console.log("即将进入的tabs的name是：" + activeName);
        if (oldActiveName === "0" && this.addform.goods_cat.length !== 3) {
          this.$message.error("请先选择商品分类，在进行下一步！");
          return false;
        }
      },
      //tabClick 返回选中的tab实例
      async tabClick() {
        if (this.activeIndex === "1") {
          const { data: res } = await this.$http.get(
            `categories/${this.isThreeGreade}/attributes`,
            {
              params: { sel: "many" },
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("获取列表失败！");
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });
          this.goodsParams = res.data;
          console.log(res);
        } else if (this.activeIndex === "2") {
          const { data: res } = await this.$http.get(
            `categories/${this.isThreeGreade}/attributes`,
            {
              params: { sel: "only" },
            }
          );
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.onlyTableData = res.data;
          console.log(res);
        }
      },
      //on-preview点击已上传的文件时的钩子
      handlePreview(file) {
        this.PreviewUrl = file.response.data.tmp_path;
        this.previewVisible = true;
        console.log(this.PreviewUrl);
      },
      //on-remove	文件列表移除文件时的钩子
      handleRemove(file) {
        /*
        1.获取将要删除的图片临时路径 在file.response中
        2.然后在addform.pics对应的索引的数组删除，splice(index,howmany)
        */
        console.log(file);
        const filePath = file.response.data.tmp_path;
        //findindex里面必需是一个有参函数，参数接收前面的数组，必需返回你需要的值 这里是x.pics属性必需等于filePath最后用i接收值
        const i = this.addform.pics.findIndex(x => {
          return x.pics === filePath;
        });
        this.addform.pics.splice(i, 1);
        console.log(this.addform);
      },
      //on-success 文件上传成功时的钩子	function(response, file, fileList)
      handleSuccess(response) {
        //定义一个对象，对象接收response的path传递给pics数组
        const picInfo = { pics: response.data.tmp_path };
        this.addform.pics.push(picInfo);
        console.log(this.addform);
        console.log(response);
      },
      //add添加商品
      async add() {
        //t添加商品前对整个表单进行校验
        this.$refs.ruleFormRef.validate(valid=>{
          if(!valid) return this.$message.error('请填写完整的表单以继续！')
        })

        //这里this.addform.goods_cat在Cascader 级联选择器v-model中必需是数组类型
        //而在网络请求中的参数必需为','分隔的字符串
        //所以用lodash进行深拷贝一份
        // this.addform.goods_cat=this.addform.goods_cat.join(',')
        //_.cloneDeep(obj)
        const deepaddform= _.cloneDeep(this.addform)
        deepaddform.goods_cat=deepaddform.goods_cat.join(',')
        //处理动态属性 ，作为网络请求的参数
        this.goodsParams.forEach(item=>{
           const manyInfoEach={
             attr_id:item.attr_id,
             attr_vals:item.attr_vals.join(',')
           }
           //然后把获取的数据传到this.addform.attrs中一并发起请求
           deepaddform.attrs.push(manyInfoEach)
        })
        //处理静态属性，作为网络请求的参数
        this.onlyTableData.forEach(item=>{
          const onlyInfoEach={
            attr_id:item.attr_id,
            attr_vals:item.attr_vals
          }
          //然后把获取的数据传到this.addform.attrs中一并发起请求
           deepaddform.attrs.push(onlyInfoEach)
        })
        //正式发起网络请求
        //添加商品，商品名称必需是唯一的
        const {data:res}=await this.$http.post('/goods',deepaddform)
        if(res.meta.status!==201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
         console.log(deepaddform);
      },
    },
  };
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .el-alert {
    margin-bottom: 15px;
  }
  .el-steps {
    margin: 15px 0;
  }
  .el-checkbox {
    margin: 0 20px 0 0 !important;
  }
  .PreviewImg {
    width: 100%;
  }
  .addGoodsBtn {
    margin: 15px 0;
  }
</style>
