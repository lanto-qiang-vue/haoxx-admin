<!--后台管理  人员培训 2018-10-08 -->
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
      <Button type="primary" v-if="" @click="addPerson">新增</Button>
      <Button type="primary" v-if="" :disabled='!detailData' @click="editButton">结束培训</Button>
      <Button type="primary" v-if="" :disabled='buttonFlag' @click="">查看明细</Button>
      <Button type="primary" v-if="" :disabled='!detailData' @click="editButton">详细</Button>
    </div>
    <!--详情-->
    <!--<person-training-detail class="table-modal-detail" :showDetail="showDetail" :detailData="detailData" @closeDetail="closeDetail"></person-training-detail>-->

      <!--  新增按钮数据  -->
        <Modal
            v-model="showAdd"
            title="人员培训基本信息"
            width="90"
            @on-visible-change="addVisibleChange"
            :scrollable="true"
            :transfer= "false"
            :footer-hide="false"
            :transition-names="['', '']"
            class="table-modal-detail"
        >
            <div style="height: 100%;overflow: auto;">
                <Form :label-width="100" inline class="detail-form" ref="newAddData" :rules="ruleValidate"  :model="newAddData">
                    <FormItem label="培训内容:"  style="width:45%;" prop="TrainingContent">
                        <Input type="text"  v-model="newAddData.TrainingContent" placeholder="">
                        </Input>
                    </FormItem>
                    <FormItem label="培训时间:"  style="width:45%;" prop="Time">
                        <!--<Input type="text"  v-model="newAddData.Time" placeholder="">
                        </Input>-->
                        <DatePicker type="date" placeholder="" v-model="newAddData.Time"></DatePicker>
                    </FormItem>
                    <FormItem label="培训地点:"  style="width:45%;" prop="place">
                        <Input type="text"  v-model="newAddData.place" placeholder="">
                        </Input>
                    </FormItem>
                    <FormItem label="培训费用:" style="width:45%;" prop="Cost">
                        
                        <!--<Input type="text"  v-model="newAddData.Cost" placeholder="">
                        </Input>-->
                        <InputNumber :min="0" v-model="newAddData.Cost"></InputNumber>
                    </FormItem>
                    
                </Form>
            </div>
            

            <div slot="footer">
                <Button type="primary" @click="" style="margin-right: 10px;">保存</Button>
            </div>
            
        </Modal>

  </common-table>





</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup ,getCreate} from '@/libs/util.js'
  import mixin from '@/hxx-components/mixin'
  import { formatDate } from '@/libs/tools.js'
//   import personTrainingDetail from './person-training-detail.vue'
export default {
	name: "person-train",
    components: {commonTable},
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
                    render: (h, params) => h('span', params.row.time.substr(0, 19))
                },
                {title: '培训地点', key: 'place', sortable: true, minWidth: 150},
                {title: '培训费用', key: 'cost', sortable: true, minWidth: 120,
                    
                },
                {title: '发布人', key: 'cREATER', sortable: true, minWidth: 120,
                    
                },
                {title: '审核人', key: 'userStatusModification', sortable: true, minWidth: 120,
                    
                },
                {title: '更改时间', key: 'uPDATE_TIME', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', params.row.uPDATE_TIME.substr(0, 19))
                },
                {title: '申请人数', key: 'num', sortable: true, minWidth: 120,
                    
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
            ruleValidate:{
                TrainingContent:[{required: true, message: '请填写数据'}],
                Time:[{required: true, message: '请填写数据'}],
                place:[{required: true, message: '请填写数据'}],
                Cost:[{required: true, message: '请填写数据'}],
            },
            showAdd:false,//新增框的显示隐藏
            newAddData:{
                "TrainingContent":"",
                "Time":"",
                "place":"",
                "Cost":0,
            },//新增按钮数据
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
                url: '/manage/support/tech_train/list',
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
            if(this.detailData.isjoin=="0"){
                this.buttonFlag=true;
            }else{
                if(this.detailData.state=='2'){
                    this.buttonFlag=true;
                    
                }else{
                    this.buttonFlag=false;
                }
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
        //新增按钮---------界面数据---
        addPerson(){
            this.showAdd=true;
            
            for(let i in this.newAddData){
                if(i=="Cost"){
                    this.newAddData[i]=0;
                }else{
                    this.newAddData[i]="";
                }
            }
            
            
        },
        addVisibleChange(status){
            if(status === false){
                this.$refs['newAddData'].resetFields();
            }
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
