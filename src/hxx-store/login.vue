<template>
    <div style="width:100%;height:100%;">
        <div style="height:70px;width:1200px;margin:0 auto;">
            <div style="width:960px;height:100%;margin:0 auto;">
                <div style="height:100%;float:left;padding-top:20px;">
                    <img src="../assets/images/haoxiuxiu-logo.png"
                         style="width:120px;height:50px;position:absolute;top:10px;"/>
                    <span style="font-size:20px;text-shadow: 0px 0px 0px #ffffff, 1px 1px 0px #d0d0d0;margin-left:130px;">好修修智慧门店管理系统</span>
                </div>
                <div style="float:right;padding-top:20px; font-size:18px;">全国客服热线：400-663-8210</div>
            </div>
        </div>
        <div style="clear:both;"></div>
        <div class="login">
            <div class="login-con">
                <Card icon="log-in">
                    <Tabs value="name1">
                        <TabPane label="企业登录" name="name1">
                            <div class="form-con">
                                <Form :model="form" @keydown.enter.native="handleSubmit">
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
                                    </FormItem>
                                    <FormItem>
                                        <Button @click="handleSubmit" type="primary" long>登录</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </TabPane>
                        <TabPane label="员工登录"  name="name2">
                            <div class="form-con">
                                <Form :model="form2" @keydown.enter.native="handleSubmit">
                                    <FormItem prop="userName">
                                        <Input v-model="form2.tenantId" placeholder="请输入商户号">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                    <FormItem prop="userName">
                                        <Input v-model="form2.userCode" placeholder="请输入用户名">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                    <FormItem prop="password">
                                        <Input type="password" v-model="form2.password" placeholder="请输入密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                    <FormItem>
                                        <Button @click="handleSubmit2" type="primary" long>登录</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        </div>
        <div class="footer-right"> © 2018 Copyright 上海衡益网络技术有限公司 沪ICP备18016827号-1</div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form'
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      form: {
        userName: '13888888888',
        password: '123456'
      },
      form2: {
        tenantId: 'T00001',
        userCode: 'zzz',
        password: '123456'
      }
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
        data: {
          telphone: this.form.userName,
          telpass: this.form.password
        }
      }).then(res => {
        if (res.success === true) {
          this.$router.push({name: 'home'})
        }
      })
    },
    handleSubmit2 () {
      this.axios.request({
        url: '/tenantLogin.do',
        // url: '/comment/id?commentId=245',
        method: 'post',
        data: {
          tenantId: this.form2.tenantId,
          userCode: this.form2.userCode,
          password: this.form2.password
        }
      }).then(res => {
        if (res.success === true) {
          this.$router.push({name: 'home'})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    /*@import './login.less';*/
    .login {
        width: 100%;
        height: 82vh;
        background-image: url('../assets/images/banner-loginbg.png');
        background-size: cover;
        background-position: center;
        position: relative;
        &-con {
            position: absolute;
            right: 250px;
            top: 50%;
            transform: translateY(-60%);
            width: 300px;
            &-header {
                font-size: 16px;
                font-weight: 300;
                text-align: center;
                padding: 30px 0;
            }
            .form-con {
                padding: 10px 0 0;
            }
            .login-tip {
                font-size: 10px;
                text-align: center;
                color: #c3c3c3;
            }
        }
    }

    .footer-right {
        text-align: center;
        font-size: 16px;
        margin-top: 20px;
        padding-bottom: 20px;
        color: #000;
    }

</style>
<style lang="less" >
    .login{
        .ivu-tabs-nav-scroll{
            text-align:center;
        }
        .ivu-tabs-nav{
            float:none;
            display:inline-block;
        }
    }
</style>
