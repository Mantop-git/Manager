<template>
  <div class="login_contain">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/imgs/girl.jpeg" alt="" />
      </div>
      <!-- 表单区域 -->
      <!-- :model中在el-form中使用，在el-input绑定form中的属性 -->
      <!-- ref对这个对象直接拿到 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 账号 -->
        <!-- 如果想用验证规则要加prop -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-zhanghao"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="">
          <!-- 在elementul中的input 输入框的模板 -->
          <!-- type='password' 密码隐藏 -->
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginvalid">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name: "Login",
    data() {
      return {
        // 这是登入表单数据绑定对象
        loginForm: {
          username: "admin",
          password: "123456",
        },
        //登入表单的验证规则对象
        loginFormRules: {
          // 验证登录名的合法
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
              min: 3,
              max: 15,
              message: "长度在 3 到 15 个字符",
              trigger: "blur",
            },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 3,
              max: 12,
              message: "长度在 3 到 12 个字符",
              trigger: "blur",
            },
          ],
        },
      };
    },
    methods: {
      //重置登入
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      //验证表单
      loginvalid() {
        this.$refs.loginFormRef.validate(async valid => {
          //返回布尔值验证是否成功,当valid为false直接返回，true网络请求
          if (!valid) return;
          //post('地址',ref对象)
          //一开始会返回promise
          //将获取的data重命名为res
          const { data: res } = await this.$http.post("login", this.loginForm);
          //返回的promise可以被await简化，await只能用在async中async修函数
          // const res = await this.$http.post("login", this.loginFormRef);console.log(res); 返回的res中的data才是真正需要的数据，所以要对返回的res解构
          if (res.meta.status !== 200) return this.$message.error("登陆失败");
          this.$message.success("登录成功");

          window.sessionStorage.setItem("token", res.data.token);
          // 2. 通过编程式路由导航跳转到后台主页,路由地址是 /home
          this.$router.push("/home");
          /*
        1.将登录成功之后的token保存到sessionStorage中
        2.token只在当前网站打开期间生效，所以保存到sessionStorage
        3.跳转到后台主页 /home
        */
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .login_contain {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // 绝对定位
    position: absolute;
    left: 50%;
    top: 50%;
    // translate这个参数的，是transform 身上的，(x,y)偏移
    transform: translate(-50%, -50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border: solid 1px #eee;
    padding: 10px;
    background-color: white;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    //    上下左右
    padding: 0% 20px;
    box-sizing: border-box;

    //   box-sizing属性可以为三个值之一：content-box（default），border-box，padding-box。

    // content-box，border和padding不计算入width之内

    // padding-box，padding计算入width内

    // border-box，border和padding计算入width之内
  }
  // 卸载
  // npm uninstall --save less-loader
  // 安装低版本
  // npm install -D less-loader@7.x
  //安装less模板
  // npm install less --save-dev
</style>
