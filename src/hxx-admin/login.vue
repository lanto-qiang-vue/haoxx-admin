<template>
  <div class="login">

    <div class="login-header">
      <!--href="index" target="_blank"-->
      <a class="header-name" >
        <div style="line-height:40px;">好修修智慧门店系统</div>
        <span>Automobile maintenance management system</span>
      </a>
      <p style="padding-top: 45px;">欢迎登录</p>
    </div>

    <div class="login-content">
        <div class="login-wrap">
          <div class="login-con">
            <Card icon="log-in" title="用户登录" :bordered="false">
              <div class="form-con">
                <!--<login-form @on-success-valid="handleSubmit"></login-form>-->
                <Form ref="loginForm" :model="form"  @keydown.enter.native="handleSubmit">
                  <FormItem prop="userName">
                    <Input v-model="form.userName" placeholder="请输入用户名">
                      <span slot="prepend">
                        <Icon :size="16" type="ios-person"></Icon>
                        </span>
                              </Input>
                            </FormItem>
                            <FormItem prop="password">
                              <Input type="password" v-model="form.password" placeholder="请输入密码">
                              <span slot="prepend">
                          <Icon :size="14" type="md-lock"></Icon>
                      </span>
                    </Input>
                    <div class="login-rember">
                        <div class="login-rember-left">
                          <Checkbox v-model="single">记住密码</Checkbox>
                        </div>
                        <div class="login-rember-right" title="请联系客服">
                          <span>忘记密码?</span>
                        </div>

                    </div>

                  </FormItem>
                  <FormItem>
                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                  </FormItem>

                </Form>
              </div>
            </Card>
          </div>
      </div>
    </div>

  </div>

</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        userName: 'sa',
        password: '123456'
      },
      single: false

    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    // handleSubmit ({ userName, password }) {
    handleSubmit () {
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
      //     this.$router.push({
      //       name: 'home'
      //     })
      //   })
      // })

      this.axios.request({
        url: '/telphoneLogin.do',
        // url: '/comment/id?commentId=245',
        method: 'post',
        params: {
          telphone: this.form.userName,
          telpass: this.form.password
        }
      }).then(res => {
        console.log(res)
        // if(res.success == 'true')
        this.$router.push({name: 'home'})
      })
    }
  }
}
</script>

<style lang="less">
  /*@import './login.less';*/
  /*.login{
    width: 100%;
    height: 500px;
    background-image: url('../assets/images/hxx-admin/login_bg.png');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con{
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;
      &-header{
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }
      .form-con{
        padding: 10px 0 0;
      }
      .login-tip{
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }*/
  .login{
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;

    .login-header{
          margin: 0 auto;
          width: 1000px;
          padding-top: 20px;
          padding-bottom: 20px;

          .header-name{
                float: left;
                display: inline-block;
          }

          .header-name div {
              font-family: "微软雅黑";
              font-size: 28px;
              color: #054c9d;
              letter-spacing: 5.5px;
              font-weight: normal;
          }
          .header-name span {
              display: block;
              font-family: "微软雅黑";
              text-transform: uppercase;
              font-size: 18px;
              color: #054c9d;
              font-weight: lighter;
          }
    }

    .login-header p {
        float: left;
        display: inline-block;
        font-size: 30px;
        font-family: "微软雅黑";
        color: #333;
        padding-top: 35px;
        padding-left: 20px;
        text-shadow: 0 0 black;
    }

    .login-content{
      width: 100%;
      height: 500px;
      background: #055fe8;
      margin-top: 90px;
      .login-wrap{
        width: 1000px;
        height:500px;
        margin:0 auto;
        background: url('../assets/images/hxx-admin/login_bg.png') no-repeat;
        position: relative;
        .login-con{
          position: absolute;
          right: 0px;
          top: 50%;
          transform: translateY(-60%);
          width: 300px;
          &-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
          }
          .form-con{
            padding: 10px 0 0;
          }
          .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
          }
          .login-rember{
            width: 100%;
            overflow: hidden;
            margin-top: 10px;

            .login-rember-left{
              float: left;
            }
            .login-rember-right{
              float: right;
            }
          }

        }

      }
    }

  }
</style>
