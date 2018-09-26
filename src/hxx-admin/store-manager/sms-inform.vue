<template>
  <div>
    <Collapse v-model="collapse">
      <Panel :name="'1'">
        短信发送
        <Form ref="formData" slot="content" :model="formData" :rules="rules" :label-width="120">
          <FormItem label="手机号码:" prop="phone">
            <Input type="text" v-model="formData.phone"
                   placeholder="手机号码(多条发送,号码之间使用英文逗号区分如:138xxxxxxxx,159xxxxxxxx,173xxxxxxxx);"> </Input>
          </FormItem>
          <FormItem label="短信内容:" prop="content">
            <Input type="textarea" v-model="formData.content" placeholder="请输入短信内容..."> </Input>
          </FormItem>
          <Button type="primary" @click="send('formData')" style="margin-left:120px;">发送</Button>
        </Form>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    name: "sms-inform",
    data() {
      return {
        collapse: [1],
        formData: {},
        rules: {
          phone: [{required: true, message: '手机号码必填', trigger: 'change,blur'}],
          content: [{required: true, message: '短信内容必填', trigger: 'change,blur'}]
        },
      }
    },
    methods: {
      send(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({title: '系统提示', content: '确认发送吗?', onOk: this.save});
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      save() {
        this.axios.request({
          url: '/manage/info/tenantsms',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            mobileNo: this.formData.phone,
            remark:this.formData.content,
          }
        }).then(res => {
          if (res.success == true) {
            this.$refs['formData'].resetFields();
           this.$Message.success('短信发送成功');
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
