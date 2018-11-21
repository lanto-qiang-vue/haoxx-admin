<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" @onRowClick="onRowClick" :page="page">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="企业名称搜索..."></Input>
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
      <Button type="primary" @click="add()">重新上传</Button>
    </div>
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
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '门店商户号', key: 'TENANT_NUM', sortable: true, minWidth: 140},
          {title: '门店名称', key: 'TENANT_NAME', sortable: true, minWidth: 140},
          {title: '维修工单单号', key: 'REPAIR_ID', sortable: true, minWidth: 140},
          {title: '门店区域', key: 'AREA_ID', sortable: true, minWidth: 140},
          {title: '失败原因', key: 'ERROR_RESAON', sortable: true, minWidth: 140},
          {title: '上传失败时间', key: 'CREATE_DATE', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
        },
      }
    },
    methods: {
      add() {
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认要重新上传吗?',
          onOk: () => {
            ///manage/info/defaultrepair/reUpload
            this.axios.request({
              url: '/manage/info/defaultrepair/reUpload',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
              }
            }).then(res => {
              if (res.success === true) {
                this.$Message.success("重新上传成功");
                this.getList();
              }
            })
          }
        });
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
          url: '/manage/info/defaultrepair/list',
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
