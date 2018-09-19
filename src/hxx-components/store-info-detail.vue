<!--门店信息详情-->
<template>
<div id="store-info-detail">
  <div class="info">
    <Collapse v-model="collapse">
      <Panel name="1">门店基本信息
        <Form class="common-form" ref="form" :rules="ruleValidate" :model="info" :label-width="80" slot="content">
          <FormItem prop="TENANT_NAME" label="门店名称">
            <Input v-model="info.TENANT_NAME" :readonly="!editAble" :disabled="!isAdmin && !isRegister"></Input>
            <!--<span class="formText" v-show="editAble">{{info.COMPANYCODE}}</span>-->
          </FormItem>
          <FormItem prop="TENANT_AREA_DISPLAY" label="门店所属区域">
            <Input v-model="info.TENANT_AREA_DISPLAY" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="TENANT_ADD" label="门店地址">
            <Input v-model="info.TENANT_ADD" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="BUSINESS_TYPE" label="经营业务类别">
            <!--<Input v-model="info.BUSINESS_TYPE"></Input>-->
            <Select v-model="info.BUSINESS_TYPE" :clearable="editAble"  :disabled="!editAble">
              <Option v-for="(item, index) in BUSINESS_TYPE_group"
                      :key="index" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="COMPANY_BUSINESS_SCOPE" label="经营范围">
            <Input v-model="info.COMPANY_BUSINESS_SCOPE" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="ORG_NUMBER" label="统一社会信用代码">
            <Input v-model="info.ORG_NUMBER" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="ROAD_LICENSE" label="道路运输许可证号">
            <Input v-model="info.ROAD_LICENSE" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="LICENSE_START_DATE" label="许可证开始日期">
            <!--<Input v-model="info.LICENSE_START_DATE"></Input>-->
            <DatePicker type="date" v-model="info.LICENSE_START_DATE" :readonly="!editAble"></DatePicker>
          </FormItem>
          <FormItem prop="LICENSE_END_DATE" label="许可证结束日期">
            <!--<Input v-model="info.LICENSE_END_DATE"></Input>-->
            <DatePicker type="date" v-model="info.LICENSE_END_DATE" :readonly="!editAble"></DatePicker>
          </FormItem>
          <FormItem prop="LEGAL_NAME" label="负责人姓名">
            <Input v-model="info.LEGAL_NAME" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="LEGAL_TEL" label="负责人联系方式">
            <Input v-model="info.LEGAL_TEL" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="LINK_MAN" label="联系人姓名">
            <Input v-model="info.LINK_MAN" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="LINK_TEL" label="联系人联系方式">
            <Input v-model="info.LINK_TEL" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="EMAIL" label="企业邮箱">
            <Input v-model="info.EMAIL" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="STATUS" label="经营状态">
            <!--<Input v-model="info.STATUS"></Input>-->
            <Select v-model="info.STATUS" :clearable="editAble" :disabled="!editAble">
              <Option v-for="(item, index) in STATUS_group"
                      :key="index" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="LINK_ZIP" label="邮政编码">
            <Input v-model="info.LINK_ZIP" :readonly="!editAble"></Input>
          </FormItem>
          <FormItem prop="TENANT_NUM" label="门店商户号">
            <Input v-model="info.TENANT_NUM" :readonly="!editAble" :disabled="!isAdmin"></Input>
          </FormItem>
        </Form>
      </Panel>
      <Panel name="2">证照上传
        <div slot="content">
          <Card class="pic-card">
            <p slot="title"><i class="red" v-if="!isAdmin">*</i>上传道路运输许可证图片</p>
            <div class="pic-body">
              <img v-show="!info.ROAD_FILE_PATH" class="no-pic" src="../assets/images/no_img.png"/>
              <img v-show="info.ROAD_FILE_PATH" class="pic" :src="info.ROAD_FILE_PATH"
                   @click="showImg(info.ROAD_FILE_PATH)"/>
              <div class="button" v-show="editAble">
                <div class="up-img">
                  <Button type="primary">上传</Button>
                  <input type="file" accept="image/jpg,image/jpeg,image/png,image/bmp"
                         @change="getImg('ROAD_FILE_PATH', $event)"/>
                </div>
                <Button type="error" @click="removeImg('ROAD_FILE_PATH')">移除</Button>
              </div>
            </div>
          </Card>
          <Card class="pic-card">
            <p slot="title"><i class="red" v-if="!isAdmin">*</i>上传营业执照图片</p>
            <div class="pic-body">
              <img v-show="!info.BUS_FILE_PATH" class="no-pic" src="../assets/images/no_img.png"/>
              <img v-show="info.BUS_FILE_PATH" class="pic" :src="info.BUS_FILE_PATH"
                   @click="showImg(info.BUS_FILE_PATH)"/>
              <div class="button" v-show="editAble">
                <div class="up-img">
                  <Button type="primary">上传</Button>
                  <input type="file" accept="image/jpg,image/jpeg,image/png,image/bmp"
                         @change="getImg('BUS_FILE_PATH',$event)"/>
                </div>
                <Button type="error" @click="removeImg('BUS_FILE_PATH')">移除</Button>
              </div>
            </div>
          </Card>
          <Card class="pic-card">
            <p slot="title">上传门头图片</p>
            <div class="pic-body">
              <img v-show="!info.TENANT_FILE_PATH" class="no-pic" src="../assets/images/no_img.png"/>
              <img v-show="info.TENANT_FILE_PATH" class="pic" :src="info.TENANT_FILE_PATH"
                   @click="showImg(info.TENANT_FILE_PATH)"/>
              <div class="button" v-show="editAble">
                <div class="up-img">
                  <Button type="primary">上传</Button>
                  <input type="file" accept="image/jpg,image/jpeg,image/png,image/bmp"
                         @change="getImg('TENANT_FILE_PATH', $event)"/>
                </div>
                <Button type="error" @click="removeImg('TENANT_FILE_PATH')">移除</Button>
              </div>
            </div>
          </Card>
        </div>
      </Panel>
    </Collapse>
  </div>
  <div class="footer" v-show="!isRegister">
    <Button v-show="!editAble" type="info" :disabled="false" @click="editAble= true"
            v-if="isAdmin ||accessBtn('save')">编辑</Button>
    <Button v-show="editAble" :disabled="false" @click="cancelEdit">取消编辑</Button>
    <Button type="primary" :disabled="!editAble" @click="save" v-if="isAdmin ||accessBtn('save')">保存</Button>
  </div>
  <div class="footer" v-show="isRegister" style="text-align:center;">
    <Button type="primary" :disabled="!editAble" @click="register">注册门店</Button>
    <Button type="error" @click="goback">返回列表</Button>
  </div>
</div>
</template>

<script>
  import { getName, getDictGroup, imgToBase64 } from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
	export default {
		name: "store-info-detail",
    props: ['data', 'show'],
    mixins: [mixin],
    data(){
		  return{
        collapse: ['1', '2'],
        info:{
          "TENANT_ID":"",
          "TENANT_AREA_CODE":"310103",
          "TENANT_NAME":"",
          "TENANT_AREA_DISPLAY":"",
          "TENANT_ADD":"",
          "BUSINESS_TYPE":"",
          "COMPANY_BUSINESS_SCOPE":"",
          "ORG_NUMBER":"",
          "ROAD_LICENSE":"",
          "LICENSE_START_DATE":"",
          "LICENSE_END_DATE":"",
          "LEGAL_NAME":"",
          "LEGAL_TEL":"",
          "LINK_MAN":"",
          "LINK_TEL":"",
          "EMAIL":"",
          "STATUS":"",
          "LINK_ZIP":"",
          "TENANT_NUM":"",
          "ROAD_FILE_PATH":"",
          "BUS_FILE_PATH":"",
          "TENANT_FILE_PATH":""
        },

        ruleValidate:{},
        editAble: false
      }
    },
    computed:{
      BUSINESS_TYPE_group(){
        return getDictGroup(this.$store.state.app.dict, '1033');
      },
      STATUS_group(){
        return getDictGroup(this.$store.state.app.dict, '1034');
      },
      isAdmin(){
        return this.$store.getters.loginType=='1001'
      },
      isRegister(){
      return this.$store.state.app.outStatus != 2;
      }
    },
    watch:{
		  data(datas){
       this.cancelEdit()
      },
      show(val){
        val? document.querySelector("#store-info-detail .info").scrollTop= 0: ''
      }
    },
    created(){
      if(this.$store.state.app.outStatus != 2){this.editAble = true;}
      let rule= (this.isAdmin? []: [{ required: true, message:'必填项不能为空'}])
      if(this.$store.state.app.outStatus != 2){
        this.ruleValidate= {
          TENANT_NAME: rule,
          TENANT_AREA_DISPLAY:rule,
          TENANT_ADD: rule
        }
      }else{
        this.ruleValidate= {
          TENANT_NAME: rule,
          TENANT_AREA_DISPLAY:rule,
          TENANT_ADD: rule,
          BUSINESS_TYPE: [{ required: true, message:'必填项不能为空'}],
          COMPANY_BUSINESS_SCOPE: rule,
          ORG_NUMBER: rule,
          ROAD_LICENSE: rule,
          LICENSE_START_DATE: rule,
          LICENSE_END_DATE: rule,
          LEGAL_NAME: rule,
          LEGAL_TEL: rule,
          LINK_ZIP: rule,
          ROAD_FILE_PATH: rule,
          BUS_FILE_PATH: rule,
        }
      }
    },
    methods:{
		  goback(){
		    this.$emit('goback');
      },
      getImg( name, e){
        imgToBase64(e.target.files[0], (base64, fileName)=> {
          this.info[name]= base64
        })
      },
      showImg(img){
        this.$Modal.info({
          width: 90,
          title: '查看',
          closable: true,
          content: '<img src="'+img+'" style="width: 100%"/>'
        })
      },
      removeImg(name){
        this.info[name]= ''
      },
      cancelEdit(){
        this.$refs.form.resetFields()
        if(this.data){
          for (let key in this.info){
            this.info[key]= this.data[key]
          }
        }
        this.editAble= false
      },
      save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(!this.isAdmin && (!this.info.ROAD_FILE_PATH || !this.info.BUS_FILE_PATH)){
              this.$Message.error('请上传相关证照!');
              return
            }
            this.$Modal.confirm({
              title: '确定保存吗？',
              onOk: () =>{
                this.$emit('save', this.info);
              }
            })
          } else {
            this.$Message.error('请输入必填项!');
          }
        })
      },
      register(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(!this.isAdmin && (!this.info.ROAD_FILE_PATH || !this.info.BUS_FILE_PATH)){
              this.$Message.error('请上传相关证照!');
              return
            }
            this.$Modal.confirm({
              title: '系统提示',
              content:'确认要注册吗?',
              onOk: () =>{
                this.$emit('register', this.info);
              }
            })
          } else {
            this.$Message.error('请输入必填项!');
          }
        })
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
  /*.formText{*/
    /*display: block;*/
    /*height: 33px;*/
    /*padding: 0 7px;*/
  /*}*/
  .info{
    width: 100%;
    height: 100%;
    padding-bottom: 60px;
    overflow: auto;
    .ivu-collapse{
      border-bottom: 0;
      min-height: 100%;
      background-color: white;
    }
    .pic-card{
      display: inline-block;
      margin: 0 10px 10px 0;
      width: 28%;
      min-width: 250px;
      .red{
        color: red;
      }
      .pic-body{
        width: 100%;
        height: 200px;
        position: relative;
        .no-pic{
          width: 250px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50% , -50%);
        }
        .pic{
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50% , -50%);
          cursor: pointer;
        }
        .button{
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 0;
          text-align: center;
          > *{
            margin: 0 5px;
            vertical-align: top;
          }
          .up-img{
            display: inline-block;
            overflow: hidden;
            position: relative;
            input{
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              opacity: 0;
              font-size: 0;
              cursor: pointer;
            }
          }
        }
      }
    }
    .pic-card:last-child{
      margin-right: 0;
    }
  }
  .footer{
    width: 100%;
    border: 1px solid #e8eaec;
    padding: 12px 18px 12px 18px;
    text-align: right;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: white;
    button{
      margin-left: 8px;
    }
  }
}
</style>
<style lang="less">
#store-info-detail{
  .ivu-collapse{
    .ivu-collapse-header{
      background-color: #f7f7f7;
    }
  }
}
</style>
