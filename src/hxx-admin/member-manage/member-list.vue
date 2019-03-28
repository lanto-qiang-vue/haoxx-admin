<template>
  <!--<Table :columns="columns10" :data="data9"></Table>-->
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page">
    <div slot="search">
      <div class="search-block" style="width:100%;">
        <Form :label-width="60" inline class="common-form" style="margin-bottom:-10px;">
          <FormItem :label-width="0">
            <Input placeholder="会员账号搜索" v-model="KEYWORD"/>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" @click="page=1;getList()">
              <Icon type="ios-search" size="24"/>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </common-table>
</template>
<script>
  import  expandRow from './expand.vue'
  import commonTable from '@/hxx-components/common-table.vue'
  export default {
    name: "member-list",
    components: {commonTable,expandRow},
    data(){
      return{
        tableData:[],
        columns:[
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号',key:'userCode', width: 200},
          {title: '是否门店员工',key:'isStaff', width: 140},
          {title: '是否门店管理员',key:'isManager', width: 140},
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {title: '门店名称',key:'tenantNames', minWidth: 140},
          {title: '注册时间',key:'createTime', width: 200,
            render: (h, params) => h('span',params.row.createTime.substr(0,16))
          },
        ],
        KEYWORD:'',
        total:0,
        showTable:false,
        clearType:false,
        page:1,
        limit:25,
      }
    },
    mounted(){
      this.getList();
      this.showTable = Math.random();
    },
    methods:{
      getList(){
        this.axios.request({
          url: '/manage/member/list',
          method: 'POST',
          data: {
            access_token: this.$store.state.user.token,
            page:this.page,
            limit:this.limit,
            KEYWORD:this.KEYWORD
          },
        }).then(res => {
          if (res.success === true) {
            this.total = res.total;
            this.tableData = res.data;
          }
        })
      },
      changePageSize(size){
        this.limit = size;
        if(this.page == 1) this.getList();
      },
      changePage(page){
        console.log("changePage");
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style>
  .common-table .ivu-table-cell-with-expand{
    height:38px;
    line-height:38px;
  }
</style>
<style scoped>

</style>
