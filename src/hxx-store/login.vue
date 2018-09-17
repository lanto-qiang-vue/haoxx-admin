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
                  <!-- 企业商户登录 1 -->
                    <Tabs v-if="isShow == 1"  value="name1">
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
                                      <Checkbox v-model="single" style="padding-left:35px;">记住账号</Checkbox>
                                      <div style="float:right;padding-right:20px;"><a href="javascript:void(0);" @click="register">新用户注册</a></div>
                                    </FormItem>
                                    <FormItem>
                                        <Button @click="handleSubmit('tel')" type="primary" long>登录</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </TabPane>
                        <TabPane label="员工登录"  name="name2">
                            <div class="form-con">
                                <Form :model="form2">
                                    <FormItem prop="userName">
                                        <Input v-model="form2.tenantId" placeholder="请输入手机号码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                    <FormItem prop="userName">
                                        <Input v-model="form2.userCode" placeholder="请输入短信验证码">
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
                                    <div style="margin-top:-10px;padding-bottom:10px;"><Checkbox v-model="single" style="padding-left:35px;">记住账号</Checkbox></div>
                                                                        </FormItem>
                                    <FormItem>
                                        <Button @click="handleSubmit('tenant')" type="primary" long>登录</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </TabPane>
                    </Tabs>
                    <!-- 企业商户结尾 注册启始 2-->
                    <div v-if="isShow == 2">
                            <div><h1 style="font-size:18px;">用户注册</h1></div>
                            <div class="form-con">
                                <Form :model="form3">
                                    <FormItem prop="userName">
                                        <Input v-model="form3.phone" placeholder="请输入手机号码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                    <FormItem prop="userName">
                                        <Input v-model="form3.phoneCode" placeholder="请输入短信验证码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                <span slot="append"><a href="javascript:void()" @click="getCode">{{description}}</a></span>
                                        </Input>
                                    </FormItem>
                                    <FormItem prop="password">
                                        <Input type="password" v-model="form3.password" placeholder="请输入密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                    <FormItem prop="password">
                                        <Input type="password" v-model="form3.repeatPassword" placeholder="请输入确认密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                                        </Input>
                                    </FormItem>
                                      <div style="float:right;padding:0 20px 10px 0;margin-top:-10px;"><a href="javascript:void(0)" @click="login">返回登录</a></div>
                                    <FormItem>
                                        <Button @click="handleSubmit('register')" type="primary" long>注册</Button>
                                    </FormItem>
                                </Form>
                            </div>
                    </div>
                    <!-- 注册结束 -->
                </Card>
            </div>
        </div>
        <div class="footer-right"> © 2018 Copyright 上海衡益网络技术有限公司 沪ICP备18016827号-1</div>
    </div>
</template>

<script>
// import LoginForm from '_c/login-form'
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      description:'获取',
      form: {
        userName: '13888888888',
        password: '123456'
      },
      form2:{
        tenantId: 'T00001',
        userCode: 'zzz',
        password: '123456'
      },
      form3:{
        phone:'',
        phoneCode:'',
        password:'',
        repeatPassword:''
      },
      single:false,
      isShow:1,
    }
  },
  // components: {
  //   LoginForm
  // },
  mounted () {
    // console.log(this.$store.state.user.userInfo)
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    // handleSubmit ({ userName, password }) {
    handleSubmit (type) {
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
      //     this.$router.push({
      //       name: 'home'
      //     })
      //   })
      // })
      this.$Spin.show();
      let url = '', data = {}
      if (type == 'tel') {
        url = '/telphoneLogin.do'
        data = {
          telphone: this.form.userName,
          telpass: this.form.password
        }
      } else {
        url = '/tenantLogin.do'
        data = {
          tenantId: this.form2.tenantId,
          userCode: this.form2.userCode,
          password: this.form2.password
        }
      }

      this.axios.request({
        url: url,
        method: 'post',
        data: data
      }).then(res => {
        if (res.success === true) {
          this.$store.commit('setToken', res.data.tokenStr)
          this.$store.commit('setDict', res.data.dict)
          this.$store.commit('setTenant',res.data.tenantUsers);
          let getInfo = Promise.all([this.getUser(res.data.tokenStr), this.getMenu(res.data.tokenStr)])
          getInfo.then(() => {
            this.$router.push({name: 'home'})
            this.$Spin.hide()
            this.$Message.success('登录成功')
          })
        }else{
          this.$Spin.hide()
        }
      })
    },
    getUser (token) {
      return new Promise((resolve, reject) => {
        this.axios.request({
          url: '/tenant/common/getLoginUser',
          method: 'post',
          data: {
            access_token: token
          }
        }).then(res => {
          if (res.success === true) {
            this.$store.commit('setUser', res.data)
            resolve()
          } else reject()
        }).then(err => {
          reject(err)
        })
      })
    },
    getMenu (token) {
      return new Promise((resolve, reject) => {
        this.axios.request({
          url: '/tenant/common/getMenu',
          method: 'post',
          data: {
            node: 'root',
            access_token: token
          }
        }).then(res => {
          if (res.success === true) {
            this.$store.commit('setMenu', res.children)
            resolve()
          } else reject()
        }).then(err => {
          reject(err)
        })
      })
    },
    register:function(){
      this.isShow = 2;
    },
    login:function(){
      this.isShow = 1;
    },
    getCode:function(){
      //倒计时....
      this.description = "开始倒计时";
      // alert(this.form3.phone);
      // var pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      // if(!pattern.test(this.form3.phone)){

      // }

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
