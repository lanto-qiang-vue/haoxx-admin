<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick"
                @onRowDblclick="dbClick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="销售单号/客户名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status">
          <Option v-for="(item, index) in list1047"
                  :key="index" :value="item.code">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
        <Button type="primary" @click="clear()">
          <Icon type="ios-undo" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" v-if="accessBtn('add')" @click="add">新增</Button>
      <Button type="info" v-if="accessBtn('edit')" :disabled="canDo" @click="edit">修改/查看</Button>
      <Button type="success" v-if="accessBtn('check')" :disabled="canDo || list.STATUS != '10471001'" @click="check">审核</Button>
      <Button type="warning" v-if="accessBtn('recheck')" :disabled="canDo || list.STATUS != '10471002'" @click="rcheck">反审核</Button>
      <Button type="success" v-if="accessBtn('collect')" :disabled="canDo || list.STATUS != '10471002'" @click="collection">收款</Button>
      <Button type="error" v-if="accessBtn('ban')" :disabled="canDo || list.STATUS != '10471001'" @click="del">作废</Button>
      <Button type="primary" v-if="accessBtn('printSalesDoc')" :disabled="canDo || list.STATUS == '10471001'" @click="print">打印销售单</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="配件销售"
      width="90"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
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
            <FormItem label="手机号:" style="width:30%;" prop="MOBILE_PHONE">
              <Input type="text" v-model="formData.MOBILE_PHONE"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="车牌号码:" style="width:30%;" prop="PLATE_NUM">
              <Input type="text" @on-click="selectType=Math.random()" :readonly="true" v-model="formData.PLATE_NUM"
                     icon="ios-search"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="销售日期:" style="width:30%;" prop="SALES_DATE">
              <Row>
                <Col span="11" style="width:100%;">
                  <DatePicker type="date" v-model="formData.SALES_DATE" style="min-width: 100%;"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="发货方式:" style="width:30%;" prop="SEND_TYPE">
              <!--<Input type="text" @on-click="selectPurchaseNo" v-model="formData.SEND_TYPE" icon="ios-search"-->
              <!--style="min-width: 100%;">-->
              <!--</Input>-->
              <Select v-model="formData.SEND_TYPE">
                <Option v-for="(item, index) in list1036"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="服务顾问:" style="width:30%;" prop="FOLLOW_PERSON">
              <Select v-model="formData.FOLLOW_PERSON">
                <Option v-for="(item, index) in personList"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="2">
          采购配件明细
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
      <div style="float:left;font-size:18px;">合计金额:&nbsp;<span style="color:red;">{{formData.SUM_MONEY}}</span>&nbsp;&nbsp;-&nbsp;&nbsp;优惠金额:<span
        style="color:red;">{{formData.LESS_MONEY}}</span>&nbsp;&nbsp;=&nbsp;&nbsp;应收金额:<span style="color:red">{{formData.REAL_MONEY}}</span>
      </div>
      <div style="height:120px;"></div>
      <div slot="footer">
        <Button type="primary" @click="addPost('formData')" v-show="canShow">保存</Button>
        <Button @click="showModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      class="table-modal-detail"
      :transition-names="['', '']"
      v-model="collectionModal"
      :closable="false"
      @on-visible-change="visibleChange"
      title="收款"
      width="90"
      :scrollable="true"
      on-visible-change
      :transfer="false"
    >
      <Collapse v-model="valueList">
        <Panel name="3">
          会员卡信息
          <Form slot="content" :label-width="120" class="common-form">
            <FormItem label="会员姓名:" style="width:30%;">
              <div style="color:red;font-size:18px;">{{collectionData.CUSTOMER_NAME}}</div>
            </FormItem>
            <FormItem label="会员卡号:" style="width:30%;">
              <div style="color:red;font-size:18px;">{{collectionData.MEMBER_CARD_NO}}</div>
            </FormItem>
            <FormItem label="余额:" style="width:30%;">
              <div style="color:red;font-size:18px;">{{collectionData.SURP_MONEY}}</div>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="1">
          结算信息
          <Form slot="content" ref="collectionData" :model="collectionData" :rules="rule2" :label-width="120"
                class="common-form">
            <FormItem label="合计金额:" style="width:30%;">
              <div style="color:red;font-size:18px;">{{collectionData.SUM_MONEY}}</div>
            </FormItem>
            <FormItem label="实收金额:" style="width:30%;">
              <div style="color:red;width:100%;font-size:18px;" v-text="collectionData.REAL_MONEY"></div>
            </FormItem>
            <div style="clear:both;"></div>
            <FormItem label="优惠金额:" style="width:30%;">
              <InputNumber type="text" :max="money" :min="0"
                           v-model="collectionData.LESS_MONEY" @on-change="changeVal"></InputNumber>
            </FormItem>
            <FormItem label="收款人:" style="width:30%;" prop="FOLLOW_PERSON">
              <Select v-model="collectionData.FOLLOW_PERSON" style="width: 100%;">
                <Option v-for="(item, index) in personList"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="支付金额:" style="width:30%;">
              <InputNumber type="text" :readonly="true" v-model="collectionData.MONEY1"></InputNumber>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="2">
          支付方式
          <Form slot="content" :label-width="0" class="common-form">
            <FormItem style="width:20%;">
              <Button type="primary" @click="zfb">支付宝</Button>
            </FormItem>
            <FormItem style="width:20%;">
              <Tooltip placement="top">
                <Button>微信支付</Button>
                <div slot="content">
                  <p>正在研发中</p>
                </div>
              </Tooltip>
            </FormItem>
            <FormItem style="width:20%;">
              <Tooltip placement="top">
                <Button>短信账单收款</Button>
                <div slot="content">
                  <p>正在研发中</p>
                </div>
              </Tooltip>
            </FormItem>
            <FormItem style="width:20%;">
              <Select v-model="collectionData.PAYMENT1" style="width: 100%;">
                <Option v-for="(item, index) in payTypeList"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="4">
          是否需要发票
          <i-switch v-model="have" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Form slot="content" ref="bill" :model="collectionData" :rules="rule2" :label-width="120"
                class="common-form">
            <div style="clear:both;"></div>
            <FormItem label="发票编号:" style="width:40%;" prop="INVOICE_NO">
              <Input v-model="collectionData.INVOICE_NO"> </Input>
            </FormItem>
            <FormItem label="发票抬头:" style="width:40%;">
              <Input v-model="collectionData.CORP_NAME"> </Input>
            </FormItem>
            <FormItem label="税号:" style="width:40%;">
              <Input v-model="collectionData.TAX_NO"> </Input>
            </FormItem>
            <FormItem label="备注:" style="width:40%;">
              <Input v-model="collectionData.REMARK"> </Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button type="primary" @click="showCard=Math.random()">更换会员卡</Button>
        <Button type="primary" @click="doCollection('collectionData')">收款</Button>
        <Button @click="collectionModal=false">关闭</Button>
      </div>
    </Modal>
    <select-value-card :showoff="showCard" @selectCard="selectCard" :showTransfer="false"></select-value-card>
    <select-customer :showoff="showType" @select="transmit"></select-customer>
    <select-vehicle :showoff="selectType" @selectCar="selectCar"></select-vehicle>
    <selectParts :showSelectParts="showSelectParts" :initParts="initParts" :stockFlag="true"
                 @selectPartsItem="selectPartsItem"></selectParts>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import unitInput from '@/hxx-components/unit-input.vue'
  import selectCustomer from '@/hxx-components/select-customer.vue'
  import selectVehicle from '@/hxx-components/select-vehicle.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import selectValueCard from '@/hxx-components/select-valueCard.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import {deepClone} from "../../libs/util";
  export default {
    name: "parts-sell",
    components: {commonTable, selectCustomer, selectVehicle, selectParts, unitInput, selectValueCard},
    mixins: [mixin],
    data() {
      const personRule = (rule, value, callback) => {
        if (this.formData.FOLLOW_PERSON == '请选择') {
          callback(new Error('请选择服务顾问'));
        } else {
          callback();
        }
      }
      const personRule2 = (rule, value, callback) => {
        if (this.collectionData.FOLLOW_PERSON == '请选择') {
          callback(new Error('请选择收款人'));
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
      return {
        rule2: {
          INVOICE_NO: [{validator: billRule, trigger: 'change,blur'}],
          FOLLOW_PERSON: [{validator: personRule2, trigger: 'change,blur'}],
        },
        collectionModal: false,
        showCard: false,
        timer:'',
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
        collectionData: {},
        storeCollectionData: {
          "RECORD_ID": "",
          "SALES_NO": "",
          "RETURN_NO": "",
          "CUSTOMER_ID": "",
          "MEMBER_CARD_ID": "",
          "MEMBER_TYPE": "",
          "MEMBER_CARD_STATUS": "",
          "SURP_MONEY": 0,
          "REALMONEY": 0,
          "SUM_MONEY": 0,
          "REAL_MONEY": 0,
          "LESS_MONEY": 0,
          "FOLLOW_PERSON": "",
          "MONEY1": 0,
          "PAYMENT1": "0",
          "IS_GIVE_INVOICE": "0",
          "INVOICE_NO": "",
          "CORP_NAME": "",
          "TAX_NO": "",
          "REMARK": "",
          "SALES_ID": ""
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
          "SALES_ID": "",
          "VEHICLE_ID": "",
          "CUSTOMER_ID": "",
          "MEMBER_TYPE": "",
          "MEMBER_CARD_NO": "",
          // "SURPLUS_MONEY": "0",
          "CUSTOMER_NAME": "",
          "MOBILE_PHONE": "",
          "PLATE_NUM": "",
          "SALES_DATE": "",
          "SEND_TYPE": "",
          "FOLLOW_PERSON": "",
          "SUM_MONEY": 0,
          "LESS_MONEY": 0,
          "REAL_MONEY": 0
        },
        showTable: false,
        tableData: [],
        refreshType: false,
        showModal: false,
        personList: [],
        showType: false,
        rules: {
          CUSTOMER_NAME: [{required: true, message: '请选择客户名称'}],
          MOBILE_PHONE: [{
            required: true,
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: '请输入有效手机号码',
            trigger: 'change,blur'
          }],
          FOLLOW_PERSON: [{required: true, message: '请选择服务顾问'},
            {validator: personRule, trigger: 'change,blur'}
          ],
          SALES_DATE: [{required: true, message: '请选择销售日期'}],
        },
        search: {
          keyword: "",
          status: '0',
        },
        columns2: [
          {
            title: '序号', key: 'STORE_NAME', minWidth: 90,
            render: (h, params) => h('span', params.index + 1)
          },
          {title: '仓库', key: 'STORE_NAME', sortable: true, minWidth: 120},
          {title: '配件名称', key: 'NAME', minWidth: 120},
          {title: '原厂编号', key: 'FACTORY_NO', minWidth: 120},
          {
            title: '数量', key: 'PART_NUM', minWidth: 120,
            render: (h, params) => {
              params.row.SUM_MONEY = parseInt(params.row.PART_NUM) * parseFloat(params.row.SALES_PRICE);
              params.row.REAL_MONEY = params.row.SUM_MONEY - params.row.LESS_MONEY;
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
            title: '单位成本', key: 'PART_COST', minWidth: 120
          },
          {
            title: '单价', key: 'SALES_PRICE', minWidth: 120,
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
          {title: '小计金额', key: 'SUM_MONEY', minWidth: 120},
          {
            title: '优惠金额', key: 'LESS_MONEY', minWidth: 120,
            render: (h, params) => {
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.LESS_MONEY,
                      data: params.row,
                      min: 0,
                      type: 'float',
                      switchType:4,
                      time: 200,
                    },
                    on: {
                      'change': (e) => {
                        let data = params.row;
                        data.LESS_MONEY = e;
                        this.data2[params.index] = data;
                      }
                    }
                  }
                )
              ])

            }
          },
          {title: '应收金额', key: 'REAL_MONEY', minWidth: 120},
          {
            title: '操作', key: 'FACTORY_NO', minWidth: 120,
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
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 120},
          {
            title: '车牌号码', key: 'PLATE_NUM', sortable: true, minWidth: 120,
          },
          {
            title: '销售日期', key: 'SALES_DATE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.SALES_DATE.substr(0, 10))
          },
          {
            title: '合计金额', key: 'SUM_MONEY', sortable: true, minWidth: 120,
            render: (h, params) => h('span', parseFloat(params.row.SUM_MONEY).toFixed(2))
          },
          {
            title: '优惠金额', key: 'LESS_MONEY', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.LESS_MONEY.toFixed(2))
          },
          {
            title: '应收金额', key: 'REAL_MONEY', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.REAL_MONEY.toFixed(2))
          },
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 80,
            render: (h, params) => h('span', getName(this.list1047, params.row.STATUS))
          },
          {
            title: '销售单号', key: 'SALES_NO', sortable: true, minWidth: 140,
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
          url: '/tenant/part/tt_part_sales/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
            sales_id: this.list.SALES_ID,
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
              '<td height="50" colspan="9"><div align="center" style="font-size:24px;"><strong>配件销售</strong></div></td>' +
              '</tr>' +
              '<tr>' +
              '<td>维修企业名称</td>' +
              '<td colspan="4">' + this.$store.state.user.userInfo.tenant.tenantName + '</td>' +
              '<td>维修企业联系人</td>' +
              '<td colspan="3">' + this.$store.state.user.userInfo.tenant.linkMan + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>维修企业地址</td>' +
              '<td colspan="4">' + this.$store.state.user.userInfo.tenant.tenantAdd + '</td>' +
              '<td>维修企业联系电话</td>' +
              '<td colspan="3">' + this.$store.state.user.userInfo.tenant.linkTel + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>客户名称</td>' +
              '<td colspan="4">' + this.list.CUSTOMER_NAME + '</td>' +
              '<td>销售日期</td>' +
              '<td colspan="3">' + this.list.SALES_DATE.substr(0, 10) + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>客户联系方式</td>' +
              '<td colspan="4">' + this.list.MOBILE_PHONE + '</td>' +
              '<td>销售单号</td>' +
              '<td colspan="3">' + this.list.SALES_NO + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>服务顾问</td>' +
              '<td colspan="4">' + this.list.FOLLOW_PERSON + '</td>' +
              '<td>打印日期</td>' +
              '<td colspan="3">' + this.getDate(new Date()) + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td><strong>序号</strong></td>' +
              '<td><strong>配件名称</strong></td>' +
              '<td><strong>原厂编号</strong></td>' +
              '<td><div align="right"><strong>数量</strong></div></td>' +
              '<td><strong>单位</strong></td>' +
              '<td><div align="right"><strong>单价</strong></div></td>' +
              '<td><div align="right"><strong>小计金额</strong></div></td>' +
              '<td><div align="right"><strong>优惠金额</strong></div></td>' +
              '<td><div align="right"><strong>应收金额</strong></div></td>' +
              '</tr>';
            let countNumber = 0;
            let countMoney = 0;
            let countless = 0;
            let countreal = 0;
            for (let i = 0; i < data.length; i++) {
              countNumber += data[i].PART_NUM;
              countMoney += data[i].SUM_MONEY;
              countless += data[i].LESS_MONEY;
              countreal += data[i].REAL_MONEY;
              temp += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].NAME + '</td>' +
                '<td>' + data[i].FACTORY_NO + '</td>' +
                '<td><div align="right">' + data[i].PART_NUM + '</div></td>' +
                '<td>' + (getName(this.list1015, data[i].UNIT) || "") + '</td>' +
                '<td><div align="right">' + data[i].SALES_PRICE.toFixed(2) + '</div></td>' +
                '<td><div align="right">' + data[i].SUM_MONEY.toFixed(2) + '</div></td>' +
                '<td><div align="right">' + data[i].LESS_MONEY.toFixed(2) + '</div></td>' +
                '<td><div align="right">' + data[i].REAL_MONEY.toFixed(2) + '</div></td>' +
                '</tr>';
            }
            temp += '<tr>'+
              '<td colspan="3"><div align="center"><strong>数量汇总</strong></div></td>'+
              '<td><div align="right">'+countNumber+'</div></td>'+
              '<td colspan="2"><div align="center"><strong>金额汇总</strong></div></td>'+
              '<td><div align="right">'+ countMoney.toFixed(2)+'</div></td>'+
              '<td><div align="right">'+ countless.toFixed(2)+'</div></td>'+
              '<td><div align="right">'+ countreal.toFixed(2)+'</div></td>'+
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
              url: '/tenant/part/tt_part_sales/cancel',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                ids: this.list.SALES_ID,
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
        let flag = false;
        if (this.collectionData.PAYMENT1 == '10101004') {
          if (this.collectionData.SURP_MONEY < this.collectionData.MONEY1) {
            this.$Modal.info({
              title: '系统提示',
              content: '储值卡余额不足',
            });
            return;
          }
        }
        if (this.have) {
          this.$refs['bill'].validate((valid) => {
            if (valid) {
            } else {
              this.$Message.error("请填写发票编号");
              flag = true;
            }
          })
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
          } else {
            this.$Message.error("请校对红框内容");
            flag = true;
          }
        })
        if (flag) {
          return;
        }
        if (this.collectionData.PAYMENT1 == 0) {
          this.$Modal.info({
            title: '系统提示',
            content: '请选择支付方式',
          });
          return;
        }
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认收款<span style="color:red">' + this.collectionData.MONEY1 + '元</span>',
          onOk: () => {
            if (this.have) {
              this.collectionData.IS_GIVE_INVOICE = '10041001';
            } else {
              this.collectionData.IS_GIVE_INVOICE = '10041002';
            }
            this.axios.request({
              url: '/tenant/part/tt_part_sales/collect_money',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                data: JSON.stringify(this.collectionData),
                parts: JSON.stringify(this.data2),
                customer_id: this.collectionData.MEMBER_CARD_ID,
                money1: this.collectionData.MONEY1,
                money2: '',
                payment1: this.collectionData.PAYMENT1,
                payment2: '',
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("收款成功");
                this.collectionModal = false;
                this.getList();
              }
            })
          }
        });
      },
      zfb() {
//支付宝支付
        if(this.collectionData.MONEY1 <= 0){
          this.$Modal.info({title:'系统提示',content:'支付金额小于0不能使用支付宝支付'});
        }
        this.axios.request({
          url: '/tenant/part/tt_part_sales/pay_sales',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            body: 100001,
            out_trade_no: this.collectionData.SALES_NO,
            total_amount: this.collectionData.MONEY1,
          }
        }).then(res => {
          if (res.success === true) {
            var strHtml = res.data.zfHtml;//获取接口返回的代码
            var s = ' target="_blank" ';//定义一个属性，让其在打开支付界面时，重新打开一个浏览器窗口
            var first = strHtml.substring(0, 6);
            var last = strHtml.substring(6, strHtml.length);
            var newStr = first + s + last;
            //将接口返回的html代码直接添加到页面上
            var oDiv = document.createElement("div");
            oDiv.id = "xxx"
            oDiv.innerHTML = newStr;
            var first = document.body.firstChild;

            document.body.insertBefore(oDiv, first);
            document.forms[0].submit();
            setTimeout(function () {
              var obj = document.getElementById('xxx');
              document.body.removeChild(obj);
            }, 500);
            this.collectionModal = false;
            this.insertSales();
          }
        })
      },
      insertSales(){
        this.collectionData.PAYMENT1 = "10101008";
        this.axios.request({
          url: '/tenant/part/tt_part_sales/insert_sales',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data:JSON.stringify(this.collectionData),
            SALES_NO: this.collectionData.SALES_NO
          }
        }).then(res => {
          if (res.success === true) {
            clearInterval(this.timer);
            this.timer = setInterval(()=>{
              this.axios.request({
                url: '/tenant/part/tt_part_sales/get_status',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  SALES_NO: this.collectionData.SALES_NO
                }
              }).then(res => {
                if (res.success === true) {
                  if(res.data[0].STATUS == '10471003'){
                    clearInterval(this.timer);
                    this.getList();
                  }
                }
              })
            },3000);
          }
        })
      },
      changeVal(e) {
        this.collectionData.REAL_MONEY = (this.collectionData.SUM_MONEY - e).toFixed(2);
        this.collectionData.MONEY1 = (this.collectionData.SUM_MONEY - e).toFixed(2);
      },
      collection() {
        //重置发票状态...
        this.valueList = [1,2,3];
        this.have = false;
        this.collectionData = deepClone(this.storeCollectionData);
        this.collectionData.CUSTOMER_ID = this.list.CUSTOMER_ID;
        this.collectionData.MEMBER_CARD_ID = this.list.CUSTOMER_ID;
        this.collectionData.MEMBER_TYPE = this.list.MEMBER_TYPE;
        this.collectionData.MEMBER_CARD_STATUS = this.list.MEMBER_CARD_STATUS;
        this.collectionData.SALES_ID = this.list.SALES_ID;
        this.collectionData.RECORD_ID = this.list.SALES_ID;
        this.collectionData.SALES_NO = this.list.SALES_NO;
        this.collectionData.FOLLOW_PERSON = this.list.FOLLOW_PERSON;
        this.collectionData.LESS_MONEY = this.list.LESS_MONEY;
        this.collectionData.REAL_MONEY = this.list.REAL_MONEY;
        this.collectionData.SUM_MONEY = this.list.SUM_MONEY;
        this.collectionData.MONEY1 = this.list.REAL_MONEY;
        this.collectionData.REALMONEY = this.list.SUM_MONEY;
        this.collectionData.SURP_MONEY = this.list.SURPLUS_MONEY;
        this.collectionData.PAYMENT1 = '0';
        //设定优惠最大值...
        this.money = this.list.SUM_MONEY;
//....
        this.collectionData.MEMBER_CARD_NO = this.list.MEMBER_CARD_NO || '无储值卡';
        this.collectionData.CUSTOMER_NAME = this.list.CUSTOMER_NAME;
        this.getPerson();
        this.getParts(this.list.SALES_ID);
        this.collectionModal = true;
      },
      selectCard(row) {
        //会员卡更换回调...
        console.log(JSON.stringify(row));
        this.collectionData.MEMBER_TYPE = row.MEMBER_TYPE;
        this.collectionData.MEMBER_CARD_ID = row.CUSTOMER_ID;
        this.collectionData.MEMBER_CARD_NO = row.MEMBER_CARD_NO;
        this.collectionData.SURP_MONEY = row.SURPLUS_MONEY;
        this.collectionData.CUSTOMER_NAME = row.NAME;
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
              url: '/tenant/part/tt_part_sales/recheck',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.SALES_ID,
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("反审核成功");
                this.getList();
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
                url: '/tenant/part/tt_part_sales/check',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  id: this.list.SALES_ID,
                }
              }).then(res => {
                if (res.success === true && res.data == true) {
                  this.$Message.success("审核成功");
                  this.getList();
                }else{
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
                              url: '/tenant/part/tt_part_sales/check',
                              method: 'post',
                              data: {
                                access_token: this.$store.state.user.token,
                                id: this.list.SALES_ID,
                                yes_out:1,
                              }
                            }).then(res => {
                              if (res.success === true && res.data == true) {
                                this.$Message.success("审核成功");
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
        let discounts = 0;
        let receivable = 0;
        for (let i in this.data2) {
          count += this.data2[i].SUM_MONEY || 0;
          discounts += this.data2[i].LESS_MONEY || 0;
          receivable += this.data2[i].REAL_MONEY || 0;
        }
        this.formData.SUM_MONEY = count.toFixed(2);
        this.formData.LESS_MONEY = discounts.toFixed(2);
        this.formData.REAL_MONEY = receivable.toFixed(2);
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
          if (this.initParts[q].LESS_MONEY) {

          } else {
            this.initParts[q].LESS_MONEY = 0;
          }
          this.initParts[q].SALES_PRICE = this.initParts[q].SALES_PRICE || 0;
          this.initParts[q].SUM_MONEY = this.initParts[q].PART_NUM * parseFloat(this.initParts[q].SALES_PRICE);
          this.initParts[q].REAL_MONEY = this.initParts[q].SUM_MONEY - this.initParts[q].LESS_MONEY;
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
                this.formData.SALES_DATE = this.getDate(this.formData.SALES_DATE);
                this.axios.request({
                  url: '/tenant/part/tt_part_sales/save',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data: JSON.stringify(this.formData),
                    parts: JSON.stringify(this.data2),
                  }
                }).then(res => {
                  if (res.success === true) {
                    if (this.formData.SALES_ID == "") {
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
        this.formData = deepClone(this.storeData);
        this.$refs.formData.resetFields();
        this.formData.SEND_TYPE = this.list1036[0].code;
        this.formData.FOLLOW_PERSON = this.$store.state.user.userInfo.user.userName;
        this.formData.SUM_MONEY = 0;
        this.formData.LESS_MONEY = 0;
        this.formData.REAL_MONEY = 0;
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
        this.getParts(row.SALES_ID);
        this.formData = row;
        this.formData.SALES_DATE = new Date(this.formData.SALES_DATE);
        this.showModal = true;
      },
      getParts(id) {
        this.axios.request({
          url: '/tenant/part/tt_part_sales/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
            sales_id: id,
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
          url: '/tenant/part/tt_part_sales/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: this.page,
            limit: this.limit,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status == 0 ? '' : this.search.status,
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
      canDo() {
        return this.list == "";
      },
      canShow() {
        return this.formData.SALES_ID == "" || this.formData.STATUS == '10471001';
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
