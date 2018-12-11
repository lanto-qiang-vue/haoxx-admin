<!--后台管理  人员培训 2018-10-08 -->
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
      <Button type="success" v-if="" @click="addPerson">新增</Button>
      <Button type="primary" v-if="" :disabled='endButton' @click="endButtonFun">结束培训</Button>
      <Button type="primary" v-if="" :disabled='!detailData' @click="detailButton">查看明细</Button>
      <Button type="primary" v-if="" :disabled='!detailData' @click="editButton">详细</Button>
    </div>
      <!--  新增按钮数据  -->
        <Modal
            v-model="showAdd"
            title="人员培训基本信息"
            width="80"
            @on-visible-change="addVisibleChange"
            :scrollable="true"
            :transfer= "false"
            :footer-hide="false"
            :transition-names="['', '']"
            class="table-modal-detail">
            <div style="height: 100%;overflow: auto;">
                <Form :label-width="100" inline class="detail-form" ref="newAddData" :rules="ruleValidate"  :model="newAddData">
                    <FormItem label="培训内容:"  style="width:45%;" prop="TrainingContent">
                        <Input type="text"  v-model="newAddData.TrainingContent" placeholder="">
                        </Input>
                    </FormItem>
                    <FormItem label="培训时间:"  style="width:45%;" prop="Time">
                        <!--<Input type="text"  v-model="newAddData.Time" placeholder="">
                        </Input>-->
                        <DatePicker type="datetime" placeholder="" v-model="newAddData.Time" format="yyyy-MM-dd HH:mm" ></DatePicker>
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
                <Button type="primary" @click="saveAddData('newAddData')" style="margin-right: 10px;">保存</Button>
            </div>

        </Modal>

        <!--查看明细-->
        <Modal
            v-model="showNewDetail"
            title="申请明细"
            @on-visible-change="detailVisibleChange"
            width="80"
            :scrollable="true"
            :transfer= "false"
            :footer-hide="false"
            :transition-names="['', '']"
            class="table-modal-detail">
            <div style="height: 100%;overflow: auto;">
                <Table
                    :data="checkDetailData"
                    :columns="columnsD"
                    stripe
                    border
                >
                </Table>
            </div>
            <div slot="footer">
                <Button type="primary" @click="checkOutFun" style="margin-right: 10px;">返回</Button>
            </div>

        </Modal>

    <!--  详细 页面数据  -->
        <Modal
            v-model="showDetail"
            title="人员培训信息"
            width="90"
            @on-visible-change="editVisibleChange"
            :scrollable="true"
            :transfer= "false"
            :footer-hide="false"
            :transition-names="['', '']"
            class="table-modal-detail">
            <div style="height: 100%;overflow: auto;">
                <Form :label-width="100" inline class="detail-form">
                    <FormItem label="培训内容:"  style="width:45%;" >
                        <Input type="textarea" :rows="4"  v-model="showDetailData.trainingContent" placeholder="" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="培训地点:"  style="width:45%;" >
                        <Input type="textarea" :rows="4"  v-model="showDetailData.place" disabled placeholder="">
                        </Input>

                    </FormItem>
                    <FormItem label="培训时间:"  style="width:45%;" >
                        <Input type="text"  v-model="showDetailData.time"  placeholder="" disabled>
                        </Input>
                    </FormItem>
                    <FormItem label="培训费用:" style="width:45%;" >

                        <Input type="text"  v-model="showDetailData.cost" disabled placeholder="">
                        </Input>

                    </FormItem>
                    <FormItem label="发布人:" style="width:45%;" >

                        <Input type="text"  v-model="showDetailData.cREATER" disabled placeholder="">
                        </Input>

                    </FormItem>
                    <FormItem label="审核人:" style="width:45%;" >

                        <Input type="text"  v-model="showDetailData.userStatusModification" disabled placeholder="">
                        </Input>

                    </FormItem>
                    <FormItem label="更改时间:" style="width:45%;" >

                        <Input type="text"  v-model="showDetailData.uPDATE_TIME" disabled placeholder="">
                        </Input>

                    </FormItem>
                    <FormItem label="申请人数:" style="width:45%;" >

                        <Input type="text"  v-model="showDetailData.num" disabled placeholder="">
                        </Input>

                    </FormItem>

                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="outDetail" style="margin-right: 10px;">返回</Button>
            </div>

        </Modal>
  </common-table>





</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import { formatDate } from '@/libs/tools.js'
export default {
	name: "person-train",
    components: {commonTable},

    data(){
		return{
            columns: [
                {title: '序号',  minWidth: 80,
                    render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                },
                {title: '培训内容', key: 'trainingContent', sortable: true, minWidth: 150,
                },
                {title: '培训时间', key: 'time', sortable: true, minWidth: 150,
                    render: (h, params) => h('span', params.row.time.substr(0, 16))
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

            endButton:true,//结束按钮状态
            showNewDetail:false,//申请明细框
            columnsD:[
                {title: '序号',  minWidth: 80,
                    type: 'index'
                },
                {title: '申请人', key: 'cREATER', sortable: true, minWidth: 200,
                },

                {title: '申请时间', key: 'cREATE_TIME', sortable: true, minWidth: 200,
                    render: (h, params) => h('span', params.row.cREATE_TIME.substr(0, 19))
                },

            ],
            checkDetailData:[],
            showDetailData:{
                cREATER:"",
                cREATE_TIME:"",
                cost:"",
                error:"",
                id:"",
                num:"",
                place:"",
                state:"",
                time:"",
                trainingContent:"",
                uPDATE_TIME:"",
                userStatusModification:"",
            },//详细页面数据
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
            this.endButton=true;
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
            if(this.detailData.state=='2'){
                this.endButton=true;
            }else{
                this.endButton=false;
            }


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
                this.getList();
            }
        },
        //保存新增数据----
        saveAddData(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"确定要保存吗？",
                        onOk:this.saveAddFun,

                    })
                }
            })


        },
        saveAddFun(){
            this.newAddData.Time=formatDate(this.newAddData.Time)+ ' '+ formatDate(this.newAddData.Time, 'hh:mm:ss');
            this.axios.request({
                url: '/manage/support/tech_train/save',
                method: 'post',
                data: {
                    data: JSON.stringify(this.newAddData),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.showAdd=false;
                    for(let i in this.newAddData){
                        if(i=="Cost"){
                            this.newAddData[i]=0;
                        }else{
                            this.newAddData[i]="";
                        }
                    }
                    this.getList();
                }
            })
        },
        //结束培训按钮-----------
        endButtonFun(){
            this.$Modal.confirm({
                title:"系统提示!",
                content:"确定要结束吗？",
                onOk:this.endFun,

            })
        },
        endFun(){
            this.axios.request({
                url: '/manage/support/tech_train/update_pass',
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
        //查看明细按钮-------
        detailButton(){
            this.showNewDetail=true;
            this.axios.request({
                url: '/manage/support/tech_train/checkDetail',
                method: 'post',
                data: {
                    id: this.detailData.id,
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.checkDetailData=res.data;
                }
            })
        },
        checkOutFun(){
            this.showNewDetail=false;
        },
        detailVisibleChange(status){
            if(status === false){
                this.getList();
            }
        },
        //详细按钮----------
        editButton(){
            for(let i in this.detailData){
                this.showDetailData[i]=this.detailData[i];
            }
            this.showDetailData['time']=this.detailData['time'].substr(0, 16);
            this.showDetail=true;

        },
        outDetail(){
            this.showDetail=false;
        },
        editVisibleChange(status){
            if(status === false){
                this.getList();
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
