<template>
<Tooltip class="change-password" content="修改当前账号密码" @click.native='click'>
  <Icon type="md-create" :size="24" style="color:#515B6D;"></Icon>
  <Modal v-model="showModal" title="修改密码" :width="400">
    <Form ref="form" :model="form" :rules="rule" :label-width="80" class="change-password-form">
      <FormItem prop="oldPassword" label="旧密码">
        <Input type="password" v-model="form.oldPassword" @on-change="validateField(['rePassword','newPassword'])">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="newPassword" label="新密码">
        <Input type="password" v-model="form.newPassword" @on-change="validateField(['rePassword'])">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="rePassword" label="确认密码">
        <Input type="password" v-model="form.rePassword" @on-change="validateField(['newPassword'])">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="showModal=false">取消</button>
      <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="ok()">确定</button>
    </div>
  </Modal>
</Tooltip>
</template>

<script>
	export default {
		name: "change-password",
    data(){
		  return{
        showModal: false,
        form:{
          oldPassword:'',
          newPassword:'',
          rePassword:'',
          access_token: this.$store.state.user.token
        },
        rule:{
          oldPassword: [
            { validator: (rule, value, callback) => {
              if(value.length< 6) callback(new Error('不能小于6位'));
              if(value== this.form.newPassword|| value== this.form.rePassword) callback(new Error('新旧密码不能相同'));
                callback();
              }, trigger: 'change', required: true }
          ],
          newPassword: [
            { validator: (rule, value, callback) => {
                if(value.length< 6) callback(new Error('不能小于6位'));
                if(value== this.form.oldPassword) callback(new Error('新旧密码不能相同'));
                if(value!= this.form.rePassword) callback(new Error('新密码不一致'));
                callback();
              }, trigger: 'change', required: true }
          ],
          rePassword: [
            { validator: (rule, value, callback) => {
                if(value.length< 6) callback(new Error('不能小于6位'));
                if(value== this.form.oldPassword) callback(new Error('新旧密码不能相同'));
                if(value!= this.form.newPassword) callback(new Error('新密码不一致'));
                callback();
              }, trigger: 'change', required: true }
          ]
        }
      }
    },
    methods:{
      click(){
        this.$refs.form.resetFields()
        this.showModal= true
        this.form.access_token= this.$store.state.user.token
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
      validateField(arr){
        for(let i in arr){
          this.$refs.form.validateField(arr[i])
        }
      }
    }
	}
</script>

<style scoped lang="less">
.change-password{
  width: 60px;
  text-align: center;
  border-left: 1px solid #F0F0F0;
  cursor: pointer;

  >*{
    font-size: 0;
  }
}
.change-password:hover{
  background-color: #F0F0F0;
}
</style>
<style  lang="less">
  .change-password-form{
    .ivu-input{
      font-size: 40px;
    }
  }
</style>
