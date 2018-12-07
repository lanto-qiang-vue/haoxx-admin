<!--服务顾问业绩统计 2018-09-04 -->
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
                <!--<td style="min-width:120px;height:30px;"></td>-->
                <td style="min-width:120px; height:30px;padding: 0 18px;">合计：</td>
                <td style="min-width:120px; height:30px;padding: 0 18px;" v-for="site in computedMoney">{{site.money}}{{site.unit}}</td>
                
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
	name: "server-statistical",
    components: {commonTable},
    mixins: [mixin],
    data(){
		return{
            columns: [
                // {title: '序号',  minWidth: 120,
                //     render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                // },
                {title: '维修技师', key: 'FOLLOW_PERSON', sortable: true, minWidth: 120,
                },
                {title: '进厂台次', key: 'REPAIR_IN', sortable: true, minWidth: 120,
                    
                },
                {title: '结算台次', key: 'REPAIR_TYPE', sortable: true, minWidth: 120},
                {title: '结算金额', key: 'SUM_MONEY', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', this.formatMoney(params.row.SUM_MONEY)||0)
                    
                },
                {title: '成本', key: 'OperatingCost', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', this.formatMoney(params.row.OperatingCost)||0)
                },
                {title: '利润', key: 'PCost', sortable: true, minWidth: 120,
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
            loading:false,
            computedMoney:[],//计算合计金额------
            
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
            this.search.ACCOUNT_TIME_gte=formatDate(this.search.ACCOUNT_TIME_gte);
            this.search.ACCOUNT_TIME_lte=formatDate(this.search.ACCOUNT_TIME_lte);
            this.loading=true;
            this.axios.request({
                url: '/tenant/report/tt_servicestatistics/list',
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
            this.computedMoney=[];
                
            
            var siteMoney={
                "REPAIR_IN":0,
                "REPAIR_TYPE":0,
                "SUM_MONEY":0,
                "OperatingCost":0,
                "PCost":0,
            };
                
            
            for(let i in val){
                for(let j in siteMoney){
                    siteMoney[j]+=parseInt(val[i][j]);
                }
            }

            for(let i in siteMoney){
                var obj={
                    unit:'',money:0
                }
                switch(i){
                    case 'REPAIR_IN':
                    case 'REPAIR_TYPE':
                        obj.unit='台';
                        obj.money=siteMoney[i];
                        this.computedMoney.push(obj);
                    break;
                    default : 
                        obj.unit='元';
                        obj.money=siteMoney[i];
                        this.computedMoney.push(obj);
                }
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
