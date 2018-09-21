
<!--选择维修项目组件 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="选择维修项目"
        width="90"
        :mask-closable="false"
        :scrollable="true"
        :transfer= "showTransfer"
        :footer-hide="false"
        :transition-names="['', '']"
        class="table-modal-detail"
    >

    <common-table v-model="tableData" :columns="columns" :show="showTenanceItems" :total="total" @changePage="changePage" 
        @changePageSize="changePageSize" @onRowClick="onRowClick" :showOperate=false>
        <div slot="search">
            <Form  class="common-form">
                <FormItem >
                    <Select v-model="test1" @on-change="changeCarType" placeholder="选择车辆类型">
                        <Option v-for="(item, index) in getCarTypeData" :key="item.cartype" :value="item.cartype">{{item.CARNAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="isThreeType">
                    <Select :disabled="isdisabled" v-model="test2" placeholder="选择项目分类" >
                        <Option v-for="(item, index) in carItemType" :key="item.TYPE_ID" :value="item.TYPE_ID">{{item.TYPE_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="isThreeType">
                    <Select :disabled="isdisabled" v-model="test3" placeholder="选择发动机类型" >
                        <Option v-for="(item, index) in banJinListData" :key="item.ENGINE_TYPE" :value="item.ENGINE_TYPE">{{item.ENGINE_TYPE_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="isThreeType">
                    <Select :disabled="isdisabled" v-model="test4" placeholder="选择汽车参数" >
                        <Option v-for="(item, index) in carListData" :key="item.CLASS_TYPE" :value="item.CLASS_TYPE">{{item.CLASS_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <Input  placeholder="项目编号/名称..." v-model="test5"></Input>
                </FormItem>
                <FormItem >
                    <ButtonGroup size="small">
                        <Button type="primary" title="查询" @click="searchVehicle"><Icon type="ios-search" size="28"/></Button>
                        <Button type="primary" title="重置" @click="resetVehicle" style="margin-right:20px;"><Icon type="ios-undo" size="28"/></Button>
                        
                    </ButtonGroup>
                    <Button type="primary" @click="addItemFun" v-if="!isThreeType">新增</Button>
                </FormItem>
           </Form>
           
        </div>

    </common-table>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "select-itemsType",
        props:['showTenanceItems','initGetItem',"showTransfer"],
        components: {commonTable},
        data(){
            return{
                test1:'',
                test2:'',
                test3:'',
                test4:'',
                test5:'',
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
                
                columns: [
                    // {type: 'selection', width: 50, fixed: 'left'},
                    {title: '序号',  minWidth: 80,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '项目编号', key: 'ITEM_NO', sortable: true, minWidth: 150,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '项目名称', key: 'NAME', sortable: true, minWidth: 200,
                        // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
                    },
                    {title: '项目分类', key: 'TYPE_NAME', sortable: true, minWidth: 170},
                    {title: '计费标准', key: 'CHARGE_TYPE', sortable: true, minWidth: 150,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CHARGE_TYPE))
                    },
                    {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 120},
                    {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 120,
                        // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
                    },
                    {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 120},
                    {title: '发动机类型', key: 'ENGINE_TYPE_NAME', sortable: true, minWidth: 170},
                    {title: '汽车排量', key: 'CLASS_NAME', sortable: true, minWidth: 250},
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
                                            
                                            this.select(params.row)
                                            this.countList(params.row.DETAIL_ID);
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
                buttonContent:"选择",//自定义按钮内容
                isdisabled:true,//判断下拉框是否下拉
                isThreeType:true,//判断是不是三类------

            }
        },
        watch:{
            showTenanceItems(){
                console.log("点击选择项目了",this.$store.state.user.userInfo.tenant.businessType);
                if(this.$store.state.user.userInfo.tenant.businessType=="10331003"||this.$store.state.user.userInfo.tenant.businessType=="10331004"){
                    this.isThreeType=false;
                }else{
                    this.isThreeType=true;
                }

                this.showOnoff=true;
                this.resetVehicle();//首次进来数据重置
                this.selectData=this.initGetItem;
                this.test2='1';
                this.getList();
                this.getCarType();
                this.getBanJinList();
                this.getCarList();
                
            }
        },
        mounted() {
            
        },
        methods:{
            state(item){
                for(let i in this.selectData){
                    if(this.selectData[i].ITEM_ID== item.ITEM_ID){
                        return true
                    }
                }
                return false
            },
            select(item){
                let flag=true
                for(let i in this.selectData){
                    if(this.selectData[i].ITEM_ID== item.ITEM_ID){
                        this.selectData.splice(i,1)
                        flag= false
                        break;
                    }
                }
                if(flag) this.selectData.push(item);
                this.$emit('sTenanceItem', this.selectData);
                console.log('this.selectData',this.selectData)
            },
            countList(idx){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/saveitemId',
                    method: 'post',
                    data: {
                        DETAIL_ID:idx,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                })
            },
            getList(){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/infolist1',
                    method: 'post',
                    data: {
                        cartype_eq: this.test1||'',
                        TYPE_ID_eq: this.test2||'',
                        ENGINE_TYPE_eq: this.test3||'',
                        CLASS_TYPE_eq: this.test4||'',
                        KEYWORD: this.test5||'',
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        console.log("得到列表数据",res);
                        this.tableData= res.data
                        this.total= res.total

                    }
              })
            },
            getCarType(){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/getCarTypeSelList',
                    method: 'post',
                    data: {
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.getCarTypeData=res.data;
                    }
              })
            },
            getBanJinList(){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/getBanJinList',
                    method: 'post',
                    data: {
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.getBanJinListData=res.data;
                    }
              })
            },
            getCarList(){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/getCarList',
                    method: 'post',
                    data: {
                        page: this.page,
                        limit: this.limit,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.getCarListData=res.data;
                    }
              })
            },
            //改变汽车类型时过滤参数;
            changeCarType(val){
                console.log(val);
                // console.log(this.search.select1)
                
                this.test2="";
                this.test3="";
                this.test4="";

                this.carItemType=[];
                this.carListData=[];
                this.banJinListData=[];
                if(val){
                    this.isdisabled=false;
                    let carType=null;
                    for(let i in this.getCarTypeData){
                        if(val==this.getCarTypeData[i].cartype){
                            carType=this.getCarTypeData[i].CARNAME;
                            break;
                        }
                    }
                    
                    for(let i in this.getItemType){
                        if(val==this.getItemType[i].cartype){
                            this.carItemType.push(this.getItemType[i]);
                        }
                    }
                    for(let i in this.getCarListData){
                        let carListArr=this.getCarListData[i].CLASS_NAME.split('-');
                        // console.log(carListArr);
                        if(carListArr[0]==carType){
                            let newJson={"CLASS_TYPE":this.getCarListData[i].CLASS_TYPE,"CLASS_NAME":carListArr[1]};
                            this.carListData.push(newJson);
                            // console.log(this.carListData);
                        }
                    }
                    if(val==3){
                        this.banJinListData=[{ENGINE_TYPE: 1, ENGINE_TYPE_NAME: "化油器"},{ENGINE_TYPE: 2, ENGINE_TYPE_NAME: "电喷"}];
                    }else if(val==4){
                        this.banJinListData=[{ENGINE_TYPE: 1, ENGINE_TYPE_NAME: "化油器"},{ENGINE_TYPE: 2, ENGINE_TYPE_NAME: "电喷"}];
                    }else if(val==5){
                        this.banJinListData=[];
                        this.banJinListData=[{ENGINE_TYPE: 0, ENGINE_TYPE_NAME: "其他"}];
                    }else{
                        this.banJinListData=[];
                    }
                }
                
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
                // this.showOnoff=false;
                // this.$emit('selectCar', row);
            },
            searchVehicle(){
                
                this.page=1;
                this.getList();
            },
            resetVehicle(){
                // console.log("重置之前先打印",this.test1,this.test2,this.test3,this.test4,this.test5);
                this.test1="";
                this.test2="";
                this.test3="";
                this.test4="";
                this.test5="";
                // console.log("重置之 后 打印",this.test1,this.test2,this.test3,this.test4,this.test5);
                this.isdisabled=true;
            },
            //新增项目--------
            addItemFun(){
                if(this.test5){
                    this.axios.request({
                            url: '/tenant/basedata/repairadditem/check_item',
                            method: 'post',
                            data: {
                                access_token: this.$store.state.user.token
                            }
                        }).then(res => {
                            if (res.success === true) {
                                var data = res.data;
                                if (data.length <= 0 || data == null) {
                                    this.$Modal.confirm({
                                        title:"系统提示!",
                                        content:"系统提示', '暂未导入维修项目，请先行导入！",
                                        
                                    })
                                    return;
                                } else {

                                    this.$Modal.confirm({
                                        title:"系统提示!",
                                        content:"确认新增吗?",
                                        onOk:this.addFun,
                                    })

                                }
                            }
                    })
                }else{
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"请在搜索框中添加你需要添加的项目名称",
                        
                    })
                }
            },
            addFun(){
                this.axios.request({
                    url: '/tenant/basedata/repairadditem/add_item',
                    method: 'post',
                    data: {
                        ITEM_NAME:this.test5,
                        access_token: this.$store.state.user.token,
                    }
                }).then(res => {
                    if (res.success === true) {
                             this.getList();   
                    }
                });
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