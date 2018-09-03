<!--门店信息详情-->
<template>
<div id="store-info-detail">
  <Collapse v-model="collapse">
    <Panel name="1">门店基本信息
      <Form class="common-form" ref="form" :rules="ruleValidate" :model="info" :label-width="80" slot="content">
        <FormItem prop="COMPANYCODE" label="门店名称">
          <Input v-model="info.COMPANYCODE"></Input>
        </FormItem>
        <FormItem prop="COMPANYCODE" label="门店所属区域">
          <Input v-model="info.COMPANYCODE"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="门店地址">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="经营业务类别">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="经营范围">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="统一社会信用代码">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="道路运输许可证号">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="许可证开始日期">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="许可证结束日期">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="负责人姓名">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="负责人联系方式">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="联系人姓名">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="联系人联系方式">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="企业邮箱">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="经营状态">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="邮政编码">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
        <FormItem prop="COMPANYPASSWORD" label="商户号">
          <Input v-model="info.COMPANYPASSWORD"></Input>
        </FormItem>
      </Form>
    </Panel>
    <Panel name="2">证照上传

    </Panel>
  </Collapse>
  <div class="footer">
    <Button v-show="!editAble" type="success" :disabled="false" @click="editAble= true">编辑</Button>
    <Button v-show="editAble" :disabled="false" @click="editAble= false">取消编辑</Button>
    <Button type="primary" :disabled="!editAble" @click="">保存</Button>
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

        },
        editAble: false
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
