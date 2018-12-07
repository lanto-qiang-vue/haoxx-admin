<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="开票公司/发票编号..."></Input>
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
      <Button type="primary" @click="add()" v-if="accessBtn('add')">开票</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height"
      title="发票管理"
      width="100"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="发票管理" :state="''" @clickBack="showModal=false"></modal-title>
      <!--<div style="height: 100%;overflow-x:hidden; padding-bottom: 30px;padding-top:10px;">-->
      <Collapse v-model="value1">
        <Panel name="1">
          基本信息
          <Form slot="content" :model="formData" ref="list" :rules="rules" :label-width="120" class="common-form">
            <FormItem label="开票抬头:" style="width:40%;" prop="CORP_NAME">
              <Input v-model="formData.CORP_NAME" :readonly="true" @on-click="showType = Math.random()" type="text" icon="ios-search"> </Input>
            </FormItem>
            <FormItem label="发票编号:" style="width:40%;" prop="INVOICE_NO">
              <Input v-model="formData.INVOICE_NO" type="text"> </Input>
            </FormItem>
            <FormItem label="税号:" style="width:40%;" prop="TAX_NO">
              <Input v-model="formData.TAX_NO" type="text"> </Input>
            </FormItem>
            <FormItem label="备注:" style="width:40%;" prop="REMARK">
              <Input v-model="formData.REMARK" type="text"> </Input>
            </FormItem>
          </Form>
        </Panel>
      </Collapse>
      <!--</div>-->
      <div slot="footer">
        <Button @click="addcancle()">取消</Button>
        <Button type="primary" @click="addpost('list')">保存</Button>
      </div>
    </Modal>
    <select-invoice :showType="showType" @transmit="transmit"></select-invoice>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import selectInvoice from '@/hxx-components/select-invoice.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import mixin from '@/hxx-components/mixin'
  import {deepClone} from "../../libs/util";

  export default {
    name: 'warehouse-manage',
    components: {commonTable,selectInvoice,ModalTitle},
    mixins: [mixin],
    data() {
      return {
        value1: '1',
        value3: '3',
        page: 1,
        showType:false,
        limit: 25,
        showModal: false,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        IS_DEFAULT: false,
        storeData: {
        "DETAIL_ID": "",
        "TYPE": "",
        "CORP_NAME": "",
        "INVOICE_NO": "",
        "TAX_NO": "",
        "REMARK": ""
        },
        formData: {},
        list: '',
        rules: {
          CORP_NAME:[{required:true,message:'请选择未开发票德维修工单或配件销售单'}],
          INVOICE_NO:[{required:true,message:'请填写发票编号'}]
        },
        columns: [
          {
            title: '序号', width: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '发票编号', key: 'INVOICE_NO', sortable: true, minWidth: 140},
          {title: '开票日期', key: 'INVOICE_DATE', sortable: true, minWidth: 140,
            render: (h, params) => h('span',params.row.INVOICE_DATE.substr(0,10))
          },
          {title: '服务类型', key: 'TYPE', sortable: true, minWidth: 140,align:'center',
            render: (h, params) => h('span',getName(this.list1027,params.row.TYPE))
          },
          {title: '开票公司', key: 'CORP_NAME', sortable: true, minWidth: 140},
          {title: '税号', key: 'TAX_NO', sortable: true, minWidth: 140},
          {title: '开票金额', key: 'SUM_MONEY', sortable: true, minWidth: 140,align:'right',
            render: (h, params) => h('span',this.formatMoney(params.row.SUM_MONEY))
          },
          {title: '办理人', key: 'FOLLOW_PERSON', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      transmit(row){
      this.formData.TAX_NO = row.TAX_NO;
      this.formData.CORP_NAME = row.CUSTOMER_NAME;
      this.formData.DETAIL_ID = row.DETAIL_ID;
      this.formData.TYPE = row.RECORD_TYPE.toString()
      },
      add() {
        this.formData = deepClone(this.storeData);
        this.$refs['list'].resetFields();
        this.IS_DEFAULT = false;
        this.showModal = true;
      },
      visibleChange() {
        this.clearsection();
      },
      addcancle() {
        this.showModal = false;
      },
      addpost(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '确认保存吗?',
              onOk: this.tosave,
            });
          } else {
            this.$Message.error("请校对红框信息");
          }
        })
      },
      tosave() {
        this.axios.request({
          url: '/tenant/finance/tt_invoice_record/save',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(this.formData),
            detail_id:this.formData.DETAIL_ID,
            record_type:this.formData.TYPE
          }
        }).then(res => {
          if (res.success === true) {
            this.$Message.success("开票成功");
            this.showModal = false;
            this.getList();
          }
        })
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
        ///tenant/basedata/ttstorehouse/list
        this.axios.request({
          url: '/tenant/finance/tt_invoice_record/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
        })
        this.clearsection();
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
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      list1028(){
        return getDictGroup(this.$store.state.app.dict,'1028');
      },
      list1027(){
        return getDictGroup(this.$store.state.app.dict,'1027');
      }
    }

  }
</script>
