<!--后台管理 人员招聘 2018-10-08 -->
<template>
  <common-table v-model="tableData" :columns="columns" :total="total" :clearSelect="clearTableSelect"
                @changePage="changePage" @changePageSize="changePageSize" @onRowClick="onRowClick"
                 :show="showTable" :page="page">
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
      <Button type="primary" v-if="" @click="auditFun" :disabled="buttonState.audit">审核</Button>
      <Button type="primary" v-if="" @click="releaseFun" :disabled="buttonState.release">发布</Button>
      <Button type="primary" v-if="" @click="showDetail=Math.random()" :disabled='!detailData'>详情</Button>
    </div>
    <!--详情-->
    <person-recruit-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></person-recruit-detail>
  </common-table>
</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import { formatDate } from '@/libs/tools.js'
import personRecruitDetail from './person-recruit-detail.vue'
export default {
	name: "person-recruit",
    components: {commonTable,personRecruitDetail},
    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 60,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '申请门店', key: 'tENANT_NAME', sortable: true, minWidth: 150,
                },
                {title: '申请时间', key: 'cREATE_TIME', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', params.row.cREATE_TIME.substr(0, 19))
                },
                {title: '岗位', key: 'name', sortable: true, minWidth: 150},
                {title: '工作职责', key: 'postName', sortable: true, minWidth: 120,
                    
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
            buttonState:{
                audit:true,
                release:true,
            }
            
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
                url: '/manage/support/person_recruit/recruitList',
                method: 'post',
                data: {
                    BeginTime: this.search.ACCOUNT_TIME_gte,
                    EndTime: this.search.ACCOUNT_TIME_lte,
                    page: this.page,
                    start: 0,
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
            this.buttonState.audit=true;
            this.buttonState.release=true;
        },
        clear(){
            for(var i in this.search){
                this.search[i]= ''
            }
            this.buttonState.audit=true;
            this.buttonState.release=true;
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
            this.detailData=row;
            if(row.state==1){
                this.buttonState.audit=false;
                this.buttonState.release=true;
            }else if(row.state==2){
                this.buttonState.audit=true;
                this.buttonState.release=false;
            }else if(row.state==3){
                this.buttonState.audit=true;
                this.buttonState.release=true;
            }
        },
        
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.buttonState.audit=true;
            this.buttonState.release=true;
        },
        //审核按钮
        auditFun(){
            this.$Modal.confirm({
                  title:"系统提示!",
                  content:"确定要审核吗？",
                  onOk:this.auditFuntion,
                  
            })
        },
        auditFuntion(){
            this.axios.request({
                url: '/manage/support/person_recruit/update_examine',
                method: 'post',
                data: {
                    ids: this.detailData.id,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.getList();
                }
            })
        },
        //发布按钮
        releaseFun(){
            this.$Modal.confirm({
                  title:"系统提示!",
                  content:"确定要发布吗？",
                  onOk:this.releaseFunction,
                  
            })
        },
        releaseFunction(){
            this.axios.request({
                url: '/manage/support/person_recruit/update_rele',
                method: 'post',
                data: {
                    ids: this.detailData.id,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.getList();
                }
            })
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
