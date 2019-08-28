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
  <div slot="operate">
    <Button type="primary" @click="openTenant" :disabled="!detail.tenantid">查看</Button>
  </div>

  <Modal
    v-model="tenantShow"
    class="table-modal-detail full-height"
    width="100"
    heigh="100"
    :mask-closable="false"
    :scrollable="true"
    :footer-hide="false"
    :transfer="false"
    :transition-names="['', '']">
    <modal-title slot="header" :title="`检查列表(${detail.tenantname})`" @clickBack="closeDetail"></modal-title>
    <car-inspection-list :tenantId="detail.tenantid" :isPage="false"
                         ref="carInspectionList"></car-inspection-list>
    <div slot="footer">
      <Button @click="closeDetail">取消</Button>
    </div>
  </Modal>

</common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import CarInspectionList from '@/hxx-store/car-inspection/car-inspection-list.vue'
  import {deepClone, upImg} from "@/libs/util"
export default {
  name: "inspection-report-head",
  components: {commonTable, ModalTitle, CarInspectionList},
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
            return h('div',  (params.row.truthrate || 0)*100 +'%');
          }},
        // {title: '操作', key: 'id', width: 70, align: 'center', fixed: 'right', render:(h,params) => {
        //     return h('i',{
        //       class: 'fa fa-search',
        //       style: {
        //         // color: 'red',
        //         fontSize: '16px',
        //         cursor: 'pointer',
        //       },
        //       on: {
        //         click:()=>{
        //           console.log('click')
        //           this.open(params.row.id)
        //         }
        //       },
        //     })
        //   }
        // },
      ],
      tableData: [],
      total: 0,
      page: 1,
      limit: 25,
      loading: true,
      tenantShow: false,
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
    openTenant(){
      this.tenantShow= true
      this.$refs.carInspectionList.getList(true)
    },
    onRowClick(item) {
      this.detail= item
    },
    closeDetail(){
      this.detail={}
      this.$refs.table.clearCurrentRow()
      this.tenantShow= false
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
