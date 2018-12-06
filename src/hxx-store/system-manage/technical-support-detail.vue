<!--技术支持详情 2018-09-04-->
<template>
  <Modal
    v-model="showModal"
    title="技术支持"
    width="100"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
    class="table-modal-detail full-height"
    :closable="false"
  >
    <modal-title slot="header" title="技术支持基本信息"  @clickBack="showModal=false"></modal-title>
    <!--<Collapse v-model="collapse">
      <Panel name="1">技术支持基本信息-->
          <div style="padding: 30px;">
              <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch"  :label-width="85" inline class="detail-form">
                <FormItem label="车辆型号:" prop="MODEL_NAME" style="width:45%;">
                    <Input type="text" :disabled='saveFlag' v-model="listSearch.MODEL_NAME" placeholder="" @on-focus="showVehicleModel=true;">
                        <Icon type="ios-search" slot="suffix" @click="showVehicleModel=true;" style="cursor:pointer;"/>
                    </Input>
                </FormItem>
                <FormItem label="故障类型:" style="width:45%;">
                    <Input type="text" :disabled='saveFlag' v-model="listSearch.FAULT_TYPE" placeholder=""> </Input>
                </FormItem>
                <FormItem label="故障呈现:" prop="FAULT_INFO" style="width:100%;">
                    <Input type="textarea" :disabled='saveFlag' v-model="listSearch.FAULT_INFO" placeholder="请输入故障描述..." style="min-width: 100%;"> </Input>
                </FormItem>
                <FormItem label="备注:" style="width:100%;">
                    <Input type="textarea" :disabled='saveFlag' v-model="listSearch.REMARK" placeholder="" style="min-width: 100%;"> </Input>
                </FormItem>
                
                <FormItem label="技术答复:" style="width:100%;" v-show="noSaveFlag">
                    <Input type="textarea" :disabled='saveFlag' v-model="listSearch.FAULT_ANSWER" placeholder="" style="min-width: 100%;"> </Input>
                </FormItem>
            </Form>
          </div>
       
      <!--</Panel>
    </Collapse>-->
    <div slot="footer">
        <Button type="primary" @click="handleSave('listSearch')" style="margin-right: 10px;" v-show="buttonFlag">保存</Button>
    </div>
    <Modal
        v-model="showVehicleModel"
        title="选择车型"
        width="90"
        :scrollable="false"
        :transfer= "true"
        :footer-hide="true"
        :transition-names="['', '']"
        class="table-modal-detail"
    >
        <vehicle-model @onRowClick="onRowClick" :show="showVehicleModel"></vehicle-model>
    </Modal>
    
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import vehicleModel from '@/hxx-components/vehicle-model.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
export default {
	name: "technical-support-detail",
    components: {vehicleModel,ModalTitle},
    data(){
      return{
            showModal:false,
            showVehicleModel:false,
            collapse:'1',
            listSearch:{
                "TID":"",
                "MODEL_ID":"",
                "MODEL_NAME":"",
                "FAULT_TYPE":"",
                "FAULT_INFO":"",
                "REMARK":"",
                "FAULT_ANSWER":"",
            },
            ruleValidate: {
                MODEL_NAME:[{required: true, message: '请选择车型'}],
                FAULT_INFO:[{required: true, message: '请描述故障呈现'}],
                
            },
            page: 1,
            limit: 25,
            total: 0,
            saveFlag:false,
            noSaveFlag:false,
            buttonFlag:true,
            
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
          this.showModal=true;
          if(this.detailData){
              this.buttonFlag=false;
              this.noSaveFlag=true;
              this.saveFlag=true;
              this.listSearch['MODEL_NAME']=this.detailData.mODEL_NAME;
              this.listSearch['FAULT_TYPE']=this.detailData.fAULT_TYPE;
              this.listSearch['FAULT_INFO']=this.detailData.fAULT_INFO;
              this.listSearch['REMARK']=this.detailData.rEMARK;
              this.listSearch['FAULT_ANSWER']=this.detailData.fAULT_ANSWER;
          }else{
              this.buttonFlag=true;
              this.noSaveFlag=false;
              this.saveFlag=false;
              for(let i in this.listSearch){
                  this.listSearch[i]='';
              }

          }

          
      }
    },
    mounted () {
    },
    methods:{
        //保存操作---
        handleSave(name){
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.$Modal.confirm({
                    title:"系统提示!",
                    content:"确定要保存吗？",
                    onOk:this.saveOrSubmit,
                })
              } else {
                  this.$Message.error('请填写必选项...');
              }
          });
        },
        //保存数据--------
        saveOrSubmit(){
            var listData={
                "TID":"",
                "MODEL_ID":"",
                "MODEL_NAME":"",
                "FAULT_TYPE":"",
                "FAULT_INFO":"",
                "REMARK":""
            };
            for(let i in listData){
                listData[i]=this.listSearch[i];
            }
            this.axios.request({
                url: '/tenant/support/tt_technical_support/save',
                method: 'post',
                data: {
                    data: JSON.stringify(listData),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('保存成功...');
                    this.showModal=false;
                }
            })
        },
        //弹出层状态变化--------
        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
                this.handleReset("listSearch");
            }
        },
        //校验重置
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        onRowClick(val){
            this.showVehicleModel=false;
            this.listSearch['MODEL_NAME']=val.MODEL_NAME;
            this.listSearch['TID']=val.TID;
            this.listSearch['MODEL_ID']=val.MODEL_ID;
            
        }
    }
}
</script>

<style scoped lang="less">
  .search-block{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
  .r-list-search{
    width: 100%;
    padding: 20px 0;
    text-align: center;

  }
  .r-list-choose-parts{
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
  .r-list-money{
    width: 100%;
    font-size: 18px;
    text-align: center;

    span{
      color:red;

    }
    .r-list-money-reset{
      font-size: 22px;
    }
  }
  .r-list-chekbox{
    width: 100%;
    overflow: hidden;
    font-size: 18px;
    padding: 0px 10px;
    div{
      float:right;
    }
  }
</style>
