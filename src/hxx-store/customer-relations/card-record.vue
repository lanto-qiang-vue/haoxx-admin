<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :showOperate="false">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="客户名称/手机号..."></Input>
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
  import mixin from '@/hxx-components/mixin'
  export default {
    name: 'card-record',
    components: {commonTable},
    mixins: [mixin],
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
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '消费日期', key: 'USE_DATE', sortable: true, minWidth: 140,
            render: (h, params) => h('span',params.row.USE_DATE.substr(0,10))
          },
          {title: '会员卡号', key: 'MEMBER_CARD_NO', sortable: true, minWidth: 140},
          {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 140},
          {title: '联系电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 140},
          {title: '消费金额', key: 'USE_MONEY', sortable: true, minWidth: 140,
            render: (h, params) => h('span',params.row.USE_MONEY.toFixed(2))
          },
          {
            title: '消费类型', key: 'RECORD_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.defaultList, params.row.RECORD_TYPE))
          },
          {
            title: '消费单据', key: 'RECORD_NO', sortable: true, minWidth: 140,
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
          url: '/tenant/customer/tt_card_use_record/list',
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

      },
      dbclick(row) {
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
      this.search.status = this.defaultList[0].code;
      this.getList();
    },
    computed: {
      cando() {
        var flag = this.list == '' ? true : false;
        return flag;
      },
      defaultList() {
        return getDictGroup(this.$store.state.app.dict, '1027');
      }
    }

  }
</script>

