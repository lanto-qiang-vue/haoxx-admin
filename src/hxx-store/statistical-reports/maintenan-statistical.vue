<!--维修班组业绩统计 2018-09-04 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :showOperate=false>
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
    
    <div slot="footer">
      <table  width='100%' cellpadding='5' cellspacing='0'>
            <tr>
                <td style="min-width:80px;height:30px;"></td>
                <td style="min-width:120px; height:30px;">合计：</td>
                <td style="min-width:120px; height:30px;" v-for="(value, key) in computedMoney">{{value}}元</td>
                
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
	name: "maintenan-statistical",
    components: {commonTable},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 80,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '维修技师', key: 'user_name', sortable: true, minWidth: 120,
                },
                {title: '工时金额', key: 'repair_money', sortable: true, minWidth: 120,
                    
                },
                {title: '工时', key: 'repair_time', sortable: true, minWidth: 120},
                {title: '材料金额', key: 'amount', sortable: true, minWidth: 120,
                    
                },
                {title: '营业额', key: 'outputValue', sortable: true, minWidth: 120,
                },
                {title: '成本', key: 'cost', sortable: true, minWidth: 120,
                },
                {title: '利润', key: 'pcost', sortable: true, minWidth: 120,
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

            computedMoney:{
                "repair_money":0,
                "repair_time":0,
                "amount":0,
                "outputValue":0,
                "cost":0,
                "pcost":0,
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
            this.search.ACCOUNT_TIME_gte=formatDate(this.search.ACCOUNT_TIME_gte);
            this.search.ACCOUNT_TIME_lte=formatDate(this.search.ACCOUNT_TIME_lte);
            this.axios.request({
                url: '/tenant/report/maintain_tech/techList',
                method: 'post',
                data: {
                    BeginTime: this.search.ACCOUNT_TIME_gte,
                    EndTime: this.search.ACCOUNT_TIME_lte,
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
            this.computedMoney={
                "repair_money":0,
                "repair_time":0,
                "amount":0,
                "outputValue":0,
                "cost":0,
                "pcost":0,
            };
            for(let i in val){
                for(let j in this.computedMoney){
                    this.computedMoney[j]+=parseInt(val[i][j]);
                }
            }
            console.log(this.computedMoney);
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
