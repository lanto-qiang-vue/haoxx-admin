<!--预约单管理详情 2018 09 05-->
<template>
  <Modal
    v-model="showModal"
    title="维修服务预约"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :mask-closable="false"
    :transition-names="['', '']"
  >
    <div style="height: 100%;overflow: auto;">
      <div class="titleMsg">{{titleMsg}}</div>
      <Collapse v-model="collapse">
        <Panel name="1">基本信息
        <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="120" class="common-form">
            <FormItem label="车牌号码:">
                <Input @on-focus="showoff=Math.random();"	type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" :disabled="listDisabled">
                    <Icon type="ios-search" slot="suffix" @click="showoff=Math.random();" style="cursor:pointer;"/>
                </Input>
            </FormItem>
            <FormItem label="车型:">
                <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型"> </Input>
            </FormItem>
            <FormItem label="预约维修类型:">
                <Select v-model="listSearch.REPAIR_TYPE" placeholder="">
                  <Option v-for="(item, index) in searchSelectOption"
                    :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="预约日期:" prop="ORDER_DATE">
                <DatePicker format="yyyy-MM-dd" v-model="listSearch.ORDER_DATE" type="date" placeholder="请选择..." :options="options"></DatePicker>

            </FormItem>
            <FormItem label="预约时间:" prop="ORDER_TIME">
                <TimePicker format="HH:mm" placeholder="请选择..." v-model="listSearch.ORDER_TIME"></TimePicker>
            </FormItem>
            <FormItem label="预约类型:">
                <Select v-model="listSearch.ORDER_TYPE" placeholder="">
                  <Option v-for="(item, index) in searchSelectOption1"
                    :key="index" :value="item.code">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="预约人:">
                <Input type="text" v-model="listSearch.ORDER_PERSON" placeholder=""> </Input>
            </FormItem>
            <FormItem label="联系电话:" prop="TELPHONE">
                <Input type="text"   v-model="listSearch.TELPHONE" > </Input>
            </FormItem>
            <FormItem label="当前里程:" prop="MILEAGE">
                <InputNumber :min="0" v-model="listSearch.MILEAGE" placeholder="最大不超过八位数"></InputNumber>
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
        :disabled-hover="true"
        stripe
        border
      ></Table>
      <div class="r-list-search" v-if="isOrderSuccess">
            <Button @click="goOnTenanceItem" type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目</Button>
            <!--<Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入维修项目</Button>-->
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
            @on-row-dblclick="onRowDblclick"
            stripe
            border
          ></Table>
          <div class="r-list-search" v-if="isOrderSuccess">
                <Button @click="goOnItemGroup" type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择项目套餐</Button>
                <!--<Button type="primary" shape="circle"><Icon type="md-add" size="24"/>进入项目套餐</Button>-->
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
        :disabled-hover="true"
        stripe
        border
      ></Table>
      <div class="r-list-choose-parts" v-if="isOrderSuccess" >
            <!--<Button @click="goOnSelectParts " type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择配件</Button>-->
            <Button @click="goOnSelectPartsGroup" type="primary" shape="circle" ><Icon type="md-add" size="24"/>选择配件</Button>
      </div>

      <div class="r-list-money">
        <p>
          维修项目费用：
          <span>{{listSearch.REPAIR_ITEM_MONEY}}元</span>
          + 维修配件费用：
          <span>{{listSearch.REPAIR_PART_MONEY}}元</span>
            - 维修项目优惠金额：
            <span>{{listSearch.REPAIR_ITEM_DERATE_MONEY}}元</span>
            - 配件优惠金额：
            <span>{{listSearch.REPAIR_PART_DERATE_MONEY}}元</span>
            = 合计应收金额：
            <span class="r-list-money-reset">{{listSearch.SUM_MONEY}}元</span>
        </p>
      </div>
    </div>
    

    

      <!--选择车型-->
      <select-vehicle :showoff="showoff" @selectCar="selectCar" :showTransfer='selectCarTransfer' class="table-modal-detail">
      </select-vehicle>
      <!--选择项目-->
      <select-itemsType :showTenanceItems="showTenanceItems" @sTenanceItem="sTenanceItem" :initGetItem="initGetItem" class="table-modal-detail" :showTransfer='selectItemransfer'>
      </select-itemsType>
      <!--选择配件-->
      <select-parts :showSelectParts="showSelectParts" @selectPartsItem="selectPartsItem" :initParts="commitParts" class="table-modal-detail" :stockFlag=true :transferFlag=true>
      </select-parts>
      <!--选择配件组-->
      <select-partsGroup :showSelectPartsGroup="showSelectPartsGroup" @selectPartsGroup="selectPartsGroup" :initPartsGroup="initPartsGroup" class="table-modal-detail" :transferFlag=true>
      </select-partsGroup>
      <!--选择项目组-->
      <select-itemPackage :showSelectItemGroup="showSelectItemGroup" @selectItemGroup="selectItemGroup" :initItemGroup="initItemGroup" class="table-modal-detail" :showTransfer='selectItemransfer1'>
      </select-itemPackage>
      <!--项目组套餐详情!!!-->
      <combo-detail :tshow="showItemFlag" :tid="itemDetailId"></combo-detail>

      <div slot="footer">
        <Button v-if="isButton" @click="handleSubmit('listSearch')" size="large" type="primary"  style="margin-right: 10px;">保存</Button>
        <Button v-if="isButton" @click="handleCommit('listSearch')" size="large" type="success"  style="margin-right: 10px;">提交</Button>
        <Button v-if="isCar" @click="handleCar" size="large" type="success" style="margin-right: 10px;" >维修接车</Button>
        <Button  size="large" type="default" style="margin-right: 10px;" @click="showModal=false;">返回</Button>
      </div>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'

  import selectVehicle from '@/hxx-components/select-vehicle.vue'
  import selectItemsType from '@/hxx-components/select-itemsType.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import selectPartsGroup from '@/hxx-components/select-partsGroup.vue'
    import comboDetail from '@/hxx-components/combo-detail.vue'

  import selectItemPackage from '@/hxx-components/select-itemPackage.vue'



	export default {
		name: "reservation-list-detail",
    components: {selectVehicle,selectItemsType,selectParts,selectPartsGroup,selectItemPackage,comboDetail},
    data(){
            // 联系电话验证
            const validatePass = (rule, value, callback) => {
                var p1 = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
                var p2=/0\d{2,3}-\d{7,8}/;
                if (p2.test(value)||p1.test(value)||!value) {
                    callback();
                }else{
                	  
                    callback(new Error('请输入正确的号码'));
                }
            };
            //校验里程数--------
            const validatePass1 = (rule, value, callback) => {
                var value1=value+'';
                if (value1.length<=8) {
                    callback();
                }else{
                    callback(new Error('最大不超过八位'));
                }
            };


      return{

        showItemFlag:null,//项目套餐组详情
        itemDetailId:'',//项目套餐组id

        showoff:null,//选择车辆
        selectCarTransfer:true,//选择车辆是否放在body

        showTenanceItems:null,//选择项目
        selectItemransfer:true,//选择项目是否放在body
        initGetItem:[],//初始化选择项目数据
        selectItemransfer1:true,//选择项目组是否放在body
        showSelectParts:null,//选择配件开关
        initParts:[],
        showSelectPartsGroup:null,
        initPartsGroup:[],

        showSelectItemGroup:null,//选择项目套餐--
        initItemGroup:[],


        showModal: false,//本界面是否显示判断
        testSingle:false,//判断是否启用维修项目套餐
        //维修项目
        columns: [
          {title: '序号',  minWidth: 80,type:"index",
          },
          {title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 180,
          },
          {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 120},
          {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 120},
          {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 120},
          {title: '小计金额', key: 'ITEM_MONEY', sortable: true, minWidth: 120,
            render: (h, params) => h('span', (params.row.REPAIR_TIME*this.work_price+params.row.PAINT_NUM*this.paint_price))
          },
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 120,
              render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.ITEM_DERATE_MONEY,
                                    disabled:this.listDisabled,
                                },
                                on: {
                                    "on-change":(val)=>{
                                        if(val<params.row.ITEM_MONEY){
                                            params.row.ITEM_DERATE_MONEY=val;
                                            let self=this;
                                            this.commitItem[params.index]=params.row;
                                            self.commitItem[params.index]['ITEM_LAST_MONEY']=params.row.REPAIR_TIME*this.work_price+params.row.PAINT_NUM*this.paint_price-val;
                                            self.computItemMoney();
                                        }else{
                                            this.$Modal.confirm({
                                                title:"系统提示!",
                                                content:"优惠金额过大",
                                                
                                            })
                                            params.row.ITEM_DERATE_MONEY=0;
                                            let self=this;
                                            this.commitItem[params.index]=params.row;
                                            self.commitItem[params.index]['ITEM_LAST_MONEY']=params.row.REPAIR_TIME*this.work_price+params.row.PAINT_NUM*this.paint_price-val;
                                            self.computItemMoney();
                                        }
                                        

                                    
                                    },
                                    
                                }
                            },
                            )
                        ]);
                    }
          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', (params.row.REPAIR_TIME*this.work_price+params.row.PAINT_NUM*this.paint_price-params.row.ITEM_DERATE_MONEY))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REMARK,
                            disabled:this.listDisabled,
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
          {title: '操作', key: '', sortable: true, minWidth: 100, fixed: 'right',
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
        commitItem:[],//提交选择项目
        //维修配件
        columns1: [
          {title: '序号',  minWidth: 80,type:'index',},
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 140,},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 100,
            
              render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.PART_NUM,
                                    disabled:this.listDisabled,
                                },
                                on: {
                                    "on-change":(val)=>{
                                        
                                            params.row.PART_NUM=val;
                                            let self=this;
                                            this.commitParts[params.index]=params.row;
                                            self.commitParts[params.index]['PART_MONEY']=params.row.SALES_PRICE*val;
                                            self.commitParts[params.index]['PART_LAST_MONEY']=params.row.SALES_PRICE*val-params.row.PART_DERATE_MONEY;
                                            self.computItemMoney();
                                  
                                        
                                        
                                    },
                                    
                                }
                            },
                            )
                        ]);
                    }
          },
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 100,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
          },
          {title: '单价', key: 'SALES_PRICE', sortable: true, minWidth: 100,
                render: (h, params) => {
                        
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.SALES_PRICE,
                                    disabled:this.listDisabled,
                                },
                                on: {
                                    "on-change":(val)=>{
                                            params.row.SALES_PRICE=val;
                                            this.commitParts[params.index]=params.row;
                                    },
                                
                                    
                                }
                            },
                            )
                        ]);
                    }
          },
          {title: '小计金额', key: 'PART_MONEY', sortable: true, minWidth: 120,
                render: (h, params) => h('span', (params.row.PART_NUM*params.row.SALES_PRICE))
            },
          {title: '优惠金额', key: 'PART_DERATE_MONEY', sortable: true, minWidth: 120,
            

              render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.PART_DERATE_MONEY,
                                    disabled:this.listDisabled,
                                },
                                on: {
                                    "on-change":(val)=>{
                                        

                                        console.log(val,params.row.PART_MONEY);
                                        if(val<params.row.PART_MONEY){
                                            params.row.PART_DERATE_MONEY=val;
                                            let self=this;
                                            
                                            self.commitParts[params.index]=params.row;
                                            self.commitParts[params.index]['PART_LAST_MONEY']=params.row.SALES_PRICE*params.row.PART_NUM-val;
                                            self.computItemMoney();
                                       
                                        }else{
                                            this.$Modal.confirm({
                                                title:"系统提示!",
                                                content:"优惠金额过大",
                                                
                                            })
                                            let self=this;
                                            self.commitParts[params.index]['PART_DERATE_MONEY']=0;
                                            self.commitParts[params.index]['PART_LAST_MONEY']=params.row.SALES_PRICE*params.row.PART_NUM-val;
                                            self.computItemMoney();
                             
                                        }
                                    },
                                    
                                }
                            },
                            )
                        ]);
                    }
          },
          {title: '优惠后金额', key: 'PART_LAST_MONEY', sortable: true, minWidth: 150,
                render: (h, params) => h('span', (params.row.PART_NUM*params.row.SALES_PRICE)-params.row.PART_DERATE_MONEY)
            },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REMARK,
                            disabled:this.listDisabled,
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
          {title: '操作', key: '', sortable: true, minWidth: 100,fixed: 'right',
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
        commitParts:[],//提交配件
        getParts:[],
        getParts1:[],
        //维修项目套餐
        columns2: [
          {title: '序号',  minWidth: 80,type:'index',},
          {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 180,},
          {title: '套餐价格', key: 'SALES_PRICE', sortable: true, minWidth: 120,
              render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.SALES_PRICE,
                                    disabled:this.listDisabled,
                                },
                                on: {
                                    "on-change":(val)=>{
                                            if(val>params.row.ITEM_DERATE_MONEY){
                                                params.row.SALES_PRICE=val;
                                                this.commitItemGroup[params.index]=params.row;
                                                this.computItemMoney();
                                            }else{
                                                this.$Modal.confirm({
                                                    title:"系统提示!",
                                                    content:"优惠金额过大",
                                                    
                                                })
                                                params.row.ITEM_DERATE_MONEY=0;
                                                params.row.SALES_PRICE=val;
                                                this.commitItemGroup[params.index]=params.row;
                                                this.computItemMoney();
                                            }
                                            
                                       

                                    },
                                    
                                }
                            },
                            )
                        ]);
                    }
          
        
          },
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 120,
              render: (h, params) => {
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    min:0,
                                    value: params.row.ITEM_DERATE_MONEY,
                                    disabled:this.listDisabled,
                                },
                                on: {
                                    "on-change":(val)=>{

                                        if(val<params.row.SALES_PRICE){
                                            params.row.ITEM_DERATE_MONEY=val;
                                            let self=this;
                                            self.commitItemGroup[params.index]=params.row;
                                            self.commitItemGroup[params.index]['ITEM_LAST_MONEY']=parseInt(params.row.SALES_PRICE)-val;

                                            console.log(self.commitItemGroup[params.index]['ITEM_LAST_MONEY']);
                                            self.computItemMoney();
                                        }else{
                                            this.$Modal.confirm({
                                                title:"系统提示!",
                                                content:"优惠金额过大",
                                                
                                            })


                                            params.row.ITEM_DERATE_MONEY=0;
                                            let self=this;
                                            self.commitItemGroup[params.index]=params.row;
                                            self.commitItemGroup[params.index]['ITEM_LAST_MONEY']=parseInt(params.row.SALES_PRICE)-val;

                                            console.log(self.commitItemGroup[params.index]['ITEM_LAST_MONEY']);
                                            self.computItemMoney();
                                        }
                                        

                                    },
                                    
                                }
                            },
                            )
                        ]);
                    }

          },
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', parseInt(params.row.SALES_PRICE)-parseInt(params.row.ITEM_DERATE_MONEY))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'text',
                            value: params.row.REMARK,
                            disabled:this.listDisabled,
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
          {title: '操作', key: '', sortable: true, minWidth: 100,fixed: 'right',
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
        commitItemGroup:[],
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
        ruleValidate: {
          ORDER_DATE:[
            { required: true, message: '请选择日期', },
            // { validator: this.validatePass, trigger: 'change' },
          ],
          ORDER_TIME: [
              { required: true,  message: '请选择时间',}
          ],
          TELPHONE: [
              { validator: validatePass, trigger: 'change'},
          ],
          MILEAGE: [
              { validator: validatePass1, trigger: 'change'},
          ],
        },//规则验证

        titleMsg:'新建',
        isCar:false,//是否维修接车
        isButton:true,//是否显示保存 提交按钮
        listDisabled:false,//是否禁止修改
        isOrderSuccess:true,//判断是否是预约状态---

        
        
        //日期时间验证-----
        options: {
            disabledDate (date) {
                console.log('aaaa',date && date.valueOf() < Date.now() - 86400000);
                return date && date.valueOf() < Date.now() - 86400000;
            }
        },
        work_price:null,//工时单价---------
        paint_price:null,//油漆面单价-------
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
        console.log('进来的参数：',this.detailData,);
        this.showModal=true;
        //清空公共数据值------
        this.getParts=[];
        this.getParts1=[];
        this.commitItemGroup=[];
        this.commitItem=[];
        this.commitParts=[];
        this.testSingle=false;

        //进来先清空数据--------
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
              case 'ORDER_DATE':this.listSearch[key]= new Date();break
              case 'ORDER_TIME':this.listSearch[key]= new Date().toLocaleTimeString();break
              default : this.listSearch[key]= ''

            }
        }

        //判断进来的参数是否存在---------------------
        if(this.detailData){
          for(let key in this.detailData){
            this.listSearch[key]= this.detailData[key]
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
              this.isOrderSuccess=true;

          }else if(this.detailData['STATUS']=='10421002'){
              this.titleMsg="已预约";
              this.isCar=true;
              this.isButton=false;
              this.listDisabled=true;
              this.isOrderSuccess=false;

          }else if(this.detailData['STATUS']=='10421003'){
              this.titleMsg="已接车";
              this.isCar=false;
              this.isButton=false;
              this.listDisabled=true;
              this.isOrderSuccess=false;
          }else{
            console.log("不满足条件");
          }

        }else{
          //新建功能表------
          this.titleMsg="新建";
          this.isCar=false;
          this.isButton=true;
          this.listDisabled=false;
          this.isOrderSuccess=true;
          
        }
      },
      commitParts(obj){
          console.log('xxxxxxxx',obj);
        //   if(obj>parseFloat(params.row.MAX_SALES_PRICE) || initV==parseFloat(params.row.MAX_SALES_PRICE)){
        //     this.$Modal.confirm({
        //         title:"系统提示!",
        //         content:"配件单价不能高于最高销售价,系统已为您自动调整为最高价！",
                
        //     })
            
            
        //     let self=this;
            
        //         self.commitParts[params.index]['SALES_PRICE']=0;
        //         self.commitParts[params.index]['SALES_PRICE']=params.row.MIN_SALES_PRICE;
            
            

        //     console.log('进来最高价',params.row.SALES_PRICE,params.row.MAX_SALES_PRICE);

        //     self.commitParts[params.index]['PART_MONEY']=params.row.PART_NUM*params.row.SALES_PRICE;
        //     self.commitParts[params.index]['PART_LAST_MONEY']=params.row.PART_NUM*params.row.SALES_PRICE-params.row.PART_DERATE_MONEY;
        //     self.computItemMoney();

            
        // }else 
        // if(initV<parseFloat(params.row.MIN_SALES_PRICE) ||initV==parseFloat(params.row.MIN_SALES_PRICE)){
        //     this.$Modal.confirm({
        //         title:"系统提示!",
        //         content:"配件单价不能低于最低销售价,系统已为您自动调整为最低价！",
                
        //     })
            
        //     let self=this;
        //     self.commitParts[params.index]['SALES_PRICE']=params.row.MIN_SALES_PRICE;
        //     console.log("self.commitParts",self.commitParts);
        //     self.commitParts[params.index]['PART_MONEY']=params.row.PART_NUM*params.row.SALES_PRICE;
        //     self.commitParts[params.index]['PART_LAST_MONEY']=params.row.PART_NUM*params.row.SALES_PRICE-params.row.PART_DERATE_MONEY;
        //     self.computItemMoney();

            
        // }else{
        //     console.log('进到没有限制价格');
        //     params.row.SALES_PRICE=initV;
        //     let self=this;
        //     self.commitParts[params.index]=params.row;
        //     self.commitParts[params.index]['PART_MONEY']=params.row.PART_NUM*params.row.SALES_PRICE;
        //     self.commitParts[params.index]['PART_LAST_MONEY']=params.row.PART_NUM*params.row.SALES_PRICE-params.row.PART_DERATE_MONEY;
        //     self.computItemMoney();
        // }
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1019');
      this.searchSelectOption1= getDictGroup(this.$store.state.app.dict, '1041');
      this.work_price=getUserInfo(this.$store.state.user.userInfo.params, 'P1001');
      this.paint_price=getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
    },
    methods:{
      //监听界面变化--------
      visibleChange(status){
        if(status === false){
          this.$emit('closeDetail');
          this.handleReset("listSearch");
        }
      },
      //保存按钮校验------------
      handleSubmit (name) {
          this.$refs[name].validate((valid) => {
              if (valid) {
                  this.$Modal.confirm({
                      title:"系统提示!",
                      content:"确定要保存吗？",
                      onOk:this.saveData,
                      
                  })
              } else {
                this.$Message.info('请填写正确信息')
              }
          });

      },
      saveData(){
          this.listSearch["ORDER_DATE"]=formatDate(this.listSearch["ORDER_DATE"]);
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
              if (res.success === true) {
                for(let i in res.data){
                  this.listSearch[i]=res.data[i];
                }
                this.$emit('closeGetList');
                this.$Message.info('保存成功');
              }else{
                this.$Message.info('保存失败');
              }
          })
      },
      //提交按钮校验------------
      handleCommit(name){
          this.$refs[name].validate((valid) => {
              if (valid) {
                  this.$Modal.confirm({
                      title:"系统提示!",
                      content:"确定要提交吗？",
                      onOk:this.commitdata,
                      
                  })
              } else {
                this.$Message.info('请填写正确信息')
              }
          });
      },
      commitdata(){
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
            
              if (res.success === true) {
                for(let i in res.data){
                  this.listSearch[i]=res.data[i];
                }
                this.$emit('closeGetList');
                this.$Message.info('提交成功')
                this.isCar=true;
                this.isButton=false;
                this.titleMsg="已预约";
                this.listDisabled=true;
                this.isOrderSuccess=false;
                
              }
          })
      },
      //清除规则验证-------------
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
              
              this.listSearch["REPAIR_PART_MONEY"]=0;
              for(let i in res.data){
                this.listSearch["REPAIR_PART_MONEY"]+=res.data[i]['PART_MONEY'];
              }
              console.log("this.listSearch",this.listSearch);
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




        this.listSearch["GIVE_REPAIR_PERSON"]=val["CUSTOMER_NAME"];

        this.listSearch["VEHICLE_COLOR"]=val["VEHICLE_COLOR"];
        this.listSearch["ENGINE_NO"]=val["ENGINE_NO"];
      },

      //选择维修项目按钮----------
      goOnTenanceItem(){
          this.showTenanceItems=Math.random();
          this.initGetItem=this.commitItem;
      },
      //获取维修项目数据-------
      sTenanceItem(val){
          console.log("父级收到数据",val);
          this.commitItem=[];
          for(let j in val){
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
              if(val[j][i]){
                listItemsModel[i]=val[j][i];
              }else if(i=="ITEM_MONEY"){
                listItemsModel[i]=val[j]["REPAIR_TIME"]*this.work_price+val[j]["PAINT_NUM"]*this.paint_price;
              }else if(i=="ITEM_LAST_MONEY"){
                listItemsModel[i]=parseInt(val[j]["REPAIR_TIME"]*this.work_price)+parseInt(val[j]["PAINT_NUM"]*this.paint_price);
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
              for(let i in this.getParts1[j]){
                commitParts[i]=this.getParts1[j][i];
              }

                commitParts['PART_MONEY']=this.getParts1[j]["SALES_PRICE"]*(this.getParts1[j]["PART_NUM"]||1);
                commitParts['PART_LAST_MONEY']=this.getParts1[j]["SALES_PRICE"]*(this.getParts1[j]["PART_NUM"]||1)-commitParts["PART_DERATE_MONEY"];
              console.log('最后得到的配件数据---------',commitParts);
              this.commitParts.push(commitParts);
          }
          

        }
        this.computItemMoney();
      },
      //选择配件按钮------
      goOnSelectParts(){
          this.showSelectParts=Math.random();
          // this.initParts=this.commitParts;
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
      //双击查看项目套餐详情------
      onRowDblclick(val){
          this.showItemFlag=Math.random();
          this.itemDetailId=val.GROUP_ID;
      },
      selectItemGroup(value){
        console.log("传过来的字段值：",value);
        
        //提交维修项目套餐
          this.commitItemGroup=[];
          for(let j in value){
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
            for(let i in value[j]){
                commitItemGroup[i]=value[j][i];
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
          this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItem[i]["REPAIR_TIME"]*this.work_price+this.commitItem[i]["PAINT_NUM"]*this.paint_price;
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
      // computedMoney(val){
      //   console.log('手动金额计算值',val);
      //   this.listSearch["REPAIR_ITEM_MONEY"]=0;
      //   this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=0;
      //   this.listSearch["SUM_MONEY"]=0;
      //   for(let i in this.commitItem){
      //     this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItem[i]["REPAIR_TIME"]*this.work_price+this.commitItem[i]["PAINT_NUM"]*this.paint_price;
      //   }
      //   for(let i in this.commitItemGroup){
      //     this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItemGroup[i]["SALES_PRICE"];
      //   }
      //   this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=val;
      //   this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-val-this.listSearch["REPAIR_PART_DERATE_MONEY"];
      // },
      // computedMoney1(val){
      //   console.log('手动金额计算值',val);
      //   this.listSearch["SUM_MONEY"]=0;
      //   this.listSearch["REPAIR_PART_MONEY"]=0;
      //   this.listSearch["REPAIR_PART_DERATE_MONEY"]=0;
      //   for(let i in this.commitParts){
      //     this.listSearch["REPAIR_PART_MONEY"]+=this.commitParts[i]["SALES_PRICE"]*(this.commitParts[i]["PART_NUM"]||1);
      //   }
      //   this.listSearch["REPAIR_PART_DERATE_MONEY"]=val;
      //   this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-this.listSearch["REPAIR_ITEM_DERATE_MONEY"]-val;
      // },

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
      //维修接车----
      handleCar(){
        console.log(this.$store.state.user.userInfo.user.userId);
        this.axios.request({
              url: '/tenant/repair/ttrepairorder/get_wxkd',
              method: 'post',
              data: {
                  KEYWORD: this.$store.state.user.userInfo.user.userId,
                  access_token: this.$store.state.user.token
              }
          }).then(res => {
              if (res.success === true) {
                  // var query=JSON.stringify({flag:true,listSearch:this.listSearch,commitItem:this.commitItem,commitItemGroup:this.commitItemGroup,commitParts:this.commitParts});
                  var query={flag:true,listSearch:this.listSearch,commitItem:this.commitItem,commitItemGroup:this.commitItemGroup,commitParts:this.commitParts};
                  this.$router.push({path:'/repairOrder-list',query:query});

                  this.showModal=false;
              }else{
                  this.$Modal.confirm({
                      title:"系统提示!",
                      content:"该用户无权限",
                      
                  })
              }
        });

        
      },
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
