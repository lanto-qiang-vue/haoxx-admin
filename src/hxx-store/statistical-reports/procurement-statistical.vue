<!--采购台账 2018-09-04 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <Form ref="search" :rules="ruleValidate"  :model="search" :label-width="85" inline>
          <FormItem label="查询日期:" style="width: 100%; margin-right: 10px;">
              <DatePicker v-model="search.ACCOUNT_TIME_gte" format="yyyy-MM-dd" type="date" placeholder="开始日期" style="width: 120px;"></DatePicker>
              <DatePicker v-model="search.ACCOUNT_TIME_lte" format="yyyy-MM-dd" type="date" placeholder="结束日期" style="width: 120px;margin-left: 5px;"></DatePicker>
              <Button style="margin-left: 5px;" type="primary" @click="page=1;getList()">搜索</Button>
          </FormItem>
     </Form>
    </div>

    <div slot="operate">
      <Button type="primary" @click="printPB">打印采购台账</Button>
    </div>
    
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'

  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import {printPBFun} from '@/hxx-components/repairPrintUtil.js'


export default {
	name: "procurement-statistical",
    components: {commonTable},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '购买日期', key: 'CREATE_TIME', sortable: true, minWidth: 180,
                },
                {title: '产品名称', key: 'NAME', sortable: true, minWidth: 120,
                    
                },
                {title: '规格型号', key: 'FORMAT', sortable: true, minWidth: 120},
                {title: '供应商名称', key: 'NAME1', sortable: true, minWidth: 140,
                    
                },
                {title: '供应商地址', key: 'ADDRESS', sortable: true, minWidth: 140,
                },
                {title: '进货单价', key: 'PURCHASE_PRICE', sortable: true, minWidth: 120,align:'right',
                    render: (h, params) => h('span', this.formatMoney(params.row.PURCHASE_PRICE)||0)
                },
                {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 100,
                },
                {title: '金额', key: 'total', sortable: true, minWidth: 100,align:'right',
                    render: (h, params) => h('span', this.formatMoney(params.row.total)||0)
                },
                {title: '配件类型', key: 'TYPE_NAME', sortable: true, minWidth: 120,
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
                url: '/tenant/report/purchasebook/list',
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

                    
                }
                this.loading=false;
            })
            this.detailData = null;
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
        //打印台账-----
        printPB(){
            var LODOP=getLodop();
            
            var temp=printPBFun(this.tableData);
            LODOP.ADD_PRINT_TEXT(30, 0, "100%", 20, "采 购 台 账");
            LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
            //LODOP.SET_PRINT_STYLEA(0,"Bold",1);
            LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
            LODOP.ADD_PRINT_TABLE(70, 0, "100%", 980, temp);
            LODOP.PREVIEW();

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
.button-distance{
  margin-left: 10px;
}
</style>
