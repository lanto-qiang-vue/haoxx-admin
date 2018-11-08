<template>
  <Modal
    v-model="showModal"
    class="table-modal-detail"
    title="选择供应商"
    width="90"
    :mask-closable="false"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer="false"
    :footer-hide="false"
    :transition-names="['', '']">
    <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                  :total="total" :show="showTable" :page="page" :clearSelect="clearType" @onRowClick="onRowClick"
                  :showOperate="false">
      <div slot="search">
        <div class="search-block">
          <Input v-model="search.keyword" placeholder="供应商编号/名称/联系电话..."></Input>
        </div>
        <ButtonGroup size="small">
          <Button type="primary" @click="page=1;getList()">
            <Icon type="ios-search" size="24"/>
          </Button>
          <Button type="primary" @click="clear()">
            <Icon type="ios-undo" size="24"/>
          </Button>
        </ButtonGroup>
        <Button style="margin-left:100px;" type="info" @click="goTo">添加供应商</Button>
      </div>
    </common-table>
  </Modal>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'select-supply',
    components: {commonTable},
    props: ['showType','refresh','switchType'],
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        showModal: false,
        clearType: false,
        showTable: false,
        list: '',
        columns: [
          {
            title: '序号', minWidth: 80,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '供应商名称', key: 'NAME', sortable: true, minWidth: 140},
          {
            title: '供应商类型', key: 'TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1008, params.row.TYPE))
          },
          {title: '联系人', key: 'LINKMAN', sortable: true, minWidth: 140},
          {
            title: '结算方式', key: 'BALANCE_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1010, params.row.BALANCE_TYPE))
          },
          {title: '税号', key: 'TAX_NO', sortable: true, minWidth: 140},
          {
            title: '发票类型', key: 'INVOICE_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1009, params.row.INVOICE_TYPE))
          }
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      goTo(){
        this.$router.push({path:'/supplier-profile',query:{type:true,switchType:this.switchType}});
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
        this.axios.request({
          url: '/tenant/basedata/ttsupplier/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.search.keyword,
            STATUS_eq:'10011001',
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
        this.$emit('transmit',row);
        this.showModal = false;
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
    watch: {
      showType() {
        this.showModal = true;
        this.showTable = Math.random();
      },
      refresh(){
        this.getList();
      }
    },
    computed: {
      list1008() {
        let data = getDictGroup(this.$store.state.app.dict, '1008');
        data.unshift({code: '0', name: '请选择'});
        return data;
      },
      list1009() {
        let data = getDictGroup(this.$store.state.app.dict, '1009');
        data.unshift({code: '0', name: '请选择'});
        return data;
      },
      list1010() {
        let data = getDictGroup(this.$store.state.app.dict, '1010');
        data.unshift({code: '0', name: '请选择'});
        return data;
      },
      defaultList() {
        let data = getDictGroup(this.$store.state.app.dict, '1001');
        data.unshift({code: '0', name: '请选择状态...'})
        return data;
      }
    }

  }
</script>

