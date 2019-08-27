<template>
<common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
              :total="total" :page="page" @onRowClick="onRowClick" :ellipsis="false"
              ref="table" :loading="loading"
              class="inspection-report-head">
  <div slot="search">
    <div class="search-block">
      <Input placeholder="保险公司名称" v-model="query.keyWord" clearable></Input>
    </div>
    <div class="search-block">
      <Input placeholder="门店名称" v-model="query.tenantName" clearable></Input>
    </div>
    <ButtonGroup size="small">
      <Button type="primary" @click="page=1;getList()">
        <Icon type="ios-search" size="24"/>
      </Button>
    </ButtonGroup>
  </div>
</common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {deepClone, upImg} from "@/libs/util"
export default {
  name: "inspection-report-head",
  components: {commonTable, ModalTitle},
  data() {
    return{
      query:{
        keyWord: '',
        tenantName: '',
      },
      detail: {},
      columns: [
        {title: '序号', key: 'id', type:'index' , width: 70, align: 'center'},
        {title: '保险公司', key: 'insucompany', minWidth: 200},
        {title: '门店名称', key: 'tenantname', minWidth: 200},
        {title: '报告数量', key: 'count', minWidth: 100},
        {title: '真实数量', key: 'realnum', minWidth: 100},
        {title: '真实率', key: 'truthrate', minWidth: 100, render:(h,params) => {
            return h('div',  params.row.truthrate*100 +'%');
          }},
      ],
      tableData: [],
      total: 0,
      loading: true,
      page: 1,
      limit: 25,
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading= true
      this.detail= {}
      this.axios.get('/manage/count/list', {
        params:{
          ...this.query,
          limit:this.limit,
          page:this.page,
        }}).then( (res) => {
        console.log(res)
        if(res.success){
          this.total= res.total
          this.tableData= res.data
          this.loading= false
        }
      })
    },
    onRowClick(item) {

    },
    closeDetail(){

      this.showCreate= false
    },
    changePageSize(size) {
      this.limit = size;
      if (this.page == 1) this.getList();
    },
    changePage(page) {
      // console.log("changePage");
      this.page = page;
      this.getList();
    }
  }
}
</script>

<style scoped lang="less">

</style>
