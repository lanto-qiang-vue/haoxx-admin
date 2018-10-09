<!--数据元管理 2018-10-09-->
<template>

        <Split v-model="split" :min="0.3" :max="0.7">
            <div slot="left" class="demo-split-pane" style="height: 100%;overflow: auto;">
                
                <!--<div style="height: 100%;overflow: auto;">-->
                    <Button type="primary" icon="md-add"></Button>
                    <div class="search-block">
                        <Input v-model="search.input" placeholder="类型编号/名称/数据元名称..">
                            <Icon type="ios-search" slot="suffix" />
                        </Input>
                    </div>
                    <Table :columns="columns" :data="tableData" border></Table>
                <!--</div>-->
                
            </div>
            <div slot="right" class="demo-split-pane" style="height: 100%;overflow: auto;">
               <Button type="primary" icon="md-add"></Button>
                <div class="search-block">
                    <Input v-model="search.input" placeholder="类型编号/名称/数据元名称..">
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                </div>
                <Table :columns="columns1" :data="tableData1" border></Table>
            </div>
        </Split>

    
      

</template>
<script>
    import commonTable from '@/hxx-components/common-table.vue'

    export default {
        name: "source-manage",
        components: {commonTable, },
        data(){
            return{
                split:0.3,
                search:{
                    input:'',
                },
                tableData:[],
                columns:[
                    {title: '类型编码', key: 'TYPE',  width: 95},
                    {title: '类型名称', key: 'TYPE_NAME',  minWidth: 130},
                ],
                columns1:[
                    {title: '序号',  minWidth: 80,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '数据元', key: 'CODE_ID', sortable: true, minWidth: 120,
                        
                    },
                    {title: '数据元名称', key: 'TYPE_NAME', sortable: true, minWidth: 120},
                    {title: '排序值', key: 'NUM', sortable: true, minWidth: 135},
                    {title: '状态', key: 'STATUS', sortable: true, minWidth: 120},
                    {title: '创建人', key: 'CREATE_BY', sortable: true, minWidth: 200},
                    {title: '创建时间', key: 'CREATE_TIME', sortable: true, minWidth: 130,
                        
                    },
                ],
                tableData1:[],
                page: 1,
                limit: 25,
                total: 0,
                showTable:false,
                showDetail: false,
                detailData: null,
                clearTableSelect: null,
                isOrderSuccess:true,//判断是不是预约成功
                firstFlag:true,
                    
            }
        },
        mounted () {
            this.getList();
        },
        methods:{
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
                    this.total= res.total
                    if(this.firstFlag){

                        this.getCodeList(res.data[0]['TYPE']);
                        this.firstFlag=false;
                    }
                    
                }
                })

                this.detailData= null
                this.isOrderSuccess=true;
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
                    this.tableData1= res.data
                    
                }
                })

                this.detailData= null
                this.isOrderSuccess=true;
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
        },

    }
</script>

<style lang="less" scoped>
    .search-block{
    display: inline-block;
    width: 200px;
    margin-left: 10px;
    }


</style>
