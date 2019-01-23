<template>
  <div style="width:100%;height:100%;background:#FFFFFF;position:absolute;">
    <div style="height:20px;"></div>
  <Collapse value="1">
    <Panel name="1">
      账号基本信息
      <div slot="content" style="color:#4A4A4A;">
        <div class="line" style="margin-top:-15px;">
          <div style="float:left;width:200px;">门店名称:</div>
          <div style="float:left;">{{this.$store.state.user.userInfo.tenant.tenantName}}</div>
        </div>
        <div class="line">
          <div style="float:left;width:200px;">门店商户号:</div>
          <div style="float:left;">{{this.$store.state.user.userInfo.tenant.tenantNum}}</div>
        </div>
        <!--<div class="line">-->
          <!--<div style="float:left;width:200px;">登录用户名:</div>-->
          <!--<div style="float:left;color:#FF8F00;">{{this.$store.state.user.userInfo.user.userName}}</div>-->
        <!--</div>-->
        <div class="line">
          <div style="float:left;width:200px;">登录用户名:</div>
          <div style="float:left;color:#FF8F00;width:89px;">{{this.$store.state.user.userInfo.user.userCode}}</div>
          <div style="float:left;color:#9B9B9B;width:182px;">&nbsp;&nbsp;&nbsp;(手机号即用作登录用户名)</div>
          <div style="float:left;padding-left:100px;"><Button type="primary" @click="changePhone" v-if="this.$store.state.user.userInfo.isManage == true">修改</Button></div>
        </div>
        <div class="line">
          <div style="float:left;width:200px;">登录密码:</div>
          <div style="float:left;color:#9B9B9B;width:271px;">定期更换登录密码会让你的账号更安全</div>
          <div style="float:left;padding-left:100px;"><Button type="primary" @click="changePassword">修改</Button></div>
        </div>
      </div>
    </Panel>
  </Collapse>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      title="修改手机号"
      width="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" :title="title" :state="''" @clickBack="showModal=false"></modal-title>
      <div style="width:100%;height:100%;background:#FFFFFF;">
        <div style="height:30px;"></div>
        <div style="margin-left:134px;" v-if="type == 1">
          <div :class="stage == 1 ? 'blue' : 'gray' " style="float:left;width:32px;height:32px;border-radius:50%;font-size:16px;text-align:center;line-height:32px;">1</div><div style="float:left;line-height:32px;font-size:14px;margin-left:10px;">确认身份</div>
          <div style="width:251px;height:1px;background:#E9E9E9;float:left;margin-top:16px;margin-left:5px;"></div>
          <div :class="stage == 2 ? 'blue' : 'gray'" style="float:left;width:32px;height:32px;border-radius:50%;font-size:16px;text-align:center;line-height:32px;margin-left:10px;">2</div><div style="float:left;line-height:32px;font-size:14px;margin-left:10px;" :class="stage == 2 ? 'black' : 'textGary'">填写新手机号并设置登录密码</div>
          <div style="width:184px;height:1px;background:#E9E9E9;float:left;margin-top:16px;margin-left:5px;"></div>
          <div style="float:left;width:32px;height:32px;border:1px solid rgba(0, 0, 0, 0.25);border-radius:50%;color:rgba(0, 0, 0,0.15);font-size:16px;text-align:center;line-height:32px;margin-left:10px;">3</div><div style="float:left;line-height:32px;font-size:14px;margin-left:10px;color:rgba(0,0,0,0.45);">确定并重新登录</div>
        </div>
        <div style="height:80px;" v-show="type == 1"></div>
          <Form :model="formData1" v-show="stage == 1" v-if="type == 1" ref="formData1" :rules="rule1" :label-width="100" class="common-form" style="width:400px;margin-left:134px;">
            <FormItem label="原手机号" style="width:350px;">
              <Input v-model="formData1.oldTelphone" :disabled="true"></Input>
            </FormItem>
            <FormItem label="登录密码" style="width:350px;" prop="oldPwd">
              <Input type="password" v-model="formData1.oldPwd"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="checkNext">下一步</Button>
            </FormItem>
          </Form>
        <Form :model="formData2" v-show="stage == 2" v-if="type == 1" ref="formData2" :rules="rule2" :label-width="120" class="common-form" style="width:500px;margin-left:134px;">
          <FormItem label="新手机号:" style="width:350px;" prop="newTelphone">
            <Input v-model="formData2.newTelphone" placeholder="请输入新手机号"></Input>
          </FormItem>
          <FormItem  label="短信验证码" style="width:350px;" prop="smsCode">
            <Input v-model="formData2.smsCode" placeholder="短信验证码">
              <span slot="append"><a href="javascript:void(0)" @click="getCode" :disabled="time != 60">{{description}}</a></span>
            </Input>
          </FormItem>
          <FormItem label="设置登录密码:" style="width:350px;" prop="newPwd" placeholder="设置登录密码">
            <Input type="password" v-model="formData2.newPwd"></Input>
          </FormItem>
          <FormItem label="确认登录密码:" style="width:350px;" prop="againPwd" placeholder="确认登录密码">
            <Input type="password" v-model="formData2.againPwd"></Input>
          </FormItem>
          <FormItem style="width:500px;">
            <Button  @click="stage = 1,reset()">上一步</Button>
            <Button type="primary" style="margin-left:40px;" @click="submit">确认并重新登录</Button>
          </FormItem>
        </Form>
        <Form ref="form" :model="form" :rules="rule" :label-width="80" style="width:350px;margin-left:134px;" v-show="type == 2">
          <FormItem prop="oldPassword" label="旧密码">
            <Input type="password" v-model="form.oldPassword" @on-change="validateField(['rePassword','newPassword'])">
            </Input>
          </FormItem>
          <FormItem prop="newPassword" label="新密码">
            <Input type="password" v-model="form.newPassword" @on-change="validateField(['rePassword'])">
            </Input>
          </FormItem>
          <FormItem prop="rePassword" label="确认密码">
            <Input type="password" v-model="form.rePassword" @on-change="validateField(['newPassword'])">
            </Input>
          </FormItem>
          <FormItem>
            <Button @click="showModal = false">取消</Button>
            <Button type="primary" @click="ok()" style="margin-left:40px;">确定</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import store from '@/store'
    export default {
        name: "account-manage",
      components:{ModalTitle},
      data(){
        const validatePWD = (rule, value, callback) => {
          if(value == this.formData2.newPwd){
            callback();
          }else{
            callback(new Error('两次密码不一致'));
          }
        };
          return {
            smsSession:'',
            form:{
              oldPassword:'',
              newPassword:'',
              rePassword:'',
              access_token: this.$store.state.user.token
            },
            showModal:false,
            formData1:{oldTelphone:'',oldPwd:''},
            type:1,
            title:'',
            formData2:{
              newTelphone:'',
              smsCode:'',
              newPwd:'',
              againPwd:'',
              oldTelphone:'',
            },
            rule1:{oldPwd:{required:true,message:'请填写旧密码'}},
            rule2:{
              newTelphone:{required:true,pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,message:'请输入正确的手机架'},
              smsCode:{required:true,message:'请输入短信验证码'},
              newPwd:{required:true,pattern:/^[a-zA-Z0-9_]{6,18}$/,message:'密码应为6-18位字母数字及下滑线'},
              againPwd:[{required:true,message:'请重复确认密码'}, {validator: validatePWD, trigger: 'blur,change'},]
            },
            rule: {
              oldPassword: [
                {
                  validator: (rule, value, callback) => {
                    // if (!/^[a-zA-Z0-9_]{6,18}$/.test(value)) callback(new Error('密码应为6-18位字母数字及下滑线'));
                    if (value == this.form.newPassword || value == this.form.rePassword) callback(new Error('新旧密码不能相同'));
                    callback();
                  }, trigger: 'change', required: true
                }
              ],
              newPassword: [
                {
                  validator: (rule, value, callback) => {
                    if (!/^[a-zA-Z0-9_]{6,18}$/.test(value)) callback(new Error('密码应为6-18位字母数字及下滑线'));
                    if (value == this.form.oldPassword) callback(new Error('新旧密码不能相同'));
                    if (value != this.form.rePassword) callback(new Error('新密码不一致'));
                    callback();
                  }, trigger: 'change', required: true
                }
              ],
              rePassword: [
                {
                  validator: (rule, value, callback) => {
                    if (!/^[a-zA-Z0-9_]{6,18}$/.test(value)) callback(new Error('密码应为6-18位字母数字及下滑线'));
                    if (value == this.form.oldPassword) callback(new Error('新旧密码不能相同'));
                    if (value != this.form.newPassword) callback(new Error('新密码不一致'));
                    callback();
                  }, trigger: 'change', required: true
                }
              ]
            },
            stage:1,
            description:'获取',
            timing:null,
            time:60,
          }
      },
      methods:{
          reset(){
            this.$refs.formData1.resetFields();
          },
        validateField(arr){
          for(let i in arr){
            this.$refs.form.validateField(arr[i])
          }
        },
        ok(){
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$Modal.confirm({
                title: '确定修改密码？',
                onOk: () =>{
                  let url= this.$store.getters.loginType=='1002'?'/tenant/index/updatePass':'/manage/index/updatePass'
                  this.axios.request({
                    url: url,
                    method: 'post',
                    data: this.form
                  }).then(res => {
                    if (res.success === true) {
                      if(res.data){
                        this.showModal= false
                        this.$Message.success('修改成功');
                      }else{
                        this.$Message.error('旧密码错误');
                      }
                    }
                  })
                }
              })
            } else {
            }
          })
        },
        changePassword(){
          this.type = 2;
          this.$refs.form.resetFields();
          this.showModal = true;
          this.title = "修改登录密码";
        },
        submit(){
          if(this.smsSession == ''){
            this.$Message.error("请获取手机验证码!");
            return false;
          }
          this.$refs.formData2.validate((valid) => {
            if(valid){
              this.axios.request({
                url: '/tenant/sys/updatemanager/updateManagerUser',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  newTelphone:this.formData2.newTelphone,
                  smsCode:this.formData2.smsCode,
                  newPwd:this.formData2.newPwd,
                  againPwd:this.formData2.againPwd,
                  oldTelphone:this.formData1.oldTelphone,
                  oldPwd:this.formData1.oldPwd,
                  smsSession:this.smsSession,
                }
              }).then(res => {
                   if(res.success == true){
                     store.dispatch('handleLogOut');
                     this.$Message.success("手机号更换成功,请重新登录");
                     return false;
                   }
              })
            }else{
              this.$Message.error("请校对红框信息!");
            }
          });
        },
        decrTime() {
          if (this.time > 0) {
            this.description = this.time - 1 + "s";
            this.time--;
          } else {
            clearInterval(this.timing);
            this.description = "获取";
            this.time = 60;
          }
        },
        getCode() {
          this.$refs.formData2.validateField('newTelphone', (error) => {
            if(!error){
           //开始调取接口获取验证码
              this.axios.request({
                url: '/tenant/sys/updatemanager/sendSmsCode',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  newTelphone:this.formData2.newTelphone,
                }
              }).then(res => {
                let title;
                if(res.success == true){
                  title = "短信已发送,请及时查收";
                  this.timing = setInterval(this.decrTime, 1000);
                  this.smsSession = res.data.smsSession;
                  this.$Modal.info({title:'系统提示!',content:title});
                }
              })
            } else {
              this.$Message.error("请输入正确的手机号来获取验证码!");
              return false;
            }
          });
        },
        changePhone(){
          this.type = 1;
          this.$refs.formData1.resetFields();
          this.$refs.formData2.resetFields();
          this.showModal = true;
          this.title = "修改手机号";
        },
        checkNext(){
          this.$refs.formData2.resetFields();
          this.$refs.formData1.validate((valid) => {
           if(valid){
             this.axios.request({
               url: '/tenant/sys/updatemanager/checkUser',
               method: 'post',
               data: {
                 access_token: this.$store.state.user.token,
                 oldTelphone:this.formData1.oldTelphone,
                 oldPwd:this.formData1.oldPwd,
               }
             }).then(res => {
                if(res.success == true){
                  this.stage = 2;
                }
             })
           }else{
             this.$Message.error('请校对红框信息!');
           }
          });
        },
      },
      mounted(){
          this.formData1.oldTelphone = this.$store.state.user.userInfo.user.userCode;
      },
    }
</script>

<style scoped>
  .black{

  }
  .textGary{
    color:rgba(0,0,0,0.45);
  }
.line{
  width:100%;border-bottom:1px solid #E8E8E8;height:50px;line-height:50px;
}
.blue{
  background-color:#1890FF;
  color:white;
}
  .gray{
    border:1px solid rgba(0, 0, 0, 0.25);border-radius:50%;color:rgba(0, 0, 0,0.15);
  }
</style>
