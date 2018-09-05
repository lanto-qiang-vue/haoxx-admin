<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    title="维修开单"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">{{titleMsg}}</div>
    <Collapse v-model="collapse">
      <Panel name="1">查询
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号码:" prop="PLATE_NUM">
              <Input @on-focus="showoff=Math.random();"	type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" style="min-width: 250px;" >
                  <Icon type="ios-search" slot="suffix"/>
              </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车架号:">
              <Input type="text" disabled v-model="listSearch.VIN_NO" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车主名称:">
              <Input type="text" disabled v-model="listSearch.CUSTOMER_NAME" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="送修人:">
              <Input type="text" v-model="listSearch.GIVE_REPAIR_PERSON" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系电话:">
              <Input type="text" v-model="listSearch.TELPHONE" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="维修类型:" >
              <Select v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in repairTypeArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="送修里程:" prop="MILEAGE">
              <InputNumber :min="1" v-model="listSearch.MILEAGE" style="min-width: 250px;" placeholder="最大不超过八位数"></InputNumber>
          </FormItem>
          <FormItem label="主修人:" >
              <Select v-model="listSearch.REPAIR_PERSON" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in repairPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="车辆类型:" >
              <Select v-model="listSearch.VEHICLE_TYPE" placeholder="" style="min-width: 250px;" @on-change="selectCarInitFun">
                <Option v-for="(item, index) in vehicleTypeArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="车辆分类代号:" >
              <Select v-model="listSearch.VEHICLE_TYPE_CODE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in vehicleNumberArr"
                  :key="item.code" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="服务顾问:" >
              <Select v-model="listSearch.FOLLOW_PERSON" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in serverPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="进厂日期:">
              <DatePicker v-model="listSearch.COME_DATE" type="datetime" placeholder="Select date and time" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="计划完工日期:">
              <DatePicker v-model="listSearch.PLAN_END_DATE" type="datetime" placeholder="Select date and time" style="width: 200px"></DatePicker>
          </FormItem>
          
       </Form>
       <Form ref="formInline"  slot="content" :label-width="80">
          <FormItem label="故障描述:">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
          <FormItem label="维修建议:">
              <Input type="textarea" v-model="listSearch.REPAIR_INFO" placeholder="请输入建议内容"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    <div class="r-list-chekbox">
      <div>
          <Checkbox v-model="testSingle" @on-change="isItemGroupFun">是否启用维修套餐</Checkbox>
      </div>
    </div>
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
    <div class="r-list-search" v-if="isOrderSuccess">
          <Button @click="goOnTenanceItem" type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目</Button>
    </div>
    <div v-if="testSingle">
        <div class="r-list-header">
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
      :data="commitParts"
      stripe
      border
    ></Table>
    <div class="r-list-choose-parts" v-if="isOrderSuccess" >
          <Button @click="goOnSelectPartsGroup" type="primary" shape="circle" ><Icon type="md-add" size="24"/>选择配件</Button>
    </div>
    <div class="r-list-header">
      <h1>其他费用</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns3"
      :data="commitOtherItem"
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
          <InputNumber @on-change="computedMoney" :disabled="!isOrderSuccess" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" :min="0">
          </InputNumber> - 配件优惠金额：
          <InputNumber @on-change="computedMoney1" :disabled="!isOrderSuccess" v-model="listSearch.REPAIR_PART_DERATE_MONEY" :min="0">
          </InputNumber>= 合计应收金额：
          <span class="r-list-money-reset">{{listSearch.SUM_MONEY}}元</span>
      </p>
    </div>
      <!--底部按钮组-->
      <div slot="footer" style="text-align: center; font-size: 18px;">
          <Button :disabled="buttonStateArr.save" @click="handleSubmit('listSearch')" size="large" type="primary"  style="margin-right: 10px; padding: 0 10px;"><Icon type="md-checkmark" size="24"/>保存</Button>
          <Button :disabled="buttonStateArr.dopay" @click="handleCommit" type="primary"  style="margin-right: 10px; padding: 0 10px;">派工</Button>
          <Button :disabled="buttonStateArr.finish" @click="handleFinish" type="primary"  style="margin-right: 10px; padding: 0 10px;">完工</Button>
          <Button :disabled="buttonStateArr.doaccount" @click="testtt" type="primary"  style="margin-right: 10px; padding: 0 10px;">结算</Button>
          <Button :disabled="buttonStateArr.shoukuan" type="primary"  style="margin-right: 10px; padding: 0 10px;">收款</Button>
          <Button :disabled="buttonStateArr.printWts" type="primary"  style="margin-right: 10px; padding: 0 10px;">打印委托书</Button>
          <Button :disabled="buttonStateArr.printPgd" type="primary"  style="margin-right: 10px; padding: 0 10px;">打印派工单</Button>
          <Button :disabled="buttonStateArr.printAccount" type="primary"  style="margin-right: 10px; padding: 0 10px;">打印结算单</Button>
      </div>
      <!--提示框-->
      <common-modal6 :description="tooltipObj.description" :title="tooltipObj.title" :modal6="tooltipObj.mshow" :fun="tooltipObj.funName" @saveData="saveData" @commitdata="commitdata">
      </common-modal6>
      <!--选择车型-->
      <select-vehicle :showoff="showoff" @selectCar="selectCar">
      </select-vehicle>
      <!--选择项目-->
      <select-itemsType :showTenanceItems="showTenanceItems" @sTenanceItem="sTenanceItem" :initGetItem="initGetItem">
      </select-itemsType>
      <!--选择配件-->
      <select-parts :showSelectParts="showSelectParts" @selectPartsItem="selectPartsItem" :initParts="initParts">
      </select-parts>
      <!--选择配件组-->
      <select-partsGroup :showSelectPartsGroup="showSelectPartsGroup" @selectPartsGroup="selectPartsGroup" :initPartsGroup="initPartsGroup">
      </select-partsGroup>
      <!--选择项目组-->
      <select-itemPackage :showSelectItemGroup="showSelectItemGroup" @selectItemGroup="selectItemGroup" :initItemGroup="initItemGroup">
      </select-itemPackage>
      <!--选择工单结算单-->
      <select-accountOrder :showSelectAccount="showSelectAccount" :showAccountData="listSearch" :showAccountItem="commitItem" :showAccountParts="commitParts" :showAccountOther="commitOtherItem">
      </select-accountOrder>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'
  import selectVehicle from '@/hxx-components/select-vehicle.vue'
  import selectItemsType from '@/hxx-components/select-itemsType.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import selectPartsGroup from '@/hxx-components/select-partsGroup.vue'

  import selectItemPackage from '@/hxx-components/select-itemPackage.vue'
  import selectAccountOrder from '@/hxx-components/select-accountOrder.vue'

  import ColumnInput from '@/hxx-components/column-input.vue'


	export default {
	name: "repairOrder-list-detail",
    components: {commonModal6,selectVehicle,selectItemsType,selectParts,selectPartsGroup,selectItemPackage,selectAccountOrder},
    data(){
      return{
        showSelectAccount:null,//选择工单结算单
        showoff:null,//选择车辆
        showTenanceItems:null,//选择项目
        initGetItem:[],//初始化选择项目数据

        showSelectParts:null,//选择配件开关
        initParts:[],
        showSelectPartsGroup:null,
        initPartsGroup:[],

        showSelectItemGroup:null,//选择项目套餐--
        initItemGroup:[],
        tooltipObj:{
            mshow:false,
            funName:'saveData',
            description:'',
            title:'',
        },//弹出层数据
        showModal: false,//本界面是否显示判断
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
          {title: '车间班组', key: 'WORK_CLASS_ID', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('Select', {
                    props:{
                        value: this.commitItem[params.index]["WORK_CLASS_ID"],
                    },
                    on: {
                        'on-change':(value) => {
                            
                            this.commitItem[params.index]["WORK_CLASS_ID"]=value;
                            for(let i in this.vehicleTeamArr){
                              if(this.vehicleTeamArr[i].itemId==value){
                                this.commitItem[params.index]["WORK_CLASS_NAME"]=this.vehicleTeamArr[i].code;
                                break;
                              }
                            }
                            
                        }
                    },
                },
                this.vehicleTeamArr.map(function(type){
                    return h('Option', {
                        props: {
                            value: type.itemId,
                        }
                    }, type.code);
                })
              );
            },

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
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 150,
            render: (h, params) =>  h(ColumnInput, {
                props: {
                  params: params,
                  type: 'number',
                  min: 0
                },
                on: {
                  'change': val => {
                    this.commitParts[params.index]['PART_NUM']=val;
                    this.commitParts[params.index]['PART_MONEY']=params.row.SALES_PRICE*val;
                    this.commitParts[params.index]['PART_LAST_MONEY']=params.row.SALES_PRICE*val-params.row.PART_DERATE_MONEY;
                    this.computItemMoney();
                  },
                }
              })
          },
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
          },
          {title: '单价', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'PART_MONEY', sortable: true, minWidth: 150,},
          {title: '优惠金额', key: 'PART_DERATE_MONEY', sortable: true, minWidth: 150,
            render: (h, params) =>  h(ColumnInput, {
                props: {
                  params: params,
                  type: 'number',
                  min: 0
                },
                on: {
                  'change': val => {
                    this.commitParts[params.index]['PART_DERATE_MONEY']=val;
                    this.commitParts[params.index]['PART_LAST_MONEY']=params.row.SALES_PRICE*params.row.PART_NUM-val;
                    this.computItemMoney();
                  },
                }
              })
          },
          {title: '优惠后金额', key: 'PART_LAST_MONEY', sortable: true, minWidth: 150,},
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
                            
                              this.commitParts[params.index]['REMARK']=e.target.value;
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
                                  this.deletePartsGroup(params.index,params.row.STOCK_ID,params.row.PART_ID);
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
        getParts:[],
        getParts1:[],
        //维修项目套餐
        columns2: [
          {title: '序号',  minWidth: 60,type:'index',},
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
          {title: '车间班组', key: 'WORK_CLASS_ID', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('Select', {
                    props:{
                        value: this.commitItemGroup[params.index]["WORK_CLASS_ID"],
                    },
                    on: {
                        'on-change':(value) => {
                            
                            this.commitItemGroup[params.index]["WORK_CLASS_ID"]=value;
                            for(let i in this.vehicleTeamArr){
                              if(this.vehicleTeamArr[i].itemId==value){
                                this.commitItemGroup[params.index]["WORK_CLASS_NAME"]=this.vehicleTeamArr[i].code;
                                break;
                              }
                            }
                            
                        }
                    },
                },
                this.vehicleTeamArr.map(function(type){
                    return h('Option', {
                        props: {
                            value: type.itemId,
                        }
                    }, type.code);
                })
              );
            },

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
        //其他费用参数
        columns3:[
          {title: '项目名称', key: 'REPAIR_ITEM1', sortable: true, minWidth: 200,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_ITEM1,
                        },
                        on: {
                            "on-blur":(e)=>{
                               console.log(e.target.value,this.commitOtherItem);
                              this.commitOtherItem[params.index]["REPAIR_ITEM1"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '金额(元)', key: 'REPAIR_MONEY1', sortable: true, minWidth: 150,
           render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_MONEY1,
                        },
                        on: {
                            "on-blur":(e)=>{
                              console.log(e.target.value,this.commitOtherItem);

                              this.commitOtherItem[params.index]["REPAIR_MONEY1"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '项目名称', key: 'REPAIR_ITEM2', sortable: true, minWidth: 200,
           render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_ITEM2,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitOtherItem[params.index]["REPAIR_ITEM2"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '金额(元)', key: 'REPAIR_MONEY2', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_MONEY2,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitOtherItem[params.index]["REPAIR_MONEY2"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '项目名称', key: 'REPAIR_ITEM3', sortable: true, minWidth: 200,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_ITEM3,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitOtherItem[params.index]["REPAIR_ITEM3"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '金额(元)', key: 'REPAIR_MONEY3', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_MONEY3,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitOtherItem[params.index]["REPAIR_MONEY3"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '项目名称', key: 'REPAIR_ITEM4', sortable: true, minWidth: 200,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_ITEM4,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitOtherItem[params.index]["REPAIR_ITEM4"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
          {title: '金额(元)', key: 'REPAIR_MONEY4', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REPAIR_MONEY4,
                        },
                        on: {
                            "on-blur":(e)=>{
                              this.commitOtherItem[params.index]["REPAIR_MONEY4"]=e.target.value;
                            }
                        }
                    },
                    )
                ]);
            }
          },
        ],

        collapse: '1',
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
            PLATE_NUM: [
                { required: true, type: 'string', message: '请选择车型', trigger: 'change' }
            ],
            MILEAGE: [
                { required: true, type: 'number', message: '请选择里程', trigger: 'change' ,min: 1,}
            ]
        },
        titleMsg:'新建未派工',
        orderDate:"",
        isOrderSuccess:true,//判断是否是派工状态状态---

        commitItemGroup:[],//提交项目组
        commitItem:[],//提交选择项目
        commitParts:[],//提交配件
        commitOtherItem:[
          {
            "REPAIR_ITEM1":"",
            "REPAIR_MONEY1":"",
            "REPAIR_ITEM2":"",
            "REPAIR_MONEY2":"",
            "REPAIR_ITEM3":"",
            "REPAIR_MONEY3":"",
            "REPAIR_ITEM4":"",
            "REPAIR_MONEY4":"",
            "CREATE_TIME":null,
            "UPDATE_TIME":null,
            "id":"repair.OtherGrid-1"
          },
        ],//提交其他参数数据值-------
        
        repairTypeArr:[],//维修类型数组
        repairPersonArr:[],//主修人数组
        serverPersonArr:[],//服务顾问数组
        vehicleTypeArr:[],//车辆类型数组
        vehicleNumberArr:[],//车辆代号数组
        vehicleNumberArr1:[
            { code: '轿车-排量<1.6升-A', type: '10521001' },
            { code: '轿车-1.6升≤排量≤1.8升-B', type: '10521001' },
            { code: '轿车-1.8升<排量≤2.3升-C', type: '10521001' },
            { code: '轿车-2.3升<排量≤3升-D', type: '10521001' },
            { code: '轿车-3升<排量≤4升-E', type: '10521001' },
            { code: '客车-车总长≤4米（座位≤7座）-I', type: '10521002' },
            { code: '客车-4米<车总长≤5米（8座≤座位≤19座）-J', type: '10521002' },
            { code: '客车-5米<车总长≤7米（20座≤座位≤32座）-K', type: '10521002' },
            { code: '客车-7米<车总长≤10米（33座≤座位≤44座）-L', type: '10521002' },
            { code: '客车-10米<车总长（45座≤座位）-M', type: '10521002' },
            { code: '货车-载质量≤0.75吨-P', type: '10521003' },
            { code: '货车-汽油(0.75吨<载质量≤3.50吨)-Q', type: '10521003' },
            { code: '货车-柴油(0.75吨<载质量≤3.50吨)-R', type: '10521003' },
            { code: '货车-汽油(0.75吨<载质量≤3.50吨)-S', type: '10521003' },
            { code: '货车-柴油(0.75吨<载质量≤3.50吨)-T', type: '10521003' },
            { code: '货车-载质量≥8吨-U', type: '10521003' }
        ],//未筛选
        vehicleTeamArr:[],//机车班组数组-------
        buttonStateArr:{
          save:false,//保存
          dopay:false,//派工
          finish:true,//完工
          doaccount:true,//结算
          shoukuan:true,//收款
          printWts:true,//打印委托书
          printPgd:true,//打印派工单
          printAccount:true,//打印结算单
        },//按钮状态组数据
        // returnData:null,//返回数据结果---公共的---

      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        console.log('进来的参数：',this.detailData,);
        this.showModal=true
        //--------------------
        
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
          //初始化车辆数据----------------
          this.selectCarInitFun(this.detailData.VEHICLE_TYPE,this.VEHICLE_TYPE_CODE);

          for(let key in this.listSearch){
            if(this.detailData[key]){
              this.listSearch[key]= this.detailData[key]
            }
          }
          //获取项目组数据---------------
          this.getItemFun(this.listSearch["REPAIR_ID"]);
          this.getItemGroupFun(this.listSearch["REPAIR_ID"]);
          this.getPartsFun(this.listSearch["REPAIR_ID"]);
          this.getOtherFun(this.listSearch["REPAIR_ID"]);

          //判断维修项目套餐是否显示---------------------------
          if("10041002"==this.detailData['IS_ITEM_GROUP']){
            this.testSingle=false;
          }else if("10041001"==this.detailData['IS_ITEM_GROUP']){
            this.testSingle=true;
          }else{
            this.testSingle=false;
          }

          if(this.detailData['STATUS']=='10201001'){
              this.titleMsg="新建未派工";

              this.orderDate="";
              this.isOrderSuccess=true;

              for(let i in this.buttonStateArr){
                switch(i){
                  case 'save':
                  case 'dopay': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }

          }else if(this.detailData['STATUS']=='10201002'){
              this.titleMsg="已派工维修中";

              this.orderDate="";
              this.isOrderSuccess=false;

              for(let i in this.buttonStateArr){
                switch(i){
                  case 'finish':
                  case 'printWts':
                  case 'printPgd': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }

          }else if(this.detailData['STATUS']=='10201003'){
              this.titleMsg="已完工待结算";

              this.orderDate="";
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'doaccount':
                  case 'printWts':
                  case 'printPgd': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }
          }else if(this.detailData['STATUS']=='10201004'){
              this.titleMsg="已结算待收款";

              this.orderDate="";
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'shoukuan':
                  case 'printAccount':
                  case 'printWts':
                  case 'printPgd': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }
          }else if(this.detailData['STATUS']=='10201005'){
              this.titleMsg="已结清";

              this.orderDate="";
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'printAccount':
                  case 'printWts':
                  case 'printPgd': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }
          }

        }else{
          for(let key in this.listSearchInit){
            this.listSearch[key]=this.listSearchInit[key];
          }
          //初始化按钮状态-----------
          for(let i in this.buttonStateArr){
            switch(i){
              case 'save':
              case 'dopay': this.buttonStateArr[i]= false; break
              default : this.buttonStateArr[i]= true;
            }
          }
          this.vehicleNumberArr=[
            { code: '轿车-排量<1.6升-A', type: '10521001' },
            { code: '轿车-1.6升≤排量≤1.8升-B', type: '10521001' },
            { code: '轿车-1.8升<排量≤2.3升-C', type: '10521001' },
            { code: '轿车-2.3升<排量≤3升-D', type: '10521001' },
            { code: '轿车-3升<排量≤4升-E', type: '10521001' },
          ];
          
          //新建功能表------
          this.titleMsg="新建未派工";

          this.orderDate="";
          this.isOrderSuccess=true;
          console.log(this.listSearch);
        }

        this.getShopClassList();
        this.getEmployeeList(this.detailData);
      }
    },
    mounted () {
      this.repairTypeArr= getDictGroup(this.$store.state.app.dict, '1019');
      this.vehicleTypeArr= getDictGroup(this.$store.state.app.dict, '1052');

    },
    methods:{
        //得到机修班组数据
        getShopClassList(){
            this.vehicleTeamArr=[];
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getShopClassList',
                method: 'post',
                data: {
                    node: 0,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    for(let i in res.data){
                        var obj={code:'',itemId:''};
                        obj.code=res.data[i].text;
                        obj.itemId=res.data[i].itemId;
                        this.vehicleTeamArr.push(obj);
                    }
                    console.log("this.vehicleTeamArr",this.vehicleTeamArr);
                }
            })
        },
        //得到主修人数据
        getEmployeeList(val){
            this.repairPersonArr=[];
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
                        this.repairPersonArr.push(obj);
                        this.serverPersonArr.push(obj);
                    }
                    //初始化主修人数据
                    if(!val){
                      this.listSearch.FOLLOW_PERSON=this.repairPersonArr[0].code;
                      this.listSearch.REPAIR_PERSON=this.serverPersonArr[0].code;
                    }
                    console.log("this.vehicleTeamArr",this.serverPersonArr,this.repairPersonArr);
                }
            })
        },
        //选择车辆类型初始化
        selectCarInitFun(val,key){
            this.listSearch.VEHICLE_TYPE_CODE=key||"";
            this.vehicleNumberArr=[];
            // this.listSearch.VEHICLE_TYPE_CODE="";
            for(let i in this.vehicleNumberArr1){
                if(this.vehicleNumberArr1[i].type==val){
                    this.vehicleNumberArr.push(this.vehicleNumberArr1[i]);
                }
            }

        },
        
        visibleChange(status){
          if(status === false){
            this.$emit('closeDetail');
            this.handleReset("listSearch");
          }
        },
        //保存按钮-----------
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                      this.$Modal.confirm({
                          title:"系统提示!",
                          content:"确定要保存吗？",
                          onOk:this.saveData,
                          
                      })
                } else {

                }
            });
        },
        saveData(){
            //提交维修项目套餐
            this.axios.request({
              url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
              
              method: 'post',
              data: {
                data: JSON.stringify(this.listSearch),
                items:JSON.stringify(this.commitItem),
                itemGroups: JSON.stringify(this.commitItemGroup),
                parts: JSON.stringify(this.commitParts),
                otherItems: JSON.stringify(this.commitOtherItem),
                access_token: this.$store.state.user.token
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.info('successful');
                this.listSearch["REPAIR_ID"]=res.data.REPAIR_ID;
                this.listSearch["REPAIR_NO"]=res.data.REPAIR_NO;

              }
            })
        },
        //派工按钮----------------
        handleCommit(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要派工吗？",
                onOk:this.commitdata,
                
            })

        },
        commitdata(){
            this.listSearch["STATUS"]="10201002";
          //提交维修项目套餐
            this.axios.request({
              url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
              method: 'post',
              data: {
                data: JSON.stringify(this.listSearch),
                items:JSON.stringify(this.commitItem),
                itemGroups: JSON.stringify(this.commitItemGroup),
                parts: JSON.stringify(this.commitParts),
                otherItems: JSON.stringify(this.commitOtherItem),
                access_token: this.$store.state.user.token
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.info('successful');
                this.titleMsg="已派工维修中";

                this.orderDate="";
                this.isOrderSuccess=false;

                for(let i in this.buttonStateArr){
                  switch(i){
                    case 'finish':
                    case 'printWts':
                    case 'printPgd': this.buttonStateArr[i]= false; break
                    default : this.buttonStateArr[i]= true;
                  }
                }
              }
            })
        },
        //完工按钮-------------------
        handleFinish(){
          this.$Modal.confirm({
              title:"系统提示!",
              content:"确定要完工吗？",
              onOk:this.saveFinish,
              
          })
        },
        saveFinish(){
          //提交维修项目套餐
            this.axios.request({
              url: '/tenant/repair/ttrepairworkorder/saveFinish',
              method: 'post',
              data: {
                repairId: this.listSearch.REPAIR_ID,
                access_token: this.$store.state.user.token
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.info('successful');
                this.titleMsg="已完工待结算";

                this.orderDate="";
                for(let i in this.buttonStateArr){
                  switch(i){
                    case 'doaccount':
                    case 'printWts':
                    case 'printPgd': this.buttonStateArr[i]= false; break
                    default : this.buttonStateArr[i]= true;
                  }
                }
              }
            })
        },

      getNewDate(val,currentVal){
          console.log("val",val,currentVal);
          this.listSearch.ORDER_DATE=val;
      },
      getOnlyNumber(val){
        this.listSearch.TELPHONE=this.listSearch.TELPHONE.replace(/[^\d]/g,'');
      },
      //保存数据----------------
      
      
      handleReset (name) {
          this.$refs[name].resetFields();
      },
      //获取维修项目内容
      getItemFun(repairId){
          this.axios.request({
            url: '/tenant/repair/ttrepairworkorder/getItems',
            method: 'post',
            data: {
              repairId: repairId,
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
      //获取其他数据内容
      getOtherFun(repairId){
        this.axios.request({
            url: '/tenant/repair/ttrepairworkorder/getOtherItems',
            method: 'post',
            data: {
              repairId: repairId,
              page: 1,
              start: 0,
              limit: 25,
              access_token: this.$store.state.user.token
            }
          }).then(res => {
            console.log(11111)
            console.log(res)
            if (res.success === true) {
              this.commitOtherItem=res.data;
              
              
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
        this.listSearch["GIVE_REPAIR_PERSON"]=val["CUSTOMER_NAME"];
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
              "REMARK":"",
              "WORK_CLASS_ID":'',
              "WORK_CLASS_NAME":"",
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
                  "IS_SEL":true,//新加的字段
                  "UPDATER":"",
                  "PURCHASE_PRICE":"",
                  "THREE_EXPIRATION_DATE":"",
                  "EXPIRATION_DATE":'',
                  "STATUS":"",
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

        for(let j in this.getParts1){
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
                  "IS_SEL":true,//新加的字段
                  "UPDATER":"",
                  "PURCHASE_PRICE":"",
                  "THREE_EXPIRATION_DATE":"",
                  "EXPIRATION_DATE":'',
                  "STATUS":"",
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
                "REMARK":"",//地下新加的
                "GROUP_NO":"",
                "GROUP_INFO":"",
                "STATUS":"",
                "IS_PREINSTALL":"",
                "IS_SEL":true,
                "WORK_CLASS_ID":'',
                "WORK_CLASS_NAME":"",

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
      
      //删除维修项目组数据
      deleteItemGroup(index){
        this.commitItemGroup.splice(index,1);
        this.computItemMoney();
      },
      //是否选择项目套餐
      isItemGroupFun(val){
        if(val){
          this.listSearch['IS_ITEM_GROUP']="10041001";
        }else{
          this.listSearch['IS_ITEM_GROUP']="10041002";
        }
        
      },
      testtt(){
        this.showSelectAccount=Math.random();
        console.log('结算之前',this.listSearch);
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
