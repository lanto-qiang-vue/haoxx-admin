<template>
  <div style="width:100%;height:100%;overflow:auto;">
    <div style="height:70px;width:80%;margin:0 auto;position:relative;">
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
          <Tabs v-show="isShow == 1"   v-model="indexName">
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
                  <FormItem prop="password" style="margin-bottom:5px;">
                    <Input type="password" v-model="form.password" placeholder="请输入密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                    </Input>
                    <div style="float:left;padding-top:30px;margin-left:-30px;"><Checkbox v-model="single" style="padding-left:35px;" v-if="jzzz">记住账号</Checkbox></div>
                    <div style="float:right;color:#AAAAAA;cursor:pointer;" @click="isShow = 4">忘记密码?</div>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleSubmit('tel')" style="" type="primary" long>登录</Button>
                  </FormItem>
                  <div style="float:left;padding-right:20px;"><a href="javascript:void(0);" @click="isShow = 3">门店许可证登录</a>
                  </div>
                  <div style="float:right;padding-right:20px;"><a href="javascript:void(0);"
                                                                  @click="register">新用户注册</a></div>
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
          <div v-show="isShow == 2">
            <div><span style="font-size:18px;"><b>用户注册</b></span><span style="float:right;padding-top:3px;"><a @click="login">登录</a></span></div>
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
                <div> <div style="float:left;"><Checkbox @on-change="changeType" :value="singleProtocol">已阅读并同意</Checkbox></div><div style="float:left;margin-left:-10px;"><span style="color:blue;cursor:pointer;" @click="protocolShow=Math.random()">《用户协议》</span></div></div>
                <div style="clear:both;"></div>
                <div style="height:10px;"></div>
                <FormItem>
                  <Button @click="doregister()" :disabled="canRegister" type="primary" long>注册</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <!-- 注册结束 -->
          <!--门店许可证登录-->
          <div v-show="isShow == 3">
            <div style="color:#1690FF;text-align:center;padding-bottom:10px;border-bottom:1px solid #E8E8E8;position:relative;">门店许可证登录
              <div style="position:absolute;top:0px;color:#4A4A4A;left:10px;cursor:pointer;" @click="isShow = 1"><Icon type="md-arrow-back" :size="20"/></div>
            </div>
            <div class="form-con">
              <Form :model="form4" ref="form4" :rules="rule4">
                <FormItem prop="license">
                  <Input v-model="form4.license" placeholder="请输入许可证号">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-paper"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="licensepwd">
                  <Input type="password" v-model="form4.licensepwd" placeholder="请输入密码">
                                        <span slot="prepend">
          <Icon :size="16" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="telphone">
                  <Input v-model="form4.telphone" placeholder="请输入手机号码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-call"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="telcode">
                  <Input v-model="form4.telcode" placeholder="请输入短信验证码">
                                        <span slot="prepend">
          <Icon type="md-chatboxes" :size="16"/>
        </span>
                    <span slot="append"><a href="javascript:void(0)" @click="getCode4" :disabled="time4 != 60">{{description4}}</a></span>
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <Input type="password" v-model="form4.password" placeholder="请设置登录密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="password_cp">
                  <Input type="password" v-model="form4.password_cp" placeholder="请确认登录密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem style="margin-bottom:0px;">
                  <div style="line-heght:10px;"><span style="color:orange;">确定后手机号即用作登录用户名</span></div>
                  <Button @click="licenceToPhone" type="primary" long>确认并重新登录</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <!--许可证登录结束-->
          <!--忘记密码-->
          <div v-show="isShow == 4">
            <div style="color:#1690FF;text-align:center;padding-bottom:10px;border-bottom:1px solid #E8E8E8;position:relative;">重置密码
              <div style="position:absolute;top:0px;color:#4A4A4A;left:10px;cursor:pointer;" @click="isShow = 1"><Icon type="md-arrow-back" :size="20"/></div>
            </div>
            <div style="height:10px;"></div>
            <div class="form-con">
                    <Form :model="form5" ref="form5" :rules="rule5">
                <FormItem prop="telphone">
                  <Input v-model="form5.telphone" placeholder="请输入手机号码">
                                        <span slot="prepend">
          <Icon :size="16" type="ios-call"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="telcode">
                  <Input v-model="form5.telcode" placeholder="请输入短信验证码">
                                        <span slot="prepend">
          <Icon type="md-chatboxes" :size="16"/>
        </span>
                    <span slot="append"><a href="javascript:void(0)" @click="getCode5" :disabled="time5 != 60">{{description5}}</a></span>
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <Input type="password" v-model="form5.password" placeholder="请设置登录密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem prop="password_cp">
                  <Input type="password" v-model="form5.password_cp" placeholder="请确认登录密码">
                                        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
                  </Input>
                </FormItem>
                <FormItem style="margin-bottom:0px;">
                  <Button @click="forget" type="primary" long>确认并重新登录</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <!---->
        </Card>
        <div style="position: relative;">
        <img src="../assets/images/hxx-ercode.png" style="width: 140%;position: relative;left: -35px;">
        <div style="width:100%;position:absolute;overflow: hidden;top: 60px;text-align: center;font-size: 14px;line-height: 20px;color: white;margin-left:10px;">
          <div style="display: inline-block;margin-right: 15px;width: 35%;"><img src="../assets/images/appDownload.png" style="width: 100%;"></div>
        </div>
        </div>
      </div>
    </div>
    <protocol :protocolShow="protocolShow" @argee="argee"></protocol>
    <div class="footer-right"> © 2018 Copyright 上海衡益网络技术有限公司 沪ICP备18016827号-1</div>
  </div>
</template>

<script>
  // import LoginForm from '_c/login-form'
  import protocol from '@/hxx-components/protocol.vue';
  import {mapActions} from 'vuex'
  import { getAccount} from '@/libs/util.js'
  export default {
    components:{protocol},
    data() {
      return {
        protocolShow:false,
        description: '获取',
        description4:'获取',
        description5:'获取',
        indexName:'name1',
        telSession:'',
        telSession4:'',
        telSession5:'',
        singleProtocol:false,//同意协议
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
          repeatPassword: '',
          IsAgreement:0,
        },
        form4:{
          license:'',
          licensepwd:'',
          telcode:'',
          telphone:'',
          password:'',
          password_cp:'',
          telSession:'',
        },
        form5:{
          telcode:'',
          telphone:'',
          password:'',
          password_cp:'',
          telSession:'',
        },
        single: false,
        isShow: 1,
        timing: '',
        timing4:'',
        timing5:'',
        jzzz:true,
        time: 60,
        time4:60,
        time5:60,
        flag: true,//防止定时器多次触发
        rules: {
          phone: [{
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            trigger: 'change,blur',
            message: '输入有效手机号'
          }],
          phoneCode: [{required: true, trigger: 'blur', message: '验证码必填'}],
          password: [{required: true, trigger: 'blur,change',pattern:/^[a-zA-Z0-9_]{6,18}$/, message: '密码应为6-18位字母数字及下滑线'}],
          repeatPassword: [{required: true, trigger: 'blur,change', message: '重复密码必填'}],
        },
        rule4:{
          license:{required:true,message:'请输入许可证号'},
          licensepwd:{required:true,message:'请输入许可证对应密码'},
          telcode:{required:true,message:'请输入手机验证码'},
          telphone:[{
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            trigger: 'change,blur',
            message: '输入有效手机号'
          }],
          password:[{required: true, trigger: 'blur,change',pattern:/^[a-zA-Z0-9_]{6,18}$/, message: '密码应为6-18位字母数字及下滑线'}],
          password_cp:[{ validator: (rule, value, callback) => {
              if(!/^[a-zA-Z0-9_]{6,18}$/.test(value)) callback(new Error('密码应为6-18位字母数字及下滑线'));
              if(value!= this.form4.password) callback(new Error('两次密码不一致'));
              callback();
            }, trigger: 'change,blur', required: true }],
        },
        rule5:{
          telcode:{required:true,message:'请输入手机验证码'},
          telphone:[{
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            trigger: 'change,blur',
            message: '输入有效手机号'
          }],
          password:[{required: true, trigger: 'blur,change',pattern:/^[a-zA-Z0-9_]{6,18}$/, message: '密码应为6-18位字母数字及下滑线'}],
          password_cp:[{ validator: (rule, value, callback) => {
              if(!/^[a-zA-Z0-9_]{6,18}$/.test(value)) callback(new Error('密码应为6-18位字母数字及下滑线'));
              if(value!= this.form5.password) callback(new Error('两次密码不一致'));
              callback();
            }, trigger: 'change,blur', required: true }],
        },
      }
    },
    mounted(){
      // alert(navigator.userAgent);
    },
    computed:{
      canRegister(){
        if(!this.form3.phone || !this.form3.phoneCode || !this.form3.password || !this.form3.repeatPassword || !this.singleProtocol){
          return true;
        }else{
          return false;
        }
      }
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
      forget(){
        this.$refs.form5.validate((valid) => {
          if(valid){
            if(this.telSession5 == ''){
              this.$Message.error("请获取短信验证码");
              return false;
            }
            this.form5.telSession = this.telSession5;
            this.axios.request({
              url: '/resetPassword.do',
              method: 'post',
              data:this.form5,
            }).then(res => {
              if(res.success == true){
                this.isShow = 1;
                this.$Message.success("密码重置成功，请重新登录");
              }
            })
          }else{
            this.$Message.error("请校对红框信息!");
          }
        });
      },
      licenceToPhone(){
        this.$refs['form4'].validate((valid) => {
          if(valid){
            if(this.telSession4 == ''){
              this.$Message.error('请获取手机短信验证码');
              return false;
            }
            this.form4.telSession = this.telSession4;
            this.axios.request({
              url: '/license.do ',
              method: 'post',
              data:this.form4,
            }).then(res => {
              if(res.success == true){
                this.isShow = 1;
                this.$Message.success("已启用手机号登陆，请重新登录");
              }
            })
          }else{
            this.$Message.error("请校对红框信息");
          }
        });
      },
      argee(flag){
        this.singleProtocol = flag;
      },
      changeType(e){
        this.singleProtocol = e;
      },
      doregister() {
        this.$refs['form3'].validate((valid) => {
          if (valid) {
            if(this.telSession == ""){
              this.$Message.error("请获取验证码");
              return false;
            }
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
                  telphone:this.form3.phone,
                  IsAgreement:this.singleProtocol ? 1 : 0,
                  telSession:this.telSession,
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
            this.$store.commit('setIsAuthorize',res.data.isAuthorize);
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
              // console.log("登录时请求的数据",JSON.stringify(res.data));
              this.$store.commit('setUser', res.data);
              if(res.data.isManage == true)this.$store.commit('setTenantId',res.data.tenant.tenantId);
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
      getCode4(){
        this.$refs.form4.validateField('telphone', (error) => {
          if(!error){
            //开始调取接口获取验证码
            this.axios.request({
              url: '/getLicenseCode.do',
              method: 'post',
              data: {
                telphone: this.form4.telphone,
              }
            }).then(res => {
              let title;
              if(res.success == true){
                title = "短信已发送,请及时查收";
                this.timing4 = setInterval(this.decrTime4, 1000);
                this.telSession4 = res.data.telSession;
                this.$Modal.info({title:'系统提示!',content:title});
              }
            })
          } else {
            this.$Message.error("请输入正确的手机号来获取验证码!");
            return false;
          }
        })
      },
      getCode5(){
        this.$refs.form5.validateField('telphone', (error) => {
          if(!error){
            //开始调取接口获取验证码
            this.axios.request({
              url: '/getResetCode.do',
              method: 'post',
              data: {
                telphone: this.form5.telphone,
              }
            }).then(res => {
              let title;
              if(res.success == true){
                title = "短信已发送,请及时查收";
                this.telSession5 = res.data.telSession;
                this.timing5 = setInterval(this.decrTime5, 1000);
                this.$Modal.info({title:'系统提示!',content:title});
              }
            })
          } else {
            this.$Message.error("请输入正确的手机号来获取验证码!");
            return false;
          }
        })
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
              this.telSession = res.data.telSession;
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
        //注册验证码
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
      decrTime4() {
        //许可证换手机验证码
        if (this.time4 > 0) {
          this.description4 = this.time4 - 1 + "s";
          this.time4--;
        } else {
          clearInterval(this.timing4);
          this.description4 = "获取";
          this.time4 = 60;
        }
      },
      decrTime5() {
        //忘记密码验证码
        if (this.time5 > 0) {
          this.description5 = this.time5 - 1 + "s";
          this.time5--;
        } else {
          clearInterval(this.timing5);
          this.description5 = "获取";
          this.time5 = 60;
        }
      },
    },    watch:{
      isShow(val){
        switch(val){
          case 1:
               for(let i in this.form){
                 this.form[i] = "";
               }
               for(let i in this.form2){
                 this.form2[i] = "";
               }
            this.single = false;
            break;
          case 3:
            this.$refs.form4.resetFields();
            break;
          case 4:
            this.$refs.form5.resetFields();
            break;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /*@import './login.less';*/
  .login {
    width: 100%;
    height: 82vh;
    min-height: 800px;
    /*background-size: 100% 100%;*/
    background: #010124 url('../assets/images/banner-loginbg.png') 30%  no-repeat;
    background-size: auto 100%;
    margin:0 auto;
    position: relative;
    &-con {
      position: absolute;
      right: 15%;
      bottom: 5%;
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
