
<!--选择项目组件 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="新增客户及车辆"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :transition-names="['', '']"
    >
    <Collapse v-model="collapse">
      <Panel name="1">车辆基本信息
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号:">
              <Input type="text" v-model="listSearch.PLATE_NUM" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="车辆颜色:">
              <Select v-model="listSearch.VEHICLE_COLOR" placeholder="" style="min-width: 250px;" placeholder="选择包装单位">
                <Option v-for="(item, index) in initColorArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="发动机号:">
              <Input type="text" v-model="listSearch.ENGINE_NO" placeholder="选择分类" style="min-width: 250px;" search >
              </Input>
          </FormItem>
          <FormItem label="车架号:">
               <Input type="text" v-model="listSearch.VIN_NO" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" v-model="listSearch.VEHICLE_MODEL" placeholder="选择分类" style="min-width: 250px;" search >
              </Input>
          </FormItem>
          <FormItem label="出厂日期:" >
              <DatePicker v-model="listSearch.LEAVE_FACTORY_DATE" type="date" placeholder="Select date"></DatePicker>
          </FormItem>
          
       </Form>
      </Panel>
      <Panel name="2">客户基本信息
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="80" inline class="detail-form">

           <FormItem label="客户名称:" >
               <Input type="text" v-model="listSearch.NAME" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="移动电话:">
               <Input type="text" v-model="listSearch.MOBILE_PHONE" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          
          <FormItem label="联系地址:">
               <Input type="text" v-model="listSearch.ADDRESS" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="QQ:">
               <Input type="text" v-model="listSearch.QQ_NO" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="微信:" >
               <Input type="text" v-model="listSearch.WEIXIN_NO" placeholder="" style="min-width: 250px;" >
              </Input>
          </FormItem>
          <FormItem label="生日:" >
              <DatePicker v-model="listSearch.BIRTHDAY" type="date" placeholder="Select date"></DatePicker>
          </FormItem>
       </Form>
      </Panel>
      
    </Collapse>
    <div slot="footer" style="text-align: center; font-size: 18px;">
        <Button @click="saveData" size="large" type="primary"  style="margin-right: 10px; padding: 0 10px;"><Icon type="md-checkmark" size="24"/>保存</Button>
        <Button size="large" type="primary"  style="margin-right: 10px; padding: 0 10px;"><Icon type="md-add" size="24"/>取消</Button>

    </div>
    <common-modal6 :description="tooltipObj.description"
      :title="tooltipObj.title" :modal6="tooltipObj.mshow" :fun="tooltipObj.funName" @del="del"></common-modal6>
    </common-table>
  </Modal>
</template>

<script>

  import { getName, getDictGroup } from '@/libs/util.js'
    import { formatDate } from '@/libs/tools.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'
	export default {
		name: "select-addVehicle",
        props:['showAddVehicle'],
        components: {commonModal6},
        data(){
            return{
                tooltipObj:{
                    mshow:null,
                    funName:'del',
                    description:'',
                    title:'',
                },
                showType:false,
                showOnoff:false,
                collapse:"1",
                initColorArr:[],
                listSearch:{
                    "VEHICLE_ID":"",
                    "TID":"",
                    "PLATE_NUM":"",
                    "VEHICLE_COLOR":"",
                    "ENGINE_NO":"",
                    "VIN_NO":"",
                    "VEHICLE_MODEL":"",
                    "LEAVE_FACTORY_DATE":"",
                    "CUSTOMER_ID":"",
                    "NAME":"",
                    "MOBILE_PHONE":"",
                    "ADDRESS":"",
                    "QQ_NO":"",
                    "WEIXIN_NO":"",
                    "BIRTHDAY":""
                },
                initList:{
                    "VEHICLE_ID":"",
                    "TID":"",
                    "PLATE_NUM":"",
                    "VEHICLE_COLOR":"",
                    "ENGINE_NO":"",
                    "VIN_NO":"",
                    "VEHICLE_MODEL":"",
                    "LEAVE_FACTORY_DATE":"",
                    "CUSTOMER_ID":"",
                    "NAME":"",
                    "MOBILE_PHONE":"",
                    "ADDRESS":"",
                    "QQ_NO":"",
                    "WEIXIN_NO":"",
                    "BIRTHDAY":""
                },
                ruleValidate: {
                },
            }
        },
        watch:{
            showAddVehicle(){
                console.log("进入选择增加车辆");
                this.showOnoff=true;
                for(let i in this.listSearch){
                    this.listSearch[i]=this.initList[i];
                }
                
            }
        },
        mounted() {
            this.initColorArr=getDictGroup(this.$store.state.app.dict, '1013');
            
        },
        methods:{
            saveData(){
                this.tooltipObj.title = '系统提示!';
                this.tooltipObj.description = '确定保存数据？';
                this.tooltipObj.mshow = Math.random();
            },
            salesPriceFun(val){
                this.listSearch.SALES_PRICE=val;
                this.listSearch.TAX=(val*this.listSearch.RATE).toFixed(2);
                this.listSearch.NOT_CONTAINS_TAX_SALE_PRICE=val-(val*this.listSearch.RATE).toFixed(2);
            },
            rateComputed(val){
                this.listSearch.TAX=(val*this.listSearch.SALES_PRICE).toFixed(2);
                this.listSearch.NOT_CONTAINS_TAX_SALE_PRICE=this.listSearch.SALES_PRICE-(val*this.listSearch.SALES_PRICE).toFixed(2);
            },
            del(){
                this.listSearch["LEAVE_FACTORY_DATE"]=formatDate(this.listSearch["LEAVE_FACTORY_DATE"]);
                this.listSearch["BIRTHDAY"]=formatDate(this.listSearch["BIRTHDAY"]);
                
                this.axios.request({
                    url: '/tenant/basedata/ttvehiclefile/save_vehicle_customer',
                    method: 'post',
                    data: {
                    data: JSON.stringify(this.listSearch),
                    access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.$Message.info('successful')
                        this.showOnoff=false;
                        this.$emit('selectAddVehicleFun');
                    }
                })
            },
            

        }
	}
</script>

<style lang="less" scoped>
    .search-block{
        display: inline-block;
        width: 200px;
        margin-right: 10px;
    }
    .common-table{
        padding: 10px;
        background-color: white;
        height: 100%;
        overflow: hidden;
        position: relative;
        .table-search{
        }
        .operate{
            margin-top: 10px;
            padding: 15px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
        }
        .main-table{
            margin-top: 10px;
        }
        .table-bottom{
            position: absolute;
            height: 52px;
            padding: 10px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
    }
</style>
