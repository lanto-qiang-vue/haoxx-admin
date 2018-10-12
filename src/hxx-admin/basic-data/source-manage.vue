<!--数据元管理 2018-10-09-->
<template>
    <div style="width: 100%;height: 100%">
        <Split v-model="splitNum" class="split" :min="0.3" :max="0.7">
        <div slot="left" class="split-pane" ref="commonTable">
            <div class="operate" >
                <Button type="primary" icon="md-add" @click="showModal=true;"></Button>
                <div class="search-block">
                    <Input v-model="search.input" placeholder="类型编号/名称/数据元名称.." >
                        <Icon type="ios-search" slot="suffix" @click="searchFun" style="cursor:pointer;"/>
                    </Input>
                </div>
            </div>
                <Table :columns="columns" :data="tableData" border :highlight-row="true" @on-current-change="onCurrentChange" :height="tableHeight"></Table>
        </div>

        <div slot="right" class="split-pane" >
            
            <div class="operate" >
                <Button type="primary">新增</Button>
                <Button type="error" @click="deleteCode" :disabled="!deleteCodeId">删除</Button>
                <Button type="info">刷新</Button>
            </div>
            <Table :columns="columns1" :data="tableData1" border @on-select="selectCode" @on-select-all="selectAllCode"></Table>
        </div>
        
        
    </Split>
        <Modal
            v-model="showModal"
            title="基本信息"
            :width="400"
            @on-visible-change="visibleChange"
            :scrollable="true"
            :transfer= "true"
            :footer-hide="false"
            
            :mask-closable="false"
            :transition-names="['', '']">
            <Form :label-width="110" ref="listSearch" :rules="ruleValidate"  :model="listSearch">
                <FormItem label="类型名称:" prop="typeName">
                    <Input type="text" v-model="listSearch.typeName" placeholder=""> </Input>
                </FormItem>
                <FormItem label="数据元名称:" prop="codeName">
                    <Input type="text" v-model="listSearch.codeName" placeholder=""> </Input>
                </FormItem>
            </Form>
            <!--底部按钮组-->
            <div slot="footer" >
                <Button @click="showModal=false;">取消</Button>
                <Button type="primary" @click="handleSubmit('listSearch')">提交</Button>
                
            </div>
        </Modal>
    
    </div>
    

    
</template>
<script>
  import sourceManageDetail from './source-manage-detail.vue'
    import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
    export default {
        name: "source-manage",
        components: {commonTable, sourceManageDetail},
        data(){
            return{
                splitNum:0.3,
                search:{
                    input:'',
                },
                tableData:[],
                columns:[
                    {title: '类型编码', key: 'TYPE',  width: 95},
                    {title: '类型名称', key: 'TYPE_NAME',  minWidth: 130},
                ],
                columns1:[
                    {
                        type: 'selection',
                        width: 60,

                    },
                    {title: '序号',  minWidth: 70,type:'index',
                    },
                    {title: '数据元', key: 'CODE_ID', minWidth: 110,
                        
                    },
                    {title: '数据元名称', key: 'CODE_DESC', minWidth: 120},
                    {title: '排序值', key: 'NUM',  minWidth: 80},
                    {title: '状态', key: 'STATUS',  minWidth: 80,
                        render: (h, params) => h('span', getName(this.statusList, params.row.STATUS))
                    },
                    {title: '创建人', key: 'CREATE_BY',  minWidth: 120},
                    {title: '创建时间', key: 'CREATE_TIME',  minWidth: 130,
                        render: (h, params) => h('span', params.row.CREATE_TIME.substr(0, 10))
                    },
                ],
                tableData1:[],
                page: 1,
                limit: 25,
                
                showTable:false,
                showDetail: false,
                detailData: null,
                clearTableSelect: null,
                isOrderSuccess:true,//判断是不是预约成功
                firstFlag:true,
                deleteCodeId:'',
                windowInnerHeight: window.innerHeight,
                tableHeight: 500,
                timer:null,//定时开关
                showModal:false,//新增按钮框的界面----

                listSearch:{
                    typeName:'',
                    codeName:''
                },
                ruleValidate:{
                    typeName: [
                        { required: true,  message: '请填写', trigger: 'change' }
                    ],
                    codeName: [
                        { required: true,  message: '请填写', trigger: 'change' }
                    ],
                },

                temTypeData:null,
                temCodeData:null,
                
            }
        },
        mounted () {
            this.getList();
            let self= this
            this.resize(500)
            window.onresize = function(){
                if(window.innerHeight!= self.windowInnerHeight)
                self.resize(200)
            }
        },
        computed:{
			statusList(){
				return getDictGroup(this.$store.state.app.dict,'1001');
			},
		},
        methods:{
            //缩放表格------
            resize(time){
                let self= this
                let commonTable=this.$refs.commonTable
                if(commonTable.offsetHeight) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function () {
                        self.windowInnerHeight= window.innerHeight
                        self.tableHeight = commonTable.offsetHeight - 20 -
                        commonTable.querySelector(".operate").offsetHeight - 10;
                    }, time);
                }
            },
            //获取当前页面数据------
		    getList(){
                this.axios.request({
                    url: '/manage/basedata/dbcode/typeList',
                    method: 'post',
                    data: {
                        keyWord: this.search.input,
                        page: 1,
                        start: 0,
                        limit: 25,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.tableData= res.data
                        
                        if(this.firstFlag){
                            this.getCodeList(res.data[0]['TYPE']);
                            this.firstFlag=false;
                            this.tableData[0]._highlight = true;
                        }
                        
                    }
                })
            },
            getCodeList(id){
                this.axios.request({
                    url: '/manage/basedata/dbcode/codeList',
                    method: 'post',
                    data: {
                        type: id,
                        page: 1,
                        start: 0,
                        limit: 25,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.tableData1= res.data;
                        this.temCodeData=res.data[0];
                        // this.updateType();
                        // this.updateCode();
                    }
                })
            },
            //搜索框搜索数据
            searchFun(){
                this.firstFlag=true;
                this.getList();
            },
            //新增数据类型----
            addNewType(){
                this.axios.request({
                    url: '/manage/basedata/dbcode/addNewType',
                    method: 'post',
                    data: {
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.tableData.unshift(res.data);
                        this.getCodeList(res.data.TYPE);
                        this.temTypeData=res.data;
                        
                    }
                })
            },
            //保存按钮-----------
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addNewType();
                    }
                });
            },
            //弹出层状态变化--------
            visibleChange(status){
                if(status === false){
                    this.$refs['listSearch'].resetFields();
                    console.log(this.listSearch);
                }
            },
            //更新数据类型
            updateType(){
                this.axios.request({
                    url: '/manage/basedata/dbcode/updateType',
                    method: 'post',
                    data: {
                        type:this.temTypeData['TYPE'],
                        name:this.listSearch.typeName,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                    }
                })
            },
            //更新数据元
            updateCode(){
                var commitdata={};
                for(let i in this.temCodeData){
                    commitdata[i]=this.temCodeData[i];
                }
                commitdata['CODE_DESC']=this.listSearch.codeName;

                this.axios.request({
                    url: '/manage/basedata/dbcode/updateCode',
                    method: 'post',
                    data: {
                        codeBak:commitdata['CODE_ID_BAK'],
                        type:commitdata['TYPE'],
                        data:JSON.stringify(commitdata),
                        
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                    }
                })
            },
            changePage(page){
                    this.page= page
                this.getList()
            },
            changePageSize(size){
                    this.limit= size
                this.getList()
            },

            onRowClick( row, index){
                console.log('row：',row);
                if(row.STATUS=="10421003"){
                    this.isOrderSuccess=true;
                }else{
                    this.isOrderSuccess=false;
                }
                this.detailData=row
            },
            onRowDblclick( row, index){
                this.detailData=row
                console.log('row：',row);
                this.showDetail=Math.random()
            },
            closeDetail(){
                this.detailData= null
                this.isOrderSuccess=true;
                this.clearTableSelect= Math.random()
            },
            onCurrentChange(currentRow, oldCurrentRow){
                console.log('发生改变',currentRow, oldCurrentRow);
                this.getCodeList(currentRow.TYPE);
            },
            //新增数据元-------
            addNewCode(){
                this.axios.request({
                    url: '/manage/basedata/dbcode/addNewCode',
                    method: 'post',
                    data: {
                        type: 1055,
                        typeName: '',
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                    }
                })
            },
            //删除数据元------
            deleteCode(){
                this.axios.request({
                    url: '/manage/basedata/dbcode/deleteCode',
                    method: 'post',
                    data: {
                        ids: this.deleteCodeId,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                    }
                })
            },
            selectCode(selection,row){
                this.deleteCodeId='';
                for(let i in selection){
                    this.deleteCodeId+=selection[i]['CODE_ID']+','
                }
                console.log(this.deleteCodeId);
            },
            selectAllCode(selection){
                console.log('选择全部',selection);
                this.deleteCodeId='';
                for(let i in this.selection){
                    this.deleteCodeId=this.deleteCodeId+this.selection[i]['CODE_ID']+','
                }
            },
        },

    }
</script>

<style lang="less" scoped>
    .search-block{
        display: inline-block;
        width: 70%;
        /*margin-left: 10px;*/
        overflow: hidden;
    }
    .demo-split{
        border: 1px solid #dcdee2;
    }
.split{
  border: 1px solid #dcdee2;
  background-color: white;
  .split-pane{
    padding: 10px;
    height: 100%;
    overflow: auto;
    position: relative;
    .tree-search{
      padding: 15px;
      border-radius: 3px;
    }
    .tree-input{
      z-index: 1;
    }
    .vehicle-tree{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      padding: 50px 0 10px 10px;
      overflow: hidden;
    }
  }
}

  .operate{
    margin-bottom: 10px;
    padding: 15px 15px 10px 15px;
    border: 1px solid #dcdee2;
    border-radius: 3px;
  }
  .operate button{
    margin: 0 5px 5px 0;
  }
</style>
