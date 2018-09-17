<template>
	<div id="health">
		<div style="height:300px;width:350px;background-color:#FFFFFF;position:absolute;left:50%;top:50%;margin-left:-175px;margin-top:-150px;">
		<div style="line-height:30px;color:white;background-color:#2196F3;padding-left:10px;font-size:16px;">
			上传汽车电子健康档案账户信息
		</div>
		<div>
		<div style="height:30px;"></div>
	   <Form ref="formData" :label-width="80">
          <FormItem label="企业编码:" style="width:90%;">
              <Input type="text" v-model="formData.COMPANYCODE" :disabled="true"  style="min-width: 100%;"> </Input>
          </FormItem>
      	  <FormItem label="登录密码:" :label-width="80" style="width:90%;margin-top:-15px;">
              <Input type="password" v-model="formData.COMPANYPASSWORD" :disabled="true"  style="min-width: 100%;"> </Input>
          </FormItem>
          <FormItem label="接口地址:" :label-width="80" style="width:90%;margin-top:-15px;">
           <Input type="textarea" v-model="formData.HTTP_URL" :disabled="true" style="width:100%;"> </Input>
          </FormItem>
      </Form>
		</div>
		</div>
	</div>
</template>
<script>
	export default{
		name:'health-record',
		data(){
			return{
				formData:[],
			}
		},
		methods:{
			getList(){
				//tenant/repair/qichedangan/load
		this.axios.request({
          url: '/tenant/repair/qichedangan/load',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                }
        }).then(res => {
          if (res.success === true) {
          	this.formData = res.data;
          }
        })
			}
		},
		mounted(){
			this.getList();
		}
	}
</script>
<style lang="less" scoped>
	#health{
		width:100%;
		height:100%;
	background-color: rgb(233, 233, 233);
	background-image: linear-gradient(0deg, rgb(244, 244, 244) 1.1px, transparent 0px), linear-gradient(90deg, rgb(244, 244, 244) 1.1px, transparent 0px);
	background-size: 20px 20px;
	overflow: auto;
	margin: 0px;
	position:relative;
	}
</style>