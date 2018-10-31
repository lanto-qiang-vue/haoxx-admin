<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" @changeSelect="changeSelect" @onRowClick="onRowClick"
                @onRowDblclick="dbclick" :clearSelect="clearSelect">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.KEYWORD" placeholder="会员卡号/客户名称/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Input v-model="search.PLATE_NUM" placeholder="车牌号码..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="type">
          <Option v-for="(item, index) in typegroup"
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
      <Button type="primary" v-if="" @click="add()">新增</Button>
      <Button type="info" v-if="" :disabled="canDo" @click="edit()">编辑/查看</Button>
      <Button type="success" v-if="" :disabled="canDo  || list.STATUS != '10471001'" @click="check()">审核</Button>
      <Button type="warning" v-if="" :disabled="canDo  || list.STATUS != '10471002'" @click="rcheck()">反审核审核</Button>
      <Button type="success" v-if="" :disabled="canDo || list.STATUS != '10471002'" @click="collection()">收款</Button>
      <Button type="warning" v-if="" :disabled="canDo  || list.STATUS != '10471003'" @click="rcollection()">反收款</Button>
      <Button type="error" v-if="" :disabled="canDo || list.STATUS != '10471001'" @click="remove()">作废</Button>
      <Button type="primary" v-if="" @click="xPrint" :disabled="canDo || list.STATUS == '10471001'">打印充值单</Button>
    </div>
    <Modal
      class="table-modal-detail"
      :transition-names="['', '']"
      v-model="showModal"
      :closable="false"
      @on-visible-change="visibleChange"
      title="储值卡充值"
      width="90"
      :scrollable="true"
      on-visible-change
      :transfer="false"
    >
      <Collapse value="1">
        <Panel name="1">
          基本信息
          <div slot="content">
            <Form ref="formData" :model="formData" :label-width="120" :rules="ruleValidate" inline class="common-form">
              <FormItem label="客户名称:" style="width:45%;" prop="CUSTOMER_NAME">
                <Input type="text" v-model="formData.CUSTOMER_NAME" :readonly="true" @on-click="selectCustomer"
                       icon="ios-search" @on-focus="selectCustomer" style="min-width: 100%;"> </Input>
              </FormItem>
              <FormItem label="会员卡号:" style="width:45%;" prop="MEMBER_CARD_NO">
                <Input type="text" v-model="formData.MEMBER_CARD_NO" :disabled="typeshow"
                       style="min-width: 100%;"> </Input>
              </FormItem>
              <FormItem label="储值卡产品:" style="width:45%;" prop="CARD_ID">
                <Select placeholder="==请选择==" v-model="formData.CARD_ID" style="min-width: 100%;">
                  <Option v-for="(item, index) in cardGroup"
                          :key="index" :value="item.CARD_ID">{{item.CARD_NAME}}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="办理人:" style="width:45%;" prop="FOLLOW_PERSON">
                <Select placeholder="==请选择==" v-model="formData.FOLLOW_PERSON" style="min-width: 100%;">
                  <Option v-for="(item, index) in person"
                          :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                  </Option>
                </Select>
              </FormItem>
            </Form>
            <Form ref="formInline" :label-width="120">
              <FormItem label="备注:">
                <Input type="textarea" v-model="formData.REMARK" placeholder="请输入备注信息"> </Input>
              </FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button type="primary" v-show="this.formData.STATUS == '10471001'" @click="save('formData')" style="margin-left:10px;">保存</Button>
        <Button type="primary" @click="showModal = false">返回</Button>
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
              <InputNumber type="text" :max="collectionData.SUM_MONEY" :min="0"
                           v-model="collectionData.LESS_MONEY" @on-change="changeVal"></InputNumber>
            </FormItem>
            <FormItem label="收款人:" style="width:30%;" prop="FOLLOW_PERSON">
              <Select v-model="collectionData.FOLLOW_PERSON" style="width: 100%;">
                <Option v-for="(item, index) in payeeList"
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
              <Tooltip placement="top">
                <Button>支付宝</Button>
                <div slot="content">
                  <p>正在研发中</p>
                </div>
              </Tooltip>
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
    <select-customer @select="select" class="table-modal-detail" :showoff="showoff"></select-customer>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import selectCustomer from '@/hxx-components/select-customer.vue'

  export default {
    name: 'card-recharge',
    components: {commonTable, selectCustomer},
    data() {
      const person = (rule, value, callback) => {
        if (this.collectionData.FOLLOW_PERSON == '==请选择==') {
          callback(new Error('请选择收款人'));
        } else {
          callback();
        }
      }
      const cardRule = (rule, value, callback) => {
        if (this.formData.CARD_ID == '0') {
          callback(new Error('请选择充值卡产品'));
        } else {
          callback();
        }
      }
      return {
        showModal: false,
        showoff: false,
        collectionModal: false,
        tableData: [],
        rule2: {
          FOLLOW_PERSON: [{required: true, message: '请选择收款人'},
            {validator: person, trigger: 'change,blur'},
          ],
        },
        valueList: [1, 2],
        list: '',
        clearSelect: false,
        payeeList: [],
        payTypeList: [
          {name: '其它方式', code: '0'},
          {name: '现金', code: '10101001'},
          {name: '刷卡', code: '10101002'},
          {name: '储值卡', code: '10101004'},
          {name: '转账', code: '10101006'},
        ],
        collectionData: {
          RECORD_ID: '',
          CUSTOMER_ID: '',
          SUM_MONEY: 0,
          FOLLOW_PERSON: '',
          MONEY1: 0,
          PAYMENT1: '',
          LESS_MONEY: 0,
          REAL_MONEY: 0,
          IS_GIVE_INVOICE: "10041002",
          REMARK: "",
        },
        type: 0,
        person: [],
        cardGroup: [],
        MEMBER_CARD_NO: '',
        formData: {
          RECHARGE_ID: '',
          CUSTOMER_NAME: '',
          CUSTOMER_ID: '',
          REMARK: '',
          CARD_ID: '',
          MEMBER_CARD_NO: '',
          FOLLOW_PERSON: '',
        },
        typegroup: [],
        ruleValidate: {
          CUSTOMER_NAME: [{required: true, message: '请点击选取客户'}],
          MEMBER_CARD_NO: [{required: true, message: '请填写会员卡号'}],
          CARD_ID: [{required: true, message: '请选择储值卡产品'},
            {validator: cardRule, trigger: 'change,blur'},
          ],
          FOLLOW_PERSON: [{required: true, message: '请选取办理人'}]
        },
        columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 150},
          {title: '会员卡号', key: 'MEMBER_CARD_NO', sortable: true, minWidth: 150},
          {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
          {
            title: '充值时间', key: 'RECHARGE_TIME', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.RECHARGE_TIME.substr(0, 10))
          },
          {title: '充值卡产品', key: 'CARD_NAME', sortable: true, minWidth: 150},
          {title: '售价', key: 'SALES_MONEY', sortable: true, minWidth: 150},
          {title: '赠送价值', key: 'DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '总价值', key: 'SUM_MONEY', sortable: true, minWidth: 150},
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          }
        ],
        page: 1,
        limit: 25,
        total: 0,
        showTable: false,
        search: {
          KEYWORD: '',
          PLATE_NUM: '',
        }
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
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
        return currentdate;
      },
      doCollection(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.collectionData.PAYMENT1 == 0) {
              this.$Modal.info({title: '系统提示', content: '请选择支付方式'});
              return;
            }
            this.$Modal.confirm({
              title: '系统提示',
              content: '<div style="color:red;">确认收款' + this.collectionData.MONEY1 + "元</div>",
              onOk: () => {
                ///tenant/customer/tt_member_recharge_record/collect_money
                this.axios.request({
                  url: 'tenant/customer/tt_member_recharge_record/collect_money',
                  method: 'post',
                  data: {
                    access_token: this.$store.state.user.token,
                    data: JSON.stringify(this.collectionData),
                    customer_id:this.collectionData.CUSTOMER_ID,
                    recharge_id:this.collectionData.RECORD_ID
                  }
                }).then(res => {
                  if (res.success === true) {
                    this.$Message.success("收款成功");
                    this.collectionModal = false;
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
      changeVal(e) {
        this.collectionData.REAL_MONEY = this.collectionData.SUM_MONEY - e;
        this.collectionData.MONEY1 = this.collectionData.SUM_MONEY - e;
        let self = this;
        setTimeout(function () {
          self.collectionData.LESS_MONEY = self.collectionData.LESS_MONEY || 0;
        }, 200);
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
      visibleChange() {
        this.clearSection();
      },
      clearSection() {
        this.list = '';
        this.clearSelect = Math.random();
      },
      select(row) {
        this.MEMBER_CARD_NO = row.MEMBER_CARD_NO ? row.MEMBER_CARD_NO : '';
        // alert(this.MEMBER_CARD_NO);
        this.formData.MEMBER_CARD_NO = row.MEMBER_CARD_NO;
        this.formData.CUSTOMER_NAME = row.NAME;
        this.formData.CUSTOMER_ID = row.CUSTOMER_ID;
      },
      onSelect() {
        // alert(1);
      },
      save(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.rechangePost,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      rechangePost() {
        //充值卡数据提交tenant/customer/tt_member_recharge_record/save
        if (this.formData.RECHARGE_ID == '') {
          this.axios.request({
            url: 'tenant/customer/tt_member_recharge_record/save',
            method: 'post',
            data: {
              access_token: this.$store.state.user.token,
              data: JSON.stringify(this.formData),
              member_card_no: this.formData.MEMBER_CARD_NO
            }
          }).then(res => {
            if (res.success === true) {
              this.$Message.info('充值成功');
              this.getList();
              this.showModal = false;
            }
          })
          return;
        }
        this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData),
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.info('修改成功');
            this.getList();
            this.showModal = false;
          }
        })
      },
      onRowClick(row) {
        this.list = row;
        this.ids = [];
        this.ids.push(row.RECHARGE_ID);
      },
      changeSelect(row) {

      },
      changePage(page) {
        this.page = page;
      },
      changePageSize(size) {
        this.limit = size;
      },
      dbclick(row) {
        this.update(row);
      },
      selectCustomer() {
        this.showoff = Math.random();
      },
      add() {
        this.$refs['formData'].resetFields();
        for (let i in this.formData) {
          this.formData[i] = "";
        }
        // alert(this.$store.state.user.userInfo.tenant.);
        this.formData.FOLLOW_PERSON = this.$store.state.user.userInfo.user.userName;
        this.showModal = true;
      },
      getBase() {
        this.cardGroup.push({CARD_NAME: '==请选择==', CARD_ID: 0});
        this.axios.request({
          url: 'tenant/basedata/tt_member_card/get_all_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            page: 1,
            limit: 25
          }
        }).then(res => {
          if (res.success === true) {
            var data = res.data;
            for (var i in data) {
              this.cardGroup.push(data[i]);
            }
          }
        })
        if (this.person.length === 0) {
          var group = this.$store.state.app.tenant;
          this.person.push({USER_NAME: '==请选择==', USER_ID: 0});
          for (var i in group) {
            this.person.push(group[i]);
          }
        }
      },
      edit() {
        this.$refs.formData.resetFields();
        this.update(this.list);
      },
      update(row) {
        console.log(JSON.stringify(row));
        this.formData = row;
        this.showModal = true;
      },
      remove() {
        if (this.ids.length === 0) {
          this.$Message.info('未选取数据');
          return;
        }
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要作废吗?',
          onOk: this.del,
        });
      },
      del() {
        //删除数据tenant/customer/tt_member_recharge_record/cancel
        this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/cancel',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            ids: this.ids.join(',')
          }
        }).then(res => {
          if (res.success === true) {
            this.ids = [];
            this.getList();
            this.$Message.success('作废成功');
          }
        })
      },
      clear() {
        this.search.PLATE_NUM = '';
        this.search.KEYWORD = '';
        this.type = 0;
        this.page = 1;
      },
      getList() {
        this.axios.request({
          url: 'tenant/customer/tt_member_recharge_record/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            KEYWORD: this.search.KEYWORD,
            PLATE_NUM: this.search.PLATE_NUM,
            page: this.page,
            limit: this.limit,
            STATUS_eq: this.type == 0 ? '' : this.type
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.clearSection();
          }
        })
      },
      check() {
        //审核...
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要审核吗',
          onOk: () => {
            this.axios.request({
              url: '/tenant/customer/tt_member_recharge_record/update_status',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.RECHARGE_ID,
                status: '10471002',
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
        //反审核...
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要反审核吗',
          onOk: () => {
            this.axios.request({
              url: '/tenant/customer/tt_member_recharge_record/update_status',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.list.RECHARGE_ID,
                status: '10471001',
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
      collection() {
        //收款....
        this.getPayee();
        console.log(JSON.stringify(this.list));
        this.collectionData.RECORD_ID = this.list.RECHARGE_ID;
        this.collectionData.CUSTOMER_ID = this.list.CUSTOMER_ID;
        //总计
        this.collectionData.SUM_MONEY = this.list.SALES_MONEY;
        //应收
        this.collectionData.REAL_MONEY = this.list.SALES_MONEY;
        //判断是否存在....
        this.collectionData.FOLLOW_PERSON = this.list.FOLLOW_PERSON;
        //inputNumber真正支付金额
        this.collectionData.MONEY1 = this.list.SALES_MONEY;
        //支付方式
        this.collectionData.PAYMENT1 = '0';
        //inputNumber少缴纳金额
        this.collectionData.LESS_MONEY = 0;
        this.collectionData.REMARK = this.list.REMARK;
        this.collectionModal = true;
      },
      xPrint() {
        let LODOP = getLodop();
        let temp = "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\"><style>table{border:2px #000 solid;border-collapse: collapse;} th,td{border: 1px solid #000;} .noBorder th,.noBorder td{border:none;} .noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} .noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}' +\n" +
          "     \"th,td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} .text-right,.text-right th,.text-right td{text-align:right;}\" +\n" +
          "     \".w100{width:100px;} .w110{width:110px;} .w130{width:130px;} .w200{ width:200px;} .h30{ height:30px;line-height:25px;} .w30{width:30px;} .w70{width:70px;} .w80{width:80px;}  .w400{width:700px;} \" +\n" +
          "     \".text-left{text-align:left;} </style>";
        temp += '<div style="padding:0 10px;">' +
          '<table border=0 width="100%" cellspacing="0" cellpadding="0" bordercolor="#000000">' +
          '<tbody>' +
          '<tr>' +
          '<td height="50" colspan="4"><div align="center" style="font-size:24px;"><strong>储值卡充值</strong></div></td>' +
          '</tr>' +
          '<tr>' +
          '<td>维修企业名称</td>' +
          '<td>' + this.$store.state.user.userInfo.tenant.tenantName + '</td>' +
          '<td>维修企业联系人</td>' +
          '<td>' + this.$store.state.user.userInfo.tenant.linkMan + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>维修企业地址</td>' +
          '<td>' + this.$store.state.user.userInfo.tenant.tenantAdd + '</td>' +
          '<td>维修企业联系电话</td>' +
          '<td>' + this.$store.state.user.userInfo.tenant.linkTel + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>客户名称</td>' +
          '<td>' + this.list.CUSTOMER_NAME + '</td>' +
          '<td>会员卡号</td>' +
          '<td>' + this.list.MEMBER_CARD_NO + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>客户联系电话</td>' +
          '<td>' + this.list.MOBILE_PHONE + '</td>' +
          '<td>充值时间</td>' +
          '<td>' + this.list.RECHARGE_TIME + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>储值卡产品</td>' +
          '<td>' + this.list.CARD_NAME + '</td>' +
          '<td>售价</td>' +
          '<td><div align="right">' + this.list.SALES_MONEY.toFixed(2) + '</div></td>' +
          '</tr>' +
          '<tr>' +
          '<td>赠送价值</td>' +
          '<td><div align="right">' + this.list.DERATE_MONEY.toFixed(2) + '</div></td>' +
          '<td>总价值</td>' +
          '<td><div align="right">' + this.list.SUM_MONEY.toFixed(2) + '</div></td>' +
          '</tr>' +
          '<tr>' +
          '<td>办理人</td>' +
          '<td>' + this.list.FOLLOW_PERSON + '</td>' +
          '<td>打印日期</td>' +
          '<td>' + this.getDate() + '</td>' +
          '</tr>' +
          '<tr class="noBorder" style="height:100px;">' +
          '<td colspan="2">维修企业（盖章）：</td>' +
          '<td colspan="2"><div align="center">客户签名（盖章）：</div></td>' +
          '</tr>' +
          '<tr class="noBorder" style="height:80px;">' +
          '<td><div align="center">日期：</div></td>' +
          '<td><div align="left">年　　月　　日</div></td>' +
          '<td><div align="center">日期：</div></td>' +
          '<td><div align="left">年　　月　　日</div></td>' +
          '</tr>' +
          '</tbody>' +
          '</table>' +
          '</div>';
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TABLE(40, 0, "100%", 950, temp);
        LODOP.PREVIEW();
        this.clearSection();
      },
      rcollection() {
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要反收款吗',
          onOk: () => {
            this.axios.request({
              url: '/tenant/customer/tt_member_recharge_record/recollect_money',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                customer_id: this.list.CUSTOMER_ID,
                recharge_id: this.list.RECHARGE_ID,
                sum_money: this.list.SUM_MONEY,
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("反审收款成功");
                this.getList();
              } else {
                let self = this;
                setTimeout(function () {
                  self.$Modal.info({title: '系统提示', content: res.title});
                }, 500);
              }
            })
          }
        });
      },
    },
    computed: {
      typeshow() {
        if (this.formData.CUSTOMER_NAME == '' || this.MEMBER_CARD_NO != '') return true;
        if (this.MEMBER_CARD_NO == '') return false;
      },
      canDo() {
        return this.list == '';
      }
    },
    mounted() {
      this.showTable = Math.random();
      var group = getDictGroup(this.$store.state.app.dict, '1047');
      this.typegroup.push({name: '请选择...', code: 0, order: 0, group: '1047'});
      for (var i in group) {
        this.typegroup.push(group[i]);
      }
      this.getBase();
      this.getList();
    },
  }
</script>
<style lang="less">
  .ivu-input-number-input {
    height: 27px;
  }
</style>
<style lang="less" scoped>
  perate {
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
    width: 100%;
  }

  .search-block {
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }

  .ftext {
    text-align: left;
  }
</style>
