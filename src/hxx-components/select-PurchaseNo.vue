<template>
  <Modal
    v-model="showModal"
    class="table-modal-detail"
    title="选择配件采购单"
    width="90"
    :mask-closable="false"
    :scrollable="true"
    :transfer="false"
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
              {title: '序号',  width: 80,align:'center',
                render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
              },
              {title: '采购单号', key: 'PURCHASE_NO', sortable: true, minWidth: 140},
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
              {
                title: '采购总金额', key: 'SUM_MONEY', sortable: true, minWidth: 140,align:'right',
                render: (h, params) => h('span',this.formatMoney(params.row.SUM_MONEY))
              },
            ]
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
         this.$emit('selectCallback',row);
        },
        clear(){
          this.search.keyword = "";
        },
        getList(){
          this.axios.request({
            url: '/tenant/part/tt_part_purchase/list',
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
