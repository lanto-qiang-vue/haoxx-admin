<!--后台管理页面 技术支持  cx-2018-09-30 -->
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
      <Button type="primary" v-if="" @click="dealFun" :disabled="dButton">处理</Button>
      <Button type="info" v-if="" @click="showNewDetail=true" :disabled="fButton">完成</Button>
      <Button type="info" v-if="" @click="editButton" :disabled="!detailData">详细</Button>
    </div>

    <!--完成按钮界面-->
    <Modal
        v-model="showNewDetail"
        title="技术回复基本信息"
        @on-visible-change="finishVisibleChange"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :transition-names="['', '']"
        class="table-modal-detail">
        <div style="height: 100%;overflow: auto;">
            <Form :label-width="100" inline class="detail-form" >
                <FormItem label="技术回复:"  style="width:91%;" >
                    <Input type="textarea" :rows="6"  v-model="FAULT_ANSWER" placeholder="">
                    </Input>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="primary" @click="showNewDetail=false" style="margin-right: 10px;">返回</Button>
            <Button type="primary" @click="finishFun" style="margin-right: 10px;">保存</Button>
        </div>
    </Modal>
    <!--详细按钮页面！！！-->
    <Modal
        v-model="showEdit"
        title="技术支持信息"
        @on-visible-change="editVisibleChange"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :transition-names="['', '']"
        class="table-modal-detail">
        <div style="height: 100%;overflow: auto;">
            <Form :label-width="100" inline class="detail-form" >
                <FormItem label="建档人:"  style="width:45%;" >
                        <Input type="text"  v-model="showDetailData.cREATER" placeholder="" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="申请人:"  style="width:45%;" >
                        <Input type="text"  v-model="showDetailData.aPPLY_PERSON" disabled placeholder="">
                        </Input>
                    
                    </FormItem>
                    <FormItem label="车型信息:"  style="width:45%;" >
                        <Input type="text"  v-model="showDetailData.mODEL_NAME"  placeholder="" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="答复时间:" style="width:45%;" >
                        
                        <Input type="text"  v-model="showDetailData.aNSWER_TIME" disabled placeholder="">
                        </Input>
                  
                    </FormItem>
                    <FormItem label="故障呈现:" style="width:45%;" >
                        
                        <Input type="textarea" :rows="4"  v-model="showDetailData.fAULT_INFO" disabled placeholder="">
                        </Input>
                        
                    </FormItem>
                    <FormItem label="故障类型:" style="width:45%;" >
                        
                        <Input type="textarea" :rows="4"  v-model="showDetailData.fAULT_TYPE" disabled placeholder="">
                        </Input>
                      
                    </FormItem>
                    <FormItem label="技术答复:" style="width:45%;" >
                        
                        <Input type="textarea" :rows="4"  v-model="showDetailData.fAULT_ANSWER" disabled placeholder="">
                        </Input>
                        
                    </FormItem>
                    <FormItem label="备注:" style="width:45%;" >
                        
                        <Input type="textarea" :rows="4"  v-model="showDetailData.rEMARK" disabled placeholder="">
                        </Input>
                        
                    </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="primary" @click="showEdit=false" style="margin-right: 10px;">返回</Button>
            
        </div>
    </Modal>
    

  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
export default {
	name: "technical-supportM",
    components: {commonTable},

    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 80,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '建档人', key: 'cREATER', sortable: true, minWidth: 120,
                },
                {title: '申请人', key: 'aPPLY_PERSON', sortable: true, minWidth: 120,
                    
                },
                {title: '车型信息', key: 'mODEL_NAME', sortable: true, minWidth: 200},
                {title: '故障呈现', key: 'fAULT_INFO', sortable: true, minWidth: 120,
                    
                },
                {title: '故障类型', key: 'fAULT_TYPE', sortable: true, minWidth: 120,
                    
                },
                
                {title: '备注', key: 'rEMARK', sortable: true, minWidth: 120,
                    
                },
                {title: '技术答复', key: 'fAULT_ANSWER', sortable: true, minWidth: 120,
                },
                {title: '答复时间', key: 'aNSWER_TIME', sortable: true, minWidth: 168,
                    render: (h, params) => h('span', params.row.aNSWER_TIME.substr(0, 19))
                },
                {title: '状态', key: 'sTATE', sortable: true, minWidth: 100,
                    render: (h, params) => {
                        var STATE='';
                        if (params.row.sTATE == "1") {
                            STATE= "申请中";
                        } else if (params.row.sTATE == "2") {
                            STATE= "处理中";
                        }else if (params.row.sTATE == "3") {
                            STATE= "已回复";
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
            dButton:true,//处理按钮flag
            fButton:true,//完成按钮flag

            showNewDetail:false,//完成界面显示
            FAULT_ANSWER:"",

            showEdit:false,//详细页面显示
            showDetailData:{
                aNSWER_TIME:"",
                aPPLY_PERSON:"",
                cREATER:"",
                fAULT_ANSWER:"",
                fAULT_INFO:"",
                fAULT_TYPE:"",
                mODEL_ID:"",
                mODEL_NAME:"",
                rEMARK:"",
                sTATE:"",
                sTATUS:"",
                sUPPORT_ID:"",
            },
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
                url: '/manage/support/technical_support/technicalList',
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
            this.dButton=true;
            this.fButton=true;
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
            this.detailData=row;
            if(row.sTATE=="1"){
                this.dButton=false;
                this.fButton=true;
            }else if(row.sTATE=="2"){
                this.dButton=true;
                this.fButton=false;
            }else if(row.sTATE=="3"){
                this.dButton=true;
                this.fButton=true;
            }
        },
        closeDetail(){
            this.detailData= null;
            this.clearTableSelect= Math.random();
            this.reset();
        },
        //处理按钮-----
        dealFun(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要处理吗？",
                onOk:this.dealFunData,
                
            })
        },
        dealFunData(){
            this.axios.request({
                url: '/manage/support/technical_support/update_manager',
                method: 'post',
                data: {
                    ids: this.detailData.sUPPORT_ID,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.getList();
                }
            })
        },
        //完成按钮------
        finishFun(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定完成回复吗？",
                onOk:this.finishFunData,
                
            })
        },
        finishFunData(){
            var jsonData={"sUPPORT_ID":"","FAULT_ANSWER":""};
            jsonData["sUPPORT_ID"]=this.detailData.sUPPORT_ID;
            jsonData["FAULT_ANSWER"]=this.FAULT_ANSWER;

            this.axios.request({
                url: '/manage/support/technical_support/update_complete',
                method: 'post',
                data: {
                    data: JSON.stringify(jsonData),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.showNewDetail=false;
                    this.FAULT_ANSWER="";
                    this.getList();
                }
            })
        },
        finishVisibleChange(status){
            if(status === false){
                this.getList();
            }
        },
        //编辑按钮
        editButton(){
            this.showEdit=true;
            for(let i in this.detailData){
                this.showDetailData[i]=this.detailData[i];
            }
        },
        editVisibleChange(status){
            if(status === false){
                this.getList();
                for(let i in this.showDetailData){
                    this.showDetailData[i]="";
                }
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
