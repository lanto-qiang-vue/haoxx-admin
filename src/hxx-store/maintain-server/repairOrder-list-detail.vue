<!--维修开单 2018-09-06详情-->
<template>
  <Modal
    v-model="showModal"
    title="维修开单"
    width="100"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer="false"
    :footer-hide="false"
    class="table-modal-detail full-height"
    :closable="false"
    :mask-closable="false"
    :transition-names="['', '']"
  >
  <modal-title slot="header" title="维修开单" :state="titleMsg" @clickBack="showModal=false"></modal-title>
    <div>
      <!--<div class="status">({{titleMsg}})</div>-->
      <!--<Collapse v-model="collapse">
        <Panel name="1">查询-->
          <Form ref="listSearch" :rules="ruleValidate" :model="listSearch" slot="content" :label-width="110"
                class="common-form">
            <FormItem label="车牌号码:" prop="PLATE_NUM">
              <Input @on-focus="showoff=Math.random();" type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号"
                     :disabled="publicButtonFlag">
                <Icon type="ios-search" slot="suffix" @click="showoff=Math.random();" style="cursor:pointer;"/>
              </Input>
            </FormItem>
            <FormItem label="车型:">
              <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型"> </Input>
            </FormItem>
            <FormItem label="车架号:">
              <Input type="text" disabled v-model="listSearch.VIN_NO" placeholder=""> </Input>
            </FormItem>
            <FormItem label="车主名称:">
              <Input type="text" disabled v-model="listSearch.CUSTOMER_NAME" placeholder=""> </Input>
            </FormItem>
            <FormItem label="送修人:">
              <Input type="text" v-model="listSearch.GIVE_REPAIR_PERSON" placeholder=""> </Input>
            </FormItem>
            <FormItem label="联系电话:" prop="TELPHONE">
              <Input type="text" v-model="listSearch.TELPHONE" placeholder=""> </Input>
            </FormItem>
            <FormItem label="维修类型:">
              <Select v-model="listSearch.REPAIR_TYPE" placeholder="">
                <Option v-for="(item, index) in repairTypeArr"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="送修里程:" prop="MILEAGE">
              <InputNumber :min="0" v-model="listSearch.MILEAGE" placeholder="最大不超过八位数"
                           :formatter="value => `${value}公里`" :parser="value => value.replace('公里', '')"
              ></InputNumber>
            </FormItem>
            <FormItem label="主修人:">
              <Select v-model="listSearch.REPAIR_PERSON" placeholder="">
                <Option v-for="(item, index) in repairPersonArr"
                        :key="index" :value="item.code">{{item.code}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="车辆类型:">
              <Select v-model="listSearch.VEHICLE_TYPE" placeholder="" @on-change="selectCarInitFun">
                <Option v-for="(item, index) in vehicleTypeArr"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="车辆分类代号:">
              <Select v-model="listSearch.VEHICLE_TYPE_CODE" placeholder="">
                <Option v-for="(item, index) in vehicleNumberArr"
                        :key="item.code" :value="item.code">{{item.code}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="服务顾问:">
              <Select v-model="listSearch.FOLLOW_PERSON" placeholder="">
                <Option v-for="(item, index) in serverPersonArr"
                        :key="index" :value="item.code">{{item.code}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="进厂日期:">
              <DatePicker v-model="listSearch.COME_DATE" type="datetime" format="yyyy-MM-dd HH:mm"
                          :time-picker-options="{steps: [1, 30, 30]}" placeholder="" :options="startTimeOptions"
                         @on-open-change="openStartTime"></DatePicker>
            </FormItem>
            <FormItem label="计划完工日期:">
              <DatePicker v-model="listSearch.PLAN_END_DATE" type="datetime" format="yyyy-MM-dd HH:mm"
                          :time-picker-options="{steps: [1, 30, 30]}" placeholder="" :options="endTimeOptions"
                           @on-open-change="openEndTime"></DatePicker>
            </FormItem>
            <FormItem label="故障描述:" style="width: 100%">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" :rows="1" placeholder="请输入故障描述"> </Input>
            </FormItem>
            <FormItem label="客诉内容:" style="width: 100%">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" :rows="1" placeholder="请输入客诉内容"> </Input>
            </FormItem>
            <FormItem label="维修建议:" style="width: 100%">
              <Input type="textarea" v-model="listSearch.REPAIR_INFO" :rows="1" placeholder="请输入建议内容"> </Input>
            </FormItem>
          </Form>
          <!--<Form ref="formInline" slot="content" :label-width="110">
            
          </Form>-->
        <!--</Panel>
      </Collapse>-->
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
        <Button @click="goOnTenanceItem" type="primary" shape="circle" style="margin-right: 10px;">
          <Icon type="md-checkmark" size="24"/>
          选择项目
        </Button>
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
          <Button @click="goOnItemGroup" type="primary" shape="circle" style="margin-right: 10px;">
            <Icon type="md-checkmark" size="24"/>
            选择项目套餐
          </Button>
          <Button type="primary" shape="circle" @click="goOnItemLink">
            <Icon type="md-add" size="24"/>
            进入项目套餐
          </Button>
        </div>
      </div>
      <div class="r-list-header">
        <h1 style="padding-top:20px;">维修配件</h1>
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
      <div class="r-list-choose-parts" v-if="isOrderSuccess">
        <Button @click="goOnSelectPartsGroup" type="primary" shape="circle">
          <Icon type="md-add" size="24"/>
          选择配件
        </Button>
      </div>
      <div class="r-list-header">
        <h1 style="padding-top:20px;">其他费用</h1>
      </div>
      <Table
        class="main-table"
        ref="tablesMain"
        :columns="columns3"
        :data="commitOtherItem"
        :disabled-hover="true"
        stripe
        border
      ></Table>

      <div class="r-list-money" v-if="isAccountFlag">
        <p style="text-align: left">
          <span class="bold">合计应收金额：<span>{{this.formatMoney(listSearch.SUM_MONEY)}}元</span> = </span>
          维修项目费用：<span>{{this.formatMoney(listSearch.REPAIR_ITEM_MONEY)}}元</span> +
          维修配件费用：<span>{{this.formatMoney(listSearch.REPAIR_PART_MONEY)}}元</span> +
          其他费用：<span>{{this.formatMoney(listSearch.OTHER_MONEY)}}元</span> -
          维修项目优惠金额：<span>{{this.formatMoney(listSearch.REPAIR_ITEM_DERATE_MONEY)}}元</span> -
          配件优惠金额：<span>{{this.formatMoney(listSearch.REPAIR_PART_DERATE_MONEY)}}元</span>
        </p>
      </div>
      <!--//结算信息-->
      <div class="r-list-header" v-if="!isAccountFlag">
        <h1>结算信息</h1>
      </div>
      <Table
        class="main-table"
        ref="tablesMain"
        :columns="columns4"
        :data="accountInfo"
        :disabled-hover="true"
        stripe
        border
        v-if="!isAccountFlag"
      ></Table>


      <!--选择车型-->
      <select-vehicle v-if="showFlag" :showoff="showoff" @selectCar="selectCar">
      </select-vehicle>
      <!--选择项目-->
      <select-itemsType v-if="showFlag" :showTenanceItems="showTenanceItems" @sTenanceItem="sTenanceItem" :initGetItem="initGetItem"
                        :initSearch="listSearch">
      </select-itemsType>
      <!--选择配件-->
      <select-parts v-if="showFlag" :showSelectParts="showSelectParts" @selectPartsItem="selectPartsItem" :initParts="initParts">
      </select-parts>
      <!--选择配件组-->
      <select-partsGroup v-if="showFlag" :showSelectPartsGroup="showSelectPartsGroup" @selectPartsGroup="selectPartsGroup"
                         :initPartsGroup="initPartsGroup">
      </select-partsGroup>
      <!--选择项目组-->
      <select-itemPackage v-if="showFlag" :showSelectItemGroup="showSelectItemGroup" @selectItemGroup="selectItemGroup"
                          :initItemGroup="initItemGroup">
      </select-itemPackage>
      <!--选择工单结算单-->
      <select-accountOrder v-if="showFlag" :showSelectAccount="showSelectAccount" :showAccountData="listSearch"
                           :showAccountItem="commitItem" :showItemGroup="commitItemGroup"
                           :showAccountParts="commitParts" :showAccountOther="commitOtherItem"
                           :repairPersonArr="repairPersonArr" @emitAccount="emitAccount"
                           @emitComputedMoney="emitComputedMoney">
      </select-accountOrder>
      <select-shoukuanOrder v-if="showFlag" :showSelectAccount="showShouKuan" :listSearch="listSearch"
                            :repairPersonArr="repairPersonArr" @closeGetList="closeGetList">

      </select-shoukuanOrder>
      <!--项目组套餐详情!!!-->
      <combo-detail v-if="showFlag" :tshow="showItemFlag" :tid="itemDetailId"></combo-detail>
    </div>

    <!--底部按钮组-->
    <div slot="footer">
      <Button v-if="accessBtn('save')" :disabled="buttonStateArr.save" @click="handleSubmit('listSearch')"
              type="primary">保存
      </Button>
      <Button v-if="accessBtn('submit')" :disabled="buttonStateArr.dopay" @click="handleCommit('listSearch')"
              type="info">派工
      </Button>
      <Button v-if="accessBtn('finish')" :disabled="buttonStateArr.finish" @click="handleFinish" type="warning">完工
      </Button>
      <Button v-if="accessBtn('doaccount')" :disabled="buttonStateArr.doaccount" @click="handleAccount" type="warning">
        结算
      </Button>
      <Button v-if="accessBtn('dopay')" :disabled="buttonStateArr.shoukuan" @click="showShouKuan=Math.random()"
              type="warning">收款
      </Button>
      <Button v-if="accessBtn('printWts')" :disabled="buttonStateArr.printWts" @click="printWTS" type="success">打印委托书
      </Button>
      <Button v-if="accessBtn('printPgd')" :disabled="buttonStateArr.printPgd" @click="printPgdButton" type="success">
        打印派工单
      </Button>
      <Button v-if="accessBtn('printAccount')" :disabled="buttonStateArr.printAccount" @click="printAccountButton"
              type="success">打印结算单
      </Button>
      <Button @click="showModal=false;">返回</Button>
    </div>
  </Modal>

</template>

<script>
  import {getName, getDictGroup, getUserInfo} from '@/libs/util.js'
  import {formatDate} from '@/libs/tools.js'
  import selectVehicle from '@/hxx-components/select-vehicle.vue'
  import selectItemsType from '@/hxx-components/select-itemsType.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import selectPartsGroup from '@/hxx-components/select-partsGroup.vue'
  import mixin from '@/hxx-components/mixin'
  import selectItemPackage from '@/hxx-components/select-itemPackage.vue'
  import selectAccountOrder from '@/hxx-components/select-accountOrder.vue'
  import selectShoukuanOrder from '@/hxx-components/select-shoukuanOrder.vue'
  import columnInput from '@/hxx-components/column-input.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import {printWtsFun, printPgdFun, printAccountFun} from '@/hxx-components/repairPrintUtil.js'
  import comboDetail from '@/hxx-components/combo-detail.vue'
  import unitSelect from '@/hxx-components/unit-select.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  export default {
    name: "repairOrder-list-detail",
    components: {
      selectVehicle,
      selectItemsType,
      selectParts,
      selectPartsGroup,
      selectItemPackage,
      selectAccountOrder,
      selectShoukuanOrder,
      comboDetail,
      columnInput,
      unitSelect,
      ModalTitle
    },
    mixins: [mixin],
    data() {
      // 联系电话验证
      const validatePass = (rule, value, callback) => {
        var p1 = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
        var p2 = /0\d{2,3}-\d{7,8}/;
        if (p2.test(value) || p1.test(value) || !value) {
          callback();
        } else {

          callback(new Error('请输入正确的号码'));
        }
      };
      //校验里程数--------
      const validatePass1 = (rule, value, callback) => {
        var value1 = value + '';
        if (value1.length <= 8) {
          callback();
        } else {
          callback(new Error('最大不超过八位'));
        }
      };

      return {
        showItemFlag: null,//项目套餐组详情
        itemDetailId: '',//项目套餐组id

        showSelectAccount: null,//选择工单结算单
        showoff: null,//选择车辆
        showTenanceItems: null,//选择项目
        initGetItem: [],//初始化选择项目数据
        showShouKuan: false,//收款弹出层-------
        showSelectParts: null,//选择配件开关
        initParts: [],
        showSelectPartsGroup: null,
        initPartsGroup: [],

        showSelectItemGroup: null,//选择项目套餐--
        initItemGroup: [],
        showModal: false,//本界面是否显示判断
        testSingle: false,//判断是否启用维修项目套餐
        //维修项目
        columns: [
          {
            title: '序号',  width: 70,align:'center', sortable: true, type: "index",
          },
          {
            title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 170,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {
            title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 120,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: params.row.REPAIR_TIME,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.REPAIR_TIME = val;
                        params.row.REPAIR_MONEY = 0;
                        params.row.PAINT_NUM = 0;
                        // params.row.ITEM_DERATE_MONEY = 0;
                        this.commitItem[params.index] = params.row;
                        this.commitItem[params.index]['ITEM_MONEY'] = (val * this.work_price + params.row.PAINT_NUM * this.paint_price).toFixed(2);
                        this.commitItem[params.index]['ITEM_LAST_MONEY'] = (this.commitItem[params.index]['ITEM_MONEY'] - params.row.ITEM_DERATE_MONEY).toFixed(2);
                         console.log(params.row.ITEM_DERATE_MONEY,this.commitItem[params.index]['ITEM_LAST_MONEY']);
                        this.computItemMoney();
                      },

                    }
                  },
                )
              ]);
            }


          },
          {
            title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: params.row.REPAIR_MONEY,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.REPAIR_MONEY = parseFloat(val.toFixed(2));
                        params.row.REPAIR_TIME = 0;
                        params.row.PAINT_NUM = 0;
                        // params.row.ITEM_DERATE_MONEY = 0;
                        this.commitItem[params.index] = params.row;
                        this.commitItem[params.index]['ITEM_MONEY'] = parseFloat(val.toFixed(2));
                        this.commitItem[params.index]['ITEM_LAST_MONEY'] = (this.commitItem[params.index]['ITEM_MONEY'] - params.row.ITEM_DERATE_MONEY).toFixed(2);
                        console.log(params.row.ITEM_DERATE_MONEY,this.commitItem[params.index]['ITEM_LAST_MONEY']);
                        this.computItemMoney('flag');
                      },

                    }
                  },
                )
              ]);
            }

          },
          {
            title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 120,
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: params.row.PAINT_NUM,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.REPAIR_TIME = 0;
                        params.row.REPAIR_MONEY = 0;
                        params.row.PAINT_NUM = val;
                        // params.row.ITEM_DERATE_MONEY = 0;
                        this.commitItem[params.index] = params.row;
                        this.commitItem[params.index]['ITEM_MONEY'] = (val * this.paint_price + params.row.PAINT_NUM * this.work_price).toFixed(2);
                        this.commitItem[params.index]['ITEM_LAST_MONEY'] = (this.commitItem[params.index]['ITEM_MONEY'] - params.row.ITEM_DERATE_MONEY).toFixed(2);
                        console.log(params.row.ITEM_DERATE_MONEY,this.commitItem[params.index]['ITEM_LAST_MONEY']);
                        this.computItemMoney();
                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '小计金额', key: 'ITEM_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.ITEM_MONEY))
          },
          {
            title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => {

              return h('div', [
                h(columnInput, {
                  props: {
                    params: params,
                    type: "number",
                    contentData: params.row.ITEM_MONEY,
                    min: 0,
                    disabled: !this.isOrderSuccess,

                  },
                  on: {
                    "change": (val) => {

                      params.row.ITEM_DERATE_MONEY = val;
                      this.commitItem[params.index] = params.row;
                      this.commitItem[params.index]['ITEM_LAST_MONEY'] = (params.row.REPAIR_TIME * this.work_price + params.row.PAINT_NUM * this.paint_price+params.row.REPAIR_MONEY - val).toFixed(2);
                      console.log(params.row.ITEM_DERATE_MONEY,this.commitItem[params.index]['ITEM_LAST_MONEY']);
                      this.computItemMoney();

                    },
                  }
                })
              ]);
            }
          },
          {
            title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 130,align:'right',
            // render: (h, params) => h('span', (params.row.ITEM_MONEY-params.row.ITEM_DERATE_MONEY))
            render: (h, params) => h('span', this.formatMoney(params.row.ITEM_LAST_MONEY))
          },
          {
            title: '车间班组', key: 'WORK_CLASS_ID', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h(unitSelect, {
                  props: {
                    value: this.commitItem[params.index]["WORK_CLASS_ID"],
                    disabled: !this.isOrderSuccess,
                    data: this.vehicleTeamArr
                  },
                  on: {
                    'change': (value) => {
                      this.commitItem[params.index]["WORK_CLASS_ID"] = value;
                      for (let i in this.vehicleTeamArr) {
                        if (this.vehicleTeamArr[i].itemId == value) {
                          this.commitItem[params.index]["WORK_CLASS_NAME"] = this.vehicleTeamArr[i].code;
                          break;
                        }
                      }

                    },
                    'refresh': () => {
                      this.getShopClassList();
                    }
                  },
                },
                // this.vehicleTeamArr.map(function(type){
                //     return h('Option', {
                //         props: {
                //             value: type.itemId,
                //         }
                //     }, type.code);
                // })
              );
            },

          },
          {
            title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REMARK,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-blur": (e) => {
                        this.commitItem[params.index]["REMARK"] = e.target.value;
                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '操作', key: '', sortable: true, width: 100, fixed: 'right',align:'center',
            render: (h, params) => {
              if (this.titleMsg == '新建未派工') {
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
                  }, '删除')
                ]);
              } else if (this.titleMsg == '已派工维修中') {
                return h('div', [
                  h('span', '已派工维修中')
                ]);
              } else if (this.titleMsg == '已完工待结算') {
                return h('div', [
                  h('span', '已完工待结算')
                ]);
              } else if (this.titleMsg == '已结算待收款') {
                return h('div', [
                  h('span', '已结算待收款')
                ]);
              } else if (this.titleMsg == '已结清') {
                return h('div', [
                  h('span', '已结清')
                ]);
              }

            }
          },
        ],
        getItem: [],
        //维修配件
        columns1: [
          {title: '序号',  width: 70,align:'center', sortable: true, type: 'index',},
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 150,},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150},
          {
            title: '数量', key: 'PART_NUM', sortable: true, minWidth: 100,

            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: params.row.PART_NUM,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.PART_NUM = val;
                        this.commitParts[params.index] = params.row;
                        this.commitParts[params.index]['PART_MONEY'] = (params.row.SALES_PRICE * val).toFixed(2);
                        this.commitParts[params.index]['PART_LAST_MONEY'] = (params.row.SALES_PRICE * val - params.row.PART_DERATE_MONEY).toFixed(2);
                        this.computItemMoney();


                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '单位', key: 'UNIT', sortable: true, minWidth: 100,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
          },
          {
            title: '单价', key: 'SALES_PRICE', sortable: true, minWidth: 100,align:'right',

            render: (h, params) => {
              return h('div', [
                h(columnInput, {
                  props: {
                    params: params,
                    type: "number",
                    contentData: params.row.MAX_SALES_PRICE,
                    contentData1: params.row.MIN_SALES_PRICE,
                    min: 0,
                    allType: true,
                    disabled: !this.isOrderSuccess,


                  },
                  on: {
                    "change": (val) => {

                      params.row.SALES_PRICE = parseFloat(val.toFixed(2));
                      this.commitParts[params.index] = params.row;
                      this.commitParts[params.index]['PART_MONEY'] = (params.row.PART_NUM * params.row.SALES_PRICE).toFixed(2);
                      this.commitParts[params.index]['PART_LAST_MONEY'] = (params.row.PART_NUM * params.row.SALES_PRICE - params.row.PART_DERATE_MONEY).toFixed(2);
                      this.computItemMoney();

                    },
                  }
                })
              ]);
            }
          },
          {
            title: '小计金额', key: 'PART_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SALES_PRICE * params.row.PART_NUM))
            
          },
          {
            title: '优惠金额', key: 'PART_DERATE_MONEY', sortable: true, minWidth: 120,align:'right',

            render: (h, params) => {
              return h('div', [
                h(columnInput, {
                  props: {
                    params: params,
                    type: "number",
                    contentData: params.row.PART_MONEY,
                    min: 0,
                    disabled: !this.isOrderSuccess,

                  },
                  on: {
                    "change": (val) => {

                      params.row.PART_DERATE_MONEY = val;
                      this.commitParts[params.index] = params.row;
                      this.commitParts[params.index]['PART_LAST_MONEY'] = (params.row.SALES_PRICE * params.row.PART_NUM - val).toFixed(2);
                      this.computItemMoney();

                    },
                  }
                })
              ]);

              // return h('div', [
              //     h('InputNumber', {
              //         props: {
              //             min:0,
              //             value: params.row.PART_DERATE_MONEY,
              //             disabled:!this.isOrderSuccess,
              //         },
              //         on: {
              //             "on-change":(val)=>{
              //                 console.log(val,params.row.PART_MONEY);
              //                 if(val<params.row.PART_MONEY){
              //                     params.row.PART_DERATE_MONEY=parseFloat(val.toFixed(2));
              //                     console.log('params.row.PART_DERATE_MONEY',params.row.PART_DERATE_MONEY);
              //                 }else{
              //                     this.$Modal.confirm({
              //                         title:"系统提示!",
              //                         content:"优惠金额过大",

              //                     })
              //                     params.row.PART_DERATE_MONEY=val;
              //                     var self=this;
              //                     setTimeout(function(){
              //                         params.row.PART_DERATE_MONEY=0;
              //                         self.commitParts[params.index]=params.row;
              //                         self.commitParts[params.index]['PART_LAST_MONEY']=(params.row.SALES_PRICE*params.row.PART_NUM-params.row.PART_DERATE_MONEY).toFixed(2);
              //                         self.computItemMoney();
              //                     },20);
              //                 }

              //                     this.commitParts[params.index]=params.row;
              //                     this.commitParts[params.index]['PART_LAST_MONEY']=(params.row.SALES_PRICE*params.row.PART_NUM-params.row.PART_DERATE_MONEY).toFixed(2);
              //                     this.computItemMoney();
              //             },

              //         }
              //     },
              //     )
              // ]);
            }
          },
          {
            title: '优惠后金额', key: 'PART_LAST_MONEY', sortable: true, minWidth: 150,align:'right',
            // render: (h, params) => h('span', params.row.SALES_PRICE*params.row.PART_NUM-params.row.PART_DERATE_MONEY)
            render: (h, params) => h('span', this.formatMoney(params.row.PART_LAST_MONEY))
          },

          {
            title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REMARK,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-blur": (e) => {

                        this.commitParts[params.index]['REMARK'] = e.target.value;
                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '是否为托修方自备配件', key: 'IS_SELF', minWidth: 200,
            render: (h, params) => {
              var flag = false;
              if (params.row.IS_SELF == "true") {
                flag = true;
              } else if (params.row.IS_SELF == "false") {
                flag = false;
              }
              return h('div', [
                h('Checkbox', {
                  props: {
                    value: flag,
                    disabled: !this.isOrderSuccess,
                  },
                  on: {
                    "on-change": (val) => {
                      params.row.IS_SELF = val;
                      this.commitParts[params.index] = params.row;
                    },

                  }
                })
              ]);
            }
          },
          {
            title: '操作', key: '', sortable: true, width: 100, fixed: 'right',aligh:"center",
            render: (h, params) => {
              if (this.titleMsg == '新建未派工') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deletePartsGroup(params.index, params.row.STOCK_ID, params.row.PART_ID);
                      }
                    }
                  }, '删除')
                ]);
              } else {
                var textData = '';
                if (params.row.STATUS == "10221001") {
                  textData = '待领料';
                } else if (params.row.STATUS == "10221002") {
                  textData = '已领料';
                }
                return h('div', [
                  h('span', textData)
                ]);
              }

            }

          },
        ],
        getParts: [],
        getParts1: [],
        //维修项目套餐
        columns2: [
          {title: '序号',  width: 70,align:'center', sortable: true, type: 'index',},
          {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 170,},
          {
            title: '套餐价格', key: 'SALES_PRICE', sortable: true, minWidth: 120,

            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: params.row.SALES_PRICE,
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-change": (val) => {

                        params.row.SALES_PRICE = parseFloat(val.toFixed(2));
                        console.log('params.row.SALES_PRICE', params.row.SALES_PRICE);
                        this.commitItemGroup[params.index] = params.row;
                        this.commitItemGroup[params.index]['ITEM_LAST_MONEY'] = (params.row.SALES_PRICE - params.row.ITEM_DERATE_MONEY).toFixed(2);
                        this.computItemMoney();

                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 120,align:'right',

            render: (h, params) => {
              return h('div', [
                h(columnInput, {
                  props: {
                    params: params,
                    type: "number",
                    contentData: params.row.SALES_PRICE,
                    min: 0,
                    disabled: !this.isOrderSuccess,

                  },
                  on: {
                    "change": (val) => {
                      params.row.ITEM_DERATE_MONEY = val;
                      this.commitItemGroup[params.index] = params.row;
                      this.commitItemGroup[params.index]['ITEM_LAST_MONEY'] = (params.row.SALES_PRICE - params.row.ITEM_DERATE_MONEY).toFixed(2);
                      this.computItemMoney();

                    },
                  }
                })
              ]);
            }

          },
          {
            title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 130,align:'right',
            // render: (h, params) => h('span', params.row.SALES_PRICE-params.row.ITEM_DERATE_MONEY)
            render: (h, params) => h('span', this.formatMoney(params.row.ITEM_LAST_MONEY))
          },
          {
            title: '车间班组', key: 'WORK_CLASS_ID', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h(unitSelect, {
                  props: {
                    value: this.commitItemGroup[params.index]["WORK_CLASS_ID"],
                    data: this.vehicleTeamArr,
                    disabled: !this.isOrderSuccess,
                  },
                  on: {
                    'change': (value) => {
                      this.commitItemGroup[params.index]["WORK_CLASS_ID"] = value;
                      for (let i in this.vehicleTeamArr) {
                        if (this.vehicleTeamArr[i].itemId == value) {
                          this.commitItemGroup[params.index]["WORK_CLASS_NAME"] = this.vehicleTeamArr[i].code;
                          break;
                        }
                      }

                    },
                    'refresh': () => {
                      this.getShopClassList();
                    }
                  },
                },
                // this.vehicleTeamArr.map(function(type){
                //     return h('Option', {
                //         props: {
                //             value: type.itemId,
                //         }
                //     }, type.code);
                // })
              );
            },

          },
          {
            title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REMARK,
                      disabled: !this.isOrderSuccess,
                    },

                    on: {
                      "on-blur": (e) => {
                        this.commitItemGroup[params.index]["REMARK"] = e.target.value;

                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '操作', key: '', sortable: true, width: 100, fixed: 'right',align:'center',
            render: (h, params) => {
              if (this.titleMsg == '新建未派工') {
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
                  }, '删除')
                ]);
              } else if (this.titleMsg == '已派工维修中') {
                return h('div', [
                  h('span', '已派工维修中')
                ]);
              } else if (this.titleMsg == '已完工待结算') {
                return h('div', [
                  h('span', '已完工待结算')
                ]);
              } else if (this.titleMsg == '已结算待收款') {
                return h('div', [
                  h('span', '已结算待收款')
                ]);
              } else if (this.titleMsg == '已结清') {
                return h('div', [
                  h('span', '已结清')
                ]);
              }

            }
          },
        ],
        getItemGroup: [],
        //其他费用参数
        columns3: [
          {
            title: '项目名称', key: 'REPAIR_ITEM1', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REPAIR_ITEM1,
                      placeholder: '请输入项目名称',
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-blur": (e) => {
                        console.log(e.target.value, this.commitOtherItem);
                        this.commitOtherItem[params.index]["REPAIR_ITEM1"] = e.target.value;
                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '金额(元)', key: 'REPAIR_MONEY1', sortable: true, minWidth: 110,align:'right',
            render: (h, params) => {
              var moneNum = parseFloat(params.row.REPAIR_MONEY1) || 0;
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: moneNum,
                      disabled: !this.isOrderSuccess,
                      formatter: value => `${value}`,
                      parser: value => value.replace('', 0)
                    },
                    on: {
                      "on-change": (val) => {

                        console.log('其他费用数据----', val);
                        params.row.REPAIR_MONEY1 = parseFloat(val.toFixed(2));
                        this.commitOtherItem[params.index] = params.row;
                        this.computItemMoney();

                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '项目名称', key: 'REPAIR_ITEM2', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REPAIR_ITEM2,
                      placeholder: '请输入项目名称',
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-blur": (e) => {
                        this.commitOtherItem[params.index]["REPAIR_ITEM2"] = e.target.value;
                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '金额(元)', key: 'REPAIR_MONEY2', sortable: true, minWidth: 110,align:'right',
            render: (h, params) => {
              var moneNum = parseFloat(params.row.REPAIR_MONEY2) || 0;
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: moneNum,
                      disabled: !this.isOrderSuccess,
                      formatter: value => `${value}`,
                      parser: value => value.replace('', 0)
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.REPAIR_MONEY2 = parseFloat(val.toFixed(2));
                        this.commitOtherItem[params.index] = params.row;
                        this.computItemMoney();

                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '项目名称', key: 'REPAIR_ITEM3', sortable: true, minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REPAIR_ITEM3,
                      placeholder: '请输入项目名称',
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-blur": (e) => {
                        this.commitOtherItem[params.index]["REPAIR_ITEM3"] = e.target.value;
                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '金额(元)', key: 'REPAIR_MONEY3', sortable: true, minWidth: 110,align:'right',
            render: (h, params) => {
              var moneNum = parseFloat(params.row.REPAIR_MONEY3) || 0;
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: moneNum,
                      disabled: !this.isOrderSuccess,
                      formatter: value => `${value}`,
                      parser: value => value.replace('', 0)
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.REPAIR_MONEY3 = parseFloat(val.toFixed(2));
                        this.commitOtherItem[params.index] = params.row;
                        this.computItemMoney();

                      },

                    }
                  },
                )
              ]);
            }
          },
          {
            title: '项目名称', key: 'REPAIR_ITEM4', sortable: true, minWidth: 150,
            render: (h, params) => {

              return h('div', [
                h('Input', {
                    props: {
                      type: 'text',
                      value: params.row.REPAIR_ITEM4,
                      placeholder: '请输入项目名称',
                      disabled: !this.isOrderSuccess,
                    },
                    on: {
                      "on-blur": (e) => {
                        this.commitOtherItem[params.index]["REPAIR_ITEM4"] = e.target.value;
                      }
                    }
                  },
                )
              ]);
            }
          },
          {
            title: '金额(元)', key: 'REPAIR_MONEY4', sortable: true, minWidth: 110,align:'right',
            render: (h, params) => {
              var moneNum = parseFloat(params.row.REPAIR_MONEY4) || 0;
              return h('div', [
                h('InputNumber', {
                    props: {
                      min: 0,
                      value: moneNum,
                      disabled: !this.isOrderSuccess,
                      formatter: value => `${value}`,
                      parser: value => value.replace('', 0)
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.REPAIR_MONEY4 = parseFloat(val.toFixed(2));
                        this.commitOtherItem[params.index] = params.row;
                        this.computItemMoney();

                      },

                    }
                  },
                )
              ]);
            }
          },
        ],
        //结算信息-----
        columns4: [
          {
            title: '维修项目费用', key: 'itemMoney', minWidth: 130,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.itemMoney))
          },
          {
            title: '维修配件费用', key: 'partMoney', minWidth: 130,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.partMoney))
          },
          {
            title: '维修项目优惠金额', key: 'itemDerateMoney', minWidth: 150,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.itemDerateMoney))
          },  
          {
            title: '维修配件优惠金额', key: 'partDerateMoney', minWidth: 140,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.partDerateMoney))
          },
          {
            title: '其他项目费用', key: 'otherItemMoney', minWidth: 130,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.otherItemMoney))
          },
          {
            title: '合计应收金额', key: 'sumMoney', minWidth: 130,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.sumMoney))
          },
        ],
        accountInfo: [],
        isAccountFlag: true,
        collapse: '1',
        //基础数据-----
        listSearch: {
          "COLLECT_NO": "",
          "TENANT_ID": "",
          "REPAIR_ID": "",
          "REPAIR_NO": "",
          "VEHICLE_ID": "",
          "ENGINE_NO": "",
          "VEHICLE_COLOR": "",
          "ORDER_ID": "",
          "OUT_DATE": "",
          "OUT_MILEAGE": "",
          "OLD_PART_RESULT": "",
          "ZY_PART": "",
          "ZY_PART_BZQ": "",
          "PLATE_NUM": "",
          "VEHICLE_MODEL": "",
          "VIN_NO": "",
          "CUSTOMER_NAME": "",
          "GIVE_REPAIR_PERSON": "",
          "TELPHONE": "",
          "REPAIR_TYPE": "10191001",
          "MILEAGE": 0,
          "REPAIR_PERSON": "",
          "VEHICLE_TYPE": "10521001",
          "VEHICLE_TYPE_CODE": "轿车-排量<1.6升-A",
          "FOLLOW_PERSON": "",
          "COME_DATE": new Date(),
          "PLAN_END_DATE": new Date(),
          "FAULT_DESC": "",
          "CUSTOMER_INFO": "",
          "REPAIR_INFO": "",
          "IS_ITEM_GROUP": "10041002",
          "REPAIR_ITEM_DERATE_MONEY": 0,
          "REPAIR_PART_DERATE_MONEY": 0,
          "STATUS": "10201001",
          "REPAIR_ITEM_MONEY": 0,
          "REPAIR_PART_MONEY": 0,
          "OTHER_MONEY": 0,
          "SUM_MONEY": 0,
          "GD_TYPE": "10181001"
        },
        //规则验证-------
        ruleValidate: {
          PLATE_NUM: [
            {required: true, type: 'string', message: '请选择车型', trigger: 'change'}
          ],
          MILEAGE: [
            {required: true, type: 'number', message: '请选择里程', trigger: 'change',},
            {validator: validatePass1, trigger: 'change'},
          ],
          TELPHONE: [
            {validator: validatePass, trigger: 'change'},
          ],

        },
        titleMsg: '新建未派工',

        isOrderSuccess: true,//判断是否是派工状态状态---

        commitItemGroup: [],//提交项目组
        commitItem: [],//提交选择项目
        commitParts: [],//提交配件
        commitOtherItem: [
          {
            "REPAIR_ITEM1": "",
            "REPAIR_MONEY1": 0,
            "REPAIR_ITEM2": "",
            "REPAIR_MONEY2": 0,
            "REPAIR_ITEM3": "",
            "REPAIR_MONEY3": 0,
            "REPAIR_ITEM4": "",
            "REPAIR_MONEY4": 0,
            "CREATE_TIME": null,
            "UPDATE_TIME": null,
            "id": ""
          },
        ],//提交其他参数数据值-------

        // repairTypeArr:[],//维修类型数组
        repairPersonArr: [],//主修人数组
        serverPersonArr: [],//服务顾问数组
        // vehicleTypeArr:[],//车辆类型数组
        vehicleNumberArr: [],//车辆代号数组
        vehicleNumberArr1: [
          {code: '轿车-排量<1.6升-A', type: '10521001'},
          {code: '轿车-1.6升≤排量≤1.8升-B', type: '10521001'},
          {code: '轿车-1.8升<排量≤2.3升-C', type: '10521001'},
          {code: '轿车-2.3升<排量≤3升-D', type: '10521001'},
          {code: '轿车-3升<排量≤4升-E', type: '10521001'},
          {code: '客车-车总长≤4米（座位≤7座）-I', type: '10521002'},
          {code: '客车-4米<车总长≤5米（8座≤座位≤19座）-J', type: '10521002'},
          {code: '客车-5米<车总长≤7米（20座≤座位≤32座）-K', type: '10521002'},
          {code: '客车-7米<车总长≤10米（33座≤座位≤44座）-L', type: '10521002'},
          {code: '客车-10米<车总长（45座≤座位）-M', type: '10521002'},
          {code: '货车-载质量≤0.75吨-P', type: '10521003'},
          {code: '货车-汽油(0.75吨<载质量≤3.50吨)-Q', type: '10521003'},
          {code: '货车-柴油(0.75吨<载质量≤3.50吨)-R', type: '10521003'},
          {code: '货车-汽油(0.75吨<载质量≤3.50吨)-S', type: '10521003'},
          {code: '货车-柴油(0.75吨<载质量≤3.50吨)-T', type: '10521003'},
          {code: '货车-载质量≥8吨-U', type: '10521003'}
        ],//未筛选
        vehicleTeamArr: [],//机车班组数组-------
        buttonStateArr: {
          save: false,//保存
          dopay: false,//派工
          finish: true,//完工
          doaccount: true,//结算
          shoukuan: true,//收款
          printWts: true,//打印委托书
          printPgd: true,//打印派工单
          printAccount: true,//打印结算单
        },//按钮状态组数据
        // returnData:null,//返回数据结果---公共的---
        publicButtonFlag: true,

        startTimeOptions: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - (86400000 * 365);
          }
        }, //开始日期设置
        endTimeOptions: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now() + (86400000 * 365);
          }
        }, //结束日期设置


        wtdData: null,//委托单服务-------

        // work_price:null,//工时单价---------
        // paint_price:null,//油漆面单价-------
        itemGroupDetail: [],//维修项目套餐详情

        printFlag1: false,//打印监控----
        printFlag2: false,
        printFlag3: false,
        printFlag4: false,
        printTime: null,//打印定时器-----

        showFlag:false,
      }
    },
    props: ['showDetail', 'detailData', 'detailQuery'],
    watch: {
      showDetail() {
        this.showFlag=true;
        this.showModal = true
        

        //--------------------
        //清空公共数据值------
        this.getItem = [];
        this.getItemGroup = [];
        this.getParts = [];
        this.getParts1 = [];
        this.commitItemGroup = [];
        this.commitItem = [];
        this.commitParts = [];
        this.testSingle = false;
        this.publicButtonFlag = false;
        this.commitOtherItem = [
          {
            "REPAIR_ITEM1": "",
            "REPAIR_MONEY1": 0,
            "REPAIR_ITEM2": "",
            "REPAIR_MONEY2": 0,
            "REPAIR_ITEM3": "",
            "REPAIR_MONEY3": 0,
            "REPAIR_ITEM4": "",
            "REPAIR_MONEY4": 0,
            "CREATE_TIME": null,
            "UPDATE_TIME": null,
            "id": ""
          },
        ];
        this.isAccountFlag = true;

        this.titleMsg = "新建未派工";
        this.isOrderSuccess = true;
        //数据清空
        for (let key in this.listSearch) {
          switch (key) {
            case 'MILEAGE':
            case 'OTHER_MONEY':
            case 'REPAIR_ITEM_MONEY':
            case 'REPAIR_PART_MONEY':
            case 'REPAIR_ITEM_DERATE_MONEY':
            case 'REPAIR_PART_DERATE_MONEY':
            case 'SUM_MONEY':
              this.listSearch[key] = 0;
              break
            case 'STATUS':
              this.listSearch[key] = "10201001";
              break
            case 'REPAIR_TYPE':
              this.listSearch[key] = "10191001";
              break
            case 'IS_ITEM_GROUP':
              this.listSearch[key] = "10041002";
              break
            case 'COME_DATE':
              this.listSearch[key] = new Date();
              break
            case 'PLAN_END_DATE':
              this.listSearch[key] = new Date();
              break
            case 'VEHICLE_TYPE':
              this.listSearch[key] = "10521001";
              break
            case 'VEHICLE_TYPE_CODE':
              this.listSearch[key] = "轿车-排量<1.6升-A";
              break
            case 'GD_TYPE':
              this.listSearch[key] = "10181001";
              break
            default :
              this.listSearch[key] = ''

          }
        }
        //按钮状态初始化
        for (let i in this.buttonStateArr) {
          switch (i) {
            case 'save':
            case 'dopay':
              this.buttonStateArr[i] = false;
              break
            default :
              this.buttonStateArr[i] = true;
          }
        }


        if (this.detailQuery) {

          this.commitItemGroup = this.detailQuery.commitItemGroup;
          this.commitItem = this.detailQuery.commitItem;
          this.commitParts = this.detailQuery.commitParts;

          //判断维修项目套餐是否显示---------------------------
          if ("10041002" == this.detailQuery.listSearch['IS_ITEM_GROUP']) {
            this.testSingle = false;
          } else if ("10041001" == this.detailQuery.listSearch['IS_ITEM_GROUP']) {
            this.testSingle = true;
          } else {
            this.testSingle = false;
          }
          // this.publicButtonFlag=true;
          //进来数据重新赋值-----------------
          for (let key in this.detailQuery.listSearch) {
            this.listSearch[key] = this.detailQuery.listSearch[key];
          }
          this.selectCarInitFun(this.listSearch.VEHICLE_TYPE, this.listSearch.VEHICLE_TYPE_CODE);
          this.listSearch['GIVE_REPAIR_PERSON'] = this.detailQuery.listSearch['CUSTOMER_NAME'];

        } else {
          //判断进来的参数是否存在---------------------
          if (this.detailData) {
            //初始化车辆数据----------------
            this.selectCarInitFun(this.detailData.VEHICLE_TYPE, this.detailData.VEHICLE_TYPE_CODE);

            for (let key in this.detailData) {
              this.listSearch[key] = this.detailData[key];
            }

            //获取项目组数据---------------
            this.getItemFun(this.listSearch["REPAIR_ID"]);
            this.getItemGroupFun(this.listSearch["REPAIR_ID"]);
            this.getPartsFun(this.listSearch["REPAIR_ID"]);
            this.getOtherFun(this.listSearch["REPAIR_ID"]);
            this.printFlag1 = false;
            this.printFlag2 = false;
            this.printFlag3 = false;
            this.printFlag4 = false;

            //判断维修项目套餐是否显示---------------------------
            if ("10041002" == this.detailData['IS_ITEM_GROUP']) {
              this.testSingle = false;
            } else if ("10041001" == this.detailData['IS_ITEM_GROUP']) {
              this.testSingle = true;
            } else {
              this.testSingle = false;
            }

            if (this.detailData['STATUS'] == '10201001') {
              this.titleMsg = "新建未派工";


              this.isOrderSuccess = true;

              for (let i in this.buttonStateArr) {
                switch (i) {
                  case 'save':
                  case 'dopay':
                    this.buttonStateArr[i] = false;
                    break
                  default :
                    this.buttonStateArr[i] = true;
                }
              }

            } else if (this.detailData['STATUS'] == '10201002') {
              this.titleMsg = "已派工维修中";


              this.isOrderSuccess = false;

              for (let i in this.buttonStateArr) {
                switch (i) {
                  case 'finish':
                  case 'printWts':
                  case 'printPgd':
                    this.buttonStateArr[i] = false;
                    break
                  default :
                    this.buttonStateArr[i] = true;
                }
              }

            } else if (this.detailData['STATUS'] == '10201003') {
              this.titleMsg = "已完工待结算";
              this.isOrderSuccess = false;

              for (let i in this.buttonStateArr) {
                switch (i) {
                  case 'doaccount':
                  case 'printWts':
                  case 'printPgd':
                    this.buttonStateArr[i] = false;
                    break
                  default :
                    this.buttonStateArr[i] = true;
                }
              }
            } else if (this.detailData['STATUS'] == '10201004') {
              this.titleMsg = "已结算待收款";
              this.isOrderSuccess = false;

              for (let i in this.buttonStateArr) {
                switch (i) {
                  case 'shoukuan':
                  case 'printAccount':
                  case 'printWts':
                  case 'printPgd':
                    this.buttonStateArr[i] = false;
                    break
                  default :
                    this.buttonStateArr[i] = true;
                }
              }
            } else if (this.detailData['STATUS'] == '10201005') {
              this.titleMsg = "已结清";
              this.isOrderSuccess = false;
              this.isAccountFlag = false;
              for (let i in this.buttonStateArr) {
                switch (i) {
                  case 'printAccount':
                  case 'printWts':
                  case 'printPgd':
                    this.buttonStateArr[i] = false;
                    break
                  default :
                    this.buttonStateArr[i] = true;
                }
              }
            }

          } else {

            //初始化按钮状态-----------

            this.vehicleNumberArr = [
              {code: '轿车-排量<1.6升-A', type: '10521001'},
              {code: '轿车-1.6升≤排量≤1.8升-B', type: '10521001'},
              {code: '轿车-1.8升<排量≤2.3升-C', type: '10521001'},
              {code: '轿车-2.3升<排量≤3升-D', type: '10521001'},
              {code: '轿车-3升<排量≤4升-E', type: '10521001'},
            ];
            //新建功能表------


          }
        }

        this.getShopClassList();
        this.getEmployeeList(this.detailData);
      }
    },
  //  activated(){
  //     console.log("获取到的对象值：",document.querySelector(".ivu-modal-body"));

  //         console.log("底部高度"+document.querySelector(".ivu-modal-body").scrollTop);

        
  //       document.querySelector(".ivu-modal-body").scrollTop=0;
  //   },
    mounted() {
      this.wtdData = this.$store.state.user.userInfo.tenant;
      //获取单价------
      //   this.work_price=parseFloat(getUserInfo(this.$store.state.user.userInfo.params, 'P1001'));
      //   this.paint_price=parseFloat(getUserInfo(this.$store.state.user.userInfo.params, 'P1002'));
    },
    computed: {
      work_price() {
        return parseFloat(getUserInfo(this.$store.state.user.userInfo.params, 'P1001'));
      },
      paint_price() {
        return parseFloat(getUserInfo(this.$store.state.user.userInfo.params, 'P1002'));
      },
      //车辆颜色------
      carColorData() {
        return getDictGroup(this.$store.state.app.dict, '1013');
      },
      //维修类型-----
      repairTypeArr() {
        return getDictGroup(this.$store.state.app.dict, '1019');
      },
      //车辆类型---
      vehicleTypeArr() {
        return getDictGroup(this.$store.state.app.dict, '1052');
      },
      //配件单位数据-------
      partsUnit() {
        return getDictGroup(this.$store.state.app.dict, '1015');
      },
      //配件品牌-----
      bandTypeFun() {
        return getDictGroup(this.$store.state.app.dict, '1016');
      },
      //配件类型
      partsTypeFun() {
        return getDictGroup(this.$store.state.app.dict, '1017');
      },


    },
    methods: {
      //得到机修班组数据
      getShopClassList() {
        this.vehicleTeamArr = [];
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getShopClassList',
          method: 'post',
          data: {
            node: 0,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            for (let i in res.data) {
              var obj = {code: '', itemId: ''};
              obj.code = res.data[i].text;
              obj.itemId = res.data[i].itemId;
              this.vehicleTeamArr.push(obj);
            }
            
          }
        })
      },
      //得到主修人数据
      getEmployeeList(val) {
        this.repairPersonArr = [];
        this.serverPersonArr = [];
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
            for (let i in res.data) {
              var obj = {code: ''};
              obj.code = res.data[i].USER_NAME;
              this.repairPersonArr.push(obj);
              this.serverPersonArr.push(obj);
            }
            //初始化主修人数据
            if (!val) {
              this.listSearch.FOLLOW_PERSON = this.$store.state.user.userInfo.user.userName;
              this.listSearch.REPAIR_PERSON = this.$store.state.user.userInfo.user.userName;
            }
            
          }
        })
      },
      //选择车辆类型初始化
      selectCarInitFun(val, key) {
        this.listSearch.VEHICLE_TYPE_CODE = key || "";
        this.vehicleNumberArr = [];
        // this.listSearch.VEHICLE_TYPE_CODE="";
        for (let i in this.vehicleNumberArr1) {
          if (this.vehicleNumberArr1[i].type == val) {
            this.vehicleNumberArr.push(this.vehicleNumberArr1[i]);
          }
        }
        this.listSearch.VEHICLE_TYPE_CODE = this.vehicleNumberArr[0]['code'];
      },

      visibleChange(status) {
        if (status === false) {
          document.querySelector(".ivu-modal-body").scrollTop=0;
          this.$emit('closeDetail');
          this.handleReset("listSearch");
        }
      },
      //保存按钮-----------
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.listSearch.VEHICLE_MODEL&&this.listSearch.VIN_NO) {
              if(this.listSearch.CUSTOMER_NAME){
                  this.$Modal.confirm({
                    title: "系统提示!",
                    content: "确定要保存吗？",
                    onOk: this.saveData,

                  })
              }else{
                  this.$Modal.confirm({
                    title: "系统提示!",
                    content:"车主名称缺失，请先完善客户信息",
                    onOk:this.perfectCustomerData,

                  })
              }
              
            } else {
              this.$Modal.confirm({
                title: "系统提示!",
                content: "请先完善车辆信息",
                onOk: this.perfectCarData,

              })
            }
          }
        });
      },
      perfectCarData() {
        this.$router.push({path: '/cart-list'});
      },
      perfectCustomerData(){
        this.$router.push({path:'/customer-list'});
      },
      saveData() {
        // this.listSearch.COME_DATE=formatDate(this.listSearch.COME_DATE);
        // this.listSearch.PLAN_END_DATE=formatDate(this.listSearch.PLAN_END_DATE);
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
          method: 'post',
          data: {
            data: JSON.stringify(this.listSearch),
            items: JSON.stringify(this.commitItem),
            itemGroups: JSON.stringify(this.commitItemGroup),
            parts: JSON.stringify(this.commitParts),
            otherItems: JSON.stringify(this.commitOtherItem),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.info('保存成功');
            this.$store.commit('setMathRand',Math.random());
            for (let key in res.data) {
              this.listSearch[key] = res.data[key];

            }
            this.getItemFun(this.listSearch["REPAIR_ID"]);
            this.getPartsFun(this.listSearch["REPAIR_ID"]);
            this.$emit('closeGetList');//重新请求数据
          }
        })
      },
      //派工按钮----------------
      handleCommit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.listSearch.VEHICLE_MODEL&&this.listSearch.VIN_NO) {
              if(this.listSearch.CUSTOMER_NAME){
                  this.$Modal.confirm({
                    title: "系统提示!",
                    content: "确定要派工吗？",
                    onOk: this.commitdata,

                  })
              }else{
                  this.$Modal.confirm({
                    title: "系统提示!",
                    content:"车主名称缺失，请先完善客户信息",
                    onOk:this.perfectCustomerData,

                  })
              }
              
            } else {
              this.$Modal.confirm({
                title: "系统提示!",
                content: "请先完善车辆信息",
                onOk: this.perfectCarData,

              })
            }

          }
        });

      },
      commitdata() {
        this.listSearch["STATUS"] = "10201002";
        this.listSearch.COME_DATE = formatDate(this.listSearch.COME_DATE) + ' ' + formatDate(this.listSearch.COME_DATE, 'hh:mm:ss');
        
        this.listSearch.PLAN_END_DATE = formatDate(this.listSearch.PLAN_END_DATE);
        //提交维修项目套餐
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
          method: 'post',
          data: {
            data: JSON.stringify(this.listSearch),
            items: JSON.stringify(this.commitItem),
            itemGroups: JSON.stringify(this.commitItemGroup),
            parts: JSON.stringify(this.commitParts),
            otherItems: JSON.stringify(this.commitOtherItem),
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.info('派工成功');
            this.$store.commit('setMathRand',Math.random());
            this.titleMsg = "已派工维修中";
            this.isOrderSuccess = false;
            for (let key in res.data) {
              this.listSearch[key] = res.data[key];

            }

            for (let i in this.buttonStateArr) {
              switch (i) {
                case 'finish':
                case 'printWts':
                case 'printPgd':
                  this.buttonStateArr[i] = false;
                  break
                default :
                  this.buttonStateArr[i] = true;
              }
            }
            this.getItemFun(this.listSearch["REPAIR_ID"]);
            this.getPartsFun(this.listSearch["REPAIR_ID"]);
            this.$emit('closeGetList');//重新请求数据

            this.itemGroupDetail = [];
            if (this.commitItemGroup.length > 0) {
              for (let i in this.commitItemGroup) {
                this.getItemDetail(this.commitItemGroup[i]['GROUP_ID']);
              }
            }

          }
        })
      },
      //完工按钮-------------------
      handleFinish() {
        this.$Modal.confirm({
          title: "系统提示!",
          content: "确定要完工吗？",
          onOk: this.saveFinish,

        })
      },
      saveFinish() {
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
            this.$Message.info('成功');
            this.titleMsg = "已完工待结算";

            for (let i in this.buttonStateArr) {
              switch (i) {
                case 'doaccount':
                case 'printWts':
                case 'printPgd':
                  this.buttonStateArr[i] = false;
                  break
                default :
                  this.buttonStateArr[i] = true;
              }
            }
            this.$emit('closeGetList');//重新请求数据
          }
        })
      },
      //结算按钮-----------
      handleAccount() {
        this.showSelectAccount = Math.random();
        
      },
      //结算单组建传出来的按钮判断-----

      emitAccount(val) {
        if (val[0] == '10201004') {
          for (let i in this.buttonStateArr) {
            switch (i) {
              case 'shoukuan':
              case 'printAccount':
              case 'printWts':
              case 'printPgd':
                this.buttonStateArr[i] = false;
                break
              default :
                this.buttonStateArr[i] = true;
            }
          }
          this.$emit('closeGetList');//重新请求数据
          this.titleMsg = "已结算待收款";
        } else if (val[0] == '10201005') {
          for (let i in this.buttonStateArr) {
            switch (i) {
              case 'printAccount':
              case 'printWts':
              case 'printPgd':
                this.buttonStateArr[i] = false;
                break
              default :
                this.buttonStateArr[i] = true;
            }
          }
          this.$emit('closeGetList');//重新请求数据
          this.titleMsg = "已结清";
        }

        if (val[1]) {
          this.accountInfo = [];
          var newJson = {
            itemMoney: 0,
            partMoney: 0,
            itemDerateMoney: 0,
            partDerateMoney: 0,
            otherItemMoney: 0,
            sumMoney: 0,
          }

          for (let i in val[1]) {
            switch (i) {
              case 'REPAIR_ITEM_MONEY':
                newJson['itemMoney'] = val[1][i];
                this.listSearch[i] = val[1][i];
                break;
              case 'REPAIR_ITEM_DERATE_MONEY':
                newJson['itemDerateMoney'] = val[1][i];
                this.listSearch[i] = val[1][i];
                break;
              case 'REPAIR_PART_DERATE_MONEY':
                newJson['partDerateMoney'] = val[1][i];
                this.listSearch[i] = val[1][i];
                break;
              case 'REPAIR_PART_MONEY':
                newJson['partMoney'] = val[1][i];
                this.listSearch[i] = val[1][i];
                break;
              case 'OTHER_MONEY':
                newJson['otherItemMoney'] = val[1][i];
                this.listSearch[i] = val[1][i];
                break;
              case 'SUM_MONEY':
                newJson['sumMoney'] = val[1][i];
                this.listSearch[i] = val[1][i];
                break;
              default :
                this.listSearch[i] = val[1][i];
            }
          }

          this.accountInfo.push(newJson);
          this.isAccountFlag = false;
        }


      },


      handleReset(name) {
        this.$refs[name].resetFields();
      },
      //获取维修项目内容
      getItemFun(repairId) {
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getItems',
          method: 'post',
          data: {
            repairId: repairId,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {

            this.sTenanceItem1(res.data);
            this.printFlag1 = true;
          }
        })
      },
      //获取维修项目套餐内容
      getItemGroupFun(repairId) {
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
            this.commitItemGroup = res.data;
            this.itemGroupDetail = [];
            if (this.commitItemGroup.length > 0) {
              for (let i in this.commitItemGroup) {
                this.getItemDetail(this.commitItemGroup[i]['GROUP_ID']);
              }
            }
            this.printFlag2 = true;
          }
        })
      },
      //获取维修配件内容
      getPartsFun(repairId) {
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
            this.selectPartsGroup1(res.data);
            if (res.data.length > 0) {
              this.listSearch["REPAIR_PART_MONEY"] = 0;
              for (let i in res.data) {
                this.listSearch["REPAIR_PART_MONEY"] += res.data[i]['PART_MONEY'];
              }
            }
            this.printFlag3 = true;


          }
        })
      },
      //获取其他数据内容
      getOtherFun(repairId) {
        this.listSearch["OTHER_MONEY"] = 0;
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
          
          if (res.success === true) {
            if (res.data.length > 0) {
              this.commitOtherItem = res.data;
              this.commitOtherItem[0]['REPAIR_MONEY1'] = parseFloat(this.commitOtherItem[0]['REPAIR_MONEY1']) || 0;
              this.commitOtherItem[0]['REPAIR_MONEY2'] = parseFloat(this.commitOtherItem[0]['REPAIR_MONEY2']) || 0;

              this.commitOtherItem[0]['REPAIR_MONEY3'] = parseFloat(this.commitOtherItem[0]['REPAIR_MONEY3']) || 0;

              this.commitOtherItem[0]['REPAIR_MONEY4'] = parseFloat(this.commitOtherItem[0]['REPAIR_MONEY4']) || 0;

              this.listSearch["OTHER_MONEY"] += parseFloat(res.data[0]['REPAIR_MONEY1']) || 0;
              this.listSearch["OTHER_MONEY"] += parseFloat(res.data[0]['REPAIR_MONEY2']) || 0;
              this.listSearch["OTHER_MONEY"] += parseFloat(res.data[0]['REPAIR_MONEY3']) || 0;
              this.listSearch["OTHER_MONEY"] += parseFloat(res.data[0]['REPAIR_MONEY4']) || 0;
            } else {
              this.commitOtherItem = [
                {
                  "REPAIR_ITEM1": "",
                  "REPAIR_MONEY1": 0,
                  "REPAIR_ITEM2": "",
                  "REPAIR_MONEY2": 0,
                  "REPAIR_ITEM3": "",
                  "REPAIR_MONEY3": 0,
                  "REPAIR_ITEM4": "",
                  "REPAIR_MONEY4": 0,
                  "CREATE_TIME": null,
                  "UPDATE_TIME": null,
                  "id": ""
                },
              ];
            }
            this.printFlag4 = true;
          }
        })
      },


      //监听选择车辆----
      selectCar(val) {
        
        this.listSearch["VEHICLE_MODEL"] = val["VEHICLE_MODEL"];
        this.listSearch["PLATE_NUM"] = val["PLATE_NUM"];
        this.listSearch["ORDER_PERSON"] = val["CUSTOMER_NAME"];
        this.listSearch["CUSTOMER_NAME"] = val["CUSTOMER_NAME"];
        this.listSearch["GIVE_REPAIR_PERSON"] = val["CUSTOMER_NAME"];
        this.listSearch["TELPHONE"] = val["MOBILE_PHONE"];
        this.listSearch["VIN_NO"] = val["VIN_NO"];
        this.listSearch["VEHICLE_ID"] = val["VEHICLE_ID"];
        this.listSearch["VEHICLE_COLOR"] = val["VEHICLE_COLOR"];
        this.listSearch["ENGINE_NO"] = val["ENGINE_NO"];
      },

      //选择维修项目按钮----------
      goOnTenanceItem() {
        this.showTenanceItems = Math.random();
        this.initGetItem = this.commitItem;
      },
      //获取维修项目数据-------
      sTenanceItem(val) {
        
        this.getItem = val;
        this.commitItem = [];
        for (let j in this.getItem) {
          var listItemsModel = {
            "DETAIL_ID": "",
            "ITEM_ID": "",
            "TENANT_ID": "",
            "CREATE_TIME": "",
            "NAME": "",
            "ITEM_NO": "",
            "TYPE_ID": "",
            "STATUS": "",
            "CHARGE_TYPE": "",
            "REPAIR_TIME": 0,
            "REPAIR_MONEY": 0,
            "PAINT_NUM": 0,
            "IS_PREINSTALL": "",
            "CLASS_NAME": "",
            "CLASS_TYPE": "",
            "ENGINE_TYPE_NAME": "",
            "ENGINE_TYPE": "",
            "SORT": "",
            "TYPE_NAME": "",
            "cartype": "",
            "BUSINESS_TYPE": "",
            "UPDATE_TIME": null,
            "id": "",
            "ITEM_MONEY": 0,
            "ITEM_DERATE_MONEY": 0,
            "ITEM_LAST_MONEY": 0,
            "SUM_MONEY": 0,
            "COME_DATE": null,
            "PLAN_END_DATE": null,
            "REPAIR_ITEM_MONEY": 0,
            "REPAIR_PART_MONEY": 0,
            "REPAIR_ITEM_DERATE_MONEY": 0,
            "REPAIR_PART_DERATE_MONEY": 0,
            "ACCOUNT_TIME": null,
            "ORDER_DATE": null,
            "IS_SEL": true,
            "REMARK": "",
            "WORK_CLASS_ID": '',
            "WORK_CLASS_NAME": "",
          }
          for (let i in this.getItem[j]) {
            listItemsModel[i] = this.getItem[j][i];
          }
          listItemsModel["ITEM_MONEY"] = listItemsModel["REPAIR_TIME"] * this.work_price + listItemsModel["PAINT_NUM"] * this.paint_price + listItemsModel["REPAIR_MONEY"];
          listItemsModel["ITEM_LAST_MONEY"] = listItemsModel["REPAIR_TIME"] * this.work_price + listItemsModel["PAINT_NUM"] * this.paint_price + listItemsModel["REPAIR_MONEY"] - listItemsModel["ITEM_DERATE_MONEY"];
          
          this.commitItem.push(listItemsModel);
        }
        this.computItemMoney();
      },
      sTenanceItem1(val) {
        
        this.getItem = val;
        this.commitItem = [];
        for (let j in this.getItem) {
          var listItemsModel = {
            "DETAIL_ID": "",
            "ITEM_ID": "",
            "TENANT_ID": "",
            "CREATE_TIME": "",
            "NAME": "",
            "ITEM_NO": "",
            "TYPE_ID": "",
            "STATUS": "",
            "CHARGE_TYPE": "",
            "REPAIR_TIME": 0,
            "REPAIR_MONEY": 0,
            "PAINT_NUM": 0,
            "IS_PREINSTALL": "",
            "CLASS_NAME": "",
            "CLASS_TYPE": "",
            "ENGINE_TYPE_NAME": "",
            "ENGINE_TYPE": "",
            "SORT": "",
            "TYPE_NAME": "",
            "cartype": "",
            "BUSINESS_TYPE": "",
            "UPDATE_TIME": null,
            "id": "",
            "ITEM_MONEY": 0,
            "ITEM_DERATE_MONEY": 0,
            "ITEM_LAST_MONEY": 0,
            "SUM_MONEY": 0,
            "COME_DATE": null,
            "PLAN_END_DATE": null,
            "REPAIR_ITEM_MONEY": 0,
            "REPAIR_PART_MONEY": 0,
            "REPAIR_ITEM_DERATE_MONEY": 0,
            "REPAIR_PART_DERATE_MONEY": 0,
            "ACCOUNT_TIME": null,
            "ORDER_DATE": null,
            "IS_SEL": true,
            "REMARK": "",
            "WORK_CLASS_ID": '',
            "WORK_CLASS_NAME": "",
          }
          for (let i in this.getItem[j]) {
            listItemsModel[i] = this.getItem[j][i];
          }
          listItemsModel["ITEM_MONEY"] = listItemsModel["REPAIR_TIME"] * this.work_price + listItemsModel["PAINT_NUM"] * this.paint_price + listItemsModel["REPAIR_MONEY"];
          listItemsModel["ITEM_LAST_MONEY"] = (listItemsModel["REPAIR_TIME"] * this.work_price + listItemsModel["PAINT_NUM"] * this.paint_price + listItemsModel["REPAIR_MONEY"] - listItemsModel["ITEM_DERATE_MONEY"]).toFixed(2);
          
          this.commitItem.push(listItemsModel);
        }
      },
      //删除维修项目数据
      deleteTenanceItem(index) {
        this.commitItem.splice(index, 1);
        this.computItemMoney();
      },

      //获取选择配件数据
      selectPartsItem(val) {
        
        this.getParts = val;
        this.commitParts = [];

        for (let j in this.getParts) {
          if (this.getParts[j]["STOCK_ID"]) {
            var commitParts = {
              "STOCK_ID": "",
              "TENANT_ID": "",
              "CREATE_TIME": "",
              "CREATER": "",
              "UPDATE_TIME": "",
              "UPDATER": "",
              "PART_ID": "",
              "STORE_ID": "",
              "STOCK_NUM": "",
              "UNIT_COST": "",
              "LAST_IN_DATE": "",
              "LAST_OUT_DATE": "",
              "NAME": "",
              "PART_NO": "",
              "TYPE_ID": "",
              "SALES_PRICE": 0,
              "UNIT": "",
              "BRAND": "",
              "FORMAT": "",
              "FACTORY_NO": "",
              "PURCHASE_PRICE": 0,
              "MIN_SALES_PRICE": "",
              "MAX_SALES_PRICE": "",
              "STORE_NAME": "",
              "id": "",
              "PART_MONEY": 0,
              "PART_DERATE_MONEY": 0,
              "PART_LAST_MONEY": 0,
              "PART_NUM": 1,
              "GET_PART_TIME": null,
              "REMARK": "",
              "IS_SELF": false,
              "COST_MONEY": 0,
              "IS_SEL": true
            }
            for (let i in commitParts) {
              if (this.getParts[j][i]) {
                commitParts[i] = this.getParts[j][i];
              } else if (i == "PART_MONEY") {
                commitParts[i] = this.getParts[j]["SALES_PRICE"] * (this.getParts[j]["PART_NUM"] || 1);

                
              } else if (i == "PART_LAST_MONEY") {
                commitParts[i] = this.getParts[j]["SALES_PRICE"] * (this.getParts[j]["PART_NUM"] || 1);

                
              }
            }
            this.commitParts.push(commitParts);
          }

        }
        for (let j in this.getParts1) {
          if (this.getParts1[j]["STOCK_ID"]) {

          } else {
            var commitParts = {
              "PART_ID": "",
              "TENANT_ID": "",
              "CREATE_TIME": "",
              "CREATER": "",
              "NAME": "",
              "PART_NO": "",
              "TYPE_ID": "",
              "SALES_PRICE": 0,
              "UNIT": "",
              "BRAND": "",
              "FORMAT": "",
              "FACTORY_NO": "",
              "PART_SOURCE": "",
              "IS_CANCEL": "",
              "RATE": "",
              "TAX": "",
              "NOT_CONTAINS_TAX_SALE_PRICE": "",
              "TYPE_NAME": "",
              "FATHER_ID": "",
              "GRAND_ID": "",
              "UPDATE_TIME": null,
              "id": "",
              "STOCK_NUM": 0,
              "PART_MONEY": 0,
              "PART_DERATE_MONEY": 0,
              "PART_LAST_MONEY": 0,
              "PART_NUM": 1,
              "UNIT_COST": 0,
              "GET_PART_TIME": null,
              "REMARK": "",
              "IS_SELF": false,
              "COST_MONEY": 0,
              "IS_SEL": true,//新加的字段
              "UPDATER": "",
              "PURCHASE_PRICE": "",
              "THREE_EXPIRATION_DATE": "",
              "EXPIRATION_DATE": '',
              "STATUS": "",
            }
            for (let i in commitParts) {
              if (this.getParts1[j][i]) {
                commitParts[i] = this.getParts1[j][i];
              } else if (i == "PART_MONEY") {
                commitParts[i] = this.getParts1[j]["SALES_PRICE"] * (this.getParts1[j]["PART_NUM"] || 1);
                
              } else if (i == "PART_LAST_MONEY") {
                commitParts[i] = this.getParts1[j]["SALES_PRICE"] * (this.getParts1[j]["PART_NUM"] || 1);
                
              }
            }
            this.commitParts.push(commitParts);
          }

        }
        
        this.computItemMoney();
      },
      //获取选择配件档案数据----配件用的是这个
      selectPartsGroup(val) {
        
        this.getParts1 = val;
        this.commitParts = [];

        for (let j in this.getParts1) {
          var commitParts = {
            "PART_ID": "",
            "TENANT_ID": "",
            "CREATE_TIME": "",
            "CREATER": "",
            "NAME": "",
            "PART_NO": "",
            "TYPE_ID": "",
            "SALES_PRICE": 0,
            "UNIT": "",
            "BRAND": "",
            "FORMAT": "",
            "FACTORY_NO": "",
            "PART_SOURCE": "",
            "IS_CANCEL": "",
            "RATE": "",
            "TAX": "",
            "NOT_CONTAINS_TAX_SALE_PRICE": "",
            "TYPE_NAME": "",
            "FATHER_ID": "",
            "GRAND_ID": "",
            "UPDATE_TIME": null,
            "id": "",
            "STOCK_NUM": 0,
            "PART_MONEY": 0,
            "PART_DERATE_MONEY": 0,
            "PART_LAST_MONEY": 0,
            "PART_NUM": 1,
            "UNIT_COST": 0,
            "GET_PART_TIME": null,
            "REMARK": "",
            "IS_SELF": false,
            "COST_MONEY": 0,
            "IS_SEL": true,//新加的字段
            "UPDATER": "",
            "PURCHASE_PRICE": "",
            "THREE_EXPIRATION_DATE": "",
            "EXPIRATION_DATE": '',
            "STATUS": "",
          }
          for (let i in this.getParts1[j]) {
            commitParts[i] = this.getParts1[j][i];
          }

          commitParts["PART_MONEY"] = commitParts["SALES_PRICE"] * (commitParts["PART_NUM"] || 1);
          commitParts["PART_LAST_MONEY"] = commitParts["SALES_PRICE"] * (commitParts["PART_NUM"] || 1) - commitParts["PART_DERATE_MONEY"];
          this.commitParts.push(commitParts);


        }
        this.computItemMoney();
      },
      selectPartsGroup1(val) {
        
        this.getParts1 = val;
        this.commitParts = [];

        for (let j in this.getParts1) {
          var commitParts = {
            "PART_ID": "",
            "TENANT_ID": "",
            "CREATE_TIME": "",
            "CREATER": "",
            "NAME": "",
            "PART_NO": "",
            "TYPE_ID": "",
            "SALES_PRICE": 0,
            "UNIT": "",
            "BRAND": "",
            "FORMAT": "",
            "FACTORY_NO": "",
            "PART_SOURCE": "",
            "IS_CANCEL": "",
            "RATE": "",
            "TAX": "",
            "NOT_CONTAINS_TAX_SALE_PRICE": "",
            "TYPE_NAME": "",
            "FATHER_ID": "",
            "GRAND_ID": "",
            "UPDATE_TIME": null,
            "id": "",
            "STOCK_NUM": 0,
            "PART_MONEY": 0,
            "PART_DERATE_MONEY": 0,
            "PART_LAST_MONEY": 0,
            "PART_NUM": 1,
            "UNIT_COST": 0,
            "GET_PART_TIME": null,
            "REMARK": "",
            "IS_SELF": false,
            "COST_MONEY": 0,
            "IS_SEL": true,//新加的字段
            "UPDATER": "",
            "PURCHASE_PRICE": "",
            "THREE_EXPIRATION_DATE": "",
            "EXPIRATION_DATE": '',
            "STATUS": "",
          }
          for (let i in this.getParts1[j]) {
            commitParts[i] = this.getParts1[j][i];
          }
          commitParts["PART_MONEY"] = this.getParts1[j]["SALES_PRICE"] * (this.getParts1[j]["PART_NUM"] || 1);
          commitParts["PART_LAST_MONEY"] = this.getParts1[j]["SALES_PRICE"] * (this.getParts1[j]["PART_NUM"] || 1) - commitParts["PART_DERATE_MONEY"];
          this.commitParts.push(commitParts);
        }
      },
      //选择配件按钮------
      goOnSelectParts() {
        this.showSelectParts = Math.random();
        this.initParts = this.commitParts;
      },
      //选择配件组按钮--------
      goOnSelectPartsGroup() {
        this.showSelectPartsGroup = Math.random();
        this.initPartsGroup = this.commitParts;

      },
      //删除配件数据
      deletePartsGroup(index, STOCK_ID, PART_ID) {
        this.commitParts.splice(index, 1);
        if (STOCK_ID) {
          for (let i in this.getParts) {
            if (this.getParts[i]['STOCK_ID'] == STOCK_ID) {
              this.getParts.splice(i, 1);
              break;
            }
          }
        } else {
          for (let i in this.getParts1) {
            if (this.getParts1[i]['PART_ID'] == PART_ID) {
              this.getParts1.splice(i, 1);
              break;
            }
          }
        }
        
        this.computItemMoney();
      },
      //选择项目套餐按钮-------
      goOnItemGroup() {
        this.showSelectItemGroup = Math.random();
        this.initItemGroup = this.commitItemGroup;
      },
      //双击查看项目套餐详情------
      onRowDblclick(val) {
        this.showItemFlag = Math.random();
        this.itemDetailId = val.GROUP_ID;
      },
      //跳转项目套餐---
      goOnItemLink() {
        this.$router.push({path: '/service-combo'});
      },
      selectItemGroup(val) {
        
        this.getItemGroup = val;
        //提交维修项目套餐
        this.commitItemGroup = [];
        for (let j in this.getItemGroup) {
          var commitItemGroup = {
            "DETAIL_ID": "",
            "TENANT_ID": "",
            "CREATE_TIME": "",
            "UPDATER": "",
            "CREATER": "",
            "ORDER_ID": "",
            "GROUP_ID": "",
            "SALES_PRICE": 0,
            "ITEM_DERATE_MONEY": 0,
            "ITEM_LAST_MONEY": 0,
            "GROUP_NAME": "",
            "UPDATE_TIME": null,
            "id": "",
            "REPAIR_TIME": 0,
            "REPAIR_MONEY": 0,
            "ITEM_MONEY": 0,
            "SUM_MONEY": 0,
            "PAINT_NUM": 0,
            "COME_DATE": null,
            "PLAN_END_DATE": null,
            "REPAIR_ITEM_MONEY": 0,
            "REPAIR_PART_MONEY": 0,
            "REPAIR_ITEM_DERATE_MONEY": 0,
            "REPAIR_PART_DERATE_MONEY": 0,
            "ACCOUNT_TIME": null,
            "ORDER_DATE": null,
            "REMARK": "",//地下新加的
            "GROUP_NO": "",
            "GROUP_INFO": "",
            "STATUS": "",
            "IS_PREINSTALL": "",
            "IS_SEL": true,
            "WORK_CLASS_ID": '',
            "WORK_CLASS_NAME": "",

          }
          for (let i in this.getItemGroup[j]) {
            commitItemGroup[i] = this.getItemGroup[j][i];
          }

          commitItemGroup["ITEM_LAST_MONEY"] = commitItemGroup["SALES_PRICE"] - commitItemGroup["ITEM_DERATE_MONEY"];
          this.commitItemGroup.push(commitItemGroup);
        }

        //计算金额
        this.computItemMoney();

      },
      //计算维修项目类的金额-----------
      computItemMoney(flag) {
        this.listSearch["REPAIR_ITEM_MONEY"] = 0;
        this.listSearch["REPAIR_ITEM_DERATE_MONEY"] = 0;
        this.listSearch["SUM_MONEY"] = 0;
        this.listSearch["REPAIR_PART_MONEY"] = 0;
        this.listSearch["REPAIR_PART_DERATE_MONEY"] = 0;
        this.listSearch['OTHER_MONEY'] = 0;
        if (flag) {
          for (let i in this.commitItem) {
            this.listSearch["REPAIR_ITEM_MONEY"] += this.commitItem[i]["ITEM_MONEY"];
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"] += this.commitItem[i]["ITEM_DERATE_MONEY"];
          }
        } else {
          for (let i in this.commitItem) {
            this.listSearch["REPAIR_ITEM_MONEY"] += this.commitItem[i]["REPAIR_TIME"] * this.work_price + this.commitItem[i]["PAINT_NUM"] * this.paint_price + this.commitItem[i]["REPAIR_MONEY"];
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"] += this.commitItem[i]["ITEM_DERATE_MONEY"];
          }
        }

        for (let i in this.commitItemGroup) {
          this.listSearch["REPAIR_ITEM_MONEY"] += this.commitItemGroup[i]["SALES_PRICE"];
          this.listSearch["REPAIR_ITEM_DERATE_MONEY"] += this.commitItemGroup[i]["ITEM_DERATE_MONEY"];
        }
        for (let i in this.commitParts) {
          this.listSearch["REPAIR_PART_MONEY"] += this.commitParts[i]["SALES_PRICE"] * (this.commitParts[i]["PART_NUM"] || 1);
          this.listSearch["REPAIR_PART_DERATE_MONEY"] += this.commitParts[i]["PART_DERATE_MONEY"];
        }
        for (let key in this.commitOtherItem[0]) {
          switch (key) {
            case 'REPAIR_MONEY1':
            case 'REPAIR_MONEY2':
            case 'REPAIR_MONEY3':
            case 'REPAIR_MONEY4':
            case 'VEHICLE_TYPE_CODE':
              this.listSearch["OTHER_MONEY"] += this.commitOtherItem[0][key];
              break
          }
        }
        this.listSearch["SUM_MONEY"] = (this.listSearch["REPAIR_ITEM_MONEY"] + this.listSearch["REPAIR_PART_MONEY"] + this.listSearch["OTHER_MONEY"] - this.listSearch["REPAIR_ITEM_DERATE_MONEY"] - this.listSearch["REPAIR_PART_DERATE_MONEY"]).toFixed(2);
        this.listSearch["REPAIR_ITEM_MONEY"] = (this.listSearch["REPAIR_ITEM_MONEY"]).toFixed(2);
        this.listSearch["REPAIR_PART_MONEY"] = (this.listSearch["REPAIR_PART_MONEY"]).toFixed(2);
        this.listSearch["OTHER_MONEY"] = (this.listSearch["OTHER_MONEY"]).toFixed(2);
        this.listSearch["REPAIR_ITEM_DERATE_MONEY"] = (this.listSearch["REPAIR_ITEM_DERATE_MONEY"]).toFixed(2);
        this.listSearch["REPAIR_PART_DERATE_MONEY"] = (this.listSearch["REPAIR_PART_DERATE_MONEY"]).toFixed(2);
      },

      //删除维修项目组数据
      deleteItemGroup(index) {
        this.commitItemGroup.splice(index, 1);
        this.computItemMoney();
      },
      //是否选择项目套餐
      isItemGroupFun(val) {
        if (val) {
          this.listSearch['IS_ITEM_GROUP'] = "10041001";
        } else {
          this.listSearch['IS_ITEM_GROUP'] = "10041002";
        }

      },


      //收款单组件出来的数据
      closeGetList() {
        for (let i in this.buttonStateArr) {
          switch (i) {
            case 'printAccount':
            case 'printWts':
            case 'printPgd':
              this.buttonStateArr[i] = false;
              break
            default :
              this.buttonStateArr[i] = true;
          }
        }
        this.$emit('closeGetList');//重新请求数据
        this.titleMsg = "已结清";
      },
      
      openStartTime(val){
        if(!val){
          if (new Date(this.listSearch.COME_DATE).getTime() >= new Date(this.listSearch.PLAN_END_DATE).getTime()) {
            this.$Modal.confirm({
              title: "系统提示!",
              content: "进厂日期不可大于计划完工日期",
            })

            this.listSearch.COME_DATE = new Date();
          }
        }
      },
      openEndTime(val){
        
        if(!val){
            if (new Date(this.listSearch.PLAN_END_DATE).getTime() <= new Date(this.listSearch.COME_DATE).getTime()) {
              this.$Modal.confirm({
                title: "系统提示!",
                content: "计划完工日期不可小于进厂日期",
              })
              this.listSearch.PLAN_END_DATE = new Date();
            }
        }
      },
      //打印测试部分-----------
      printWTS() {
        clearTimeout(this.printTime);
        
        if (this.printFlag1 && this.printFlag2 && this.printFlag3 && this.printFlag4) {
          var listSearch = {};
          var store = this.$store;
          for (let i in this.listSearch) {
            switch (i) {
              case'COME_DATE':
              case'OUT_DATE':
                listSearch[i] = formatDate(this.listSearch[i]) + ' ' + formatDate(this.listSearch[i], 'hh:mm:ss');
                break;
              case'VEHICLE_COLOR':
                
                listSearch[i] = getName(this.carColorData, this.listSearch[i]) || '';
                break;
              case'PLAN_END_DATE':
                listSearch[i] = formatDate(this.listSearch[i]) + ' ' + formatDate(this.listSearch[i], 'hh:mm:ss');
                break;
              default :
                listSearch[i] = this.listSearch[i];
            }
            ;
          }
          ;
          var commitParts = [];
          for (let i in this.commitParts) {
            commitParts.push(this.commitParts[i]);
          }
          ;
          for (let i in commitParts) {
            commitParts[i].UNIT = getName(this.partsUnit, commitParts[i].UNIT) || '';
          }
          var LODOP = getLodop();
          var temp = printWtsFun(this.wtdData, listSearch, this.commitItem, this.commitItemGroup, commitParts, this.commitOtherItem, store);
          LODOP.PRINT_INITA(1, 1, 770, 660, "测试预览功能");
          LODOP.SET_SHOW_MODE("SKIN_TYPE", '1');
          LODOP.ADD_PRINT_TEXT(30, 0, "100%", 20, "车 辆 维 修 委 托 单");
          LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
          LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
          LODOP.ADD_PRINT_TABLE(70, 0, "100%", 980, temp);
          LODOP.PREVIEW();

        } else {
          let self = this;
          this.printTime = setTimeout(function () {
            self.printWTS();
          }, 300)
        }


      },
      //得到维修项目套餐详情数据-----

      getItemDetail(id) {
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getGroupItem',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            GROUP_ID: id,
            page: 1,
            limit: 25,
          }
        }).then(res => {
          if (res.success === true) {
            if (res.data && JSON.stringify(res.data[0]) != "{}") {
              for (let i in res.data) {
                
                this.itemGroupDetail.push(res.data[i]);
              }
            }

          }
        });
      },
      //打印派工单部分---------
      printPgdButton() {


        clearTimeout(this.printTime);
        
        if (this.printFlag1 && this.printFlag2 && this.printFlag3 && this.printFlag4) {
          var listSearch = {};
          for (let i in this.listSearch) {
            switch (i) {
              case'COME_DATE':
              case'OUT_DATE':
                listSearch[i] = formatDate(this.listSearch[i]) + ' ' + formatDate(this.listSearch[i], 'hh:mm:ss');
                break;
              case'PLAN_END_DATE':
                listSearch[i] = formatDate(this.listSearch[i]) + ' ' + formatDate(this.listSearch[i], 'hh:mm:ss');
                break;
              default :
                listSearch[i] = this.listSearch[i];
            }
            ;
          }
          ;


          var LODOP = getLodop();
          var temp = printPgdFun(this.wtdData, listSearch, this.commitItem, this.commitParts, this.itemGroupDetail);
          LODOP.ADD_PRINT_TEXT(60, 0, "100%", 20, "车 辆 维 修 派 工 单");
          LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
          LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
          LODOP.ADD_PRINT_TABLE(90, 0, "100%", 950, temp);
          LODOP.PREVIEW();

        } else {
          let self = this;
          this.printTime = setTimeout(function () {
            self.printPgdButton();
          }, 300)
        }
      },
      //打印结算单部分-------------------
      printAccountButton() {


        clearTimeout(this.printTime);
        
        if (this.printFlag1 && this.printFlag2 && this.printFlag3 && this.printFlag4) {
          var temp = null;

          var store = this.$store;

          var listSearch = {};
          for (let i in this.listSearch) {
            switch (i) {
              case'COME_DATE':
              case'OUT_DATE':
                listSearch[i] = formatDate(this.listSearch[i]) + ' ' + formatDate(this.listSearch[i], 'hh:mm:ss');
                break;
              case'VEHICLE_TYPE':

                listSearch[i] = getName(this.vehicleTypeArr, this.listSearch[i]);
                break;
              case'REPAIR_TYPE':
                listSearch[i] = getName(this.repairTypeArr, this.listSearch[i]);
                break;
              default :
                listSearch[i] = this.listSearch[i];
            }
            ;

          }
          ;
          var commitParts = [];
          for (let i in this.commitParts) {
            commitParts.push(this.commitParts[i]);
          }
          for (let j in commitParts) {
            commitParts[j].BRAND = getName(this.bandTypeFun, commitParts[j].BRAND) || '';
            commitParts[j].PART_SOURCE = getName(this.partsTypeFun, commitParts[j].PART_SOURCE) || '';

            if (commitParts[j].IS_SELF == "true" || commitParts[j].IS_SELF == true) {
              commitParts[j].IS_SELF = "是"
            } else if (commitParts[j].IS_SELF == "false" || commitParts[j].IS_SELF == false) {
              commitParts[j].IS_SELF = "否"
            }
            ;
          }
          ;


          if (this.$store.state.user.userInfo.tenant && this.$store.state.user.userInfo.tenant.businessType == '10331003') {
            
            temp = printAccountFun(this.wtdData, listSearch, this.commitItem, this.commitItemGroup, commitParts, this.commitOtherItem, store, 'styleFlag');
          } else {
            
            temp = printAccountFun(this.wtdData, listSearch, this.commitItem, this.commitItemGroup, commitParts, this.commitOtherItem, store, 'styleFlag');
          }
          var LODOP = getLodop();
          LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
          LODOP.ADD_PRINT_TABLE(50, 0, "100%", 1000, temp);
          //LODOP.SET_PRINT_STYLEA(0,"Offset2Top",-60); //设置次页偏移把区域向上扩
          LODOP.PREVIEW();

        } else {
          let self = this;
          this.printTime = setTimeout(function () {
            self.printAccountButton();
          }, 300)
        }
      },
      //计算金额统计数据--------
      emitComputedMoney(value) {

      },


    }
  }
</script>

<style scoped lang="less">
  .search-block {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }

  .r-list-search {
    width: 100%;
    text-align: center;
    padding-top:20px;
  }
  .r-list-header{
    h1{
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 5px;
    }
  }

  .r-list-choose-parts {
    width: 100%;
    padding-top:20px;
    text-align: center;
  }

  .r-list-money {
    padding-top: 20px;
    margin-bottom: 20px;
    height: 30px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    span {
      color: red;
    }
    .bold{
      font-size: 14px;
      font-weight: 600;
      color: black;
    }
    .r-list-money-reset {
      font-size: 22px;
    }
  }

  .r-list-chekbox {
    width: 100%;
    overflow: hidden;
    font-size: 18px;
    padding: 5px 10px;
    div {
      float: right;
    }
  }
</style>
