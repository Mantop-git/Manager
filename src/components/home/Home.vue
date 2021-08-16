<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="home-head" @click="backHome">
        <img src="~assets/imgs/heima.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!--这句话的意思是如果为true 宽度65px :表示否则 为200px  -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单项 -->
        <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409ff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 给index动态绑定，指定单一项，动态index只能接收字符串 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconfontObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单的模板 -->
              <template slot="title">
                <!-- 2图标 -->
                <i class="iconfont icon-caidan"></i>
                <!-- 2文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        menulist: [],
        activePath: "",
        isCollapse: false,
        iconfontObj: {
          125: "iconfont icon-user",
          103: "iconfont icon-tijikongjian",
          101: "iconfont icon-shangpin",
          102: "iconfont icon-changyongtubiao-fuben-65",
          145: "iconfont icon-baobiaobiaoweiguanli",
        },
      };
    },
    created() {
      this.getmenulist();
      // window.sessionStorage.getItem('key')
      this.activePath = window.sessionStorage.getItem("activePath");
    },
    methods: {
      // 导航头部点击回到主路由
      backHome() {
        this.$router.push("/welcome");
      },
      // 退出登录
      loginout() {
        window.sessionStorage.clear();
        this.$router.push("/login");
        this.$message("退出成功");
      },
      //点击折叠菜单
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      // 保存链接激活状态，
      //接收 一个活跃的路径
      saveNavState(activePath) {
        // window.sessionStorage.setItem('key','value')
        window.sessionStorage.setItem("activePath", activePath);
        this.activePath = activePath;
      },
      async getmenulist() {
        //请求后端menu的数据，返回promise可以用async和await简化最后解构
        const { data: res } = await this.$http.get("/menus");
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menulist = res.data;
        // console.log(res);
      },
    },
  };
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .home-head {
    cursor: pointer;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: #fff;
    align-items: center;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 10px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    color: #333;
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
    color: #333;
  }
  .iconfont {
    margin-right: 8px;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 12px;
    text-align: center;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
