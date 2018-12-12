<!--仓库盘点详情页 2018-09-20 测试  -->
<template>
  <Modal
    v-model="showModal"
    title="仓库盘点单"
    width="100"
    
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
    class="table-modal-detail full-height"
    :closable="false"
  >
    <modal-title slot="header" title="仓库盘点单" :state="titleMsg" @clickBack="showModal=false"></modal-title>
    <div style="height:100%;padding-top:10px;padding-bottom:30px;">
        <!--<div class="status">&nbsp;&nbsp;&nbsp;&nbsp;({{this.titleMsg}})</div>-->
    <!--<Collapse v-model="collapse">-->
      <!--<Panel name="1">查询-->
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="85" inline class="detail-form">
          <FormItem label="盘点仓库:" prop="STORE_ID" style="width:23%;">
              <Select v-model="listSearch.STORE_ID" placeholder="请选择..." style="min-width: 100%;" @on-change="selectStoreFun">
                <Option v-for="(item, index) in allStore"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="盘点日期:" prop="CHECK_DATE" style="width:23%;">
              <DatePicker v-model="listSearch.CHECK_DATE" type="date" placeholder="选择日期..." style="min-width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="盘点人:" prop="CHECK_PERSON" style="width:23%;">
              <Select v-model="listSearch.CHECK_PERSON" placeholder="请选择." style="min-width: 100%;">
                <Option v-for="(item, index) in repairPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="盘点类型:" prop="CHECK_TYPE" style="width:23%;">
              <Select v-model="listSearch.CHECK_TYPE" placeholder="请选择盘点类型..." style="min-width: 100%;">
                <Option v-for="(item, index) in getCheckType"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          
          <FormItem label="备注:" style="width:100%;">
              <Input type="textarea" v-model="listSearch.REMARK" placeholder="请输入备注描述..." style="min-width: 100%;"> </Input>
          </FormItem>
          
       </Form>
      <!--</Panel>-->
    <!--</Collapse>-->

    <div class="r-list-header" style="margin: 5px 0;">
      <h1>配件明细</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns"
      :data="commitParts"
      :highlight-row="true"
      stripe
      border
    ></Table>
    <div class="r-list-choose-parts" v-show="saveFlag">
          <Button @click="selectPartsFun" type="primary" shape="circle" ><Icon type="md-add" size="24"/>选择配件</Button>
          <Button @click="loadAllPartByStore" type="primary" shape="circle" ><Icon type="md-add" size="24"/>载入本库全部配件</Button>
    </div>
    
    <!--//选择配件-->
    <!--<select-warehouseParts :showSelectParts="showSelectParts" :initParts="initParts"></select-warehouseParts>-->
    <select-parts :showSelectParts="showSelectParts" @selectPartsItem="selectPartsItem" :initParts="initParts" :initData="initData" :stockFlag='stockFlag' :transferFlag="transferFlag"></select-parts>
    </div>
    
    <div slot="footer">
        <Button type="primary" @click="handleSave('listSearch')" style="margin-right: 10px;" v-show="saveFlag">保存</Button>
        <Button type="info" @click="handleCommit('listSearch')" style="margin-right: 10px;" v-show="saveFlag">提交</Button>
        <Button type="primary" @click="handleOpenAllOut" style="margin-right: 10px;" v-show="noSaveFlag">盘赢盘亏处理</Button>
        <Button type="primary" @click="printWarehouse" style="margin-right: 10px;" v-show="printFlag" >打印盘点单</Button>
        <Button type="default" @click="showModal=false;" style="margin-right: 10px;">返回</Button>

    </div>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import {printPdd} from '@/hxx-components/repairPrintUtil.js'
  import selectParts from '@/hxx-components/select-parts.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'
export default {
	name: "warehouse-check-detail",
    components: {selectParts,ModalTitle},
    data(){
      return{
            showModal:false,
            collapse:'1',
            showSelectParts:null,
            initParts:[],//初始化配件数组
            initData:'',//传入的基础数据值
            timer:null,//监听定时操作
            stockFlag:false,//判断仓库是否出现
            transferFlag:true,//判断界面是否出现在body
            //维修配件
            columns: [
                {title: '序号',  width: 70,type:'index',align:'center'},
                {title: '配件名称', key: 'NAME', sortable: true, minWidth: 120},
                {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 120,
                },
                {title: '单位', key: 'UNIT', sortable: true, minWidth: 100,
                    render: (h, params) => h('span', getName(this.getUnit, params.row.UNIT))
                },
                {title: '品牌', key: 'BRAND', sortable: true, minWidth: 100,
                    render: (h, params) => h('span', getName(this.getBrand, params.row.UNIT))
                },
                {title: '实盘数量', key: 'CHECK_NUM', sortable: true, minWidth: 120,align:'right',
                    render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.CHECK_NUM,
                                    
                                },
                                on: {
                                    "on-change":(val)=>{
                                        
                                            params.row.CHECK_NUM=val;

                                            this.commitParts[params.index]=params.row;
                                            this.commitParts[params.index]['DIFFERENCE_NUM']=val-params.row.STOCK_NUM;
                                        
                                    },
                                    
                                }
                            },
                            )
                        ]);
                    }
                },
                {title: '现库数量', key: 'STOCK_NUM', sortable: true, minWidth: 120,align:'right',
                },
                {title: '差异数量', key: 'DIFFERENCE_NUM', sortable: true, minWidth: 120,align:'right',
                    render: (h, params) => h('span', (params.row.CHECK_NUM-params.row.STOCK_NUM))
                },
                {title: '备注', key: 'REMARK', sortable: true, minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    type: 'text',
                                    value: params.row.REMARK,
                                },
                                on: {
                                    "on-blur":(e)=>{
                                        this.commitParts[params.index]['REMARK']=e.target.value;
                                    }
                                }
                            },
                            )
                        ]);
                    }
                },
                {title: '操作', key: '', sortable: true, minWidth: 100,fixed: 'right',align:'center',
                    render: (h, params) => {
                        
                        if(this.titleMsg=='新建'){
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deletePartsGroup(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }else if(this.titleMsg=='已提交'){
                            return h('div', [
                                h('span', '已提交')
                            ]);
                        }else if(this.titleMsg=='已盘赢盘亏处理'){
                            return h('div', [
                                h('span', '已盘赢盘亏处理')
                            ]);
                        }else if(this.titleMsg=='已作废'){
                            return h('div', [
                                h('span', '已作废')
                            ]);
                        }
                    }
                    
                },
            ],
            commitParts:[],//提交配件
            listSearch:{
                "CHECK_ID":"",
                "STORE_NAME":"",
                "CHECK_NO":"",
                "STORE_ID":'',
                "CHECK_DATE":"",
                "CHECK_PERSON":"",
                "CHECK_TYPE":"",
                "REMARK":"",
                "STATUS":""
            },
            ruleValidate: {
                STORE_ID:[{required: true, message: '请选择盘点仓库'}],
                CHECK_DATE:[{required: true, message: '请选择日期'}],
                CHECK_PERSON:[{required: true, message: '请选择盘点人'}],
                CHECK_TYPE:[{required: true, message: '请选择盘点类型'}],
                
            },
            page: 1,
            limit: 25,
            total: 0,
            repairPersonArr:[],//得到盘点人
            allStore:[],//得到仓库---------
            titleMsg:'新建',

            saveFlag:true,
            noSaveFlag:false,
            printFlag:false,
            printFlag1:false,//判断数据是否加载完成
            printTime:null,//监控定时轮询


      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
          this.showModal=true;
          this.getEmployeeList();
          this.getAllStore();
          if(this.detailData){
              this.listSearch=this.detailData;
              console.log(this.listSearch);
              this.printFlag1=false;
              this.getParts();//获取配件
              if(this.detailData.STATUS=='10441001'){
                  this.titleMsg='新建'
                  this.saveFlag=true;
                  this.noSaveFlag=false;
                  this.printFlag=true;
                  this.initData=this.detailData.STORE_ID;

              }else if(this.detailData.STATUS=='10441002'){
                  this.titleMsg='已提交'
                  this.saveFlag=false;
                  this.noSaveFlag=true;
                  this.printFlag=true;
                  this.initData=this.detailData.STORE_ID;

              }else if(this.detailData.STATUS=='10441003'){
                  this.titleMsg='已盘赢盘亏处理'
                  this.saveFlag=false;
                  this.noSaveFlag=false;
                  this.printFlag=true;
                  this.initData=this.detailData.STORE_ID;

              }else if(this.detailData.STATUS=='10441004'){
                  this.titleMsg='已作废'
                  this.saveFlag=false;
                  this.noSaveFlag=false;
                  this.printFlag=true;
              }
          }else{
              this.titleMsg='新建';
              for(let i in this.listSearch){
                  this.listSearch[i]='';
              }
              this.listSearch['CHECK_DATE']=new Date();
              this.listSearch['CHECK_PERSON']=this.$store.state.user.userInfo.user.userName;

              this.saveFlag=true;
              this.noSaveFlag=false;
              this.printFlag=false;
              this.initData='';
              this.commitParts=[];

          }
      }
    },
    computed:{
        //得到所有盘点类型----
        getCheckType(){
            return getDictGroup(this.$store.state.app.dict, '1043');
        },
        //品牌状态----
        getBrand(){
            return getDictGroup(this.$store.state.app.dict, '1016');
        },
        //单位取值--------
        getUnit(){
            return getDictGroup(this.$store.state.app.dict, '1015');
        },

        
    },
    mounted () {
      

    },
    methods:{
       
        //得到主修人数据
        getEmployeeList(){
            
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
                    this.repairPersonArr=[];
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
            
            this.axios.request({
                url: '/tenant/basedata/partinfo/getStoreSelList',
                method: 'post',
                data: {
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.allStore=[];
                    for(let i in res.data){
                        var obj={code:'',name:''};
                        obj.name=res.data[i].NAME;
                        obj.code=res.data[i].STORE_ID;
                        this.allStore.push(obj);
                        
                    }
                }
            })
        },
        //获取已选择的配件数据信息
        getParts(){
            this.axios.request({
                url: '/tenant/part/ttpartcheck/getParts',
                method: 'post',
                data: {
                    checkId: this.listSearch.CHECK_ID,
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    var val=res.data;
                    this.commitParts=[];
                    this.printFlag1=true;
                    for(let i in val){
                        var partsObj={
                            "STOCK_ID":'',
                            "TENANT_ID":'',
                            "CREATE_TIME":'',
                            "CREATER":'',
                            "UPDATE_TIME":'',
                            "UPDATER":'',
                            "PART_ID":'',
                            "STORE_ID":'',
                            "STOCK_NUM":'',
                            "UNIT_COST":'',
                            "LAST_IN_DATE":'',
                            "LAST_OUT_DATE":'',
                            "NAME":'',
                            "PART_NO":'',
                            "TYPE_ID":'',
                            "SALES_PRICE":'',
                            "UNIT":'',
                            "BRAND":'',
                            "FORMAT":'',
                            "FACTORY_NO":'',
                            "PURCHASE_PRICE":'',
                            "STORE_NAME":'',
                            "id":'',
                            "PART_MONEY":0,
                            "PART_DERATE_MONEY":0,
                            "PART_LAST_MONEY":0,
                            "PART_NUM":0,
                            "GET_PART_TIME":null,
                            "REMARK":'',
                            "IS_SELF":false,
                            "COST_MONEY":0,
                            "DIFFERENCE_NUM":0,
                            "IS_SEL":true,
                            "CHECK_NUM":0,
                        }
                        for(let key in partsObj){
                            if(val[i].hasOwnProperty(key)){
                                partsObj[key]=val[i][key];
                            }
                        }
                        this.commitParts.push(partsObj);
                    }
                    

                }
            })
        },
        //保存操作---
        handleSave(name){
            this.$refs[name].validate((valid) => {
              if (valid) {
                  if(this.commitParts.length>0){
                      
                        this.$Modal.confirm({
                            title:"系统提示!",
                            content:"确定要保存吗？",
                            onOk:this.saveOrSubmit,
                            
                        })
                  }else{
                      this.$Message.error('请选择配件...');
                  }
                  
              } else {
                  this.$Message.error('请填写必选项...');
              }
          });
        },
        //保存数据--------
        saveOrSubmit(){
            this.listSearch["CHECK_DATE"]=formatDate(this.listSearch["CHECK_DATE"]);
            this.listSearch["STATUS"]='10441001';
            this.axios.request({
                url: '/tenant/part/ttpartcheck/saveOrSubmit',
                method: 'post',
                data: {
                    data: JSON.stringify(this.listSearch),
                    parts: JSON.stringify(this.commitParts),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('保存成功...');
                    this.printFlag=true;
                    
                    for(let i in res.data){
                        this.listSearch[i]=res.data[i];
                    }
                    
                }
            })
        },
        //提交操作
        handleCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.commitParts.length>0){
                        for(let i in this.commitParts){
                            if(this.commitParts[i].CHECK_NUM>=0){
                                // this.$Message.error('实盘数量...');
                            }else{
                                this.$Message.error('实盘数量不能为空');
                                return;
                            }
                        }
                        this.$Modal.confirm({
                            title:"系统提示!",
                            content:"确定要提交吗？",
                            onOk:this.commitSubmit,
                            
                        })
                    }else{
                        this.$Message.error('请选择配件...');
                    }
                    
                } else {
                    this.$Message.error('请填写必选项...');
                }
            });
        },
        commitSubmit(){
            this.listSearch["CHECK_DATE"]=formatDate(this.listSearch["CHECK_DATE"]);
            this.listSearch["STATUS"]='10441002';
            this.axios.request({
                url: '/tenant/part/ttpartcheck/saveOrSubmit',
                method: 'post',
                data: {
                    data: JSON.stringify(this.listSearch),
                    parts: JSON.stringify(this.commitParts),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('提交成功...');
                    for(let i in res.data){
                        this.listSearch[i]=res.data[i];
                    }
                    //数据处理类
                    this.titleMsg='已提交';
                    this.saveFlag=false;
                    this.noSaveFlag=true;
                    this.printFlag=true;
                }
            })
        },
        //盘赢盘亏处理-----------
        handleOpenAllOut(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要盘赢盘亏处理吗？<br/>盘赢盘亏处理将改变配件库存至[当前库存±差异数量]",
                onOk:this.openAllOut,
                
            })
        },
        openAllOut(){
            this.axios.request({
                url: '/tenant/part/ttpartcheck/doProcess',
                method: 'post',
                data: {
                    checkId: this.listSearch.CHECK_ID,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('数据提交成功...');
                    this.titleMsg='已盘赢盘亏处理';
                    this.saveFlag=false;
                    this.noSaveFlag=false;
                    this.printFlag=true;
                }
            })
        },
        //载入仓库所有配件---
        loadAllPartByStore(){
            if(this.listSearch.STORE_ID){
                this.axios.request({
                    url: '/tenant/part/ttpartcheck/loadAllPartByStore',
                    method: 'post',
                    data: {
                        storeId: this.listSearch.STORE_ID,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        var val=res.data;
                        this.commitParts=[];
                        for(let i in val){
                            var partsObj={
                                "STOCK_ID":'',
                                "TENANT_ID":'',
                                "CREATE_TIME":'',
                                "CREATER":'',
                                "UPDATE_TIME":'',
                                "UPDATER":'',
                                "PART_ID":'',
                                "STORE_ID":'',
                                "STOCK_NUM":'',
                                "UNIT_COST":'',
                                "LAST_IN_DATE":'',
                                "LAST_OUT_DATE":'',
                                "NAME":'',
                                "PART_NO":'',
                                "TYPE_ID":'',
                                "SALES_PRICE":'',
                                "UNIT":'',
                                "BRAND":'',
                                "FORMAT":'',
                                "FACTORY_NO":'',
                                "PURCHASE_PRICE":'',
                                "STORE_NAME":'',
                                "id":'',
                                "PART_MONEY":0,
                                "PART_DERATE_MONEY":0,
                                "PART_LAST_MONEY":0,
                                "PART_NUM":0,
                                "GET_PART_TIME":null,
                                "REMARK":'',
                                "IS_SELF":false,
                                "COST_MONEY":0,
                                "DIFFERENCE_NUM":0,
                                "IS_SEL":true,
                                "CHECK_NUM":0
                            }
                            for(let key in partsObj){
                                if(val[i].hasOwnProperty(key)){
                                    partsObj[key]=val[i][key];
                                }
                            }
                            this.commitParts.push(partsObj);
                        }
                    }
                })
            }else{
                this.$Message.info('请选择仓库');
            }
            
        },
        //获取选择配件数据
        selectPartsItem(val){
            console.log("val",val);
            this.commitParts=[];
            for(let i in val){
                var partsObj={
                    "STOCK_ID":'',
                    "TENANT_ID":'',
                    "CREATE_TIME":'',
                    "CREATER":'',
                    "UPDATE_TIME":'',
                    "UPDATER":'',
                    "PART_ID":'',
                    "STORE_ID":'',
                    "STOCK_NUM":'',
                    "UNIT_COST":'',
                    "LAST_IN_DATE":'',
                    "LAST_OUT_DATE":'',
                    "NAME":'',
                    "PART_NO":'',
                    "TYPE_ID":'',
                    "SALES_PRICE":'',
                    "UNIT":'',
                    "BRAND":'',
                    "FORMAT":'',
                    "FACTORY_NO":'',
                    "PURCHASE_PRICE":'',
                    "STORE_NAME":'',
                    "id":'',
                    "PART_MONEY":0,
                    "PART_DERATE_MONEY":0,
                    "PART_LAST_MONEY":0,
                    "PART_NUM":0,
                    "GET_PART_TIME":null,
                    "REMARK":'',
                    "IS_SELF":false,
                    "COST_MONEY":0,
                    "DIFFERENCE_NUM":0,
                    "IS_SEL":true,
                    "CHECK_NUM":0
                }
                for(let key in partsObj){
                    if(val[i].hasOwnProperty(key)){
                        partsObj[key]=val[i][key];
                    }
                }
                this.commitParts.push(partsObj);
            }
            
        },
        //选择配件按钮
        selectPartsFun(){
            if(this.initData){
                this.showSelectParts=Math.random();
                this.initParts=this.commitParts;
                this.initData=this.listSearch.STORE_ID;
            }else{
                this.$Message.error('请选择盘点仓库');
            }
            
        },
        //删除配件按钮
        deletePartsGroup(index){
            this.commitParts.splice(index,1);
        },
        clear(){
                for(var i in this.search){
                    this.search[i]= ''
                }
                this.page=1;
                this.getList()
        },
       //仓库选择时赋值给别的传参数据
        selectStoreFun(val){
            
            this.initData=val;
        },
        //弹出层状态变化--------
        visibleChange(status){
            if(status === false){
                document.querySelector(".ivu-modal-body").scrollTop=0;
                this.$emit('closeDetail');
                this.handleReset("listSearch");
            }
        },
        //校验重置
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        //仓库盘点单打印-------
        printWarehouse(){
            
            clearTimeout(this.printTime);
            console.log("仓库盘点单打印---");
            if(this.printFlag1){
                var wtdData=this.$store.state.user.userInfo.tenant;
                var listSearch={};
                for(let i in this.listSearch){
                    switch(i){
                        case'CHECK_DATE':
                            listSearch[i]=formatDate(this.listSearch[i]);
                        break;
                        case'CHECK_TYPE':
                            listSearch[i]=getName(this.getCheckType,this.listSearch[i]);
                        break;
                        case'STORE_NAME':
                            listSearch[i]=getName(this.allStore,this.listSearch["STORE_ID"]);
                        break;
                        default : listSearch[i]= this.listSearch[i];
                    };
                }
                listSearch['printDate']=formatDate(new Date())+ ' '+ formatDate(new Date(), 'hh:mm:ss');

                var commitParts=[];
                for(let i in this.commitParts){
                    commitParts.push(this.commitParts[i]);
                }

                for(let i in commitParts){
                    commitParts[i].UNIT=getName(this.getUnit,commitParts[i].UNIT)||'';
                    commitParts[i].BRAND=getName(this.getBrand,commitParts[i].BRAND)||'';
                    commitParts[i].DIFFERENCE_NUM=commitParts[i].CHECK_NUM-commitParts[i].STOCK_NUM;
                }

                var temp=printPdd(wtdData,listSearch,commitParts);
                var LODOP=getLodop();
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
                LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
                LODOP.ADD_PRINT_TABLE(40, 0, "100%", 950, temp);
                LODOP.PREVIEW();

            }else{
                let self=this;
                this.printTime=setTimeout(function(){
                    self.printWarehouse();
                },300)
            }
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
  .r-list-header{
    h1{
      padding-top:10px;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 5px;
    }
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
