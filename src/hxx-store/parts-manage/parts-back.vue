<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick"
                @onRowDblclick="dbClick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="退货单号/供应商名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status" clearable>
          <Option v-for="(item, index) in list1047"
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
      <Button type="success" v-if="accessBtn('add')" @click="add">新增</Button>
      <Button type="success" v-if="accessBtn('check')" :disabled="canDo || list.STATUS != '10471001'" @click="check">
        审核
      </Button>
      <Button type="warning" v-if="accessBtn('recheck')" :disabled="canDo || list.STATUS != '10471002'" @click="rcheck">
        反审核
      </Button>
      <Button type="success" v-if="accessBtn('collect')" :disabled="canDo || list.STATUS != '10471002'"
      @click="collection">收款
      </Button>
      <Button type="error" v-if="accessBtn('cancel')" :disabled="canDo || list.STATUS != '10471001'" @click="del">作废
      </Button>
      <Button type="primary" v-if="accessBtn('printThd')" :disabled="canDo || list.STATUS == '10471001'" @click="print">
        打印退货单
      </Button>
      <Button type="info" v-if="accessBtn('edit')" :disabled="canDo" @click="edit">修改/查看</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      title="采购退货"
      width="100"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="采购退货" :state="''" @clickBack="showModal=false"></modal-title>
      <!--<div style="height: 100%;overflow: auto; padding-bottom: 30px;padding-top:10px;">-->
      <div>
      <Collapse v-model="value">
        <Panel name="1">
          基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="退货供应商:" style="width:30%;" prop="SUPPLIER_NAME">
              <Input type="text" :readonly="true" @on-click="selectSupply" v-model="formData.SUPPLIER_NAME"
                     icon="ios-search"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="退货原因:" style="width:30%;" prop="RETURN_REASON">
              <Input type="text" v-model="formData.RETURN_REASON"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="退货日期" style="width:30%;" prop="RETURN_DATE">
              <Row>
                <Col span="11" style="width:100%;">
                  <DatePicker type="date" v-model="formData.RETURN_DATE" style="min-width: 100%;"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="退货人:" style="width:30%;" prop="PURCHASE_PERSON">
              <Select v-model="formData.RETURN_PERSON">
                <Option v-for="(item, index) in personList"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="原始采购单号:" style="width:30%;">
              <Input type="text" @on-click="selectPurchaseNo" :readonly="true" v-model="formData.PURCHASE_NO" icon="ios-search">
              </Input>
            </FormItem>
          </Form>
        </Panel>
        <Panel name="2">
          采购配件明细
          <div slot="content">
            <Table
              ref="tablesMain"
              class="main-table"
              :columns="columns2"
              :data="data2"
              border
            ></Table>
          </div>
        </Panel>
      </Collapse>
      </div>
      <div style="width:100%;text-align:center;padding-top:20px;">
        <Button @click="showSelectParts=Math.random()" type="primary" shape="circle" style="margin-right: 10px;">
          <Icon type="md-checkmark" size="24"/>
          选择配件
        </Button>
      </div>
      <div style="float:left;font-size:18px;">合计金额:&nbsp;<span style="color:red;">{{formData.RETURN_MONEY}}</span></div>
      <!--</div>-->
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
      width="80"
      :scrollable="true"
      on-visible-change
      :transfer="true"
    >
      <Collapse v-model="valueList">
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
      </Collapse>

      <div slot="footer">
        <Button type="primary" @click="doCollection('collectionData')">收款</Button>
        <Button @click="collectionModal=false">关闭</Button>
      </div>
    </Modal>
    <Modal>
    </Modal>
    <Modal v-model="showFrame">
      <!--<iframe id="ifrID" src="http://www.baidu.com" frameBorder="0" width="100%" scrolling="yes" height="100%">-->

      <!--</iframe>-->
    </Modal>
    <select-supply @transmit="transmit" :showType="showType" :switchType="2" :refresh="refreshType"></select-supply>
    <select-purchase-no :showType="selectType" @selectCallback="selectCallback"></select-purchase-no>
    <selectParts :showSelectParts="showSelectParts" :initParts="initParts" :stockFlag="true"
                 @selectPartsItem="selectPartsItem"></selectParts>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import unitInput from '@/hxx-components/unit-input.vue'
  import selectSupply from '@/hxx-components/select-supply.vue'
  import selectPurchaseNo from '@/hxx-components/select-PurchaseNo.vue'
  import selectParts from '@/hxx-components/select-parts.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import mixin from '@/hxx-components/mixin'
  import {deepClone} from "../../libs/util";

  export default {
    name: "parts-back",
    components: {commonTable, selectSupply, selectPurchaseNo, selectParts, unitInput,ModalTitle},
    mixins: [mixin],
    data() {
      return {
        showFrame: false,
        timer: '',
        rule2: {},
        collectionModal: false,
        money: 0,
        valueList: [1, 2],
        payTypeList: [
          {name: '其它方式', code: '0'},
          {name: '现金', code: '10101001'},
          {name: '刷卡', code: '10101002'},
          // {name: '储值卡', code: '10101004'},
          {name: '转账', code: '10101006'},
        ],
        payeeList: [],
        collectionData: {
          "RECORD_ID": "",
          "RETURN_NO": "",
          "REALMONEY": 0,
          "SUM_MONEY": 0,
          "REAL_MONEY": 0,
          "LESS_MONEY": 0,
          "FOLLOW_PERSON": "",
          "MONEY1": 0,
          "PAYMENT1": "0",
          "IS_GIVE_INVOICE": "",
          "RETURN_ID": ""
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
          RETURN_ID: "",
          SUPPLIER_ID: "",
          PURCHASE_ID: "",
          SUPPLIER_NAME: "",
          RETURN_DATE:"",
          RETURN_REASON: "",
          RETURN_PERSON: "",
          PURCHASE_NO: "",
          RETURN_MONEY: 0
        },
        showTable: false,
        tableData: [],
        refreshType: false,
        showModal: false,
        personList: [],
        showType: false,
        rules: {
          SUPPLIER_NAME: [{required: true, message: '请选择退货供应商'}],
          RETURN_DATE: [{required: true, message: '请填写退货日期'}],
          RETURN_REASON: [{required: true, message: '请填写退货原因'}],
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
          {title: '仓库', key: 'STORE_NAME', sortable: true, minWidth: 120},
          {title: '配件名称', key: 'NAME', minWidth: 120,},
          {title: '原厂编号', key: 'FACTORY_NO', minWidth: 120,},
          {
            title: '数量', key: 'PART_NUM', minWidth: 120,align:'right',
            render: (h, params) => {
              this.countMoney();
              params.row.SUM_MONEY = params.row.PART_NUM * parseFloat(params.row.PURCHASE_PRICE);
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
            title: '退货单价', key: 'PURCHASE_PRICE', minWidth: 120,align:'right',
            render: (h, params) => {
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.PURCHASE_PRICE,
                      data: params.row,
                      min: 0,
                      type: 'float',
                      switchType: 3,
                      time: 200,
                    },
                    on: {
                      'change': (e) => {
                        let data = params.row;
                        data.PURCHASE_PRICE = e;
                        this.data2[params.index] = data;
                      }
                    }
                  }
                )
              ])

            }
          },
          {title: '退货金额', key: 'SUM_MONEY', minWidth: 120,align:'right',
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
            title: '序号', width: 80,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '供应商名称', key: 'SUPPLIER_NAME', sortable: true, minWidth: 120,},
          {
            title: '退货金额', key: 'RETURN_MONEY', sortable: true, minWidth: 120,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.RETURN_MONEY))
          },
          {
            title: '退货日期', key: 'RETURN_DATE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.RETURN_DATE.substr(0, 10))
          },
          {title: '退货原因', key: 'RETURN_REASON', sortable: true, minWidth: 140},
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 140,align:'center',
            render: (h, params) => h('span', getName(this.list1047, params.row.STATUS))
          },
          {
            title: '退货单号', key: 'RETURN_NO', sortable: true, minWidth: 100,
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
      getDate() {
        let date = new Date();
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
          url: '/tenant/part/tt_part_purchase_return/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
            return_id: this.list.RETURN_ID,
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
              '<td height="50" colspan="9"><div align="center" style="font-size:24px;"><strong>采购退货</strong></div></td>' +
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
              '<td>退货供应商</td>' +
              '<td colspan="4">' + this.list.SUPPLIER_NAME + '</td>' +
              '<td>退货日期</td>' +
              '<td colspan="3">' + this.list.RETURN_DATE.substr(0, 10) + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>退货员</td>' +
              '<td colspan="4">' + this.list.RETURN_PERSON + '</td>' +
              '<td>退货单号</td>' +
              '<td colspan="3">' + this.list.RETURN_NO + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>退货原因</td>' +
              '<td colspan="4">' + this.list.RETURN_REASON + '</td>' +
              '<td>打印日期</td>' +
              '<td colspan="3">' + this.getDate() + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td><strong>序号</strong></td>' +
              '<td><strong>退货仓库</strong></td>' +
              '<td><strong>配件名称</strong></td>' +
              '<td><strong>原厂编号</strong></td>' +
              '<td><div align="right"><strong>数量</strong></div></td>' +
              '<td><strong>单位</strong></td>' +
              '<td><strong>品牌</strong></td>' +
              '<td><div align="right"><strong>退货单价</strong></div></td>' +
              '<td><div align="right"><strong>退货金额</strong></div></td>' +
              '</tr>';
            let countNumber = 0;
            let countMoney = 0;
            for (let i = 0; i < data.length; i++) {
              countNumber += data[i].PART_NUM;
              countMoney += data[i].SUM_MONEY;
              temp += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].STORE_NAME + '</td>' +
                '<td>' + data[i].NAME + '</td>' +
                '<td>' + data[i].FACTORY_NO + '</td>' +
                '<td><div align="right">' + data[i].PART_NUM + '</div></td>' +
                '<td>' + (getName(this.list1015, data[i].UNIT) || "") + '</td>' +
                '<td>' + (getName(this.list1016, data[i].BRAND) || "") + '</td>' +
                '<td><div align="right">' + (data[i].PURCHASE_PRICE ||0).toFixed(2) + '</div></td>' +
                '<td><div align="right">' + (data[i].SUM_MONEY || 0).toFixed(2) + '</div></td>' +
                '</tr>';
            }
            temp += '<tr>' +
              '<td colspan="4"><div align="center"><strong>退货总数量</strong></div></td>' +
              '<td><div align="right">' + countNumber + '</div></td>' +
              '<td colspan="3"><div align="center"><strong>退货总金额</strong></div></td>' +
              '<td><div align="right">' + countMoney.toFixed(2) + '</div></td>' +
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
              url: '/tenant/part/tt_part_purchase_return/cancel',
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
            this.axios.request({
              url: '/tenant/part/tt_part_purchase_return/collect_money',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                data: JSON.stringify(this.collectionData),
                parts: JSON.stringify(this.data2)
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
        if (this.collectionData.MONEY1 <= 0) {
          this.$Modal.info({title: '系统提示', content: '支付金额大于0时才能使用支付宝支付!'});
          return;
        }
        this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/pay_return',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            body: 100001,
            out_trade_no: this.collectionData.RETURN_NO,
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
            this.insertReturn();
          }
        })
      },
      insertReturn() {
        this.collectionData.PAYMENT1 = "10101008";
        this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/insert_return',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.collectionData),
            RETURN_NO: this.collectionData.RETURN_NO
          }
        }).then(res => {
          if (res.success === true) {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
              this.axios.request({
                url: '/tenant/part/tt_part_purchase_return/return_status',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  RETURN_NO: this.collectionData.RETURN_NO
                }
              }).then(res => {
                if (res.success === true) {
                  if (res.data[0].STATUS == '10471003') {
                    clearInterval(this.timer);
                    this.getList();
                  }
                }
              })
            }, 3000);
          }
        })
      },
      changeVal(e) {
        this.collectionData.REAL_MONEY = (this.collectionData.SUM_MONEY - e).toFixed(2);
        this.collectionData.MONEY1 = (this.collectionData.SUM_MONEY - e).toFixed(2);
      },
      collection() {
        this.getPerson();
        this.getParts(this.list.RETURN_ID);
        this.collectionData.RETURN_ID = this.list.RETURN_ID;
        this.collectionData.RECORD_ID = this.list.RETURN_ID;
        this.collectionData.RETURN_NO = this.list.RETURN_NO;
        this.collectionData.REALMONEY = this.list.RETURN_MONEY;
        this.collectionData.SUM_MONEY = this.list.RETURN_MONEY;
        this.collectionData.REAL_MONEY = this.list.RETURN_MONEY;
        this.money = this.list.RETURN_MONEY;
        this.collectionData.LESS_MONEY = 0;
        this.collectionData.PAYMENT1 = "0";
        this.collectionData.FOLLOW_PERSON = this.list.RETURN_PERSON;
        this.collectionData.MONEY1 = this.list.RETURN_MONEY;
        this.collectionData.IS_GIVE_INVOICE = this.list.IS_CANCEL;
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
              url: '/tenant/part/tt_part_purchase_return/recheck',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.RETURN_ID,
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
                url: '/tenant/part/tt_part_purchase_return/check',
                method: 'post',
                data: {
                  access_token: this.$store.state.user.token,
                  id: this.list.RETURN_ID,
                }
              }).then(res => {
                if (res.success === true && res.data == true) {
                  this.$Message.success("审核成功");
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
                              url: '/tenant/part/tt_part_purchase_return/check',
                              method: 'post',
                              data: {
                                access_token: this.$store.state.user.token,
                                id: this.list.RETURN_ID,
                                yes_out: 1,
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
        this.search.status = '';
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
          if (this.initParts[q].PART_NUM) {

          } else {
            this.initParts[q].PART_NUM = 1;
          }
          this.initParts[q].PURCHASE_PRICE = this.initParts[q].PURCHASE_PRICE || 0;
          this.initParts[q].SUM_MONEY = this.initParts[q].PART_NUM * parseFloat(this.initParts[q].PURCHASE_PRICE);
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
      selectPurchaseNo() {
        this.selectType = Math.random();
      },
      transmit(row) {
        //接受返回的供应商...
        this.formData.SUPPLIER_ID = row.SUPPLIER_ID;
        this.formData.SUPPLIER_NAME = row.NAME;
      },
      visibleChange() {
        this.clearSection();
      },
      selectSupply() {
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
                this.axios.request({
                  url: '/tenant/part/tt_part_purchase_return/save',
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
        this.formData = deepClone(this.storeData);
        this.initParts = [];
        this.data2 = [];
        this.getPerson();
        for (let i in this.formData) {
          this.formData[i] = "";
        }
        this.$refs.formData.resetFields();
        this.formData.RETURN_MONEY = 0;
        this.formData.RETURN_DATE = new Date();
        this.formData.RETURN_PERSON = this.$store.state.user.userInfo.user.userName;
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
        this.getParts(row.RETURN_ID);
        this.formData = row;
        this.showModal = true;
      },
      getParts(id) {
        this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25,
            return_id: id,
          }
        }).then(res => {
          if (res.success === true) {
            let data = res.data;
            for(let i in data){
              data[i].PURCHASE_PRICE = data[i].PURCHASE_PRICE || 0;
              data[i].SUM_MONEY = data[i].SUM_MONEY || 0;
            }
            this.initParts = this.data2 = data;
          }
        })
      },
      dbClick(row) {
        this.update(row);
      },
      getList() {
        this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/list',
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
    },
    computed: {
      list1047() {
        let data = getDictGroup(this.$store.state.app.dict, '1047');
        // data.unshift({code: '0', name: '请选择状态...'});
        return data;
      },
      canDo() {
        return this.list == "";
      },
      canShow() {
        return this.formData.RETURN_ID == "" || this.formData.STATUS == '10471001';
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
  .r-list-choose-parts {
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
</style>
