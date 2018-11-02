<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="采购单号/供应商名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status">
          <Option v-for="(item, index) in list1048"
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
      <Button type="primary" @click="add">新增</Button>
      <Button type="info">修改/查看</Button>
      <Button type="success">审核</Button>
      <Button type="warning">反审核</Button>
      <Button type="success">付款</Button>
      <Button type="error">作废</Button>
      <Button type="primary">打印采购单</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail"
      title="配件采购"
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
            <FormItem label="供应商:" style="width:30%;" prop="SUPPLIER_NAME">
              <Input type="text" @on-click="selectSupply" v-model="formData.SUPPLIER_NAME"  icon="ios-search"
                     style="min-width: 100%;">
              </Input>
            </FormItem>
            <FormItem label="采购仓库:" style="width:30%;">
              <Select v-model="formData.STORE_ID">
                <Option v-for="(item, index) in wareHouseList"
                        :key="index" :value="item.STORE_ID">{{item.NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="采购日期:" style="width:30%;">
              <Row>
                <Col span="11" style="width:100%;">
                  <DatePicker type="date" v-model="formData.PURCHASE_DATE" style="min-width: 100%;"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="采购员:" style="width:30%;" prop="NAME">
              <Select v-model="formData.PURCHASE_PERSON">
                <Option v-for="(item, index) in personList"
                        :key="index" :value="item.USER_NAME">{{item.USER_NAME}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="采购类型:" style="width:30%;" prop="NAME">
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
        <Button type="primary" shape="circle" style="margin-right: 10px;"><Icon type="md-checkmark" size="24"/>选择配件</Button>
      </div>
      <div style="height:60px;"></div>
      <div slot="footer">
        <!--<Button type="primary" @click="addPost('formData')">保存</Button>-->
        <Button @click="showModal=false">取消</Button>
      </div>
    </Modal>
    <select-supply @transmit="transmit" :showType="showType" :refresh="refreshType"></select-supply>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import selectSupply from '@/hxx-components/select-supply.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'parts-purchase',
    components: {commonTable,selectSupply},
    activated(){
      let queryData=this.$route.query;
      if(queryData.type){
        this.refreshType = Math.random();
      }
    },
    data() {
      return {
        page: 1,
        value:[1,2],
        data2:[],
        columns2:[
          {title: '序号', key: 'STORE_NAME', minWidth: 90},
          {title: '配件名称', key: 'STORE_NAME', sortable: true, minWidth: 120},
          {title: '原厂编号', key: 'STORE_NAME', minWidth: 120},
          {title: '数量', key: 'STORE_NAME',minWidth: 120},
          {title: '单位', key: 'STORE_NAME',minWidth: 120},
          {title: '品牌', key: 'STORE_NAME', minWidth: 120},
          {title: '采购单价', key: 'STORE_NAME',minWidth: 120},
          {title: '采购金额', key: 'STORE_NAME',minWidth: 120},
          {title: '含税销售价', key: 'STORE_NAME', minWidth: 120},
          {title: '销售税率', key: 'STORE_NAME',minWidth: 120},
          {title: '未含税销售价', key: 'STORE_NAME',minWidth: 120},
          {title: '操作', key: 'STORE_NAME',minWidth: 120},
        ],
        limit: 25,
        total: 0,
        showModal: false,
        wareHouseList:[],
        personList:[],
        refreshType:false,
        formData: {
          PURCHASE_ID: "",
          SUPPLIER_ID: "0",
          SUPPLIER_NAME: "",
          STORE_ID: "0",
          PURCHASE_DATE: "2018-11-01",
          PURCHASE_PERSON: "zzZ",
          PURCHASE_TYPE: "10241001",
          REMARK: "备注",
          STATUS: "10481001",
          SUM_MONEY: 0
        },
        rules: {},
        tableData: [],
        showType:false,
        clearType: false,
        showTable: false,
        list: '',
        columns: [
          {title: '仓库名称', key: 'STORE_NAME', sortable: true, minWidth: 120},
          {
            title: '采购日期', key: 'PURCHASE_DATE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', params.row.PURCHASE_DATE.substr(0, 10))
          },
          {
            title: '订单类型', key: 'PURCHASE_TYPE', sortable: true, minWidth: 120,
            render: (h, params) => h('span', getName(this.list1024, params.row.PURCHASE_TYPE))
          },
          {title: '供应商名称', key: 'SUPPLIER_NAME', sortable: true, minWidth: 140,},
          {title: '采购员', key: 'PURCHASE_PERSON', sortable: true, minWidth: 120},
          // {
          //   title: '采购总金额', key: 'SUM_MONEY', sortable: true, minWidth: 140,
          //   render: (h, params) => h('span', params.row.SUM_MONEY.toFixed(2))
          // },
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 100,
            render: (h, params) => h('span', getName(this.list1048, params.row.STATUS))
          },
          {title: '采购单号', key: 'PURCHASE_NO', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
          status: '0',
        },
      }
    },
    methods: {
      getWarehouse(){
        //获取仓库...
        this.axios.request({
          url: '/tenant/basedata/ttstorehouse/get_all_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit:25,
            page:1,
            start:0,
          }
        }).then(res => {
          if (res.success === true) {
            this.wareHouseList = [];
            this.wareHouseList = res.data;
            this.wareHouseList.unshift({STORE_ID:'0',NAME:'请选择'})
          }
        })
      },
      getPerson(){
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getEmployeeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit:25,
            page:1,
            start:0,
          }
        }).then(res => {
          if (res.success === true) {
            this.personList = [];
            this.personList = res.data;
            this.personList.unshift({USER_NAME:'请选择'});
          }
        })
      },
      transmit(row){
        //接受返回的供应商...
        this.formData.SUPPLIER_ID = row.SUPPLIER_ID;
        this.formData.SUPPLIER_NAME = row.NAME;
      },
      selectSupply(){
        this.showType = Math.random();
      },
      visibleChange() {

      },
      add() {
        this.showModal = true;
        this.formData.PURCHASE_TYPE = this.list1024[0].code;
        this.getWarehouse();
        this.getPerson();
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
            STATUS_eq: this.search.status == 0 ? '' : this.search.status,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
        })
        this.clearsection();
      },
      onRowClick(row) {
      },
      dbclick(row) {
      },
      clear() {
        this.search.keyword = '';
        this.search.status = '0';
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
        ssdcdvf
      },
      list1048() {
        let data = getDictGroup(this.$store.state.app.dict, '1048');
        data.unshift({code: '0', name: '选择状态...'});
        return data;
      },
      list1024() {
        return getDictGroup(this.$store.state.app.dict, '1024');
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
    padding-top:20px;
    width: 100%;
    font-size: 16px;
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
