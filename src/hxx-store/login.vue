<template>
  <div style="width:100%;height:100%;overflow:auto;">
    <div style="height:70px;width:80%;margin:0 auto;">
      <div style="">
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
          <Tabs v-if="isShow == 1"   v-model="indexName">
            <TabPane label="企业登录" name="name1">
              <div class="form-con">
                <Form :model="form" @keydown.enter.native="handleSubmit('tel')">
                  <FormItem prop="userName">
                    <Input v-model="form.userName" :maxlength="11" placeholder="请输入用户名">
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
                    <Checkbox v-model="single" style="padding-left:35px;" v-if="jzzz">记住账号</Checkbox>
                    <div style="float:right;padding-right:20px;"><a href="javascript:void(0);"
                                                                    @click="register">新用户注册</a></div>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleSubmit('tel')" type="primary" long>登录</Button>
                  </FormItem>
                </Form>
              </div>
            </TabPane>
            <TabPane label="员工登录" name="name2">
              <div class="form-con">
                <Form :model="form2" @keydown.enter.native="handleSubmit('tenant')">
                  <FormItem prop="userName">
                    <Input v-model="form2.tenantId" placeholder="请输入商户号">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                    </Input>
                  </FormItem>
                  <FormItem prop="userName">
                    <Input v-model="form2.userCode" placeholder="请输入账号">
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
                  <div style="margin-top:-10px;padding-bottom:10px;">
                    <Checkbox v-model="single" style="padding-left:35px;" v-if="jzzz">记住账号</Checkbox>
                  </div>
                  <!--</FormItem>-->
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
              <Form :model="form3" ref="form3" :rules="rules">
                <FormItem prop="phone">
                  <Input v-model="form3.phone" placeholder="请输入手机号码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="phoneCode">
                  <Input v-model="form3.phoneCode" placeholder="请输入短信验证码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
                    <span slot="append"><a href="javascript:void(0)" @click="getCode">{{description}}</a></span>
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <Input type="password" v-model="form3.password" placeholder="请输入密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="repeatPassword">
                  <Input type="password" v-model="form3.repeatPassword" placeholder="请输入确认密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <div style="float:right;padding:0 20px 10px 0;margin-top:-10px;"><a @click="login">返回登录</a></div>
                <FormItem>
                  <Button @click="doregister()" type="primary" long>注册</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <!-- 注册结束 -->
        </Card>
        <div style="position: relative;">
        <img src="../assets/images/hxx-ercode.png" style="width: 140%;position: relative;left: -35px;">
        <div style="width:100%;position:absolute;overflow: hidden;top: 60px;text-align: center;font-size: 14px;line-height: 20px;color: white;margin-left:10px;">
          <div style="display: inline-block;margin-right: 15px;width: 35%;"><img src="../assets/images/appDownload.png" style="width: 100%;"></div>
        </div>
        </div>
      </div>
    </div>
    <div class="footer-right"> © 2018 Copyright 上海衡益网络技术有限公司 沪ICP备18016827号-1</div>
  </div>
</template>

<script>
  // import LoginForm from '_c/login-form'
  import {mapActions} from 'vuex'
  import { getAccount} from '@/libs/util.js'
  export default {
    data() {
      return {
        description: '获取',
        indexName:'name1',
        form: {
          userName: '',
          password: ''
        },
        form2: {
          tenantId: '',
          userCode: '',
          password: ''
        },
        form3: {
          phone: '',
          phoneCode: '',
          password: '',
          repeatPassword: ''
        },
        single: false,
        isShow: 1,
        timing: '',
        jzzz:true,
        time: 60,
        flag: true,//防止定时器多次触发
        rules: {
          phone: [{
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            trigger: 'change,blur',
            message: '输入有效手机号'
          }],
          phoneCode: [{required: true, trigger: 'blur', message: '验证码必填'}],
          password: [{required: true, trigger: 'blur', message: '密码必填'}],
          repeatPassword: [{required: true, trigger: 'blur', message: '重复密码必填'}],
        },
      }
    },
    mounted() {

    },
    created(){
      let account = JSON.parse(getAccount());
      // console.log(account['telphone']);
      if(account.telphone){
        this.form.userName = account.telphone;
        this.form.password = account.telpass;
        this.single = true;
      }
      if(account.tenantId){
        this.form2.tenantId = account.tenantId;
        this.form2.userCode = account.userCode;
        this.form2.password = account.password;
        this.single = true;
        this.indexName = 'name2';
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      doregister() {
        this.$refs['form3'].validate((valid) => {
          if (valid) {
            if (this.form3.password !== this.form3.repeatPassword) {
              this.$Message.error("两次密码不一致");
              return false;
            } else {
              this.axios.request({
                url: '/register.do',
                method: 'post',
                data: {
                  password:this.form3.password,
                  confpassword:this.form3.repeatPassword,
                  telcode:this.form3.phoneCode,
                  telphone:this.form3.phone
                }
              }).then(res => {
                if (res.success === true) {
                  var getInfo = Promise.all([this.getRegister(res.data.tokenStr)]);
                  this.$store.commit('setToken', res.data.tokenStr)
                  this.$store.commit('setDict', res.data.dict)
                  this.$store.commit('setMenu',[]);
                  this.$Modal.success({title:'系统提示!',content:'恭喜你,注册成功',onOk:this.setInfo});
                }
              })
            }
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      setInfo(){
        //设置信息....
        this.$router.push({name:'storeRegister'});
      },
      handleSubmit(type) {
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
            this.$store.commit('setTenant', res.data.tenantUsers)
            this.$store.commit('setOutStatus',res.data.outStatus)
              //注册过门店 2,未注册过门店 0,员工登录无状态
            if (res.data.outStatus == 2 || type != 'tel') {
              var getInfo = Promise.all([this.getUser(res.data.tokenStr), this.getMenu(res.data.tokenStr)]);
              if(this.single){
                this.$store.commit('setAccount',JSON.stringify(data));
              }else{
                this.$store.commit('setAccount',JSON.stringify({}));
              }
              var name = 'home';
            } else {
              //新注册用户...
              var getInfo = Promise.all([this.getRegister(res.data.tokenStr)]);
              this.$store.commit('setMenu',[]);
              var name = 'storeRegister';
            }
            getInfo.then(() => {
              this.$router.push({name:name})
              this.$Spin.hide()
              this.$Message.success('登录成功')
            })
          } else {
            this.$Spin.hide()
          }
        })
      },
      getUser(token) {
        return new Promise((resolve, reject) => {
          this.axios.request({
            url: '/tenant/common/getLoginUser',
            method: 'post',
            data: {
              access_token: token
            }
          }).then(res => {
            if (res.success === true) {
              console.log("登录时请求的数据",res.data);
              this.$store.commit('setUser', res.data)
              resolve()
            } else reject()
          }).then(err => {
            reject(err)
          })
        })
      },
      getRegister(token){
        return new Promise((resolve, reject) => {
          this.axios.request({
            url: '/register/tenantregister/getLoginUser',
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
      getMenu(token) {
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
      register: function () {
        this.isShow = 2;
      },
      login: function () {
        this.isShow = 1;
      },
      getCode: function () {
        this.$refs['form3'].validateField('phone');
        var pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!pattern.test(this.form3.phone)) {
          return false;
        }
        if (this.flag) {
          this.axios.request({
            url: '/getTelCode.do',
            method: 'post',
            data: {
              telphone: this.form3.phone
            }
          }).then(res => {
            var title = '';
            if(res.success == true){
              title = "短信已发送,请及时查收";
              this.flag = false;
              this.timing = setInterval(this.decrTime, 1000);
            }else{
              title = res.title;
            }
            this.$Modal.info({title:'系统提示!',content:title});
          })
        }
      },
      decrTime() {
        if (this.time > 0) {
          this.description = this.time - 1 + "s";
          this.time--;
        } else {
          clearInterval(this.timing);
          this.description = "获取";
          this.time = 60;
          this.flag = true;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  /*@import './login.less';*/
  .login {
    width: 100%;
    height: 82vh;
    min-height: 700px;
    /*background-size: 100% 100%;*/
    background: #010124 url('../assets/images/banner-loginbg.png') 30%  no-repeat;
    background-size: auto 100%;
    margin:0 auto;
    position: relative;
    &-con {
      position: absolute;
      right: 15%;
      bottom: 10%;
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
<style lang="less">
  .login {
    .ivu-tabs-nav-scroll {
      text-align: center;
    }
    .ivu-tabs-nav {
      float: none;
      display: inline-block;
    }

  }
</style>
