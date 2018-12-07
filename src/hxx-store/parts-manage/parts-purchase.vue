<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick" @onRowDblclick="dbclick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="采购单号/供应商名称..."></Input>
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
      <Button type="success" v-if="accessBtn('pay_money')" :disabled="canDo || list.STATUS != '10481002'" @click="payment">付款</Button>
      <Button type="error" v-if="accessBtn('cancel')" :disabled="canDo || list.STATUS != '10481001'" @click="del">作废</Button>
      <Button type="primary" v-if="accessBtn('printCgd')" :disabled="canDo || list.STATUS == '10481001'" @click="Xprint">打印采购单</Button>
      <Button type="info" v-if="accessBtn('edit')" :disabled="canDo" @click="edit">修改/查看</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      title="配件采购"
      width="100%"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="维修项目套餐" :state="''" @clickBack="showModal=false"></modal-title>
      <div style="height: 100%;overflow: auto; padding-bottom: 30px;padding-top:10px;">
      <Collapse v-model="value">
        <Panel name="1">
          基本信息
          <Form slot="content" :model="formData" ref="formData" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="供应商:" style="width:30%;" prop="SUPPLIER_NAME">
              <Input type="text" @on-click="selectSupply" :readonly="true" v-model="formData.SUPPLIER_NAME" icon="ios-search"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="采购仓库:" style="width:30%;" prop="STORE_ID">
              <Select v-model="formData.STORE_ID">
                <Option v-for="(item, index) in wareHouseList"
                        :key="index" :value="item.STORE_ID">{{item.NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="采购日期:" style="width:30%;" prop="PURCHASE_DATE">
              <Row>
                <Col span="11" style="width:100%;">
                  <DatePicker type="date" v-model="formData.PURCHASE_DATE" style="min-width: 100%;"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="采购员:" style="width:30%;" prop="PURCHASE_PERSON">
              <Select v-model="formData.PURCHASE_PERSON">
                <Option v-for="(item, index) in personList"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="采购类型:" style="width:30%;" prop="PURCHASE_TYPE">
              <Select v-model="formData.PURCHASE_TYPE">
                <Option v-for="(item, index) in list1024"
                        :key="index" :value="item.code">{{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="备注:" style="width:30%;" prop="NAME">
              <Input type="text" v-model="formData.REMARK"
                     style="min-width: 100%;"> </Input>
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
        <Button @click="showParts=Math.random()" type="primary" shape="circle" style="margin-right: 10px;">
          <Icon type="md-checkmark" size="24"/>
          选择配件
        </Button>
      </div>
      <div style="float:left;font-size:18px;">合计金额:&nbsp;<span style="color:red;">{{formData.SUM_MONEY}}</span></div>
      </div>
      <div slot="footer">
        <Button type="primary" v-show="canShow"  @click="addPost('formData')">保存</Button>
        <Button @click="showModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="payModal"
      :mask-closable="false"
      title="付款"
      :width="800"
      @on-visible-change="visibleChange"
      :transition-names="['', '']">
      <Form :model="payData" ref="payData" :rules="payRule" :label-width="120" class="common-form">
        <FormItem label="合计金额:" style="width:40%;">
          <div><span style="padding-left:50px;color:red;font-size:18px;">{{payData.SUM_MONEY.toFixed(2) + '元'}}</span>
          </div>
        </FormItem>
        <FormItem label="支付金额:" style="width:40%;">
          <Input v-model="payData.MONEY" :readonly="true" type="text"> </Input>
        </FormItem>
        <FormItem label="付款人:" style="width:40%;" prop="FOLLOW_PERSON">
          <Select v-model="payData.FOLLOW_PERSON">
            <Option v-for="(item, index) in paymentList"
                    :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="支付方式:" style="width:40%;">
          <Select v-model="payData.PAYMENT">
            <Option v-for="(item, index) in list1010"
                    :key="index" :value="item.code">{{item.name}}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="payModal=false">取消</Button>
        <Button type="primary"  @click="payPost('payData')">付款</Button>
      </div>
    </Modal>
    <select-parts-group @selectPartsGroup="selectPartsGroup" :showSelectPartsGroup="showParts"
                        :initPartsGroup="initParts"></select-parts-group>
    <select-supply @transmit="transmit" :showType="showType" :switchType="1" :refresh="refreshType"></select-supply>
  </common-table>
</template>
<script>
  import selectSupply from '@/hxx-components/select-supply.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import unitInput from '@/hxx-components/unit-input.vue'
  import selectPartsGroup from '@/hxx-components/select-partsGroup.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from "../../libs/util"
  import mixin from '@/hxx-components/mixin'

  export default {
    name: 'parts-purchase',
    components: {commonTable, selectSupply, selectPartsGroup, unitInput,ModalTitle},
    mixins: [mixin],
    activated() {
      let queryData = this.$route.query;
      if (queryData.type) {
        this.refreshType = Math.random();
      }
    },
    data() {
      const warehouseRule = (rule, value, callback) => {
        if (this.formData.STORE_ID == '0') {
          callback(new Error('请选择采购仓库'));
        } else {
          callback();
        }
      }
      const personRule = (rule, value, callback) => {
        if (this.formData.PURCHASE_PERSON == '请选择') {
          callback(new Error('请选择采购员'));
        } else {
          callback();
        }
      }
      const payRule = (rule, value, callback) => {
        if (this.payData.FOLLOW_PERSON == '请选择') {
          callback(new Error('请选择付款人'));
        } else {
          callback();
        }
      }
      return {
        page: 1,
        value: [1, 2],
        initParts: [],
        data2: [],
        payModal: false,
        payRule: {
          FOLLOW_PERSON: [{required: true, message: '请选择付款人'}, {validator: payRule, trigger: 'change,blur'}],
        },
        paymentList: [],
        payData: {
          "RECORD_ID": "",
          "CUSTOMER_ID": "",
          "MEMBER_CARD_ID": "",
          "MEMBER_TYPE": "",
          "SURP_MONEY": "",
          "SUM_MONEY": 0,
          "MONEY": "",
          "FOLLOW_PERSON": "",
          "PAYMENT": "10101001",
          "PURCHASE_ID": ""
        },
        columns2: [
          {
            title: '序号', key: 'STORE_NAME', width: 70,align:'center',
            render: (h, params) => h('span', params.index + 1)
          },
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 120,},
          {title: '原厂编号', key: 'FACTORY_NO', minWidth: 120,},
          {
            title: '数量', key: 'PART_NUM', minWidth: 120,align:'right',
            render: (h, params) => {
              this.countMoney();
              params.row.SUM_MONEY = params.row.PART_NUM * parseFloat(params.row.PURCHASE_PRICE);
              params.row.NOT_CONTAINS_TAX_SALE_PRICE = (params.row.SALES_PRICE / (1 + params.row.RATE)).toFixed(2);
              params.row.TAX = (params.row.SALES_PRICE / (1 + params.row.RATE) * params.row.RATE).toFixed(2)
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.PART_NUM,
                      min: 1,
                      type: 'int',
                      switchType: 0,
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
            title: '采购单价', key: 'PURCHASE_PRICE', minWidth: 120,align:'right',
            render: (h, params) => {
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.PURCHASE_PRICE,
                      data: params.row,
                      min: 0,
                      type: 'float',
                      switchType: 1,
                      time: 1000,
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
          {
            title: '采购金额', key: 'SUM_MONEY', minWidth: 120,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SUM_MONEY))
          },
          {title: '含税销售价', key: 'SALES_PRICE', minWidth: 120,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SALES_PRICE))
          },
          {
            title: '销售税率', key: 'RATE', minWidth: 120,align:'right',
            render: (h, params) => {
              return h('div', [
                h(unitInput, {
                    props: {
                      params: params.row.RATE || 0,
                      min: 0,
                      type: 'float',
                      data: params.row,
                      switchType: 0,
                      time: 200,
                    },
                    on: {
                      'change': (e) => {
                        let data = params.row;
                        data.RATE = e;
                        this.data2[params.index] = data;
                      }
                    }
                  }
                )
              ])

            }
          },
          {title: '销售税额', key: 'TAX', minWidth: 140,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.TAX))
          },
          {title: '未含税销售价', key: 'NOT_CONTAINS_TAX_SALE_PRICE', minWidth: 140,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.NOT_CONTAINS_TAX_SALE_PRICE))
          },
          {
            title: '操作', key: 'STORE_NAME', minWidth: 120,align:'center',
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
        limit: 25,
        total: 0,
        showModal: false,
        showParts: false,
        wareHouseList: [],
        personList: [],
        refreshType: false,
        formData: {
          PURCHASE_ID: "",
          SUPPLIER_ID: "",
          SUPPLIER_NAME: "",
          STORE_ID: "0",
          PURCHASE_DATE: "",
          PURCHASE_PERSON: "",
          PURCHASE_TYPE: "10241001",
          REMARK: "",
          STATUS: "10481001",
          SUM_MONEY: 0
        },
        rules: {
          SUPPLIER_NAME: [{required: true, message: '请选择供应商'}],
          PURCHASE_DATE: [{required: true, message: '请选择采购日期'}],
          STORE_ID: [{required: true, message: '请选择采购仓库'}, {validator: warehouseRule, trigger: 'change,blur'}],
          PURCHASE_TYPE: [{required: true, message: '请选择采购类型'}],
          PURCHASE_PERSON: [{required: true, message: '请选择采购员'}, {validator: personRule, trigger: 'change,blur'}],
        },
        tableData: [],
        showType: false,
        clearType: false,
        showTable: false,
        list: '',
        columns: [
          {title: '序号',  width: 70,align:'center',
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '仓库名称', key: 'STORE_NAME', sortable: true, minWidth: 120,},
          {
            title: '采购日期', key: 'PURCHASE_DATE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.PURCHASE_DATE.substr(0, 10))
          },
          {
            title: '订单类型', key: 'PURCHASE_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.list1024, params.row.PURCHASE_TYPE))
          },
          {title: '供应商名称', key: 'SUPPLIER_NAME', sortable: true, minWidth: 140},
          {title: '采购员', key: 'PURCHASE_PERSON', sortable: true, minWidth: 120},
          {
            title: '采购总金额', key: 'SUM_MONEY', sortable: true, minWidth: 140,align:'right',
            render: (h, params) => h('span',this.formatMoney(params.row.SUM_MONEY))
          },
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 100,align:'center',
            render: (h, params) => h('span', getName(this.list1048, params.row.STATUS))
          },
          {title: '采购单号', key: 'PURCHASE_NO', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
          status: '',
        },
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
      Xprint() {
        //打印采购单....
        this.axios.request({
          url: '/tenant/part/tt_part_purchase/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            purchase_id: this.list.PURCHASE_ID,
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
              '<td height="50" colspan="8"><div align="center" style="font-size:24px;"><strong>采购单</strong></div></td>' +
              '</tr>' +
              '<tr>' +
              '<td>维修企业名称</td>' +
              '<td colspan="3">' + this.$store.state.user.userInfo.tenant.tenantName + '</td>' +
              '<td>维修企业联系人</td>' +
              '<td colspan="3">' + this.$store.state.user.userInfo.tenant.linkMan + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>维修企业地址</td>' +
              '<td colspan="3">' + this.$store.state.user.userInfo.tenant.tenantAdd + '</td>' +
              '<td>维修企业联系电话</td>' +
              '<td colspan="3">' + this.$store.state.user.userInfo.tenant.linkTel + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>供应商</td>' +
              '<td colspan="3">' + this.list.SUPPLIER_NAME + '</td>' +
              '<td>采购日期</td>' +
              '<td colspan="3">' + this.list.PURCHASE_DATE.substr(0, 10) + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>采购仓库</td>' +
              '<td colspan="3">' + this.list.STORE_NAME + '</td>' +
              '<td>采购员</td>' +
              '<td colspan="3">' + this.list.PURCHASE_PERSON + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>采购单号</td>' +
              '<td colspan="3">' + this.list.PURCHASE_NO + '</td>' +
              '<td>打印日期</td>' +
              '<td colspan="3">' + this.getDate() + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td>备注</td>' +
              '<td colspan="7">' + this.list.REMARK + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td><strong>序号</strong></td>' +
              '<td><strong>配件名称</strong></td>' +
              '<td><strong>原厂编号</strong></td>' +
              '<td><div align="right"><strong>数量</strong></div></td>' +
              '<td><strong>单位</strong></td>' +
              '<td><strong>品牌</strong></td>' +
              '<td><div align="right"><strong>采购单价</strong></div></td>' +
              '<td><div align="right"><strong>采购金额</strong></div></td>' +
              '</tr>';
            let partNum = 0;
            let countMoney = 0;
            for (let i = 0; i < data.length; i++) {
              partNum += data[i].PART_NUM;
              countMoney += data[i].SUM_MONEY;
              temp += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].NAME + '</td>' +
                '<td>' + data[i].FACTORY_NO + '</td>' +
                '<td><div align="right">' + data[i].PART_NUM + '</div></td>' +
                '<td>' + (getName(this.list1015, data[i].UNIT) || "") + '</td>' +
                '<td>' + (getName(this.list1016, data[i].BRAND) || "") + '</td>' +
                '<td><div align="right">' + data[i].PURCHASE_PRICE.toFixed(2) + '</div></td>' +
                '<td><div align="right">' + data[i].SUM_MONEY.toFixed(2) + '</div></td>' +
                '</tr>';
            }
            temp += '<tr>'+
              '<td colspan="3"><div align="center"><strong>采购总数量</strong></div></td>'+
              '<td><div align="right">'+ partNum+'</div></td>'+
              '<td colspan="3"><div align="center"><strong>采购总金额</strong></div></td>'+
              '<td><div align="right">'+countMoney.toFixed(2)+'</div></td>'+
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
              url: '/tenant/part/tt_part_purchase/cancel',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                ids: this.list.PURCHASE_ID,
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
      payment() {
        //付款
        this.getPerson();
        this.payData.FOLLOW_PERSON = this.$store.state.user.userInfo.user.userName;
        this.payData.PURCHASE_ID = this.list.PURCHASE_ID;
        this.payData.RECORD_ID = this.list.PURCHASE_ID;
        this.payData.SUM_MONEY = this.list.SUM_MONEY;
        this.payData.MONEY = this.list.SUM_MONEY;
        this.payModal = true;
      },
      check() {
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认要审核吗?',
          onOk:()=>{
            this.axios.request({
              url: '/tenant/part/tt_part_purchase/check',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.PURCHASE_ID,
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("审核成功");
                this.getList();
              }
            })
          }
        });
      },
      rcheck() {
        //反审核../tenant/part/tt_part_purchase/recheck
        this.$Modal.confirm({
          title:'系统提示',
          content:'确认要反审核吗?',
          onOk:()=>{
            this.axios.request({
              url: '/tenant/part/tt_part_purchase/recheck',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.PURCHASE_ID,
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
                            url: '/tenant/part/tt_part_purchase/recheck',
                            method: 'post',
                            data: {
                              access_token: this.$store.state.user.token,
                              id: this.list.PURCHASE_ID,
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
      countMoney() {
        //合计金额
        let count = 0;
        for (let i in this.data2) {
          count += this.data2[i].SUM_MONEY || 0;
        }
        this.formData.SUM_MONEY = count.toFixed(2);
      },
      edit() {
        this.update(this.list);
      },
      update(row) {
        this.getWarehouse();
        this.getPerson();
        this.formData = row;
        //获取列表..
        this.getParts(this.formData.PURCHASE_ID);
        this.showModal = true;
      },
      getParts(id) {
        this.axios.request({
          url: '/tenant/part/tt_part_purchase/part_info',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            purchase_id: id,
          }
        }).then(res => {
          if (res.success === true) {
            this.data2 = res.data;
            this.initParts = this.data2;
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
                ///tenant/part/tt_part_purchase/save
                this.axios.request({
                  url: '/tenant/part/tt_part_purchase/save',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data: JSON.stringify(this.formData),
                    parts: JSON.stringify(this.data2),
                  }
                }).then(res => {
                  if (res.success === true) {
                    if (this.formData.PURCHASE_ID == "") {
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
      payPost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认要付款吗?',
              onOk: () => {
                this.axios.request({
                  url: '/tenant/part/tt_part_purchase/pay_money',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data: JSON.stringify(this.payData),
                  }
                }).then(res => {
                  if (res.success === true) {
                    this.$Message.success("付款成功");
                    this.payModal = false;
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
      selectPartsGroup(row) {
        this.initParts = row;
        for (let q in this.initParts) {
          if (this.initParts[q].PART_NUM) {

          } else {
            this.initParts[q].PART_NUM = 1;
          }
          if(this.initParts[q].RATE){

          }else{
            this.initParts[q].RATE = 0;
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
      changeVal(index, e) {
        let self = this;
        let data = deepClone(this.data2[index]);
        data.PART_NUM = 6;
        setTimeout(function () {
          self.data2[index] = data;
        }, 200);
      },
      getWarehouse() {
        //获取仓库...
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/get_all_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            start: 0,
          }
        }).then(res => {
          if (res.success === true) {
            this.wareHouseList = [];
            this.wareHouseList = res.data;
            this.wareHouseList.unshift({STORE_ID: '0', NAME: '请选择'})
          }
        })
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
            this.paymentList = deepClone(this.personList);
          }
        })
      },
      transmit(row) {
        //接受返回的供应商...
        this.formData.SUPPLIER_ID = row.SUPPLIER_ID;
        this.formData.SUPPLIER_NAME = row.NAME;
      },
      selectSupply() {
        this.showType = Math.random();
      },
      visibleChange() {
        this.clearsection();
      },
      add() {
        this.$refs.formData.resetFields();
        //配件列表清空
        this.data2 = [];
        this.initParts = [];
        this.formData.PURCHASE_ID = "";
        this.formData.PURCHASE_TYPE = this.list1024[0].code;
        this.formData.PURCHASE_PERSON = this.$store.state.user.userInfo.user.userName;
        this.formData.SUM_MONEY = 0;
        this.formData.STATUS = "10481001";
        this.formData.REMARK = "";
        this.getWarehouse();
        this.getPerson();
        this.showModal = true;
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePageSize(size) {
        this.limit = size;
        this.getList();
      },
      getList() {
        this.axios.request({
          url: '/tenant/part/tt_part_purchase/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status || '',
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.clearsection();
            this.total = res.total;
          }
        })
        this.clearsection();
      },
      onRowClick(row) {
        this.list = row;
      },
      dbclick(row) {
        this.update(row);
      },
      clear() {
        this.search.keyword = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    computed: {
      canShow(){
        return (this.formData.PURCHASE_ID == "" || this.formData.STATUS == '10481001');
      },
      canDo() {
        return this.list == "";
      },
      list1048() {
        let data = getDictGroup(this.$store.state.app.dict, '1048');
        // data.unshift({code: '0', name: '选择状态...'});
        return data;
      },
      list1024() {
        return getDictGroup(this.$store.state.app.dict, '1024');
      },
      list1015() {
        return getDictGroup(this.$store.state.app.dict, '1015');
      },
      list1010() {
        return getDictGroup(this.$store.state.app.dict, '1010');
      },
      list1016() {
        return getDictGroup(this.$store.state.app.dict, '1016');
      }
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
<style lang="less">
  .ivu-collapse-header .ivu-icon{
    float:right;
    line-height:3;
  }
</style>
