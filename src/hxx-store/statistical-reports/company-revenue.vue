<!--公司营收报告统计 2018-09-04 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :showOperate=false :loading="loading">
    <div slot="search">
      <Form ref="search" :rules="ruleValidate"  :model="search" :label-width="85" inline>
          <FormItem label="查询日期:" style="width: 100%; margin-right: 10px;">
              <DatePicker v-model="search.ACCOUNT_TIME_gte" format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px;"></DatePicker>
              <DatePicker v-model="search.ACCOUNT_TIME_lte" format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px;margin-left: 5px;"></DatePicker>
              <Button style="margin-left: 5px;" type="primary" @click="page=1;getList()">搜索</Button>
          </FormItem>
     </Form>
    </div>
    
    <div slot="footer">
      <table  width='100%' cellpadding='5' cellspacing='0'>
            <tr>
                <td style="min-width:150px; height:30px;padding:0 18px;">合计：</td>
                <td style="min-width:150px; height:30px;padding:0 18px;" v-for="(value, key) in computedMoney">{{value}}元</td>
                
            </tr>
        </table>
    </div>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'

export default {
	name: "company-revenue",
    components: {commonTable},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '业务分类', key: 'Name', sortable: true, minWidth: 150,
                },
                {title: '营业额', key: 'Turnover', sortable: true, minWidth: 150,align:'right',
                    render: (h, params) => h('span', this.formatMoney(params.row.Turnover)||0)
                    
                },
                {title: '营业成本', key: 'OperatingCost', sortable: true, minWidth: 150,align:'right',
                    render: (h, params) => h('span', this.formatMoney(params.row.OperatingCost)||0)
                },
                {title: '纯利润', key: 'PCost', sortable: true, minWidth: 150,align:'right',
                    render: (h, params) => h('span', this.formatMoney(params.row.PCost)||0)
                },
            ],
            tableData: [],
            search:{
                ACCOUNT_TIME_gte: '',
                ACCOUNT_TIME_lte:'',
            },
            ruleValidate:{},
            page: 1,
            limit: 25,
            total: 0,
            showTable:false,
            showDetail: false,
            detailData: null,
            clearTableSelect: null,
            loading:false,//加载进度-----------
            computedMoney:{
                "Turnover":0,
                "OperatingCost":0,
                "PCost":0,
            },//计算合计金额------
            
      }
    },
    computed:{
        
    },
    mounted () {
      this.getList();
      this.showTable= Math.random();
      
    },
    methods:{
        //获取列表值-----
        getList(){
            this.loading=true;
            this.search.ACCOUNT_TIME_gte=formatDate(this.search.ACCOUNT_TIME_gte);
            this.search.ACCOUNT_TIME_lte=formatDate(this.search.ACCOUNT_TIME_lte);
            this.axios.request({
                url: '/tenant/report/tt_fundreport/list',
                method: 'post',
                data: {
                    ACCOUNT_TIME_gte: this.search.ACCOUNT_TIME_gte,
                    ACCOUNT_TIME_lte: this.search.ACCOUNT_TIME_lte,
                    page: this.page,
                    limit: this.limit,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    this.tableData= res.data
                    this.total= res.total

                    this.computedList(res.data);
                    
                }
                this.loading=false;
            })
            this.detailData = null;
        },
        //计算金额------
        computedList(val){
            //先初始化，后计算
            this.computedMoney={
                "Turnover":0,
                "OperatingCost":0,
                "PCost":0,
            };
            for(let i in val){
                for(let j in this.computedMoney){
                    if(parseInt(val[i][j])){
                        this.computedMoney[j]+=parseInt(val[i][j]);
                    }
                    
                }
            }

            for(let i in this.computedMoney){
                this.computedMoney[i]=this.formatMoney(this.computedMoney[i]);
            }            
        },
        clear(){
            for(var i in this.search){
                this.search[i]= ''
            }
            
            this.page=1;
            this.getList();
        },
        changePage(page){
            this.page= page
            this.getList()
        },
        changePageSize(size){
            this.limit= size
            this.getList()
        },

        onRowClick(row, index){
            console.log(row);
            this.detailData=row
        },
        onRowDblclick( row, index){
            this.detailData=row;
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.reset();
        },
        //重置数据-----
        reset(){
            this.getList();
        },

    }
}
</script>

<style lang="less" scoped>
.search-block{
  display: inline-block;
  width: 200px;
  margin-right: 10px;
}
.button-distance{
  margin-left: 10px;
}
</style>
