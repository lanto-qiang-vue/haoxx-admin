<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage" :total="total"  :show="showTable" @onRowClick="onRowClick" @onRowDblclick="dbclick">
    <div slot="search"  >
      <div class="search-block">
        <Input v-model="search.keyword"  placeholder="业务单号,跟单人..."></Input>
      </div>
      <div class="search-block">
                <Select v-model="search.type">
                <Option v-for="(item, index) in typeGroup"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
     </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
        <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="success" @click="look()">查看</Button>
    </div>
    <finance-bill :showDetail="serviceShow" :detailData="detailData"></finance-bill>
  </common-table>
</template>
<script>
    import { getName, getDictGroup, getCreate } from '@/libs/util.js'
    import commonTable from '@/hxx-components/common-table.vue'
    import financeBill from '@/hxx-store/finance-manage/finance-bill.vue'
  export default{
    name:'expend-income',
    components:{commonTable,financeBill},
    data(){
      return {
        serviceShow:false,
        detailData:[],
        typeGroup:[],
        tableData:[],
        columns:[
          {title: '序号',  minWidth: 80,
            render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
          },
           {title: '类别',  className: 'demo-table-info-column', key: 'TYPE', sortable: true, minWidth: 150,render: (h, params) => h('span',getName(this.$store.state.app.dict, params.row.TYPE))},
          {title: '业务类别', key: 'RECORD_TYPE', sortable: true, minWidth: 150,
           render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.RECORD_TYPE))
          },
          {title: '业务单号', key: 'RECORD_NO', sortable: true, minWidth: 150},
          {title: '金额', key: 'MONEY', sortable: true, minWidth: 150
          },
          {title: '结算方式', key: 'PAYMENT', sortable: true, minWidth: 150,
          ender: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.PAYMENT))
          },
          {title: '跟单人', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
          {title: '创建日期', key: 'CREATE_TIME', sortable: true, minWidth: 150},
        ],
        showTable:false,
        page:1,
        limit:25,
        total:0,
        list:[],
        typeGroup:[],
        search:{
          keyword:'',
          type:0,
        }
      }
    },
    methods:{
      dbclick(row){
      if(row.RECORD_TYPE == '10271001' || row.RECORD_TYPE == '10271004' || row.RECORD_TYPE == '10271002'){
      this.detailData = row;
      this.serviceShow = Math.random();
      return;
      }
      alert(row.RECORD_TYPE);
      },
      onRowClick(row){
        this.list = [];
        this.list.push(row);
      },
      changePageSize(size){this.limit = size;this.getList();},
      changePage(page){this.page = page;this.getList();},
      getList(){
        //tenant/finance/finance_account/list
        var type = this.search.type == 0 ? '' : this.search.type;
          this.axios.request({
          url: '/tenant/finance/finance_account/list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 KEYWORD:this.search.keyword,
                 limit:this.limit,
                 page:this.page,
                 TYPE_eq:type
                }
        }).then(res => {
          if (res.success === true) {
            this.tableData= res.data
            this.total= res.total
          }
        })
      },
      clear(){
        this.search.keyword = '';
        this.search.type = 0;
      },
      look(){
        if(this.list.length == 0){
          this.$Message.info('未选取数据');
          return;
        }
       this.serviceShow = Math.random();
       this.detailData = this.list[0];
      },
    },
    mounted(){
      this.getList();
      var group = getDictGroup(this.$store.state.app.dict,'1038');
      this.typeGroup.push({'name':'请选择','group':'1038','code':0,order:0});
      for(var i in group){
        this.typeGroup.push(group[i]);
      }
     this.showTable = Math.random();
    }
  }
</script>
<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.ftext{
  text-align:left;
}
</style>