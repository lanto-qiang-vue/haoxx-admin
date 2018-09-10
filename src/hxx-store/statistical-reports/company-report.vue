<!--业务类别统计 2018-09-04 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">

    <div slot="search">
      <Form ref="search" :rules="ruleValidate"  :model="search" :label-width="85" inline>
          <FormItem label="查询日期:" style="width: 100%; margin-right: 10px;">
              <DatePicker v-model="search.ACCOUNT_TIME_gte" format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px;"></DatePicker>
              <DatePicker v-model="search.ACCOUNT_TIME_lte" format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px;margin-left: 5px;"></DatePicker>
              <ButtonGroup size="small" style="margin-left: 10px;">
                <Button type="primary" @click="page=1;getList()"><Icon type="ios-search" size="24"/></Button>
                <Button type="primary" @click="clear()"><Icon type="ios-undo" size="24"/></Button>
              </ButtonGroup>
          </FormItem>
     </Form>
    </div>
    <div slot="operate">
        <div span="16">
            <div ref="dom" style="height: 300px; border: 2px solid block; position: relative;" ></div>
        </div>
            
    </div>
    
    <div slot="footer">
      <table  width='100%' cellpadding='5' cellspacing='0'>
            <tr>
                <td style="min-width:120px; height:30px;padding:0 18px; text-align: center;">合计：</td>
                <td style="min-width:120px; height:30px;padding:0 18px;text-align: center;" v-for="site in computedMoney">{{site.money}}{{site.unit}}</td>
                
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
    import echarts from 'echarts'

export default {
	name: "company-report",
    components: {commonTable},
    mixins: [mixin],
    data(){
	    return{
            value: {
                Mon: 13253,
                Tue: 34235,
                Wed: 26321,
                Thu: 12340,
                Fri: 24643,
                Sat: 1322,
                Sun: 1324
            },
            columns: [
                {title: "营业总额", key: '_Turnover', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', params.row._Turnover||0)
                },
                {title: '营业成本', key: '_OperatingCost', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', params.row._OperatingCost||0)
                },
                {title: '纯利润', key: '_PCost', sortable: true, minWidth: 120,
                    render: (h, params) => h('span', params.row._PCost||0)

                },
                {title: '应收金额', key: '_AmountReceivable_Alleceivable', sortable: true, minWidth: 120,
                     render: (h, params) => h('span', params.row._AmountReceivable_Alleceivable||0)
                },
                {title: '实收金额', key: '_AmountCollected', sortable: true, minWidth: 120,
                     render: (h, params) => h('span', params.row._AmountCollected||0)
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

            computedMoney:[],//计算合计金额------
            
        }
    },
    computed:{
        
    },
    mounted () {
      this.getList();
      this.showTable= Math.random();

    //   this.$nextTick(() => {
    //     let xAxisData = Object.keys(this.value)
    //     let seriesData = Object.values(this.value)
    //     let option = {
    //         title: {
    //         text: this.text,
    //         subtext: this.subtext,
    //         x: 'center'
    //         },
    //         xAxis: {
    //         type: 'category',
    //         data: xAxisData
    //         },
    //         yAxis: {
    //         type: 'value'
    //         },
    //         series: [{
    //         data: seriesData,
    //         type: 'bar'
    //         }]
    //     }
    //     let dom = echarts.init(this.$refs.dom, 'tdTheme')
    //     dom.setOption(option)
    //     })

    
    var myChart = echarts.init(this.$refs.dom);
    var option = null;
    option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };
    ;
    
    myChart.setOption(option, true);
    
  
    },
    methods:{
        //获取列表值----
        getList(){
            this.search.ACCOUNT_TIME_gte=formatDate(this.search.ACCOUNT_TIME_gte);
            this.search.ACCOUNT_TIME_lte=formatDate(this.search.ACCOUNT_TIME_lte);
            this.axios.request({
                url: '/tenant/report/tt_managereport/info_list',
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
            })
            this.detailData = null;
        },
        //计算金额------
        computedList(val){
            //先初始化，后计算
            this.computedMoney=[];
            var siteMoney={
                "rEPAIR_TYPE":0,
                "rEPAIR_TIME":0,
                "sALES_PRICE":0,
                "total":0,
                "operatingCost":0,
                "pCost":0,
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
                    
                    case 'rEPAIR_TIME':
                        obj.unit='工时';
                        obj.money=siteMoney[i];
                        this.computedMoney.push(obj);
                    break;
                    case 'rEPAIR_TYPE':
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
