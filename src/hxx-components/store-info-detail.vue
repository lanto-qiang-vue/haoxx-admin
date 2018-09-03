<!--门店信息详情-->
<template>
<div id="store-info-detail">
  <Collapse v-model="collapse">
    <Panel name="1">门店基本信息
      <Form class="common-form" ref="form" :rules="ruleValidate" :model="info" :label-width="80" slot="content">
        <FormItem prop="COMPANYCODE" label="门店名称">
          <Input v-model="info.COMPANYCODE"></Input>
        </FormItem>
        <FormItem prop="COMPANYCODE" label="企业编码">
          <Input v-model="info.COMPANYCODE"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="登录密码">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
      </Form>
    </Panel>
    <Panel name="2">证照上传

    </Panel>
  </Collapse>
  <div class="footer">
    <Button type="success" :disabled="false" @click="">编辑</Button>
    <Button :disabled="false" @click="">取消编辑</Button>
    <Button type="primary" :disabled="false" @click="">保存</Button>
  </div>
</div>
</template>

<script>
	export default {
		name: "store-info-detail",
    data(){
		  return{
        collapse: ['1', '2'],
        info:{

        },
        ruleValidate:{

        }
      }
    }
	}
</script>

<style scoped lang="less">
#store-info-detail{
  height: 100%;
  overflow: auto;
  position: relative;
  background-color: white;
  .footer{
    width: 100%;
    border-top: 1px solid #e8eaec;
    padding: 12px 18px 12px 18px;
    text-align: right;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
