
<!--选择配件组件 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="选择配件库存"
        width="90"
        :scrollable="true"
        :transfer= "transferFlag"
        :footer-hide="false"
        :mask-closable="false"
        :transition-names="['', '']"
        class="table-modal-detail"
    >
    <common-table v-model="tableData" :columns="columns" :show="showSelectParts" :total="total" @changePage="changePage" 
        @changePageSize="changePageSize" @onRowClick="onRowClick" :showOperate="showOperate">
        <div slot="search">
            <Form class="common-form">
                <FormItem label="配件分类:" :label-width="80">
                    <Select v-model="test1" >
                        <Option v-for="(item, index) in getSellItem" :key="index" :value="item.TYPE_ID">{{item.TYPE_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="仓库:" v-show='stockFlag' :label-width="60">
                    <Select v-model="test2">
                        <Option v-for="(item, index) in getAllItem" :key="index" :value="item.STORE_ID">{{item.NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input  placeholder="配件编号/名称..." v-model="test3"></Input>
                    
                </FormItem>
                <ButtonGroup size="small">
                    <Button type="primary" title="查询" @click="searchVehicle"><Icon type="ios-search" size="28"/></Button>
                    <Button type="primary" title="重置" @click="resetVehicle"><Icon type="ios-undo" size="28"/></Button>
                </ButtonGroup>
           </Form>
           
        </div>
    </common-table>
    <div slot="footer">
        <Button type="primary" @click="showOnoff=false;" style="margin-right: 10px;">确定</Button>

    </div>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-parts",
        props:['showSelectParts','initParts','initData','stockFlag','transferFlag'],
        components: {commonTable},
        data(){
            return{
                test1:'',
                test2:'',
                test3:'',
                showOperate:false,//
                getCarTypeData:[],//汽车类型集合
                getBanJinListData:[],//发动机类型集合
                getCarListData:[],//汽车参数集合
                getItemType:[
                        { TYPE_ID: "1", TYPE_NAME: "维护", cartype: "3" },
                        { TYPE_ID: "2", TYPE_NAME: "大修和全车喷漆", cartype: "3" },
                        { TYPE_ID: "3", TYPE_NAME: "发动机机械", cartype: "3" },
                        { TYPE_ID: "4", TYPE_NAME: "发动机电气", cartype: "3" },
                        { TYPE_ID: "5", TYPE_NAME: "变速箱", cartype: "3" },
                        { TYPE_ID: "6", TYPE_NAME: "转向系统", cartype: "3" },
                        { TYPE_ID: "7", TYPE_NAME: "悬挂系统", cartype: "3" },
                        { TYPE_ID: "8", TYPE_NAME: "驱动桥", cartype: "3" },
                        { TYPE_ID: "9", TYPE_NAME: "制动系统", cartype: "3" },
                        { TYPE_ID: "10", TYPE_NAME: "电气", cartype: "3" },
                        { TYPE_ID: "11", TYPE_NAME: "空调", cartype: "3" },
                        { TYPE_ID: "12", TYPE_NAME: "钣金", cartype: "3" },
                        { TYPE_ID: "13", TYPE_NAME: "喷漆", cartype: "3" },
                        { TYPE_ID: "25", TYPE_NAME: "维护", cartype: "4" },
                        { TYPE_ID: "26", TYPE_NAME: "大修和全车喷漆", cartype: "4" },
                        { TYPE_ID: "27", TYPE_NAME: "发动机机械", cartype: "4" },
                        { TYPE_ID: "28", TYPE_NAME: "发动机电气", cartype: "4" },
                        { TYPE_ID: "29", TYPE_NAME: "变速箱", cartype: "4" },
                        { TYPE_ID: "30", TYPE_NAME: "转向系统", cartype: "4" },
                        { TYPE_ID: "31", TYPE_NAME: "悬挂系统", cartype: "4" },
                        { TYPE_ID: "32", TYPE_NAME: "驱动桥", cartype: "4" },
                        { TYPE_ID: "33", TYPE_NAME: "制动系统", cartype: "4" },
                        { TYPE_ID: "34", TYPE_NAME: "电气", cartype: "4" },
                        { TYPE_ID: "35", TYPE_NAME: "空调", cartype: "4" },
                        { TYPE_ID: "36", TYPE_NAME: "钣金", cartype: "4" },
                        { TYPE_ID: "37", TYPE_NAME: "喷漆", cartype: "4" },
                        { TYPE_ID: "38", TYPE_NAME: "维护和大修", cartype: "5" },
                        { TYPE_ID: "39", TYPE_NAME: "发动机附离合器", cartype: "5" },
                        { TYPE_ID: "40", TYPE_NAME: "变速箱附传动轴", cartype: "5" },
                        { TYPE_ID: "41", TYPE_NAME: "转向系、前桥、前悬挂", cartype: "5" },
                        { TYPE_ID: "42", TYPE_NAME: "后桥、后悬挂、制动", cartype: "5" },
                        { TYPE_ID: "43", TYPE_NAME: "电气", cartype: "5" },
                        { TYPE_ID: "44", TYPE_NAME: "车身", cartype: "5" },
                        { TYPE_ID: "45", TYPE_NAME: "车架、漆工", cartype: "5" },
                        { TYPE_ID: "116", TYPE_NAME: "自定义", cartype: "3" },
                        { TYPE_ID: "117", TYPE_NAME: "自定义", cartype: "4" },
                        { TYPE_ID: "118", TYPE_NAME: "自定义", cartype: "5" },
                ],//汽车项目分类
                carTypeData:[],//过滤后的汽车类型
                carItemType:[],//过滤后的汽车分类
                banJinListData:[],//过滤后的发动机类型
                carListData:[],//过滤后的汽车参数

                listSearch:{
                    ORDER_TYPE:'',
                },
                searchSelectOption1:[],
                collapse: ['1','2'],
                tableHeight: 500,
                timer: null,
                showOnoff:false,
                tableData:[],
                selectData:[],
                //表格内容数据----
                columns: [
                    // {type: 'selection', width: 50, fixed: 'left'},
                    {title: '序号',  minWidth: 80,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '仓库', key: 'STORE_NAME', sortable: true, minWidth: 180,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 140,
                        // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
                    },
                    {title: '配件名称', key: 'NAME', sortable: true, minWidth: 180},
                    {title: '品牌', key: 'BRAND', sortable: true, minWidth: 150,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.BRAND))
                    },
                    {title: '单位成本', key: 'UNIT_COST', sortable: true, minWidth: 130},
                    {title: '销售建议价', key: 'SALES_PRICE', sortable: true, minWidth: 150,
                        // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
                    },
                    {title: '库存量', key: 'STOCK_NUM', sortable: true, minWidth: 120},
                    {title: '单位', key: 'UNIT', sortable: true, minWidth: 100,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
                    },
                    {title: '操作', key: 'operation', sortable: true, minWidth: 100,fixed: 'right',
                        render: (h, params) => {
                            let buttonContent= this.state(params.row)? '取消选择':'选择';
                            let buttonStatus= this.state(params.row)? 'warning':'primary';
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: buttonStatus,
                                        size: 'small'
                                    },
                                    style: {
                                        width:"60px",
                                        textAlign: "center",
                                        marginRight: '10px',
                                        
                                    },
                                    on: {
                                        click: (index) => {
                                            console.log(params.index);
                                            console.log(this.tableData[params.index]);
                                            this.select(params.row)
                                        }
                                    }
                                }, buttonContent),
                            ]);
                        }
                    },
                ],
                total: 0,
                page: 1,
                limit: 25,

                getSellItem:[],//配件分类
                getAllItem:[],//仓库数据

            }
        },
        watch:{
            showSelectParts(){
                console.log("点击选择配件了");
                this.showOnoff=true;
                this.selectData=this.initParts;

                this.test2=this.initData;

                this.getList();
                this.getTypeSellList();
                this.getAllList();
                
                
            }
        },
        mounted() {
            
        },
        methods:{
            state(item){
                for(let i in this.selectData){
                    if(this.selectData[i].PART_ID== item.PART_ID && this.selectData[i].STORE_ID == item.STORE_ID){
                        return true
                    }
                }
                return false
            },
            select(item){
                let flag=true
                for(let i in this.selectData){
                    if(this.selectData[i].PART_ID== item.PART_ID && this.selectData[i].STORE_ID == item.STORE_ID){
                        this.selectData.splice(i,1)
                        flag= false
                        break;
                    }
                }
                if(flag) this.selectData.push(item);
                this.$emit('selectPartsItem', this.selectData);
                
            },
            //获取表格数据
            getList(){
                console.log(this.test2,'this.test2');
                this.axios.request({
                    url: '/tenant/repair/ttpartstock/list',
                    method: 'post',
                    data: {
                        TYPE_ID_eq: this.test1||'',
                        STORE_ID_eq: this.test2||'',
                        KEYWORD: this.test3,
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
            },
            //获取配件分类列表数据----------
            getTypeSellList(){
                this.axios.request({
                    url: '/tenant/basedata/partinfo/getTypeSelList',
                    method: 'post',
                    data: {
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                        this.getSellItem=res.data;
                    }
              })
            },
            //获取仓库列表数据--------------
            getAllList(){
                this.axios.request({
                    url: '/tenant/basedata/ttstorehouse/get_all_list',
                    method: 'post',
                    data: {
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.getAllItem=res.data;
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
                console.log(row);
                
            },
            searchVehicle(){
                this.page=1;
                this.getList();
            },
            resetVehicle(){
                
                if(this.stockFlag){
                    this.test1="";
                    this.test2="";
                    this.test3="";
                    this.page=1;
                    this.getList();
                }else{
                     this.test1="";
                    this.test3="";
                    this.page=1;
                    this.getList();
                }
                
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
    .common-table{
        padding: 10px;
        background-color: white;
        height: 100%;
        overflow: hidden;
        position: relative;
        .table-search{
        }
        .operate{
            margin-top: 10px;
            padding: 15px;
            border: 1px solid #dcdee2;
            border-radius: 3px;
        }
        .main-table{
            margin-top: 10px;
        }
        .table-bottom{
            position: absolute;
            height: 52px;
            padding: 10px;
            width: 100%;
            left: 0;
            bottom: 0;
            background-color: white;
            z-index: 4;
        }
    }
</style>
