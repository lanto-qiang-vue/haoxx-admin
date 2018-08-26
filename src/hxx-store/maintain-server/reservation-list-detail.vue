<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    title="维修服务预约"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
  >
    <div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">{{titleMsg}}</div>
    <Collapse v-model="collapse">
      <Panel name="1">查询
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号码:">
              <Input @on-focus="showoff=Math.random();"	type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" style="min-width: 250px;" >
                  <Icon type="ios-search" slot="suffix"/>
              </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="预约维修类型:" >
              <Select v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in searchSelectOption"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="预约日期:" prop="ORDER_DATE">
              <DatePicker format="yyyy-MM-dd" v-model="listSearch.ORDER_DATE" type="date" placeholder="请选择..." style="min-width: 250px;"></DatePicker>

          </FormItem>
          <FormItem label="预约时间:" prop="ORDER_TIME">
              <!--<TimePicker v-model="listSearch.ORDER_TIME" type="time" placeholder="请选择..." style="min-width: 250px;"></TimePicker>-->
              <Select v-model="listSearch.ORDER_TIME" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in timeGruop"
                  :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
          </FormItem>
          <FormItem label="预约类型:">
              <Select v-model="listSearch.ORDER_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in searchSelectOption1"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="预约人:">
              <Input type="text" v-model="listSearch.ORDER_PERSON" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系电话:">
              <Input type="text"  @on-keyup="getOnlyNumber" v-model="listSearch.TELPHONE" onkeypress="return event.keyCode>=48&&event.keyCode<=57" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="当前里程:">
              <InputNumber :min="1" v-model="listSearch.MILEAGE" style="min-width: 250px;" placeholder="最大不超过八位数"></InputNumber>
          </FormItem>
       </Form>
       <Form ref="formInline"  slot="content" :label-width="80">
          <FormItem label="故障描述:">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    <div class="r-list-chekbox">
      <div>
          <Checkbox v-model="testSingle">是否启用维修套餐</Checkbox>
      </div>
    </div>
    <div class="r-list-header">
      <h1>维修项目</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns"
      :data="getItem"
      stripe
      border
    ></Table>
    <div class="r-list-search" v-if="isOrderSuccess">
          <Button @click="goOnTenanceItem" type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目</Button>
          <Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入维修项目</Button>
    </div>
    <div v-if="testSingle">
        <div class="r-list-header">
          <h1>维修项目套餐</h1>
        </div>
        <Table
          class="main-table"
          ref="tablesMain"
          :columns="columns2"
          :data="getItemGroup"
          stripe
          border
        ></Table>
        <div class="r-list-search" v-if="isOrderSuccess">
              <Button type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目套餐</Button>
              <Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入项目套餐</Button>
        </div>
    </div>
    <div class="r-list-header">
      <h1>维修配件</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns1"
      :data="getParts"
      stripe
      border
    ></Table>
    <div class="r-list-choose-parts" v-if="isOrderSuccess" >
          <Button @click="goOnSelectParts " type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>从配件库存选择配件</Button>
          <Button @click="goOnSelectPartsGroup" type="primary" shape="circle" ><Icon type="md-add" size="24"/>从配件档案选择配件</Button>
    </div>

    <div class="r-list-money">
      <p>
        维修项目费用：
        <span>{{listSearch.REPAIR_ITEM_MONEY}}元</span>
         + 维修配件费用：
         <span>{{listSearch.REPAIR_PART_MONEY}}元</span>
          + 维修项目优惠金额：
          <InputNumber @on-change="computeOne" :disabled="listDisabled" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" :min="0">
          </InputNumber> - 配件优惠金额：
          <InputNumber @on-change="computeTwo" :disabled="listDisabled" v-model="listSearch.REPAIR_PART_DERATE_MONEY" :min="0">
          </InputNumber>= 合计应收金额：
          <span class="r-list-money-reset">{{listSearch.SUM_MONEY}}元</span>
      </p>
    </div>

    <div slot="footer" style="text-align: center; font-size: 18px;">
        <Button v-if="isButton" @click="handleSubmit('listSearch')" size="large" type="primary"  style="margin-right: 10px; padding: 0 10px;"><Icon type="md-checkmark" size="24"/>保存</Button>
        <Button v-if="isButton" @click="handleCommit" size="large" type="primary"  style="margin-right: 10px; padding: 0 10px;"><Icon type="md-add" size="24"/>提交</Button>
        <Button v-if="isCar"  size="large" type="primary"  style=" padding: 0 10px;"><Icon type="ios-car" size="24"/>维修接车</Button>
    </div>
    <common-modal6 :description="tooltipObj.description"
      :title="tooltipObj.title" :modal6="tooltipObj.mshow" :fun="tooltipObj.funName" @saveData="saveData" @commitdata="commitdata"></common-modal6>

      <common-select-vehicle :showoff="showoff" @selectCar="selectCar">
      </common-select-vehicle>
      <common-tenance-items :showTenanceItems="showTenanceItems" @sTenanceItem="sTenanceItem" :initGetItem="initGetItem">
      </common-tenance-items>

      <common-select-parts :showSelectParts="showSelectParts" @selectPartsItem="selectPartsItem" :initParts="initParts">

      </common-select-parts>
      <common-select-partsGroup :showSelectPartsGroup="showSelectPartsGroup" @selectPartsGroup="selectPartsGroup" :initPartsGroup="initPartsGroup">

      </common-select-partsGroup>
  </Modal>

</template>

<script>
  import { getName, getDictGroup } from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'
  import commonSelectVehicle from '@/hxx-components/common-select-vehicle.vue'
  import commonTenanceItems from '@/hxx-components/common-tenance-items.vue'
  import commonSelectParts from '@/hxx-components/common-select-parts.vue'
  import commonSelectPartsGroup from '@/hxx-components/common-select-partsGroup.vue'
  import ColumnInput from '@/hxx-components/column-input.vue'

	export default {
		name: "reservation-list-detail",
    components: {commonModal6,commonSelectVehicle,commonTenanceItems,commonSelectParts,commonSelectPartsGroup},
    data(){
      return{
        showoff:null,//选择车辆
        showTenanceItems:null,//选择项目
        initGetItem:[],//初始化选择项目数据

        showSelectParts:null,//选择配件开关
        initParts:null,
        showSelectPartsGroup:null,
        initPartsGroup:null,
        tooltipObj:{
            mshow:false,
            funName:'saveData',
            description:'',
            title:'',
        },
        titleModel:true,
        showModal: false,
        testSingle:false,
        testMsg:"2700.00",
        testMsg1:"100.00",
        testMsg2:"5000.00",
        columns: [
          {title: '序号',  minWidth: 60,type:"index",
          },
          {title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 200,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 150},
          {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 150},
          {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'ITEM_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', (params.row.REPAIR_TIME*100+params.row.PAINT_NUM*1200))
          },
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 150,
            render: (h, params) =>  h(ColumnInput, {
                props: {
                  params: params,
                  type: 'number',
                  min: 0
                },
                on: {
                  'change': val => {
                    this.getItem[params.index][params.column.key]= val
                    // console.log('change',params.column.key,this.getItem[params.index])
                  },
                }
              })
          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', (params.row.REPAIR_TIME*100+params.row.PAINT_NUM*1200))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '操作', key: '', sortable: true, minWidth: 150, fixed: 'right',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.deleteTenanceItem(params.index);
                            }
                        }
                    }, 'Delete')
                ]);
            }
          },
        ],
        getItem:[],
        columns1: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,type:'index',
            // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 200,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))s
          },
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 150,
            render: (h, params) => h('span', 1)
          },
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
          },
          {title: '单价', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'PART_MONEY', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
          },
          {title: '优惠金额', key: 'PART_DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'PART_LAST_MONEY', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '操作', key: '', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
        ],
        getParts:[],

        columns2: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,type:'index',
            // render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 200,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '套餐价格', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '备注', key: '', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '操作', key: '', sortable: true, minWidth: 150,
            // render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
        ],
        getItemGroup:[],
        collapse: '1',
        search:{
          input: '',
          TELPHONE:"",
        },
        listSearch:{
          "ORDER_ID":"",
          "VEHICLE_ID":"",
          "VIN_NO":"",
          "CUSTOMER_NAME":"",
          "PLATE_NUM":"",
          "VEHICLE_MODEL":"",
          "REPAIR_TYPE":"10191001",
          "ORDER_DATE":"",
          "ORDER_TIME":"",
          "ORDER_TYPE":"10411001",
          "ORDER_PERSON":"",
          "TELPHONE":"",
          "MILEAGE": 0,
          "FAULT_DESC":"",
          "CUSTOMER_INFO":"",
          "IS_ITEM_GROUP":"",
          "REPAIR_ITEM_DERATE_MONEY":0,
          "REPAIR_PART_DERATE_MONEY":0,
          "STATUS":"",
          "REPAIR_ITEM_MONEY":0,
          "REPAIR_PART_MONEY":0,
          "SUM_MONEY":0
        },
        listItems:{
          "DETAIL_ID":153696,
          "ITEM_ID":53386,
          "TENANT_ID":1,
          "CREATE_TIME":"2018-07-18 17:43:21",
          "NAME":"发动机大修*1 - U",
          "ITEM_NO":"5-1-4",
          "TYPE_ID":38,
          "STATUS":"10011001",
          "CHARGE_TYPE":"10141002",
          "REPAIR_TIME":325,
          "REPAIR_MONEY":0,
          "PAINT_NUM":0,
          "REMARK":"含综合性能检测作业",
          "IS_PREINSTALL":"10041001",
          "CLASS_NAME":"货车-载质量≥8吨",
          "CLASS_TYPE":"U",
          "ENGINE_TYPE_NAME":"货车-其他",
          "ENGINE_TYPE":"0",
          "SORT":49,
          "TYPE_NAME":"货车-维护和大修",
          "cartype":5,
          "BUSINESS_TYPE":"10331001",
          "UPDATE_TIME":null,
          "id":"repair.Repair-261",
          "ITEM_MONEY":32500,
          "ITEM_DERATE_MONEY":0,
          "ITEM_LAST_MONEY":32500,
          "SUM_MONEY":0,
          "COME_DATE":null,
          "PLAN_END_DATE":null,
          "REPAIR_ITEM_MONEY":0,
          "REPAIR_PART_MONEY":0,
          "REPAIR_ITEM_DERATE_MONEY":0,
          "REPAIR_PART_DERATE_MONEY":0,
          "ACCOUNT_TIME":null,
          "ORDER_DATE":null,
          "IS_SEL":true
        },
        listParts:{
          "STOCK_ID":10,
          "TENANT_ID":1,
          "CREATE_TIME":"2018-03-25 22:44:13",
          "CREATER":1,
          "UPDATE_TIME":"2018-08-24 09:58:26",
          "UPDATER":1,
          "PART_ID":4,
          "STORE_ID":3,
          "STOCK_NUM":-7,
          "UNIT_COST":133,
          "LAST_IN_DATE":"2018-03-25 22:44:13",
          "LAST_OUT_DATE":"2018-08-24 09:58:26",
          "NAME":"雨刷器",
          "PART_NO":"P1000004",
          "TYPE_ID":11,
          "SALES_PRICE":388,
          "UNIT":"10151001",
          "BRAND":"",
          "FORMAT":"",
          "FACTORY_NO":"YSQ001",
          "PURCHASE_PRICE":133,
          "STORE_NAME":"北京路仓库",
          "id":"repair.PartStock-1",
          "PART_MONEY":388,
          "PART_DERATE_MONEY":0,
          "PART_LAST_MONEY":388,
          "PART_NUM":1,
          "GET_PART_TIME":null,
          "REMARK":"",
          "IS_SELF":false,
          "COST_MONEY":0,
          "IS_SEL":true
        },
        searchSelectOption:[],
        searchSelectOption1:[],
        timeGruop:[
          {value:"上午",label:"上午"},
          {value:"下午",label:"下午"},
          {value:"5:00",label:"5:00"},
          {value:"5:30",label:"5:30"},
          {value:"6:00",label:"6:00"},
          {value:"6:30",label:"6:30"},
          {value:"7:00",label:"7:00"},
          {value:"7:30",label:"7:30"},
          {value:"8:00",label:"8:00"},
          {value:"8:30",label:"8:30"},
          {value:"9:00",label:"9:00"},
          {value:"9:30",label:"9:30"},
          {value:"10:00",label:"10:00"},
          {value:"10:30",label:"10:30"},
          {value:"11:00",label:"11:00"},
          {value:"11:30",label:"11:30"},
          {value:"12:00",label:"12:00"},
          {value:"12:30",label:"12:30"},
          {value:"13:00",label:"13:00"},
          {value:"13:30",label:"13:30"},
          {value:"14:00",label:"14:00"},
          {value:"14:30",label:"14:30"},
          {value:"15:00",label:"15:00"},
          {value:"15:30",label:"15:30"},
          {value:"16:00",label:"16:00"},
          {value:"16:30",label:"16:30"},
          {value:"17:00",label:"17:00"},
          {value:"17:30",label:"17:30"},
          {value:"18:00",label:"18:00"},
          {value:"18:30",label:"18:30"},
          {value:"19:00",label:"19:00"},
          {value:"19:30",label:"19:30"},
          {value:"20:00",label:"20:00"},
          {value:"20:30",label:"20:30"},
          {value:"21:00",label:"21:00"},
          {value:"21:30",label:"21:30"},
          {value:"22:00",label:"22:00"},
          {value:"22:30",label:"22:30"},
          {value:"23:00",label:"23:00"},
          {value:"23:30",label:"23:30"},
        ],
        ruleValidate: {

            ORDER_TIME: [
                { required: true, type: 'string', message: '请选择时间', trigger: 'change' }
            ]
        },
        titleMsg:'新建',
        isCar:false,
        isButton:true,
        listDisabled:false,
        orderDate:"",
        isOrderSuccess:true,//判断是否是预约状态---

      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        console.log('进来的参数：',this.detailData);
        this.showModal=true
        if(this.detailData){
          for(let key in this.listSearch){
            if(this.detailData[key]){
              this.listSearch[key]= this.detailData[key]
            }
          }
          console.log(this.listSearch);
          this.getItemFun(this.listSearch["ORDER_ID"]);
          this.getItemGroupFun(this.listSearch["ORDER_ID"]);
          this.getPartsFun(this.listSearch["ORDER_ID"]);

          if(this.detailData['STATUS']=='10421001'){
              this.titleMsg="新建";
              this.isCar=false;
              this.isButton=true;
              this.listDisabled=false;
              this.orderDate="";
              this.isOrderSuccess=true;

          }else if(this.detailData['STATUS']=='10421002'){
              this.titleMsg="已预约";
              this.isCar=true;
              this.isButton=false;
              this.listDisabled=true;
              this.orderDate="";
              this.isOrderSuccess=false;

          }else if(this.detailData['STATUS']=='10421003'){
              this.titleMsg="已接车";
              this.isCar=false;
              this.isButton=false;
              this.listDisabled=true;
              this.orderDate="";
          }else{
            console.log("不满足条件");
          }

        }else{
          for(let key in this.listSearch){
            switch (key){
              case 'MILEAGE':
              case 'REPAIR_ITEM_MONEY':
              case 'REPAIR_PART_MONEY':
              case 'REPAIR_ITEM_DERATE_MONEY':
              case 'REPAIR_PART_DERATE_MONEY':
              case 'SUM_MONEY': this.listSearch[key]= 0; break
              case 'STATUS': this.listSearch[key]= "10421001"; break
              case 'REPAIR_TYPE': this.listSearch[key]= "10191001"; break
              case 'ORDER_TYPE': this.listSearch[key]= "10411001"; break
              default : this.listSearch[key]= ''

            }
          }
          //新建功能表------
          this.titleMsg="新建";
          this.isCar=false;
          this.isButton=true;
          this.listDisabled=false;
          this.orderDate="";
          this.getItem=[];
          this.getItemGroup=[];
          this.getParts=[];
          this.isOrderSuccess=true;
          console.log(this.listSearch);
        }
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1019');
      this.searchSelectOption1= getDictGroup(this.$store.state.app.dict, '1041');
      console.log('谁先：',this.searchSelectOption);

    },
    methods:{
      test111(){
        this.showoff=Math.random();
      },
      visibleChange(status){
        if(status === false){
          this.$emit('closeDetail');
          this.handleReset("listSearch");
        }
      },
      handleSubmit (name) {
          // this.$refs[name].validate((valid) => {
          //     if (valid) {

                  console.log("保存数据----");
                  this.orderdate=this.listSearch["ORDER_DATE"];
                  this.listSearch["ORDER_DATE"]=formatDate(this.listSearch["ORDER_DATE"]);
                  this.tooltipObj.title = '系统提示!';
                  this.tooltipObj.description = '确定要保存吗？';
                  this.tooltipObj.mshow = Math.random();
                  this.tooltipObj.funName='saveData';
          //     } else {

          //     }
          // });

      },
      handleCommit(){
          this.tooltipObj.title = '系统提示!';
          this.tooltipObj.description = '确定要提交吗？';
          this.tooltipObj.mshow = Math.random();
          this.tooltipObj.funName='commitdata';


      },
      getNewDate(val,currentVal){
          console.log("val",val,currentVal);
          this.listSearch.ORDER_DATE=val;
      },
      getOnlyNumber(val){
        this.listSearch.TELPHONE=this.listSearch.TELPHONE.replace(/[^\d]/g,'');
      },
      saveData(){
          console.log("保存");
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/saveOrSubmit',
            method: 'post',
            data: {
              data: JSON.stringify(this.listSearch),
              items:JSON.stringify(this.getItem),
              itemGroups: JSON.stringify([]),
              parts: JSON.stringify(this.getParts),
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            console.log(11111)
            console.log(res)
            if (res.success === true) {
              for(let key in this.listSearch){
                if(res.data[key]){
                  this.listSearch[key]= res.data[key];
                }
              }
              this.listSearch["ORDER_DATE"]=this.orderdate;
              console.log("res",res);
              console.log("替换：",this.listSearch)
              this.$Message.info('successful')
            }
          })
      },
      commitdata(){
        console.log("提交");
          this.listSearch["ORDER_DATE"]=formatDate(this.listSearch["ORDER_DATE"]);
          this.listSearch["STATUS"]="10421002";
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/saveOrSubmit',
            method: 'post',
            data: {
              data: JSON.stringify(this.listSearch),
              items:JSON.stringify(this.getItem),
              itemGroups: JSON.stringify([]),
              parts: JSON.stringify(this.getParts),
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            console.log(11111)
            console.log(res)
            if (res.success === true) {
              this.$Message.info('successful')
              this.isCar=true;
              this.isButton=false;
              this.titleMsg="已预约";
              this.listDisabled=true;
            }
          })
      },
      handleReset (name) {
          this.$refs[name].resetFields();
      },
      //获取维修项目内容
      getItemFun(orderId){
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/getItems',
            method: 'post',
            data: {
              orderId: orderId,
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            if (res.success === true) {
              this.getItem=res.data;
              console.log("this.getitem-res",this.getItem);
              this.computedMoney();
            }
          })
      },
      //获取维修项目套餐内容
      getItemGroupFun(orderId){
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/getItemGroups',
            method: 'post',
            data: {
              orderId: orderId,
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            if (res.success === true) {
              this.getItemGroup=res.data;
            }
          })
      },
      //获取维修配件内容
      getPartsFun(orderId){
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/getParts',
            method: 'post',
            data: {
              orderId: orderId,
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            console.log(11111)
            console.log(res)
            if (res.success === true) {
              this.getParts=res.data;
              console.log(res.data[0]);
              this.listSearch["REPAIR_PART_MONEY"]=res.data[0]['PART_MONEY'];
              // console.log("ccccc",res.data,res.data['PART_MONEY']);
            }
          })
      },
      //计算费用加减
      computeOne(val){
        console.log(val,this.listSearch["REPAIR_ITEM_MONEY"],this.listSearch["REPAIR_PART_MONEY"],this.listSearch["REPAIR_ITEM_DERATE_MONEY"],this.listSearch["REPAIR_PART_DERATE_MONEY"]);
        this.listSearch["SUM_MONEY"]=parseInt(this.listSearch["REPAIR_ITEM_MONEY"])+parseInt(this.listSearch["REPAIR_PART_MONEY"])-parseInt(this.listSearch["REPAIR_ITEM_DERATE_MONEY"])-parseInt(this.listSearch["REPAIR_PART_DERATE_MONEY"]);
      },
      computeTwo(val){
        console.log(val);
        this.listSearch["SUM_MONEY"]=parseInt(this.listSearch["REPAIR_ITEM_MONEY"])+parseInt(this.listSearch["REPAIR_PART_MONEY"])-parseInt(this.listSearch["REPAIR_ITEM_DERATE_MONEY"])-parseInt(this.listSearch["REPAIR_PART_DERATE_MONEY"]);

      },
      //监听选择车辆----
      selectCar(val){
        this.listSearch["VEHICLE_MODEL"]=val["VEHICLE_MODEL"];
        this.listSearch["PLATE_NUM"]=val["PLATE_NUM"];

      },
      //选择维修项目按钮----------
      goOnTenanceItem(){
          this.showTenanceItems=Math.random();
          this.initGetItem=this.getItem;
      },
      //获取维修项目数据-------
      sTenanceItem(val){
        console.log("父级收到数据",val);
        this.getItem=val;

        var listItemsModel={
          "DETAIL_ID":'',
          "ITEM_ID":'',
          "TENANT_ID":'',
          "CREATE_TIME":"",
          "NAME":"",
          "ITEM_NO":"",
          "TYPE_ID":'',
          "STATUS":"",
          "CHARGE_TYPE":"",
          "REPAIR_TIME":0,
          "REPAIR_MONEY":0,
          "PAINT_NUM":0,
          "REMARK":"",
          "IS_PREINSTALL":"",
          "CLASS_NAME":"",
          "CLASS_TYPE":"",
          "ENGINE_TYPE_NAME":"",
          "ENGINE_TYPE":"",
          "SORT":'',
          "TYPE_NAME":"",
          "cartype":'',
          "BUSINESS_TYPE":"",
          "UPDATE_TIME":null,
          "id":"",
          "ITEM_MONEY":0,
          "ITEM_DERATE_MONEY":0,
          "ITEM_LAST_MONEY":0,
          "SUM_MONEY":0,
          "COME_DATE":null,
          "PLAN_END_DATE":null,
          "REPAIR_ITEM_MONEY":0,
          "REPAIR_PART_MONEY":0,
          "REPAIR_ITEM_DERATE_MONEY":0,
          "REPAIR_PART_DERATE_MONEY":0,
          "ACCOUNT_TIME":null,
          "ORDER_DATE":null,
          "IS_SEL":true
        }
        this.computedMoney();
      },

      //删除维修项目数据
      deleteTenanceItem(index){
        this.getItem.splice(index,1);
        this.computedMoney();
      },
      //同步金额计算
      computedMoney(){
          this.listSearch["REPAIR_ITEM_MONEY"]=0;
          this.listSearch["REPAIR_PART_MONEY"]=0;
          for(let i in this.getItem){
            this.listSearch["REPAIR_ITEM_MONEY"]+=(this.getItem[i].REPAIR_TIME*100+this.getItem[i].PAINT_NUM*1200);
          }
          for(let i in this.getParts){
            this.listSearch["REPAIR_PART_MONEY"]+=(this.getParts[i].SALES_PRICE*1);
          }
          this.computeOne();//计算金额
      },
      //获取选择配件数据
      selectPartsItem(val){
        console.log("选择配件数据",val);
        this.getParts=val;
        this.computedMoney();
      },
      //获取选择配件档案数据----
      selectPartsGroup(val){
        console.log("选择配件数据组",val);
        this.getParts=val;
        this.computedMoney();
      },
      //选择配件按钮------
      goOnSelectParts(){
          this.showSelectParts=Math.random();
          this.initParts=this.getParts;
      },
      //选择配件组按钮--------
      goOnSelectPartsGroup(){
          this.showSelectPartsGroup=Math.random();
          this.initPartsGroup=this.getParts;

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
    padding: 5px 10px;
    div{
      float:right;
    }
  }
</style>
