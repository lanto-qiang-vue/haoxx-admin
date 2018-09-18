<!--维修领料详情2018-09-12修改  详情-->
<template>
  <Modal
    v-model="showModal"
    title="维修领料"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    class="table-modal-detail"
    :transition-names="['', '']"
  > 
  <div style="overflow: auto;height: 100%;padding-bottom: 30px;">
      <div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">工单号:{{listSearch.REPAIR_NO}}</div>
    <Collapse v-model="collapse">
      <Panel name="1">查询
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="120" inline class="detail-form">
          <FormItem label="车牌号码:" prop="PLATE_NUM" style="width:30%;">
              <Input type="text" v-model="listSearch.PLATE_NUM" placeholder="" style="min-width: 250px;" disabled>
              </Input>
          </FormItem>
          <FormItem label="车型:" style="width:30%;">
              <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车架号:" style="width:30%;">
              <Input type="text" disabled v-model="listSearch.VIN_NO" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="维修类型:" prop="REPAIR_TYPE" style="width:30%;">
              <Input type="text" disabled v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="进厂日期:" prop="COME_DATE" style="width:30%;">
              
              <Input type="text" disabled v-model="listSearch.COME_DATE" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="服务顾问:" prop="FOLLOW_PERSON" style="width:30%;">
              <Input type="text" disabled v-model="listSearch.FOLLOW_PERSON" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          
       </Form>
       <Form ref="formInline"  slot="content" :label-width="80">
          <FormItem label="客诉内容:">
              <Input type="textarea" disabled v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
          <FormItem label="维修建议:">
              <Input type="textarea" disabled v-model="listSearch.REPAIR_INFO" placeholder="请输入建议内容"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    <Collapse v-model="collapse1">
      <Panel name="1">维修项目/套餐信息
        <div slot="content">
            <div class="r-list-chekbox">
                    <div>
                        <Checkbox v-model="testSingle" disabled>是否启用维修套餐</Checkbox>
                    </div>
                </div>
                <div class="r-list-header" style="margin: 5px 0;">
                    <h1>维修项目</h1>
                </div>
                <Table
                class="main-table"
                ref="tablesMain"
                :columns="columns"
                :data="commitItem"
                stripe
                border
                ></Table>
                <div v-if="testSingle">
                    <div class="r-list-header" style="margin: 5px 0;">
                        <h1>维修项目套餐</h1>
                    </div>
                    <Table
                    class="main-table"
                    ref="tablesMain"
                    :columns="columns2"
                    :data="commitItemGroup"
                    stripe
                    border
                    ></Table>
                </div>
        </div>
        
      </Panel>
    </Collapse>
    
    <div class="r-list-header" style="margin: 5px 0;">
      <h1>维修配件</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns1"
      :data="commitParts"
      :highlight-row="true"
      @on-row-click="onRowClick"
      stripe
      border
    ></Table>
    <div style="width: 100%;height: 50px;line-height: 50px;font-size: 16px;">
        <span>配件数量合计:</span>
        <span style="color: red;">{{costNumber}}</span>
        <span style="padding-left: 10px;">   成本金额合计：</span>
        <span style="color: red;">{{costMoney}} 元</span>
    </div>
    
    <!--退料弹框-->
    <Modal
        v-model="showRejected"
        title="选择退料人"
        >
        <Form ref="personObj" :rules="ruleValidate"  :model="personObj"  :label-width="120" inline class="detail-form">
          <FormItem label="选择退料人:" prop="selectPerson">
              <Select v-model="personObj.selectPerson" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in repairPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
       </Form>
       <div slot="footer">
            <Button type="primary" @click="savePartIn('personObj')" style="margin-right: 10px;">确定</Button>
        </div>
    </Modal>
    <!--维修领料弹框-->
    <Modal
        v-model="showReceive"
        title="维修领料"
        >
        <Form ref="storeObj" :rules="ruleValidate"  :model="storeObj"  :label-width="120" inline class="detail-form">
            <FormItem label="领料仓库:" prop="selectStore">
              <Select v-model="storeObj.selectStore" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in allStore"
                  :key="index" :value="item.id">{{item.code}}</Option>
              </Select>
            </FormItem>
          <FormItem label="选择退料人:" prop="selectPerson">
              <Select v-model="storeObj.selectPerson" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in repairPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
       </Form>
       <div slot="footer">
            <Button type="primary" @click="savePartOut('storeObj')" style="margin-right: 10px;">确定</Button>
        </div>
    </Modal>
  </div>
    
  <!--底部按钮组-->
    <div slot="footer">
        <Button type="primary" @click="receiveFun" style="margin-right: 10px;">领料出库</Button>
        <Button type="primary" @click="rejectedFun" style="margin-right: 10px;">退料入库</Button>
    </div>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import ColumnInput from '@/hxx-components/column-input.vue'


	export default {
	name: "maintain-pick-detail",
    components: {ColumnInput},
    data(){
      return{
        showReceive:false,//领料弹框
        showRejected:false,//退料弹框
        showModal: false,//本界面是否显示判断
        testSingle:false,//判断是否启用维修项目套餐
        //维修项目
        columns: [
          {title: '序号',  minWidth: 80,type:"index",
          },
          {title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 200,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 120},
          {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 120},
          {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 120},
          {title: '小计金额', key: 'ITEM_MONEY', sortable: true, minWidth: 120,
          },
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 120,
          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
          },
          {title: '车间班组', key: 'WORK_CLASS_NAME', sortable: true, minWidth: 150,
            
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            
          },
          {title: '操作', key: '', sortable: true, minWidth: 150,
            
          },
        ],
        //维修配件
        columns1: [
          {title: '序号',  minWidth: 80,type:'index',},
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 120,},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 120},
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 100,
            
          },
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 100,
            render: (h, params) => h('span', getName(this.getUnit, params.row.UNIT))
          },
          {title: '成本单价', key: 'UNIT_COST', sortable: true, minWidth: 120},
          {title: '成本金额', key: '', sortable: true, minWidth: 120,
            render: (h, params) => h('span', parseFloat(params.row.PART_NUM)*parseFloat(params.row.UNIT_COST))
            },
          {title: '销售税率', key: 'TAX', sortable: true, minWidth: 120,
            
          },
          {title: '含销售价', key: 'SALES_PRICE', sortable: true, minWidth: 120,},
          {title: '销售税额', key: 'RATE', sortable: true, minWidth: 120,},
          {title: '未含销售价', key: 'NOT_CONTAINS_TAX_SALE_PRICE', sortable: true, minWidth: 150,},
          {title: '领/退料人', key: 'GET_PART_PERSON', sortable: true, minWidth: 150,},
          {title: '领/退料时间', key: 'GET_PART_TIME', sortable: true, minWidth: 150,},
          {title: '领料仓库', key: 'STORE_NAME', sortable: true, minWidth: 150,},
          {title: '领料状态', key: 'STATUS', sortable: true, minWidth: 150,
            render: (h, params) => {
                        var bgColor='#00bcd4';
                        if(params.row.STATUS==10221002){
                            bgColor='#FF9800';
                        }else{
                            bgColor='#00bcd4';
                        }
                        return h('div', {
                                style: {
                                    width:'100%',
                                    height:'100%',
                                    textAlign: "center",
                                    background: bgColor,
                                    color:'#fff',
                                },
                            },getName(this.getStatus, params.row.STATUS))
                        }
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
          },
        ],
        //维修项目套餐
        columns2: [
          {title: '序号',  minWidth: 80,type:'index',},
          {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 200,},
          {title: '套餐价格', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 150,
          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            
          },
          {title: '车间班组', key: 'WORK_CLASS_NAME', sortable: true, minWidth: 150,
            
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            
          },
          {title: '操作', key: '', sortable: true, minWidth: 150,
          },
        ],
        collapse: '1',
        collapse1:'',
        listSearch:{
           "TENANT_ID":"",
            "REPAIR_ID":"",
            "REPAIR_NO":"",
            "VEHICLE_ID":"",
            "ENGINE_NO":"",
            "VEHICLE_COLOR":"",
            "ORDER_ID":"",
            "OUT_DATE":"",
            "OUT_MILEAGE":"",
            "OLD_PART_RESULT":"",
            "ZY_PART":"",
            "ZY_PART_BZQ":"",
            "PLATE_NUM":"",
            "VEHICLE_MODEL":"",
            "VIN_NO":"",
            "CUSTOMER_NAME":"",
            "GIVE_REPAIR_PERSON":"",
            "TELPHONE":"",
            "REPAIR_TYPE":"",
            "MILEAGE":0,
            "REPAIR_PERSON":"",
            "VEHICLE_TYPE":"",
            "VEHICLE_TYPE_CODE":"",
            "FOLLOW_PERSON":"",
            "COME_DATE":"",
            "PLAN_END_DATE":"",
            "FAULT_DESC":"",
            "CUSTOMER_INFO":"",
            "REPAIR_INFO":"",
            "IS_ITEM_GROUP":"",
            "REPAIR_ITEM_DERATE_MONEY":0,
            "REPAIR_PART_DERATE_MONEY":0,
            "STATUS":"",
            "REPAIR_ITEM_MONEY":0,
            "REPAIR_PART_MONEY":0,
            "SUM_MONEY":0,
            "GD_TYPE":""
        },
        listSearchInit:{
            "TENANT_ID":"",
            "REPAIR_ID":"",
            "REPAIR_NO":"",
            "VEHICLE_ID":"",
            "ENGINE_NO":"",
            "VEHICLE_COLOR":"",
            "ORDER_ID":"",
            "OUT_DATE":"",
            "OUT_MILEAGE":"",
            "OLD_PART_RESULT":"",
            "ZY_PART":"",
            "ZY_PART_BZQ":"",
            "PLATE_NUM":"",
            "VEHICLE_MODEL":"",
            "VIN_NO":"",
            "CUSTOMER_NAME":"",
            "GIVE_REPAIR_PERSON":"",
            "TELPHONE":"",
            "REPAIR_TYPE":"10191001",
            "MILEAGE":0,
            "REPAIR_PERSON":"",
            "VEHICLE_TYPE":"10521001",
            "VEHICLE_TYPE_CODE":"轿车-排量<1.6升-A",
            "FOLLOW_PERSON":"",
            "COME_DATE":new Date(),
            "PLAN_END_DATE":new Date(),
            "FAULT_DESC":"",
            "CUSTOMER_INFO":"",
            "REPAIR_INFO":"",
            "IS_ITEM_GROUP":"10041002",
            "REPAIR_ITEM_DERATE_MONEY":0,
            "REPAIR_PART_DERATE_MONEY":0,
            "STATUS":"10201001",
            "REPAIR_ITEM_MONEY":0,
            "REPAIR_PART_MONEY":0,
            "SUM_MONEY":0,
            "GD_TYPE":""
        },
        
        ruleValidate: {
            PLATE_NUM: [
                { required: true, type: 'string', message: '请选择车型', trigger: 'change' }
            ],
            REPAIR_TYPE:[{required: true, message: '选择维修类型'}],
            COME_DATE:[{required: true, message: '选择进厂日期'}],
            FOLLOW_PERSON:[{required: true, message: '选择服务顾问'}],
            selectPerson:[{required: true, message: '选择退料人'}],
            selectStore:[{required: true, message: '选择仓库'}],
        },
        commitItemGroup:[],//提交项目组
        commitItem:[],//提交选择项目
        commitParts:[],//提交配件
        repairPersonArr:[],//主修人数组
        personObj:{
            selectStore:'',
        },//小弹框选择主修人
        storeObj:{
            selectPerson:null,
            selectStore:'',
        },//小弹框选择主修人
        commitOneParts:null,//单条配件数据----
        allStore:[],//全部仓库
        costMoney:0,//成本金额
        costNumber:0,//成本数量


      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        console.log('进来的参数：',this.detailData,);
        if(this.detailData){
            this.showModal=true
            this.listSearch=this.detailData;
            this.listSearch.REPAIR_TYPE=getName(this.getType,this.listSearch.REPAIR_TYPE);
            
            this.getEmployeeList();
            this.getAllStore();
            this.getItemFun(this.detailData.REPAIR_ID);
            this.getItemGroupFun(this.detailData.REPAIR_ID);
            this.getPartsFun(this.detailData.REPAIR_ID);
        }
        

        
      }
    },
    computed:{
        //领料状态----
        getStatus(){
            return getDictGroup(this.$store.state.app.dict, '1022');
        },
        //单位取值--------
        getUnit(){
            return getDictGroup(this.$store.state.app.dict, '1015');
        },
        getType(){
            return getDictGroup(this.$store.state.app.dict, '1019');
        }

    },
    mounted () {
      this.vehicleTypeArr= getDictGroup(this.$store.state.app.dict, '1052');

    },
    methods:{
        //得到主修人数据
        getEmployeeList(){
            this.repairPersonArr=[];
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getEmployeeList',
                method: 'post',
                data: {
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    for(let i in res.data){
                        var obj={code:''};
                        obj.code=res.data[i].USER_NAME;
                        this.repairPersonArr.push(obj);
                    }
                }
            })
        },
        //获取所有仓库---
        getAllStore(){
            this.allStore=[];
            this.axios.request({
                url: '/tenant/basedata/ttstorehouse/get_all_list',
                method: 'post',
                data: {
                page: 1,
                start: 0,
                limit: 25,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    for(let i in res.data){
                        var obj={code:'',id:''};
                        obj.code=res.data[i].NAME;
                        obj.id=res.data[i].STORE_ID;
                        this.allStore.push(obj);
                        
                    }
                }
            })
        },
        //获取维修项目内容
        getItemFun(repairId){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getItems',
                method: 'post',
                data: {
                repairId: repairId,
                page: 1,
                start: 0,
                limit: 25,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.commitItem=res.data;

                }
            })
        },
        //获取维修项目套餐内容
        getItemGroupFun(repairId){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getItemGroups',
                method: 'post',
                data: {
                repairId: repairId,
                page: 1,
                start: 0,
                limit: 25,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.commitItemGroup=res.data;
                    if(this.commitItemGroup.length>0){
                        this.testSingle=true;
                    }else{
                        this.testSingle=false;
                    }
                }
            })
        },
        //获取维修配件内容
        getPartsFun(repairId){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getParts',
                method: 'post',
                data: {
                repairId: repairId,
                page: 1,
                start: 0,
                limit: 25,
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.commitParts=res.data;
                    this.costNumber=this.commitParts.length;
                    this.costMoney=0;
                    for(let i in this.commitParts){
                        this.costMoney+=parseFloat(this.commitParts[i].PART_NUM)*parseFloat(this.commitParts[i].UNIT_COST);
                    }
                    this.costMoney=this.costMoney.toFixed(2)
                }
            })
        },
        //选择领退料数据--------
        onRowClick( row, index){
            console.log(row);
            this.commitOneParts=row;
        },
        //退料入库按钮------------
        rejectedFun(){
            if(this.commitOneParts){
                this.showRejected=true;
            }else{
                this.$Message.error('请选择一条维修配件数据');
            }
            
        },
        savePartIn(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.axios.request({
                        url: '/tenant/repair/ttrepairgetpart/savePartIn',
                        method: 'post',
                        data: {
                        REPAIR_ID: this.listSearch.REPAIR_ID,
                        PERSON: this.personObj.selectPerson,
                        parts: JSON.stringify([this.commitOneParts]),
                        access_token: this.$store.state.user.token
                        }
                    }).then(res => {
                        if (res.success === true) {
                            for(let i in this.personObj){
                                this.personObj[i]='';
                            }
                            this.getPartsFun(this.listSearch.REPAIR_ID);
                            this.commitOneParts=null;
                            this.$Message.info('退料成功');
                            this.handleReset('personObj');
                        }else{
                            this.$Message.error(res.Exception.message);
                        }
                    })
                    this.showRejected=false;
                } else {
                    this.$Message.error("请填写红框信息");
                }
            })
        },
        //领料入库按钮----------
        receiveFun(){
            if(this.commitOneParts){
                this.showReceive=true;
            }else{
                this.$Message.error('请选择一条维修配件数据');
            }
        },
        savePartOut(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.axios.request({
                        url: '/tenant/repair/ttrepairgetpart/savePartOut',
                        method: 'post',
                        data: {
                        REPAIR_ID: this.listSearch.REPAIR_ID,
                        STORE_ID:this.storeObj.selectStore,
                        PERSON: this.storeObj.selectPerson,
                        parts: JSON.stringify([this.commitOneParts]),
                        access_token: this.$store.state.user.token
                        }
                    }).then(res => {
                        if (res.success === true) {
                            if(res.data && res.data=='2'){
                                this.receiveFunOnce();
                            }else{
                                for(let i in this.storeObj){
                                    this.storeObj[i]='';
                                }
                                this.getPartsFun(this.listSearch.REPAIR_ID);
                                this.commitOneParts=null;
                                this.$Message.info('领料成功');
                                this.handleReset('storeObj');
                            }
                            
                        }else{
                            this.$Message.error(res.Exception.message);
                        }
                    })
                    this.showReceive=false;
                } else {
                    this.$Message.error("请填写红框信息");
                }
            })
        },
        receiveFunOnce(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"出库数量大于实际库存，是否允许出库？",
                onOk:this.savePartOutOnce,
                
            })
        },
        savePartOutOnce(){
            this.axios.request({
                        url: '/tenant/repair/ttrepairgetpart/savePartOut',
                        method: 'post',
                        data: {
                        REPAIR_ID: this.listSearch.REPAIR_ID,
                        STORE_ID:this.storeObj.selectStore,
                        PERSON: this.storeObj.selectPerson,
                        parts: JSON.stringify([this.commitOneParts]),
                        IS_CONF_OUT:'10041001',
                        access_token: this.$store.state.user.token
                        }
                    }).then(res => {
                        if (res.success === true) {
                                for(let i in this.storeObj){
                                    this.storeObj[i]='';
                                }
                                this.getPartsFun(this.listSearch.REPAIR_ID);
                                this.commitOneParts=null;
                                this.$Message.info('领料成功');
                                this.handleReset('storeObj');
                        }else{
                            this.$Message.error(res.Exception.message);
                        }
                    })
        },
        visibleChange(status){
            if(status === false){
                this.$emit('closeDetail');
                // this.handleReset("listSearch");
            }
        },
        //校验重置
        handleReset (name) {
            this.$refs[name].resetFields();
        },
       
               
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
