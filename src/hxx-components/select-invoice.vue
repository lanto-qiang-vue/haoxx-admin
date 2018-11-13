<template>
  <Modal
    v-model="showModal"
    class="table-modal-detail"
    title="未开票维修工单及配件销售单"
    width="90"
    :mask-closable="false"
    :scrollable="true"
    :transfer="false"
    :footer-hide="false"
    :transition-names="['', '']">
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" @onRowClick="onRowClick" :page="page" :showOperate="false">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="开票公司/发票编号..."></Input>
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
  </Modal>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'

  export default {
    name: 'select-invoice',
    components: {commonTable},
    props: ["showType"],
    data() {
      return {
        page: 1,
        limit: 25,
        total: 0,
        tableData: [],
        showTable: false,
        showModal:false,
        columns: [
          {
            title: '序号', minWidth: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '业务编号', key: 'RECORD_NO', sortable: true, minWidth: 140},
          {
            title: '业务类型', key: 'RECORD_TYPE', sortable: true, minWidth: 140,
            render: (h, params) => h('span', getName(this.list1027, params.row.RECORD_TYPE))
          },
          {
            title: '开票抬头', key: 'CUSTOMER_NAME', sortable: true, minWidth: 140,
          },
          {title: '开票税号', key: 'TAX_NO', sortable: true, minWidth: 140},
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 140},
        ],
        search: {
          keyword: '',
        },
      }
    },
    watch: {
      showType() {
        this.getList();
        this.showModal = true;
        this.showTable = Math.random();
      }
    },
    methods: {
      onRowClick(row){
      this.$emit("transmit",row);
      this.showModal = false;
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
          url: '/tenant/finance/tt_invoice_record/not_give_invoice_list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit: 25,
            page: 1,
            KEYWORD: this.search.keyword,
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData = res.data;
            this.total = res.total;
          }
        })
      },
      clear() {
        this.search.keyword = '';
      },
    },
    mounted() {

    },
    computed: {
      list1028() {
        return getDictGroup(this.$store.state.app.dict, '1028');
      },
      list1027() {
        return getDictGroup(this.$store.state.app.dict, '1027');
      }
    }

  }
</script>
