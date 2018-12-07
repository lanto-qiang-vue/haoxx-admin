<template>
<Modal
  v-model="showModal"
  class="table-modal-detail"
  title="选择配件销售单"
  width="80"
  :mask-closable="false"
  :scrollable="true"
  :transfer="true"
  :footer-hide="false"
  :transition-names="['', '']">
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :showOperate="false" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input v-model="search.keyword" placeholder="采购单号/供应商名称..."></Input>
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
  </common-table>
</Modal>
</template>
<script>
  import {getName, getDictGroup, getCreate} from '@/libs/util.js'
  import commonTable from '@/hxx-components/common-table.vue'
  export default {
    name: "select-PurchaseNo",
    components:{commonTable},
    props:['showType'],
    data(){
      return {
        page:1,
        limit:25,
        showTable:false,
        tableData:[],
        clearType:false,
        showModal:false,
        total:0,
        search:{
          keyword:'',
        },
        columns: [
        {
          title: '序号', width: 70,align:'center',sortable: true,
          render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
        },
        {title: '客户名称', key: 'CUSTOMER_NAME', sortable: true, minWidth: 120},
        {
          title: '车牌号码', key: 'PLATE_NUM', sortable: true, minWidth: 120,
        },
        {
          title: '销售日期', key: 'SALES_DATE', sortable: true, minWidth: 120,
          render: (h, params) => h('span', params.row.SALES_DATE.substr(0, 10))
        },
        {
          title: '合计金额', key: 'SUM_MONEY', sortable: true, minWidth: 120,align:'right',
          render: (h, params) => h('span',this.formatMoney(params.row.SUM_MONEY))
        },
        {
          title: '优惠金额', key: 'LESS_MONEY', sortable: true, minWidth: 120,align:'right',
          render: (h, params) => h('span',this.formatMoney(params.row.LESS_MONEY))
        },
        {
          title: '应收金额', key: 'REAL_MONEY', sortable: true, minWidth: 120,align:'right',
          render: (h, params) => h('span',this.formatMoney(params.row.REAL_MONEY))
        },
        {
          title: '状态', key: 'STATUS', sortable: true, minWidth: 80,
          render: (h, params) => h('span', getName(this.list1047, params.row.STATUS))
        },
        {
          title: '销售单号', key: 'SALES_NO', sortable: true, minWidth: 140,
        },]
      }
    },
    watch:{
      showType(){
        this.getList();
        this.clearType = Math.random();
        this.showTable = Math.random();
        this.showModal = true;
      }
    },
    methods:{
      changePage(page){
        this.page = page;
        this.getList();
      },
      changePageSize(size){
        this.limit = size;
        this.getList();
      },
      onRowClick(row){
        this.showModal = false;
        this.$emit('selectSales',row);
      },
      clear(){
        this.search.keyword = "";
      },
      getList(){
        this.axios.request({
          url: '/tenant/part/tt_part_sales/list',
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
      },
    },
    computed:{
      list1024(){
        return getDictGroup(this.$store.state.app.dict,'1024');
      }
    },
  }
</script>

<style scoped>

</style>
