<!--人员培训 2018-09-04 -->
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
      <Button type="primary" v-if="" :disabled='buttonFlag' @click="selectPick">申请</Button>
      <Button type="primary" v-if="" @click="editButton">查看详情</Button>
    </div>
    <!--详情-->
    <person-training-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></person-training-detail>

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
  import personTrainingDetail from './person-training-detail.vue'
export default {
	name: "person-training",
    components: {commonTable,personTrainingDetail},
    mixins: [mixin],
    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 60,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '培训内容', key: 'trainingContent', sortable: true, minWidth: 150,
                },
                {title: '培训时间', key: 'time', sortable: true, minWidth: 150,
                    
                },
                {title: '培训地点', key: 'place', sortable: true, minWidth: 150},
                {title: '培训费用', key: 'cost', sortable: true, minWidth: 120,
                    
                },
                {title: '发布人', key: 'cREATER', sortable: true, minWidth: 120,
                    
                },
                {title: '状态', key: 'state', sortable: true, minWidth: 100,
                    render: (h, params) => {
                        var STATE='';
                        if (params.row.state == "1") {
                            STATE= "申请中";
                        } else if (params.row.state == "2") {
                            STATE= "已结束";
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
            buttonFlag:true,
            
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
                url: '/tenant/support/tenant_techtrain/list',
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
            if(this.detailData.isjoin=='0'){
                this.buttonFlag=false;
                
            }else{
                this.buttonFlag=true;
            }
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
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要申请吗？",
                onOk:this.saveOrSubmit,
                
            })
            
            
        },
        saveOrSubmit(){
            this.axios.request({
                url: '/tenant/support/tenant_techtrain/examine_tech',
                method: 'post',
                data: {
                
                    ids: this.detailData.id,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    this.$Message.info('申请成功');
                    this.detailData=null;
                    this.getList();
                    this.buttonFlag=true;
                }
            })
            
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
