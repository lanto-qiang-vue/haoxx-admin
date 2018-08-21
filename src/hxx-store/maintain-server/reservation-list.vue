<!--预约单管理-->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total"
    @changePage="changePage" @changePageSize="changePageSize">
    <div  slot="search"  >
      <div class="search-block">
        <Input v-model="search.input" placeholder="预约单号/预约人/联系电话..."></Input>
      </div>
      <div class="search-block">
        <Select v-model="search.select" placeholder="选择状态...">
          <Option value="">全部</Option>
          <Option v-for="(item, index) in searchSelectOption"
                  :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="showDetail=true">新增</Button>
      <Button type="info">编辑/查看</Button>
      <Button type="error">作废</Button>
    </div>
     <reservation-list-detail slot="detail" @getNewList="getNewList" :showDetail="showDetail"></reservation-list-detail> 
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import reservationListDetail from './reservation-list-detail.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "reservation-list",
    components: {commonTable, reservationListDetail},
    data(){
		  return{
        columns: [
          // {type: 'selection', width: 50, fixed: 'left'},
          {title: '序号',  minWidth: 60,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
          {title: '预约类别', key: 'ORDER_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '预约人', key: 'ORDER_PERSON', sortable: true, minWidth: 150},
          {title: '联系电话', key: 'TELPHONE', sortable: true, minWidth: 150},
          {title: '车牌号', key: 'PLATE_NUM', sortable: true, minWidth: 100},
          {title: '车型', key: 'VEHICLE_MODEL', sortable: true, minWidth: 200},
          {title: '预约日期', key: 'ORDER_DATE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
          },
          {title: '预约时间', key: 'ORDER_TIME', sortable: true, minWidth: 100},
          {title: '维修类型', key: 'REPAIR_TYPE', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.REPAIR_TYPE))
          },
          {title: '应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 150,
            render: (h, params) => h('span', params.row.SUM_MONEY|| '0.00')
          },
          {title: '状态', key: 'STATUS', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.STATUS))
          },
          {title: '预约单号', key: 'ORDER_NO', sortable: true, minWidth: 150},
        ],
        tableData: [],
        searchSelectOption:[],
        search:{
          input: '',
          select: ''
        },
        page: 1,
        limit: 25,
        total: 0,

        showDetail: false
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1042')
      this.getList()
    },
    methods:{
		  getList(){
        this.axios.request({
          url: '/tenant/repair/ttrepairorder/list',
          method: 'post',
          data: {
            KEYWORD: this.search.input,
            STATUS_eq: this.search.select,
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
      clear(){
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
      getNewList(val){
        console.log(222)
        this.getList();
        this.showDetail=val;
      }
    }
	}
</script>

<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
</style>
