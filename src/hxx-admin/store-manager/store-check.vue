<template>
  <common-table v-model="tableData" :loading="load" :columns="columns" @changePageSize="changePageSize"
                @changePage="changePage" :total="total" :show="showTable" :clearSelect="clearType"
                @onRowClick="onRowClick" @onRowDblclick="dbclick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="关键字搜索..."></Input>
      </div>
      <div class="search-block">
        <Select placeholder="" v-model="search.status" style="min-width: 100%;">
          <Option v-for="(item, index) in statusList1"
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
      <Button type="primary" :disabled="cando" @click="check()">审核</Button>
    </div>
    <Modal v-model="showModal" title="门店注册信息" :width="90" :transfer="false"
           class="table-modal-detail store-modal" :transition-names="['', '']">
      <div style="height: 100%">
        <store-info-detail :data="detailData" :type="2" @getRemark="getRemark"></store-info-detail>
      </div>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="OK">审核通过</Button>
        <Button type="error" @click="NO">审核不通过</Button>
        <Button type="error" @click="goback">返回</Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import StoreInfoDetail from '@/hxx-components/store-info-detail.vue'

  export default {
    name: 'store-check',
    components: {commonTable, StoreInfoDetail},
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        obj: "",
        load: false,
        list: "",
        detailData: [],
        clearType: false,
        showModal: false,
        showTable: false,
        columns: [
          {title: '序号', key: 'TENANT_NUM', sortable: true, minWidth: 100},
          {title: '门店商户号', key: 'TENANT_NAME', sortable: true, minWidth: 140},
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 140},
          {title: '联系人姓名', key: 'LINK_MAN', sortable: true, minWidth: 140},
          {title: '联系方式', key: 'LINK_TEL', sortable: true, minWidth: 140},
          {
            title: '营业状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
          },
          {
            title: '审核状态', key: 'CHECK_STATUS', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.checkList, params.row.CHECK_STATUS))
          },
          {title: '注册时间', key: 'CREATE_TIME', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
          status: '',
        },
      }
    },
    methods: {
      goback() {
        this.showModal = false;
      },
      OK() {
        if (!this.detailData.BUSINESS_TYPE) {
          this.$Modal.error({
            title:'系统提示',
            content:'门店经营类型未选择,请前往门店信息修改',
          });
          return false;
        }
        this.$Modal.confirm({title:'系统提示',content:'确认要审核通过吗?',onOk:this.saveOk})
      },
      saveOk() {
        this.save({
          TENANT_ID: this.obj.TENANT_ID,
          REMARK: this.obj.REMARK ? this.obj.REMARK : "",
          CHECK_STATUS: "10351002"
        });
      },
      saveNo() {
        this.save({
          TENANT_ID: this.obj.TENANT_ID,
          REMARK: this.obj.REMARK ? this.obj.REMARK : "",
          CHECK_STATUS: "10351003"
        });
      },
      getRemark(data) {
        this.obj.REMARK = data;
      },
      save(data) {
        this.axios.request({
          url: '/manage/info/tenantaudit/saveAudit',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            data: JSON.stringify(data)
          }
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.getList();
          }
        })
      },
      NO() {
        this.$Modal.confirm({title: '系统提示', content: '确认要审核通过不通过吗?', onOk: this.saveNo})
      },
      visibleChange() {
        this.clearsection();
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
        this.load = true;
        this.axios.request({
          url: '/manage/info/tenantaudit/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            KEYWORD: this.search.keyword,
            STATUS_eq: this.search.status == 0 ? '' : this.search.status
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
            this.load = false;
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
      check() {
        this.update(this.list);
      },
      update(row) {
        this.obj = row;
        this.detailData = row;
        this.showModal = true;
      },
      clear() {
        this.search.keyword = '';
        this.search.status = 0;
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
        let flag = this.list == '' ? true : false;
        return flag;
      },
      statusList1() {
        let data = getDictGroup(this.$store.state.app.dict, '1034');
        let store = [];
        store.push({name: '营业状态...', code: 0});
        this.search.status = 0;
        for (let i in data) {
          store.push(data[i]);
        }
        return store;
      },
      statusList() {
        return getDictGroup(this.$store.state.app.dict, '1034');
      },
      checkList() {
        return getDictGroup(this.$store.state.app.dict, '1035');
      }
    }
  }
</script>
