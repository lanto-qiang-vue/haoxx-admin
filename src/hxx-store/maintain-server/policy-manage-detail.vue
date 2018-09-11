<!--保单管理 详情 2018 09 11-->
<template>
  <Modal
    v-model="showModal"
    title="保单管理"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :mask-closable="false"
    :transition-names="['', '']"
  >
    <div style="height: 100%;overflow: auto;padding-bottom: 30px;">
      
      <Collapse v-model="collapse">
        <Panel name="1">保单基本信息
            <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="120" class="common-form">
                <FormItem label="车牌号码:" prop="PLATE_NUM">
                    <Input @on-focus="showoff=Math.random();"	type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" >
                        <Icon type="ios-search" slot="suffix" @click="showoff=Math.random();" style="cursor:pointer;"/>
                    </Input>
                </FormItem>
                <FormItem label="客户名称:">
                    <Input type="text" disabled v-model="listSearch.CUSTOMER_NAME" placeholder=""> </Input>
                </FormItem>
                <FormItem label="联系电话:">
                    <Input type="text" disabled v-model="listSearch.MOBILE_PHONE" placeholder=""> </Input>
                </FormItem>
                <FormItem label="车船税:" prop="VEHICLE_TAX">
                    <InputNumber :min="0" v-model="listSearch.VEHICLE_TAX" placeholder="" @on-change="selectMoney"></InputNumber>
                </FormItem>
                <FormItem label="商业险返点:">
                    <Input type="text"  v-model="listSearch.VCI_DERATE" placeholder=""> </Input>
                </FormItem>
                <FormItem label="交强险返点:">
                <Input type="text"  v-model="listSearch.TCI_DERATE" placeholder=""> </Input>
                </FormItem>
                <FormItem label="总金额:" prop="SUM_MONEY" >
                    <Input type="text" disabled v-model="listSearch.SUM_MONEY" placeholder="" > </Input>
                </FormItem>
                <FormItem label="提成:">
                    <InputNumber :min="0" v-model="listSearch.DEDUCT_MONEY" placeholder=""></InputNumber>
                </FormItem>
                <FormItem label="投保人:">
                    <Input type="text" v-model="listSearch.APPLICANT_PERSON" placeholder=""> </Input>
                </FormItem>
                <FormItem label="投保人电话:">
                    <Input type="text" v-model="listSearch.APPLICANT_TELPHONE" placeholder=""> </Input>
                </FormItem>
                <FormItem label="投保人身份证:">
                    <Input type="text" v-model="listSearch.APPLICANT_CERT_NO" placeholder=""> </Input>
                </FormItem>
                <FormItem label="被保人:">
                    <Input type="text" v-model="listSearch.RECOGNIZEE_PERSON" placeholder=""> </Input>
                </FormItem>
                <FormItem label="被保人电话:">
                    <Input type="text" v-model="listSearch.RECOGNIZEE_TELPHONE" placeholder=""> </Input>
                </FormItem>
                <FormItem label="被保人身份证:">
                    <Input type="text" v-model="listSearch.RECOGNIZEE_CERT_NO" placeholder=""> </Input>
                </FormItem>
                <FormItem label="推荐人:">
                    <Input type="text" v-model="listSearch.RECOMMEND_PERSON" placeholder=""> </Input>
                </FormItem>
                <FormItem label="服务顾问:" prop="FOLLOW_PERSON">
                    <Select v-model="listSearch.FOLLOW_PERSON" placeholder="">
                        <Option v-for="(item, index) in serverPersonArr"
                        :key="item.code" :value="item.code">{{item.code}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Panel>
      
        <Panel name="2">保单详细信息
            <div slot="content" style="height: 500px;">
                <common-table v-model="tableData" :columns="columns1" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :showSearch=false >
                        <div slot="operate">
                            <Button type="primary" v-if="accessBtn('add')" @click="showDetail1=Math.random();tableDetailData=null;">新增</Button>
                            <Button type="info" v-if="accessBtn('edit')" @click="showDetail1=Math.random();" :disabled="editFlag">修改/查看</Button>
                            <Button type="error" v-if="accessBtn('del')"  @click="delTableData" :disabled="delFlag">作废</Button>
                        </div>
                </common-table>
            </div>
        </Panel>
      </Collapse>
      
    </div>
    
      <!--选择车型-->
      <select-vehicle :showoff="showoff" @selectCar="selectCar" :showTransfer='selectCarTransfer' class="table-modal-detail">
      </select-vehicle>
      <policy-detail-edit :showDetail="showDetail1" @policyFun="policyFun" :tableDetailData="tableDetailData"></policy-detail-edit>
      <div slot="footer">
        <Button v-if="isButton" @click="handleSubmit('listSearch')" size="large" type="primary"  style="margin-right: 10px;">保存</Button>
        <Button  size="large" type="default" style="margin-right: 10px;" @click="showModal=false;">返回</Button>
      </div>
  </Modal>

</template>

<script>
    import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
    import { formatDate } from '@/libs/tools.js'
    import mixin from '@/hxx-components/mixin'
    import selectVehicle from '@/hxx-components/select-vehicle.vue'
    import commonTable from '@/hxx-components/common-table.vue'
    import policyDetailEdit from './policy-detail-edit.vue'
    export default {
		name: "policy-manage-detail",
        mixins: [mixin],
        components: {commonTable,selectVehicle,policyDetailEdit},
        data(){
        return{
            showoff:null,//选择车辆
            selectCarTransfer:true,//选择车辆是否放在body

            tableData: [
                
            ],
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            
            clearTableSelect: null,
            isOrderSuccess:true,//判断是不是预约成功
            showModal: false,//本界面是否显示判断
            showDetail1:null,
            //维修配件
            columns1: [
                {title: '保单号', key: 'GUAR_NO', sortable: true, minWidth: 140,},
                {title: '保单类型', key: 'TYPE', sortable: true, minWidth: 120},
                {title: '保险公司', key: 'CORP_NAME', sortable: true, minWidth: 150,
                    
                },
                {title: '购买日期', key: 'BUY_DATE', sortable: true, minWidth: 140,
                    
                },
                {title: '生效日期', key: 'START_DATE', sortable: true, minWidth: 140},
                {title: '结束日期', key: 'END_DATE', sortable: true, minWidth: 140,},
                {title: '金额', key: 'MONEY', sortable: true, minWidth: 120,
                    
                },
                
            ],
            collapse: ['1','2'],
            listSearch:{
                "GUAR_ID":"",
                "VEHICLE_ID":"",
                "TOTAL_MONEY":"",
                "PLATE_NUM":"",
                "CUSTOMER_NAME":"",
                "MOBILE_PHONE":"",
                "VEHICLE_TAX":0,
                "VCI_DERATE":"",
                "TCI_DERATE":"",
                "SUM_MONEY":"",
                "DEDUCT_MONEY":0,
                "APPLICANT_PERSON":"",
                "APPLICANT_TELPHONE":"",
                "APPLICANT_CERT_NO":"",
                "RECOGNIZEE_PERSON":"",
                "RECOGNIZEE_TELPHONE":"",
                "RECOGNIZEE_CERT_NO":"",
                "RECOMMEND_PERSON":"",
                "FOLLOW_PERSON":""
            },

            ruleValidate: {
                PLATE_NUM:[
                    { required: true, message: '车牌号码必填', },
                    
                ],
                VEHICLE_TAX: [
                    { required: true,  message: '车船税必填',}
                ],
                SUM_MONEY: [
                    { required: true,  message: '总金额必填',}
                ],
                FOLLOW_PERSON: [
                    { required: true,  message: '服务顾问必填',}
                ]
            },//规则验证

           
            isCar:false,
            isButton:true,
            listDisabled:false,
            orderDate:"",
            isOrderSuccess:true,//判断是否是预约状态---

            timer:null,
            
            serverPersonArr:null,
            tableDetailData:null,
            editFlag:true,//修改按钮状态
            delFlag:true,//删除按钮状态
            tableIndex:null,//删除index

        }
        
        },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        console.log('进来的参数：',this.detailData,);
        this.showModal=true
        this.showTable= Math.random();
        //判断进来的参数是否存在---------------------
        if(this.detailData){
                this.getEmployeeList(this.detailData.FOLLOW_PERSON);
              this.listSearch= this.detailData;
              if(this.detailData.STATUS=="10461002"){
                  this.isButton=false;
              }else if(this.detailData.STATUS=="10461001"){
                  this.isButton=true;
              }
              
        }else{
            this.listSearch={
                "GUAR_ID":"",
                "VEHICLE_ID":"",
                "TOTAL_MONEY":"",
                "PLATE_NUM":"",
                "CUSTOMER_NAME":"",
                "MOBILE_PHONE":"",
                "VEHICLE_TAX":0,
                "VCI_DERATE":"",
                "TCI_DERATE":"",
                "SUM_MONEY":"",
                "DEDUCT_MONEY":0,
                "APPLICANT_PERSON":"",
                "APPLICANT_TELPHONE":"",
                "APPLICANT_CERT_NO":"",
                "RECOGNIZEE_PERSON":"",
                "RECOGNIZEE_TELPHONE":"",
                "RECOGNIZEE_CERT_NO":"",
                "RECOMMEND_PERSON":"",
                "FOLLOW_PERSON":""
            },
            //新建功能表------
            
            this.isCar=false;
            this.isButton=true;
            this.listDisabled=false;
            this.orderDate="";
            this.isOrderSuccess=true;
            console.log(this.listSearch);

            this.getEmployeeList();
        }
        
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1019');
      this.searchSelectOption1= getDictGroup(this.$store.state.app.dict, '1041');
      
    },
    methods:{
        //得到主修人数据
        getEmployeeList(val){
            this.serverPersonArr=[];
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
                        this.serverPersonArr.push(obj);
                    }
                    //初始化主修人数据
                    if(!val){
                        console.log('满足条件进入主修人数据',val);
                      this.listSearch.FOLLOW_PERSON=this.serverPersonArr[0].code;
                    }else{
                        console.log('不满足条件进入主修人数据',val);
                        this.listSearch.FOLLOW_PERSON=val;
                    }
                    
                }
            })
        },
        getList(){
            this.axios.request({
            url: '/tenant/repair/tt_guarantee_slip/info_list',
            method: 'post',
            data: {
                GUAR_ID_eq: this.listSearch.GUAR_ID,
                page: this.page,
                limit: this.limit,
                access_token: this.$store.state.user.token
            }
            }).then(res => {
            if (res.success === true) {
                this.tableData= res.data
                this.total= res.total
            }
            })

            this.detailData= null
            this.isOrderSuccess=true;
        },
        visibleChange(status){
            if(status === false){
            this.$emit('closeDetail');
            this.handleReset("listSearch");
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"确定要保存吗？",
                        onOk:this.saveData,
                        
                    })
                } else {
                    this.$Message.info('请填写必选项')
                }
            });

        },
        saveData(){
            this.axios.request({
                url: '/tenant/repair/tt_guarantee_slip/save',
                method: 'post',
                data: {
                    data: JSON.stringify(this.listSearch),
                    infos: JSON.stringify(this.tableData),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.showModal=false;
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        
        //监听选择车辆----
        selectCar(val){
            console.log(val);
            this.listSearch["VEHICLE_ID"]=val["VEHICLE_ID"];
            this.listSearch["PLATE_NUM"]=val["PLATE_NUM"];
            this.listSearch["CUSTOMER_NAME"]=val["CUSTOMER_NAME"];
            this.listSearch["MOBILE_PHONE"]=val["MOBILE_PHONE"];
        },
        clear(){
                for(let i in this.search){
            this.search[i]= ''
            }
            this.page=1;
                this.getList()
        },
        changePage(page){
                this.page= page
                this.getList()
        },
        changePageSize(size){
                this.limit= size
                this.getList()
        },
        //数据获取
        onRowClick( row, index){
            this.tableDetailData=row;
            this.tableIndex=index;
            this.editFlag=false;
            this.delFlag=false;

        },
        onRowDblclick( row, index){
            this.tableDetailData=row
            console.log('row：',row);
            this.showDetail1=Math.random()
        },
        closeDetail(){
            this.tableDetailData=null;
            this.clearTableSelect= Math.random();
            this.editFlag=true;
            this.delFlag=true;

        },
        //监听保单详情编辑
        policyFun(val){
            var oldValue={
                "INFO_ID":'',
                "TENANT_ID":'',
                "CREATE_TIME":'',
                "CREATER":'',
                "GUAR_ID":'',
                "GUAR_NO":'',
                "TYPE":'',
                "INSURER_ID":'',
                "BUY_DATE":'',
                "START_DATE":'',
                "END_DATE":'',
                "MONEY":'',
                "REMARK":'',
                "CORP_NAME":'',
                "UPDATE_TIME":'',
                "id":'',
            };

            for(let i in val){
                oldValue[i]=val[i];
            }
            oldValue['BUY_DATE']=formatDate(oldValue['BUY_DATE']);
            oldValue['START_DATE']=formatDate(oldValue['START_DATE']);
            oldValue['END_DATE']=formatDate(oldValue['END_DATE']);
            this.tableData.push(oldValue);
            //关闭清除状态

            this.closeDetail();
            
        },
        //选择金额------
        selectMoney(val){
            console.log(val);
            this.listSearch.SUM_MONEY=val;
        },
        //删除数据-----------
        delTableData(){
            this.tableData.splice(this.tableIndex,1);
            this.closeDetail();
        }

    }
}
</script>

<style scoped lang="less">
  .titleMsg{
    font-size: 18px;
    color: red;
    text-align: right;
    padding-right: 30px;
  }
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
    margin:20px 0;
    margin-bottom: 50px;
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
    padding: 5px 10px;
    div{
      float:right;
    }
  }
</style>
