<template>
  <common-table v-model="tableData" :columns="columns" :total="total"
    @changePage="changePage" @changePageSize="changePageSize" @changeSelect="changeSelect">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="客户编号/名称/手机号码..."></Input>
      </div>
      <div class="search-block">
        <Input v-model="search.number" placeholder="车牌号码..."></Input>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="showDetail=true">新增</Button>
      <Button type="info">编辑/查看</Button>
      <Button type="error" @click="remove">作废</Button>
    </div>
     <reservation-list-detail slot="detail" :showDetail="showDetail"></reservation-list-detail>
  </common-table>
</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'
      import { getName, getDictGroup } from '@/libs/util.js'
  export default {
    name: "customer-list",
    components: {commonTable},
    data(){
      return{
        columns: [
          {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '客户编号', key: 'CODE', sortable: true, minWidth: 150},
          {title: '客户名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '移动电话', key: 'MOBILE_PHONE', sortable: true, minWidth: 150},
          {title: '客户类型', key: 'CUSTOMER_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span',getName(this.$store.state.app.dict, params.row.CUSTOMER_TYPE))
          },
          {title: '客户等级', key: 'CUSTOMER_LEVEL', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CUSTOMER_LEVEL))
          },
          {title: '客户专员', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
          {title: '创建人', key: 'CREATER', sortable: true, minWidth: 150
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CREATER))
          },
          {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 150
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150},
        ],
        tableData: [],
        searchSelectOption:[],
        search:{
          input: '',
          number: ''
        },
        page: 1,
        limit: 25,
        total: 0,

        showDetail: false
      }
    },
    mounted () {
      this.getList()
    },
    methods:{
      getList:function(){
             this.axios.request({
          url: 'tenant/basedata/ttcustomerfile/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            PLATE_NUM:this.search.number,
            page: this.page,
            limit: this.limit,
            access_token: this.$store.state.user.token
          }
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
          }
        })
      },
      clear:function(){
                for(let i in this.search){
          this.search[i]= ''
        }
        this.page=1;
        this.getList()
      },
      changePage(page){
        this.page= page
        this.getList()
      },
      changePageSize(size){
        this.limit= size
        this.getList()
      },
      changeSelect(selection){
       var list = [];
        selection.filter(function(item){
          list.push(item.CUSTOMER_ID);
        });
        console.log(list);
      },
      remove(){
        alert(1);
      }
    },
  }
</script>
<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
</style>