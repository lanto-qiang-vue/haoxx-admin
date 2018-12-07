<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick"
                @onRowDblclick="dbClick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="销售单号/客户名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status" clearable>
          <Option v-for="(item, index) in list1048"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup>
        <Button type="primary" @click="page=1;getList()">
          搜索
        </Button>
        <!--<Button type="primary" @click="clear()">-->
          <!--<Icon type="ios-undo" size="24"/>-->
        <!--</Button>-->
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('add')" @click="add">新增</Button>
      <Button type="success" v-if="accessBtn('check')" :disabled="canDo || list.STATUS != '10481001'" @click="check">审核</Button>
      <Button type="warning" v-if="accessBtn('recheck')" :disabled="canDo || list.STATUS != '10481002'" @click="rcheck">反审核</Button>
      <Button type="success" v-if="accessBtn('pay_money')" :disabled="canDo || list.STATUS != '10481002'" @click="collection">付款</Button>
      <Button type="error" v-if="accessBtn('cancel')" :disabled="canDo || list.STATUS != '10481001'" @click="del">作废</Button>
      <Button type="primary" v-if="accessBtn('printSalesReturnDoc')" :disabled="canDo || list.STATUS == '10481001'" @click="print">打印销售单</Button>
      <Button type="info" v-if="accessBtn('edit')" :disabled="canDo" @click="edit">修改/查看</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      title="配件销售退货"
      width="100"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="配件销售退货" :state="''" @clickBack="showModal=false"></modal-title>
      <div style="height:100%;padding-top:10px;padding-bottom:30px;">
      <Collapse v-model="value">
        <Panel name="1">
          基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="客户名称:" style="width:30%;" prop="CUSTOMER_NAME">
              <Input type="text" @on-click="selectCustomer" :readonly="true" v-model="formData.CUSTOMER_NAME"
                     icon="ios-search"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="退货日期:" style="width:30%;" prop="RETURN_DATE">
              <Row>
                <Col span="11" style="width:100%;">
                  <DatePicker type="date" v-model="formData.RETURN_DATE" style="min-width: 100%;"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="退货原因:" style="width:30%;" prop="RETURN_REASON">
              <Input v-model="formData.RETURN_REASON"></Input>
            </FormItem>
            <FormItem label="退货人:" style="width:30%;" prop="RETURN_PERSON">
              <Select v-model="formData.RETURN_PERSON">
                <Option v-for="(item, index) in personList"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="原始销售单:" style="width:30%;">
              <Input type="text" @on-click="selectType=Math.random()" v-model="formData.SALES_NO" icon="ios-search">
              </Input>
            </FormItem>
            <FormItem label="退货仓库:" style="width:30%;" prop="STORE_ID">
              <Select v-model="formData.STORE_ID">
                <Option v-for="(item, index) in wareHouseList"
                        :key="index" :value="item.STORE_ID">{{item.NAME}}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="2">
          配件销售明细
          <div slot="content">
            <Table
              class="main-table"
              ref="tablesMain"
              :columns="columns2"
              :data="data2"
              stripe
              border
            ></Table>
          </div>
        </Panel>
      </Collapse>
      <div class="r-list-search">
        <Button @click="showSelectParts=Math.random()" type="primary" shape="circle" style="margin-right: 10px;">
          <Icon type="md-checkmark" size="24"/>
          选择配件
        </Button>
      </div>
      <div style="float:left;font-size:18px;">合计金额:&nbsp;<span style="color:red;">{{formData.RETURN_MONEY}}</span></div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="addPost('formData')" v-show="canShow">保存</Button>
        <Button @click="showModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      :transition-names="['', '']"
      v-model="collectionModal"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      title="付款"
      width="800"
      :scrollable="true"
      on-visible-change
      :transfer="false"
    >
      <Form :model="collectionData" ref="collectionData" :rules="rule2" :label-width="120" class="common-form">
        <FormItem label="合计金额:" style="width:40%;">
          <div><span
            style="padding-left:50px;color:red;font-size:18px;">{{collectionData.SUM_MONEY.toFixed(2) + '元'}}</span>
          </div>
        </FormItem>
        <FormItem label="支付金额:" style="width:40%;">
          <Input v-model="collectionData.MONEY" :readonly="true" type="text"> </Input>
        </FormItem>
        <FormItem label="付款人:" style="width:40%;" prop="FOLLOW_PERSON">
          <Select v-model="collectionData.FOLLOW_PERSON">
            <Option v-for="(item, index) in personList"
                    :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="支付方式:" style="width:40%;">
          <Select v-model="collectionData.PAYMENT">
            <Option v-for="(item, index) in list1010"
                    :key="index" :value="item.code">{{item.name}}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="doCollection('collectionData')">收款</Button>
        <Button @click="collectionModal=false">关闭</Button>
      </div>
    </Modal>
    <!--<select-value-card :showoff="showCard" @selectCard="selectCard" :showTransfer="false"></select-value-card>-->
    <select-customer :showoff="showType" @select="transmit"></select-customer>
    <!--<select-vehicle :showoff="selectType" @selectCar="selectCar"></select-vehicle>-->
    <select-sales-no :showType="selectType" @selectSales="selectSales"></select-sales-no>
    <selectParts :showSelectParts="showSelectParts" :initParts="initParts" :stockFlag="true"
                 @selectPartsItem="selectPartsItem"></selectParts>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import unitInput from '@/hxx-components/unit-input.vue'
  import selectCustomer from '@/hxx-components/select-customer.vue'
  import selectSalesNo from '@/hxx-components/select-salesNo.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import selectValueCard from '@/hxx-components/select-valueCard.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import mixin from '@/hxx-components/mixin'
  import {deepClone} from "../../libs/util";

  export default {
    name: "sales-return",
    components: {commonTable, selectCustomer, selectParts, unitInput, selectValueCard, selectSalesNo,ModalTitle},
    mixins: [mixin],
    data() {
      const personRule = (rule, value, callback) => {
        if (this.formData.RETURN_PERSON == "请选择") {
          callback(new Error('请选择退货人'));
        } else {
          callback();
        }
      }
      const personRule2 = (rule, value, callback) => {
        if (value == "请选择") {
          callback(new Error('请选择付款人'));
        } else {
          callback();
        }
      }
      const billRule = (rule, value, callback) => {
        if (value == '' && this.have) {
          callback(new Error('请填写发票编号'));
        } else {
          callback();
        }
      }
      const storeRule = (rule, value, callback) => {
        if (value == '0') {
          callback(new Error('请选择退货仓库'));
        } else {
          callback();
        }
      }
      return {
        wareHouseList: [],
        rule2: {
          FOLLOW_PERSON: [
            {validator: personRule2, trigger: 'change,blur'}
          ]
        },
        collectionModal: false,
        showCard: false,
        money: 0,
        valueList: [1, 2, 3],
        have: false,
        payTypeList: [
          {name: '其它方式', code: '0'},
          {name: '现金', code: '10101001'},
          {name: '刷卡', code: '10101002'},
          {name: '储值卡', code: '10101004'},
          {name: '转账', code: '10101006'},
        ],
        payeeList: [],
        collectionData: {
          SUM_MONEY: 0,
        },
        storeCollectionData: {
          "RECORD_ID": "22",
          "CUSTOMER_ID": "127",
          "SUM_MONEY": 10,
          "MONEY": "10",
          "FOLLOW_PERSON": "zzZ",
          "PAYMENT": "10101001",
          "RETURN_ID": "22"
        },
        page: 1,
        total: 0,
        value: [1, 2],
        selectType: false,
        showSelectParts: false,
        initParts: [],
        limit: 25,
        formData: {},
        storeData: {
          "RETURN_ID": "",
          "CUSTOMER_ID": "",
          "SALES_ID": "",
          "CUSTOMER_NAME": "",
          "RETURN_DATE": "",
          "RETURN_REASON": "",
          "RETURN_PERSON": "",
          "SALES_NO": "",
          "STORE_ID": '0',
          "RETURN_MONEY": 0
        },
        showTable: false,
        tableData: [],
        refreshType: false,
        showModal: false,
        personList: [],
        showType: false,
        rules: {
          CUSTOMER_NAME: [{required: true, message: '请选择客户名称'}],
          RETURN_PERSON: [{required: true, message: '请选择退货人'},
            {validator: personRule, trigger: 'change,blur'}
          ],
          RETURN_REASON: [{required: true, message: '请填写退货原因'}],
          RETURN_DATE: [{required: true, message: '请选择退货日期'}],
          STORE_ID: [{required: true, message: '请选择仓库'}, {
            validator: storeRule, trigger: 'change,blur'
          }],
        },
        search: {
          keyword: "",
          status: '',
        },
        columns2: [
          {
            title: '序号', key: 'STORE_NAME', width: 70,align:'center',
            render: (h, params) => h('span', params.index + 1)
          },
          {title: '配件名称', key: 'NAME', minWidth: 120,},
          {title: '原厂编号', key: 'FACTORY_NO', minWidth: 120,},
          {
            title: '数量', key: 'PART_NUM', minWidth: 120,align:'right',
            render: (h, params) => {
              params.row.SUM_MONEY = parseInt(params.row.PART_NUM) * parseFloat(params.row.SALES_PRICE);
              this.countMoney();
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.PART_NUM,
                      min: 1,
                      type: 'int',
                      switchType: 3,
                      data: params.row,
                      time: 200,
                    },
                    on: {
                      'change': (e) => {
                        let data = params.row;
                        data.PART_NUM = e;
                        this.data2[params.index] = data;
                      }
                    }
                  }
                )
              ])

            }
          },
          {
            title: '单位', key: 'UNIT', minWidth: 120,
            render: (h, params) => h('span', getName(this.list1015, params.row.UNIT))
          },
          {
            title: '品牌', key: 'BRAND', minWidth: 120,
            render: (h, params) => h('span', getName(this.list1016, params.row.BRAND))
          },
          {
            title: '单位成本', key: 'PART_COST', minWidth: 120,align:'right',
            render: (h, params) => h('span',this.formatMoney(params.row.PART_COST))
          },
          {
            title: '退货单价', key: 'SALES_PRICE', minWidth: 120,align:'right',
            render: (h, params) => {
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.SALES_PRICE,
                      data: params.row,
                      min: 0,
                      type: 'float',
                      switchType: 3,
                      time: 200,
                    },
                    on: {
                      'change': (e) => {
                        let data = params.row;
                        data.SALES_PRICE = e;
                        this.data2[params.index] = data;
                      }
                    }
                  }
                )
              ])

            }
          },
          {title: '小计金额', key: 'SUM_MONEY', minWidth: 120,align:'right',
            render: (h, params) => h('span',this.formatMoney(params.row.SUM_MONEY))
          },
          {
            title: '单位成本', key: 'PART_COST', minWidth: 120,align:'right',
            render: (h, params) => h('span',this.formatMoney(params.row.SUM_MONEY))
          },
          {
            title: '操作', key: 'FACTORY_NO', minWidth: 120,align:'center',
            render: (h, params) => {
              let buttonContent = "删除";
              let buttonStatus = "error";
              return h('div', [
                h('Button', {
                  props: {
                    type: buttonStatus,
                    size: 'small'
                  },
                  style: {
                    width: "60px",
                    textAlign: "center",
                    marginRight: '10px',

                  },
                  on: {
                    click: (index) => {
                      this.data2.splice(params.index, 1);
                    }
                  }
                }, buttonContent),
              ]);
            }
          },
        ],
        data2: [],
        columns: [
          {
            title: '序号', width: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 120,},
          {
            title: '退款合计', key: 'RETURN_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => h('span',this.formatMoney(params.row.RETURN_MONEY))
          },
          {
            title: '退货日期', key: 'RETURN_DATE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.RETURN_DATE.substr(0, 10))
          },
          {
            title: '退货原因', key: 'RETURN_REASON', sortable: true, minWidth: 120,
          },
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 80,align:'center',
            render: (h, params) => h('span', getName(this.list1048, params.row.STATUS))
          },
          {
            title: '销售单号', key: 'RETURN_NO', sortable: true, minWidth: 140,
          },],
        list: '',
        clearType: false,
      }
    },
    activated() {
      let queryData = this.$route.query;
      if (queryData.type) {
        this.refreshType = Math.random();
      }
    },
    methods: {
      getWareHouse() {
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/get_all_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
          }
        }).then(res => {
          if (res.success === true) {
            this.wareHouseList = res.data;
            this.wareHouseList.unshift({
              STORE_ID: '0',
              NAME: '请选择',
            });
          }
        })
      },
      selectSales(row) {
        this.formData.SALES_ID = row.SALES_ID;
        this.formData.SALES_NO = row.SALES_NO;
        this.axios.request({
          url: '/tenant/part/tt_part_sales_return/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            sales_id: 25,
            sales_id: row.SALES_ID,
          }
        }).then(res => {
          if (res.success === true) {
            this.initParts = this.data2 = res.data;
          }
        })
      },
      getDate(date) {
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + this.formCode(date.getHours()) + seperator2 + this.formCode(date.getMinutes())
          + seperator2 + this.formCode(date.getSeconds());
        return currentdate;
      },
      formCode(data) {
        if (data >= 0 && data < 9) {
          data = "0" + data;
        }
        return data;
      },
      print() {
        this.axios.request({
          url: '/tenant/part/tt_part_sales_return/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
            sales_id: this.list.RETURN_ID,
          }
        }).then(res => {
          if (res.success === true) {
            let data = res.data;
            let temp = "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\"><style>table{border:2px #000 solid;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +\n" +
              "     \"th,td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}\" +\n" +
              "     \".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} \" +\n" +
              "     \".text-left{text-align:left;} </style>";
            temp += '<div style="padding:0 10px;">' +
              '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">' +
              '<tr>' +
              '<td height="50" colspan="7"><div align="center" style="font-size:24px;"><strong>配件销售退货</strong></div></td>' +
              '</tr>' +
              '<tr>' +
              '<td>维修企业名称</td>' +
              '<td colspan="4">' + this.$store.state.user.userInfo.tenant.tenantName + '</td>' +
              '<td>维修企业联系人</td>' +
              '<td>' + this.$store.state.user.userInfo.tenant.linkMan + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>维修企业地址</td>' +
              '<td colspan="4">' + this.$store.state.user.userInfo.tenant.tenantAdd + '</td>' +
              '<td>维修企业联系电话</td>' +
              '<td>' + this.$store.state.user.userInfo.tenant.linkTel + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>客户名称</td>' +
              '<td colspan="4">' + this.list.CUSTOMER_NAME + '</td>' +
              '<td>退货日期</td>' +
              '<td>' + this.list.RETURN_DATE.substr(0, 10) + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>客户联系方式</td>' +
              '<td colspan="4">' + this.list.MOBILE_PHONE + '</td>' +
              '<td>退货单号</td>' +
              '<td>' + this.list.RETURN_NO + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>退货员</td>' +
              '<td colspan="4">' + this.list.RETURN_PERSON + '</td>' +
              '<td>打印日期</td>' +
              '<td>' + this.getDate(new Date()) + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>退货原因</td>' +
              '<td colspan="6">' + this.list.RETURN_REASON + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td><strong>序号</strong></td>' +
              '<td><strong>配件名称</strong></td>' +
              '<td><strong>原厂编号</strong></td>' +
              '<td><div align="right"><strong>数量</strong></div></td>' +
              '<td><strong>单位</strong></td>' +
              '<td><div align="right"><strong>退货单价</strong></div></td>' +
              '<td><div align="right"><strong>小计金额</strong></div></td>' +
              '</tr>';
            let countNumber = 0;
            let countMoney = 0;
            for (let i = 0; i < data.length; i++) {
              countNumber += data[i].PART_NUM;
              countMoney += data[i].SUM_MONEY;
              temp += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].NAME + '</td>' +
                '<td>' + data[i].FACTORY_NO + '</td>' +
                '<td><div align="right">' + data[i].PART_NUM + '</div></td>' +
                '<td>' + getName(this.list1015, data[i].UNIT) + '</td>' +
                '<td><div align="right">' + data[i].SALES_PRICE.toFixed(2) + '</div></td>' +
                '<td><div align="right">' + data[i].SUM_MONEY.toFixed(2) + '</div></td>' +
                '</tr>';
            }
            temp += '<tr>'+
              '<td colspan="3"><div align="center"><strong>数量汇总</strong></div></td>'+
              '<td><div align="right">'+ countNumber.toFixed(2)+'</div></td>'+
              '<td colspan="2"><div align="center"><strong>金额汇总</strong></div></td>'+
              '<td><div align="right">'+ countMoney.toFixed(2)+'</div></td>'+
              '</tr>';
              temp += '</tbody>' +
                '</table>' +
                '</div>';
            let LODOP = getLodop();
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TABLE(40, 0, "100%", 950, temp);
            LODOP.PREVIEW();
          }
        })
      },
      del() {
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要删除吗?',
          onOk: () => {
            this.axios.request({
              url: '/tenant/part/tt_part_sales_return/cancel',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                ids: this.list.RETURN_ID,
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("删除成功");
                this.getList();
              }
            })
          }
        });
      },
      doCollection(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认付款<span style="color:red">' + this.collectionData.MONEY + '元</span>',
              onOk: () => {
                this.axios.request({
                  url: '/tenant/part/tt_part_sales_return/pay_money',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data: JSON.stringify(this.collectionData),
                    parts: JSON.stringify(this.data2),
                  }
                }).then(res => {
                  if (res.success === true) {
                    this.$Message.success("付款成功");
                    this.collectionModal = false;
                    this.getList();
                  }
                })
              }
            });
          } else {
            this.$Message.error("请选择付款人");
          }
        });
      },
      changeVal(e) {
        // this.collectionData.REAL_MONEY = this.collectionData.SUM_MONEY - e;
        // this.collectionData.MONEY1 = this.collectionData.SUM_MONEY - e;
      },
      collection() {
        this.collectionData = deepClone(this.storeCollectionData);
        this.collectionData.SUM_MONEY = this.collectionData.MONEY = this.list.RETURN_MONEY;
        this.collectionData.RECORD_ID = this.collectionData.RETURN_ID = this.list.RETURN_ID;
        this.collectionData.PAYMENT1 = this.list1010[0].code;
        this.collectionData.FOLLOW_PERSON = this.$store.state.user.userInfo.user.userName;
        this.collectionData.CUSTOMER_ID = this.list.CUSTOMER_ID;
        this.getPerson();
        this.getParts(this.list.RETURN_ID);
        this.collectionModal = true;
      },
      getPayee() {
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getEmployeeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
          }
        }).then(res => {
          if (res.success === true) {
            this.payeeList = res.data;
            this.payeeList.unshift({USER_NAME: '==请选择=='});
          }
        })
      },
      rcheck() {
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要反审核吗?',
          onOk: () => {
            this.axios.request({
              url: '/tenant/part/tt_part_sales_return/recheck',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.RETURN_ID,
              }
            }).then(res => {
              if (res.success === true && res.data == true) {
                this.$Message.success("反审核成功");
                this.getList();
              } else {
                let self = this;
                let value;
                let data = this.$store.state.user.userInfo.params;
                for (let i in data) {
                  if (data[i].PARAM_ID == 'P2001') {
                    value = parseInt(data[i].PARAM_VALUE);
                    break;
                  }
                }
                switch (value) {
                  case 1:
                    break;
                  case 2:
                    setTimeout(() => {
                      this.$Modal.confirm({
                        title: '系统提示',
                        content: res.data,
                        onOk: () => {
                          this.axios.request({
                            url: '/tenant/part/tt_part_sales_return/recheck',
                            method: 'post',
                            data: {
                              access_token: this.$store.state.user.token,
                              id: this.list.RETURN_ID,
                              yes_out:1,
                            }
                          }).then(res => {
                            if (res.success === true && res.data == true) {
                              this.$Message.success("反审核成功");
                              this.getList();
                            } else {

                            }
                          })
                        }
                      });
                    }, 300);
                    break;
                  case 3:
                    setTimeout(() => {
                      this.$Modal.error({title: '系统提示', content: res.data});
                    }, 300);
                    break;
                }
              }
            })
          }
        });
      },
      check() {
        this.$Modal.confirm(
          {
            title: '系统提示',
            content: '确认要审核吗',
            onOk: () => {
              this.axios.request({
                url: '/tenant/part/tt_part_sales_return/check',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  id: this.list.RETURN_ID,
                }
              }).then(res => {
                if (res.success === true) {
                  this.$Message.success("审核成功");
                  this.getList();
                }
              })
            }
          }
        );
      },
      clear() {
        this.search.keyword = "";
        this.search.status = '0';
      },
      clearSection() {
        this.clearType = Math.random();
        this.list = "";
      },
      countMoney() {
        let count = 0;
        for (let i in this.data2) {
          count += this.data2[i].SUM_MONEY || 0;
        }
        this.formData.RETURN_MONEY = count.toFixed(2);
      },
      selectPartsItem(row) {
        this.initParts = row;
        for (let q in this.initParts) {
          if (this.initParts[q].PART_COST) {

          } else {
            this.initParts[q].PART_COST = this.initParts[q].UNIT_COST;
          }
          if (this.initParts[q].PART_NUM) {

          } else {
            this.initParts[q].PART_NUM = 1;
          }
          if (this.initParts[q].REAL_MONEY) {
          } else {
            this.initParts[q].REAL_MONEY = 0;
          }
          this.initParts[q].SALES_PRICE = this.initParts[q].SALES_PRICE || 0;
          this.initParts[q].SUM_MONEY = this.initParts[q].PART_NUM * parseFloat(this.initParts[q].SALES_PRICE);
        }
        for (let i in this.initParts) {
          for (let a in this.data2) {
            if (this.data2[a].PART_ID == this.initParts[i].PART_ID) {
              this.initParts[i] = this.data2[a];
              break;
            }
          }
        }
        this.data2 = this.initParts;
      },
      selectCallback(row) {
        //根据采购单号找配件..
        this.formData.PURCHASE_NO = row.PURCHASE_NO;
        this.formData.PURCHASE_ID = row.PURCHASE_ID;
        this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            start: 0,
            purchase_id: row.PURCHASE_ID
          }
        }).then(res => {
          if (res.success === true) {
            this.initParts = res.data;
            this.data2 = this.initParts;
          }
        })
      },
      selectCar(row) {
        //接受选择参数返回值....
        this.formData.VEHICLE_ID = row.VEHICLE_ID;
        this.formData.PLATE_NUM = row.PLATE_NUM;
      },
      transmit(row) {
        //接受返回的客户...
        console.log(JSON.stringify(row));
        this.formData.CUSTOMER_NAME = row.NAME;
        this.formData.CUSTOMER_ID = row.CUSTOMER_ID;
        this.formData.MOBILE_PHONE = row.MOBILE_PHONE;
        this.formData.MEMBER_TYPE = row.MEMBER_TYPE;
        this.formData.MEMBER_CARD_NO = row.MEMBER_CARD_NO;
      },
      visibleChange() {
        this.clearSection();
      },
      selectCustomer() {
        this.showType = Math.random();
      },
      getPerson() {
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getEmployeeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            start: 0,
          }
        }).then(res => {
          if (res.success === true) {
            this.personList = [];
            this.personList = res.data;
            this.personList.unshift({USER_NAME: '请选择'});
          }
        })
      },
      addPost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.data2.length == 0) {
              this.$Modal.info({title: '系统提示', content: '至少需有1条配件记录'});
              return;
            }
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: () => {
                // this.formData.SALES_DATE = this.getDate(this.formData.SALES_DATE);
                this.axios.request({
                  url: '/tenant/part/tt_part_sales_return/save',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data: JSON.stringify(this.formData),
                    parts: JSON.stringify(this.data2),
                  }
                }).then(res => {
                  if (res.success === true) {
                    if (this.formData.RETURN_ID == "") {
                      this.$Message.success("新增成功");
                    } else {
                      this.$Message.success("修改成功");
                    }
                    this.showModal = false;
                    this.getList();
                  }
                })
              },
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      add() {
        this.initParts = [];
        this.data2 = [];
        this.getPerson();
        this.getWareHouse();
        this.formData = deepClone(this.storeData);
        this.$refs.formData.resetFields();
        this.formData.RETURN_PERSON = this.$store.state.user.userInfo.user.userName;
        this.formData.SUM_MONEY = 0;
        this.showModal = true;
      },
      edit() {
        this.update(this.list);
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      onRowClick(row) {
        this.list = row;
      },
      update(row) {
        this.getPerson();
        this.getWareHouse();
        this.getParts(row.RETURN_ID);
        this.formData = row;
        this.formData.SALES_DATE = new Date(this.formData.SALES_DATE);
        this.showModal = true;
      },
      getParts(id) {
        this.axios.request({
          url: '/tenant/part/tt_part_sales_return/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
            return_id: id,
          }
        }).then(res => {
          if (res.success === true) {
            this.initParts = this.data2 = res.data;
          }
        })
      },
      dbClick(row) {
        this.update(row);
      },
      getList() {
        this.axios.request({
          url: '/tenant/part/tt_part_sales_return/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: this.page,
            limit: this.limit,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status || '',
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.clearSection();
          }
        })
      },
    },
    watch: {
      data2(data) {
        if (data.length == 0) {
          this.countMoney();
        }
      },
      valueList(val) {
        let type = false;
        for (let i in val) {
          if (val[i] == 4) {
            type = true;
          }
        }
        this.have = type;
      },
    },
    computed: {
      list1047() {
        let data = getDictGroup(this.$store.state.app.dict, '1047');
        data.unshift({code: '0', name: '请选择状态...'});
        return data;
      },
      list1048() {
        let data = getDictGroup(this.$store.state.app.dict, '1048');
        // data.unshift({code: '0', name: '请选择状态...'});
        return data;
      },
      canDo() {
        return this.list == "";
      },
      canShow() {
        return this.formData.RETURN_ID == "" || this.formData.STATUS == '10481001';
      },
      list1010() {
        return getDictGroup(this.$store.state.app.dict, '1010');
      },
      list1036() {
        return getDictGroup(this.$store.state.app.dict, '1036');
      },
      list1024() {
        return getDictGroup(this.$store.state.app.dict, '1024');
      },
      list1015() {
        return getDictGroup(this.$store.state.app.dict, '1015');
      },
      list1016() {
        return getDictGroup(this.$store.state.app.dict, '1016');
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
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
    padding: 20px 0;
    text-align: center;

  }

  .r-list-choose-parts {
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }

  .r-list-money {
    padding-top: 20px;
    width: 100%;
    font-size: 16px;
    text-align: center;

    span {
      color: red;

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
