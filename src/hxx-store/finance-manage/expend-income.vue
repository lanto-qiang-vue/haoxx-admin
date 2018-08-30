<template>
  <Modal
    class=""
    v-model="showModal"
    title="维修记录"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">{{titleMsg}}</div>
    <Collapse v-model="collapse">
      <Panel name="1">详情
       <Form ref="listSearch"   slot="content" :label-width="120" inline class="detail-form">
                <FormItem label="车牌号码:" style="width:30%;">
                <Input type="text" v-model="base.PLATE_NUM" style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                <FormItem label="车型:" style="width:30%;">
                <Input type="text" v-model="base.VEHICLE_MODEL"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车架号:" style="width:30%;">
                <Input type="text" v-model="base.VIN_NO"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车主名称:" style="width:30%;">
                <Input type="text" v-model="base.CUSTOMER_NAME"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="送修人:" style="width:30%;">
                <Input type="text" v-model="base.GIVE_REPAIR_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="联系电话:" style="width:30%;">
                <Input type="text"  v-model="base.TELPHONE" style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="维修类型:" style="width:30%;">
                <Input type="text" v-model="base.REPAIR_TYPE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="送修里程:" style="width:30%;">
                <Input type="text" v-model="base.MILEAGE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="主修人:" style="width:30%;">
                <Input type="text" v-model="base.REPAIR_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车辆类型:" style="width:30%;">
                <Input type="text" v-model="base.VEHICLE_TYPE"   style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车辆分类代码:" style="width:30%;">
                <Input type="text"  v-model="base.VEHICLE_TYPE_CODE" style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="服务顾问:" style="width:30%;">
                <Input type="text" v-model="base.FOLLOW_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="进场日期:" style="width:30%;">
                <Input type="text" v-model="base.COME_DATE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="计划完工日期:" style="width:30%;">
                <Input type="text" v-model="base.PLAN_END_DATE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
       </Form>
       <Form ref="formInline"  slot="content" :label-width="120">
          <FormItem v-if="base.FAULT_DESC != ''" label="故障描述:">
              <Input type="textarea" v-model="base.FAULT_DESC"  placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem v-if="base.CUSTOMER_INFO != ''" label="客诉内容:">
              <Input type="textarea" v-model="base.CUSTOMER_INFO"  placeholder="请输入客诉内容"> </Input>
          </FormItem>
              <FormItem v-if="base.REPAIR_INFO !=''" label="客诉内容:">
              <Input type="textarea" v-model="base.REPAIR_INFO"  placeholder="请输入客诉内容"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    <div class="r-list-header">
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
        <div class="r-list-header">
          <h1>维修项目套餐</h1>
        </div>
        <Table
          class="main-table"
          ref="tablesMain"
          :columns="columns2"
          :data="combo"
          stripe
          border
        ></Table>
        <div class="r-list-search" v-if="isOrderSuccess">
              <Button @click="goOnItemGroup" type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目套餐</Button>
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
      :data="partsobj"
      stripe
      border
    ></Table>
    <div class="r-list-money">
      <p>
        维修项目费用：
        <span>{{listSearch.REPAIR_ITEM_MONEY}}元</span>
         + 维修配件费用：
         <span>{{listSearch.REPAIR_PART_MONEY}}元</span>
          + 维修项目优惠金额：
          <InputNumber @on-change="computedMoney" :disabled="listDisabled" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" :min="0">
          </InputNumber> - 配件优惠金额：
          <InputNumber @on-change="computedMoney1" :disabled="listDisabled" v-model="listSearch.REPAIR_PART_DERATE_MONEY" :min="0">
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

      <select-vehicle :showoff="showoff" @selectCar="selectCar">
      </select-vehicle>
      <select-items :showTenanceItems="showTenanceItems" @sTenanceItem="sTenanceItem" :initGetItem="initGetItem">
      </select-items>

      <select-parts :showSelectParts="showSelectParts" @selectPartsItem="selectPartsItem" :initParts="initParts">

      </select-parts>
      <select-partsGroup :showSelectPartsGroup="showSelectPartsGroup" @selectPartsGroup="selectPartsGroup" :initPartsGroup="initPartsGroup">

      </select-partsGroup>
      <select-itemPackage :showSelectItemGroup="showSelectItemGroup" @selectItemGroup="selectItemGroup" :initItemGroup="initItemGroup">

      </select-itemPackage>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'
  import selectVehicle from '@/hxx-components/select-vehicle.vue'
  import selectItems from '@/hxx-components/select-items.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import selectPartsGroup from '@/hxx-components/select-partsGroup.vue'

  import selectItemPackage from '@/hxx-components/select-itemPackage.vue'

  import ColumnInput from '@/hxx-components/column-input.vue'


	export default {
		name: "expend-income",
    components: {commonModal6,selectVehicle,selectItems,selectParts,selectPartsGroup,selectItemPackage},
    data(){
      return{
        showoff:null,//选择车辆
        showTenanceItems:null,//选择项目
        initGetItem:[],//初始化选择项目数据
        parts:'',
        partsobj:[],
        combo:[],
        commitParts:[],
        showSelectParts:null,//选择配件开关
        initParts:[],
        showSelectPartsGroup:null,
        initPartsGroup:[],

        showSelectItemGroup:null,//选择项目套餐--
        initItemGroup:[],
        base:'',
        tooltipObj:{
            mshow:false,
            funName:'saveData',
            description:'',
            title:'',
        },//弹出层数据
        showModal:true,//本界面是否显示判断
        testSingle:false,//判断是否启用维修项目套餐
        //维修项目
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
            render: (h, params) => h('span', (params.row.REPAIR_TIME*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+params.row.PAINT_NUM*getUserInfo(this.$store.state.user.userInfo.params, 'P1002')))
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
                    // this.getItem[params.index][params.column.key]= val
                    this.commitItem[params.index]['ITEM_DERATE_MONEY']=val;
                    this.commitItem[params.index]['ITEM_LAST_MONEY']=params.row.REPAIR_TIME*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+params.row.PAINT_NUM*getUserInfo(this.$store.state.user.userInfo.params, 'P1002')-val;
                    this.computItemMoney();
                  },
                }
              })

          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', (params.row.REPAIR_TIME*100+params.row.PAINT_NUM*1200-params.row.ITEM_DERATE_MONEY))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REMARK,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitItem[params.index]["REMARK"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '操作', key: '', sortable: true, minWidth: 150, fixed: 'right',
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
                                  this.deleteTenanceItem(params.index);
                              }
                          }
                      }, 'Delete')
                  ]);
                }else if(this.titleMsg=='已预约'){
                  return h('div', [
                      h('span', '已预约')
                  ]);
                }else if(this.titleMsg=='已接车'){
                  return h('div', [
                      h('span', '已接车')
                  ]);
                }
                
            }
          },
        ],
        getItem:[],
        //维修配件
        columns1: [
          {title: '序号',  minWidth: 60,type:'index',},
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 200,},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 150},
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
          },
          {title: '单价', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'PART_MONEY', sortable: true, minWidth: 150,},
          {title: '优惠金额', key: 'PART_DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'PART_LAST_MONEY', sortable: true, minWidth: 150,},
                    {title: '是否为托修方自配部件', key: 'IS_SELF', sortable: true, minWidth: 200,
             render: (h, params) => h('span', this.isSelf(params.row.IS_SELF))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150},
        ],
        getParts:[],
        getParts1:[],
        //维修项目套餐
        columns2: [
          {title: '序号',  minWidth: 80,type:'index',},
          {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 200,},
          {title: '套餐价格', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 150,
              render: (h, params) =>  h(ColumnInput, {
                    props: {
                      params: params,
                      type: 'number',
                      min: 0
                    },
                    on: {
                      'change': val => {
                        this.commitItemGroup[params.index]['ITEM_DERATE_MONEY']=val;
                        this.commitItemGroup[params.index]['ITEM_LAST_MONEY']=params.row.SALES_PRICE-val;
                        this.computItemMoney();
                      },
                    }
              })
            
            
          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SALES_PRICE-params.row.ITEM_DERATE_MONEY)
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REMARK,
                        },
                        
                        on: {
                            "on-blur":(e)=>{
                              this.commitItemGroup[params.index]["REMARK"]=e.target.value;
                              
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '操作', key: '', sortable: true, minWidth: 150,fixed: 'right',
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
                                  this.deleteItemGroup(params.index);
                              }
                          }
                      }, 'Delete')
                  ]);
                }else if(this.titleMsg=='已预约'){
                  return h('div', [
                      h('span', '已预约')
                  ]);
                }else if(this.titleMsg=='已接车'){
                  return h('div', [
                      h('span', '已接车')
                  ]);
                }
            }
          },
        ],
        getItemGroup:[],
        collapse: '1',
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
        titleMsg:'',
        isCar:false,
        isButton:true,
        listDisabled:false,
        orderDate:"",
        isOrderSuccess:true,//判断是否是预约状态---

        commitItemGroup:[],
        commitItem:[],//提交选择项目
        commitParts:[],//提交配件

        

      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        //tenant/repair/ttrepairworkorder/get_info
        this.showModal=true

        //清空公共数据值------
        this.getItem=[];
        this.getItemGroup=[];
        this.getParts=[];
        this.getParts1=[];
        this.commitItemGroup=[];
        this.commitItem=[];
        this.commitParts=[];
        this.testSingle=false;
        //判断进来的参数是否存在---------------------
        if(this.detailData){
          for(let key in this.listSearch){
            if(this.detailData[key]){
              this.listSearch[key]= this.detailData[key]
            }
          }

          this.getItemFun(this.listSearch["ORDER_ID"]);
          this.getItemGroupFun(this.listSearch["ORDER_ID"]);
          this.getPartsFun(this.listSearch["ORDER_ID"]);

          //判断维修项目套餐是否显示---------------------------
          if("10041002"==this.detailData['IS_ITEM_GROUP']){
            this.testSingle=false;
          }else if("10041001"==this.detailData['IS_ITEM_GROUP']){
            this.testSingle=true;
          }else{
            this.testSingle=false;
          }

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
              case 'IS_ITEM_GROUP': this.listSearch[key]= "10041002"; break
              default : this.listSearch[key]= ''

            }
          }
          //新建功能表------
          this.titleMsg="新建";
          this.isCar=false;
          this.isButton=true;
          this.listDisabled=false;
          this.orderDate="";
          this.isOrderSuccess=true;
          console.log(this.listSearch);
        }
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1019');
      this.searchSelectOption1= getDictGroup(this.$store.state.app.dict, '1041');
      // 获取详情头部
          this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/get_info',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 detail_id:101346
                }
        }).then(res => {
          if (res.success === true) {
          this.base = res.data;
              this.base.REPAIR_TYPE = getName(this.$store.state.app.dict,this.base.REPAIR_TYPE);
              this.base.VEHICLE_TYPE = getName(this.$store.state.app.dict,this.base.VEHICLE_TYPE);
              this.titleMsg = getName(this.$store.state.app.dict,this.base.STATUS);
          }
        })
     // 获取详情维修配件
     // tenant/repair/ttrepairworkorder/getParts
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getParts',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:101346
                }
        }).then(res => {
          if (res.success === true) {
              this.partsobj = res.data;
          }
        })
    //获取项目套餐
    // /tenant/repair/ttrepairworkorder/getItems
            this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getItems',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:101346
                }
        }).then(res => {
          if (res.success === true) {
              this.combo = res.data;
          }
        })

    },
    methods:{
      isSelf(type){
      if(type){
        return '是';
      }else{
        return '否';
      }
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
          console.log("保存this.getItemGroup",this.getItemGroup);
          //提交维修项目套餐
          this.axios.request({
            url: '/tenant/repair/ttrepairorder/saveOrSubmit',
            method: 'post',
            data: {
              data: JSON.stringify(this.listSearch),
              items:JSON.stringify(this.commitItem),
              itemGroups: JSON.stringify(this.commitItemGroup),
              parts: JSON.stringify(this.commitParts),
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            console.log(11111)
            console.log(res)
            if (res.success === true) {
              // for(let key in this.listSearch){
              //   if(res.data[key]){
              //     this.listSearch[key]= res.data[key];
              //   }
              // }
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
              items:JSON.stringify(this.commitItem),
              itemGroups: JSON.stringify(this.commitItemGroup),
              parts: JSON.stringify(this.commitParts),
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
              this.commitItem=res.data;

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
              this.commitItemGroup=res.data;
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
              this.commitParts=res.data;
              console.log(res.data[0]);
              this.listSearch["REPAIR_PART_MONEY"]=0;
              for(let i in res.data){
                this.listSearch["REPAIR_PART_MONEY"]+=res.data[i]['PART_MONEY'];
              }
              
            }
          })
      },
      
      //监听选择车辆----
      selectCar(val){
        console.log(val);
        this.listSearch["VEHICLE_MODEL"]=val["VEHICLE_MODEL"];
        this.listSearch["PLATE_NUM"]=val["PLATE_NUM"];
        this.listSearch["ORDER_PERSON"]=val["CUSTOMER_NAME"];
        this.listSearch["CUSTOMER_NAME"]=val["CUSTOMER_NAME"];
        this.listSearch["TELPHONE"]=val["MOBILE_PHONE"];
        this.listSearch["VIN_NO"]=val["VIN_NO"];
        this.listSearch["VEHICLE_ID"]=val["VEHICLE_ID"];
      },

      //选择维修项目按钮----------
      goOnTenanceItem(){
          this.showTenanceItems=Math.random();
          this.initGetItem=this.commitItem;
      },
      //获取维修项目数据-------
      sTenanceItem(val){
          console.log("父级收到数据",val);
          this.getItem=val;
          this.commitItem=[];
          for(let j in this.getItem){
            var listItemsModel={
              "DETAIL_ID":"",
              "ITEM_ID":"",
              "TENANT_ID":"",
              "CREATE_TIME":"",
              "NAME":"",
              "ITEM_NO":"",
              "TYPE_ID":"",
              "STATUS":"",
              "CHARGE_TYPE":"",
              "REPAIR_TIME":0,
              "REPAIR_MONEY":0,
              "PAINT_NUM":0,
              "IS_PREINSTALL":"",
              "CLASS_NAME":"",
              "CLASS_TYPE":"",
              "ENGINE_TYPE_NAME":"",
              "ENGINE_TYPE":"",
              "SORT":"",
              "TYPE_NAME":"",
              "cartype":"",
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
              "IS_SEL":true,
              "REMARK":""
            }
            for(let i in listItemsModel){
              if(this.getItem[j][i]){
                listItemsModel[i]=this.getItem[j][i];
              }else if(i=="ITEM_MONEY"){
                
                listItemsModel[i]=this.getItem[j]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+this.getItem[j]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
              }else if(i=="ITEM_LAST_MONEY"){
                listItemsModel[i]=parseInt(this.getItem[j]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001'))+parseInt(this.getItem[j]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002'));
              }
              
            }
            this.commitItem.push(listItemsModel);
          }
          this.computItemMoney();
      },
      //删除维修项目数据
      deleteTenanceItem(index){
        this.commitItem.splice(index,1);
        this.computItemMoney();
      },

      //获取选择配件数据
      selectPartsItem(val){
        console.log("选择配件数据",val);
        this.getParts=val;
        this.commitParts=[];
        for(let j in this.getParts){
          if(this.getParts[j]["STOCK_ID"]){
              var commitParts={
                  "STOCK_ID":"",
                  "TENANT_ID":"",
                  "CREATE_TIME":"",
                  "CREATER":"",
                  "UPDATE_TIME":"",
                  "UPDATER":"",
                  "PART_ID":"",
                  "STORE_ID":"",
                  "STOCK_NUM":"",
                  "UNIT_COST":"",
                  "LAST_IN_DATE":"",
                  "LAST_OUT_DATE":"",
                  "NAME":"",
                  "PART_NO":"",
                  "TYPE_ID":"",
                  "SALES_PRICE":0,
                  "UNIT":"",
                  "BRAND":"",
                  "FORMAT":"",
                  "FACTORY_NO":"",
                  "PURCHASE_PRICE":0,
                  "MIN_SALES_PRICE":"",
                  "MAX_SALES_PRICE":"",
                  "STORE_NAME":"",
                  "id":"",
                  "PART_MONEY":0,
                  "PART_DERATE_MONEY":0,
                  "PART_LAST_MONEY":0,
                  "PART_NUM":1,
                  "GET_PART_TIME":null,
                  "REMARK":"",
                  "IS_SELF":false,
                  "COST_MONEY":0,
                  "IS_SEL":true
              }
              for(let i in commitParts){
                if(this.getParts[j][i]){
                  commitParts[i]=this.getParts[j][i];
                }else if(i=="PART_MONEY"){
                  commitParts[i]=this.getParts[j]["SALES_PRICE"]*(this.getParts[j]["PART_NUM"]||1);
                }else if(i=="PART_LAST_MONEY"){
                  commitParts[i]=this.getParts[j]["SALES_PRICE"]*(this.getParts[j]["PART_NUM"]||1);
                }
              }
              this.commitParts.push(commitParts);
          }
          
        }
        for(let j in this.getParts1){
          if(this.getParts1[j]["STOCK_ID"]){

          }else{
              var commitParts={
                  "PART_ID":"",
                  "TENANT_ID":"",
                  "CREATE_TIME":"",
                  "CREATER":"",
                  "NAME":"",
                  "PART_NO":"",
                  "TYPE_ID":"",
                  "SALES_PRICE":0,
                  "UNIT":"",
                  "BRAND":"",
                  "FORMAT":"",
                  "FACTORY_NO":"",
                  "PART_SOURCE":"",
                  "IS_CANCEL":"",
                  "RATE":"",
                  "TAX":"",
                  "NOT_CONTAINS_TAX_SALE_PRICE":"",
                  "TYPE_NAME":"",
                  "FATHER_ID":"",
                  "GRAND_ID":"",
                  "UPDATE_TIME":null,
                  "id":"",
                  "STOCK_NUM":0,
                  "PART_MONEY":0,
                  "PART_DERATE_MONEY":0,
                  "PART_LAST_MONEY":0,
                  "PART_NUM":1,
                  "UNIT_COST":0,
                  "GET_PART_TIME":null,
                  "REMARK":"",
                  "IS_SELF":false,
                  "COST_MONEY":0,
                  "IS_SEL":true
              }
              for(let i in commitParts){
                if(this.getParts1[j][i]){
                  commitParts[i]=this.getParts1[j][i];
                }else if(i=="PART_MONEY"){
                  commitParts[i]=this.getParts1[j]["SALES_PRICE"]*(this.getParts1[j]["PART_NUM"]||1);
                }else if(i=="PART_LAST_MONEY"){
                  commitParts[i]=this.getParts1[j]["SALES_PRICE"]*(this.getParts1[j]["PART_NUM"]||1);
                }
              }
              this.commitParts.push(commitParts);
          }

        }
        this.computItemMoney();
      },
      //获取选择配件档案数据----
      selectPartsGroup(val){
        console.log("选择配件数据组",val);
        this.getParts1=val;
        this.commitParts=[];
        for(let j in this.getParts){
          if(this.getParts[j]["STOCK_ID"]){
              var commitParts={
                  "STOCK_ID":"",
                  "TENANT_ID":"",
                  "CREATE_TIME":"",
                  "CREATER":"",
                  "UPDATE_TIME":"",
                  "UPDATER":"",
                  "PART_ID":"",
                  "STORE_ID":"",
                  "STOCK_NUM":"",
                  "UNIT_COST":"",
                  "LAST_IN_DATE":"",
                  "LAST_OUT_DATE":"",
                  "NAME":"",
                  "PART_NO":"",
                  "TYPE_ID":"",
                  "SALES_PRICE":0,
                  "UNIT":"",
                  "BRAND":"",
                  "FORMAT":"",
                  "FACTORY_NO":"",
                  "PURCHASE_PRICE":0,
                  "MIN_SALES_PRICE":"",
                  "MAX_SALES_PRICE":"",
                  "STORE_NAME":"",
                  "id":"",
                  "PART_MONEY":0,
                  "PART_DERATE_MONEY":0,
                  "PART_LAST_MONEY":0,
                  "PART_NUM":1,
                  "GET_PART_TIME":null,
                  "REMARK":"",
                  "IS_SELF":false,
                  "COST_MONEY":0,
                  "IS_SEL":true
              }
              for(let i in commitParts){
                if(this.getParts[j][i]){
                  commitParts[i]=this.getParts[j][i];
                }else if(i=="PART_MONEY"){
                  commitParts[i]=this.getParts[j]["SALES_PRICE"]*(this.getParts[j]["PART_NUM"]||1);
                }else if(i=="PART_LAST_MONEY"){
                  commitParts[i]=this.getParts[j]["SALES_PRICE"]*(this.getParts[j]["PART_NUM"]||1);
                }
              }
              this.commitParts.push(commitParts);
          }
          
        }
        for(let j in this.getParts1){
          if(this.getParts1[j]["STOCK_ID"]){

          }else{
              var commitParts={
                  "PART_ID":"",
                  "TENANT_ID":"",
                  "CREATE_TIME":"",
                  "CREATER":"",
                  "NAME":"",
                  "PART_NO":"",
                  "TYPE_ID":"",
                  "SALES_PRICE":0,
                  "UNIT":"",
                  "BRAND":"",
                  "FORMAT":"",
                  "FACTORY_NO":"",
                  "PART_SOURCE":"",
                  "IS_CANCEL":"",
                  "RATE":"",
                  "TAX":"",
                  "NOT_CONTAINS_TAX_SALE_PRICE":"",
                  "TYPE_NAME":"",
                  "FATHER_ID":"",
                  "GRAND_ID":"",
                  "UPDATE_TIME":null,
                  "id":"",
                  "STOCK_NUM":0,
                  "PART_MONEY":0,
                  "PART_DERATE_MONEY":0,
                  "PART_LAST_MONEY":0,
                  "PART_NUM":1,
                  "UNIT_COST":0,
                  "GET_PART_TIME":null,
                  "REMARK":"",
                  "IS_SELF":false,
                  "COST_MONEY":0,
                  "IS_SEL":true
              }
              for(let i in commitParts){
                if(this.getParts1[j][i]){
                  commitParts[i]=this.getParts1[j][i];
                }else if(i=="PART_MONEY"){
                  commitParts[i]=this.getParts1[j]["SALES_PRICE"]*(this.getParts1[j]["PART_NUM"]||1);
                }else if(i=="PART_LAST_MONEY"){
                  commitParts[i]=this.getParts1[j]["SALES_PRICE"]*(this.getParts1[j]["PART_NUM"]||1);
                }
              }
              console.log(commitParts);
              this.commitParts.push(commitParts);
          }

        }
        this.computItemMoney();
      },
      //选择配件按钮------
      goOnSelectParts(){
          this.showSelectParts=Math.random();
          this.initParts=this.commitParts;
      },
      //选择配件组按钮--------
      goOnSelectPartsGroup(){
          this.showSelectPartsGroup=Math.random();
          this.initPartsGroup=this.commitParts;

      },
      //删除配件数据
      deletePartsGroup(index,STOCK_ID,PART_ID){
        this.commitParts.splice(index,1);
        if(STOCK_ID){
          for(let i in this.getParts){
            if(this.getParts[i]['STOCK_ID']==STOCK_ID){
              this.getParts.splice(i,1);
              break;
            }
          }
        }else{
          for(let i in this.getParts1){
            if(this.getParts1[i]['PART_ID']==PART_ID){
              this.getParts1.splice(i,1);
              break;
            }
          }
        }
        console.log(index,STOCK_ID,PART_ID);
        this.computItemMoney();
      },
      //选择项目套餐按钮-------
      goOnItemGroup(){
        this.showSelectItemGroup=Math.random();
        this.initItemGroup=this.commitItemGroup;
      },
      selectItemGroup(val){
        console.log("传过来的字段值：",val);
        this.getItemGroup=val;
        //提交维修项目套餐
          this.commitItemGroup=[];
          for(let j in this.getItemGroup){
            var commitItemGroup={
                "DETAIL_ID":"",
                "TENANT_ID":"",
                "CREATE_TIME":"",
                "UPDATE_TIME":"",
                "UPDATER":"",
                "CREATER":"",
                "ORDER_ID":"",
                "GROUP_ID":"",
                "SALES_PRICE":0,
                "ITEM_DERATE_MONEY":0,
                "ITEM_LAST_MONEY":0,
                "GROUP_NAME":"",
                "UPDATE_TIME":null,
                "id":"",
                "REPAIR_TIME":0,
                "REPAIR_MONEY":0,
                "ITEM_MONEY":0,
                "SUM_MONEY":0,
                "PAINT_NUM":0,
                "COME_DATE":null,
                "PLAN_END_DATE":null,
                "REPAIR_ITEM_MONEY":0,
                "REPAIR_PART_MONEY":0,
                "REPAIR_ITEM_DERATE_MONEY":0,
                "REPAIR_PART_DERATE_MONEY":0,
                "ACCOUNT_TIME":null,
                "ORDER_DATE":null,
                "REMARK":""
            }
            for(let i in commitItemGroup){
              if(this.getItemGroup[j][i]){
                commitItemGroup[i]=this.getItemGroup[j][i];
              }else if(i=="ITEM_LAST_MONEY"){
                commitItemGroup[i]=this.getItemGroup[j]["SALES_PRICE"];
              }
            }
            this.commitItemGroup.push(commitItemGroup);
          }

          //计算金额
          this.computItemMoney();
        
      },
      //计算维修项目类的金额-----------
      computItemMoney(){
        this.listSearch["REPAIR_ITEM_MONEY"]=0;
        this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=0;
        this.listSearch["SUM_MONEY"]=0;
        this.listSearch["REPAIR_PART_MONEY"]=0;
        this.listSearch["REPAIR_PART_DERATE_MONEY"]=0;
        for(let i in this.commitItem){
          this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItem[i]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+this.commitItem[i]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
          this.listSearch["REPAIR_ITEM_DERATE_MONEY"]+=this.commitItem[i]["ITEM_DERATE_MONEY"];
        }
        for(let i in this.commitItemGroup){
          this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItemGroup[i]["SALES_PRICE"];
          this.listSearch["REPAIR_ITEM_DERATE_MONEY"]+=this.commitItemGroup[i]["ITEM_DERATE_MONEY"];
        }
        for(let i in this.commitParts){
          this.listSearch["REPAIR_PART_MONEY"]+=this.commitParts[i]["SALES_PRICE"]*(this.commitParts[i]["PART_NUM"]||1);
          this.listSearch["REPAIR_PART_DERATE_MONEY"]+=this.commitParts[i]["PART_DERATE_MONEY"];
        }
        this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-this.listSearch["REPAIR_ITEM_DERATE_MONEY"]-this.listSearch["REPAIR_PART_DERATE_MONEY"];
      },
      //手动金额计算值---------------
      computedMoney(val){
        console.log('手动金额计算值',val);
        this.listSearch["REPAIR_ITEM_MONEY"]=0;
        this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=0;
        this.listSearch["SUM_MONEY"]=0;
        for(let i in this.commitItem){
          this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItem[i]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+this.commitItem[i]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
        }
        for(let i in this.commitItemGroup){
          this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItemGroup[i]["SALES_PRICE"];
        }
        this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=val;
        this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-val-this.listSearch["REPAIR_PART_DERATE_MONEY"];
      },
      computedMoney1(val){
        console.log('手动金额计算值',val);
        this.listSearch["SUM_MONEY"]=0;
        this.listSearch["REPAIR_PART_MONEY"]=0;
        this.listSearch["REPAIR_PART_DERATE_MONEY"]=0;
        for(let i in this.commitParts){
          this.listSearch["REPAIR_PART_MONEY"]+=this.commitParts[i]["SALES_PRICE"]*(this.commitParts[i]["PART_NUM"]||1);
        }
        this.listSearch["REPAIR_PART_DERATE_MONEY"]=val;
        this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-this.listSearch["REPAIR_ITEM_DERATE_MONEY"]-val;
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
    padding: 5px 10px;
    div{
      float:right;
    }
  }
</style>
