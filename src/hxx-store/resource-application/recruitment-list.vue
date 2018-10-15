<!--人员招聘 2018-09-04 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                @onRowDblclick="onRowDblclick" :show="showTable" :page="page">
    <div slot="search">
      <Form ref="search" :rules="ruleValidate"  :model="search" :label-width="85" inline>
          <FormItem label="创建时间:" style="width: 100%; margin-right: 10px;">
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
      <Button type="primary" v-if="" @click="selectPick">新增</Button>
      <Button type="primary" v-if="" @click="editButton" :disabled='!detailData'>查看详情</Button>
    </div>
    <!--详情-->
    <recruitment-list-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></recruitment-list-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
  import recruitmentListDetail from './recruitment-list-detail.vue'
export default {
	name: "recruitment-list",
    components: {commonTable,recruitmentListDetail},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 60,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '岗位名称', key: 'name', sortable: true, minWidth: 150,
                },
                {title: '岗位职责', key: 'postName', sortable: true, minWidth: 150,
                    
                },
                {title: '申请时间', key: 'cREATE_TIME', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', params.row.cREATE_TIME.substr(0, 16))
                },
                {title: '人数', key: 'num', sortable: true, minWidth: 120,
                    
                },
                {title: '状态', key: 'state', sortable: true, minWidth: 100,
                    render: (h, params) => {
                        var STATE='';
                        if (params.row.state == "1") {
                            STATE= "申请中";
                        } else if (params.row.state == "2") {
                            STATE= "处理中";
                        }else if (params.row.state == "3") {
                            STATE= "已发布";
                        } else {
                            STATE= "";
                        }
                        return h('div',STATE)
                        }
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
                url: '/tenant/support/tt_personrecruit/list',
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
            this.showDetail=Math.random();
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.reset();
        },
        //新增按钮
        selectPick(){
            this.detailData=null;
            this.showDetail=Math.random();
        },
        //编辑按钮
        editButton(){
            if(this.detailData){
                this.showDetail=Math.random();
            }else{
                this.$Message.info('请选择一条数据');
            }
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
