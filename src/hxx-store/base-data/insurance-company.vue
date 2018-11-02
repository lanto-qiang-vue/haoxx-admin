<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :showOperate="false">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="公司编号/公司名称..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.status">
          <Option v-for="(item, index) in defaultList"
                  :key="index" :value="item.code">{{item.name}}</Option>
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
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'insurance-company',
    components: {commonTable},
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        clearType: false,
        showTable: false,
        list: '',
        columns: [
          {title: '公司编号', key: 'CORP_NO', sortable: true, minWidth: 140},
          {title: '公司名称', key: 'CORP_NAME', sortable: true, minWidth: 140},
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 140},
          {title: '传真', key: 'FAX', sortable: true, minWidth: 140},
          {title: '邮箱', key: 'EMAIL', sortable: true, minWidth: 140},
          {
            title: '状态', key: 'STATUS', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.defaultList, params.row.STATUS))
          },
        ],
        search: {
          keyword: '',
          status: '',
        },
      }
    },
    methods: {
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
          url: '/tenant/basedata/tbinsurer/list',
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
        this.search.status = '';
      },
      clearsection() {
        this.list = '';
        this.clearType = Math.random();
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.search.status = this.defaultList[0].code;
      this.getList();
    },
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      defaultList() {
        return getDictGroup(this.$store.state.app.dict, '1001');
      }
    }

  }
</script>
