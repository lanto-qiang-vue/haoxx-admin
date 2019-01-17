<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick" :page="page">
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import env from '_conf/url'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'upload-error',
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
          {
            title: '序号', minWidth: 70,align:'center',
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 140},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 140},
          {title: '门店地址', key: 'TENANT_ADD', sortable: true, minWidth: 140},
          {title: '上传数量', key: 'count(*)', sortable: true, minWidth: 140,align:'center'},
          {title: '区域', key: 'name', sortable: true, minWidth: 140},
          {title: '更新时间', key: 'UPDATE_TIME', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
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
          url: 'manage/info/upload/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            // KEYWORD: this.search.keyword,
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
        this.list = row;
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
    computed: {}

  }
</script>
