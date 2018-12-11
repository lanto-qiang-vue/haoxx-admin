
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
        class="table-modal-detail">

    <common-table v-model="tableData" :columns="columns" :show="showTenanceItems" :total="total" @changePage="changePage"
        @changePageSize="changePageSize" @onRowClick="onRowClick" :showOperate=false :page="page">
        <div slot="search">
            <Form  class="common-form">
                <FormItem >
                    <Select v-model="test1" @on-change="changeCarType" placeholder="选择车辆类型" :disabled="isdisabled">
                        <Option v-for="(item, index) in getCarTypeData" :key="item.cartype" :value="item.cartype">{{item.CARNAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <Select  v-model="test4" placeholder="选择汽车参数" :disabled="isdisabled">
                        <Option v-for="(item, index) in carListData" :key="item.CLASS_TYPE" :value="item.CLASS_TYPE">{{item.CLASS_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <Select  v-model="test3" placeholder="选择发动机类型" >
                        <Option v-for="(item, index) in banJinListData" :key="item.ENGINE_TYPE" :value="item.ENGINE_TYPE">{{item.ENGINE_TYPE_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <Select  v-model="test2" placeholder="选择项目分类" clearable>
                        <Option v-for="(item, index) in carItemType" :key="item.TYPE_ID" :value="item.TYPE_ID">{{item.TYPE_NAME}}</Option>
                    </Select>
                </FormItem>

                <FormItem >
                    <Input  placeholder="项目编号/名称..." v-model="test5"></Input>
                </FormItem>
                <FormItem >
                    <ButtonGroup size="small">
                        <Button type="primary" @click="searchVehicle">搜索</Button>
                    </ButtonGroup>
                    <Button style="margin-left: 5px;" type="success" @click="addItemFun">新增</Button>
                </FormItem>
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
		name: "select-itemsType",
        props:['showTenanceItems','initGetItem',"showTransfer",'initSearch'],
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
                    {title: '序号',  width: 70,align:'center',
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
                    {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 120,align:'right',
                        render: (h, params) => h('span', this.formatMoney(params.row.REPAIR_MONEY))
                    },
                    {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 120,align:'right',
                        // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
                    },
                    {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 120,align:'right',},
                    {title: '发动机类型', key: 'ENGINE_TYPE_NAME', sortable: true, minWidth: 170},
                    {title: '汽车排量', key: 'CLASS_NAME', sortable: true, minWidth: 250},
                    {title: '操作', key: 'operation', sortable: true, minWidth: 120,fixed: 'right',align:'center',
                        render: (h, params) => {
                            let buttonContent= this.state(params.row)? '取消选择':'选择';
                            let buttonStatus= this.state(params.row)? 'default':'warning';
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: buttonStatus,
                                        size: 'small'
                                    },
                                    style: {
                                        textAlign: "center",

                                        width:"80px",
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
                carNameArr:[
                    {code:'轿车',name:3},
                    {code:'客车',name:4},
                    {code:'货车',name:5},
                ],//汽车数据集合------
                vehicleNumberArr:[
                    { code: '轿车-排量<1.6升-A', name: 'A' },
                    { code: '轿车-1.6升≤排量≤1.8升-B', name: 'B' },
                    { code: '轿车-1.8升<排量≤2.3升-C', name: 'C' },
                    { code: '轿车-2.3升<排量≤3升-D', name: 'D' },
                    { code: '轿车-3升<排量≤4升-E', name: 'E' },
                    { code: '客车-车总长≤4米（座位≤7座）-I', name: 'I' },
                    { code: '客车-4米<车总长≤5米（8座≤座位≤19座）-J', name: 'J' },
                    { code: '客车-5米<车总长≤7米（20座≤座位≤32座）-K', name: 'K' },
                    { code: '客车-7米<车总长≤10米（33座≤座位≤44座）-L', name: 'L' },
                    { code: '客车-10米<车总长（45座≤座位）-M', name: 'M' },
                    { code: '货车-载质量≤0.75吨-P', name: 'P' },
                    { code: '货车-汽油(0.75吨<载质量≤3.50吨)-Q', name: 'Q' },
                    { code: '货车-柴油(0.75吨<载质量≤3.50吨)-R', name: 'R' },
                    { code: '货车-汽油(0.75吨<载质量≤3.50吨)-S', name: 'S' },
                    { code: '货车-柴油(0.75吨<载质量≤3.50吨)-T', name: 'T' },
                    { code: '货车-载质量≥8吨-U', name: 'U' }
                ],//未筛选
                flagData:1,
            }
        },
        watch:{
            showTenanceItems(){
                this.showOnoff=true;
                this.resetVehicle();//首次进来数据重置
                this.selectData=this.initGetItem;
                this.flagData=1;


                if(this.initSearch){
                    let getCarName=getName(this.vehicleTypeArr,this.initSearch.VEHICLE_TYPE);
                    this.test1=getName(this.carNameArr,getCarName);

                    this.changeCarType(this.test1);
                    this.test4=getName(this.vehicleNumberArr,this.initSearch.VEHICLE_TYPE_CODE);
                    this.isdisabled=true;
                }else{
                    this.test1=3;
                    this.test4="A";

                    this.changeCarType(this.test1);

                    this.isdisabled=false;
                }







                this.getList();
            }
        },
        computed: {
            //车辆类型---
            vehicleTypeArr(){
                return getDictGroup(this.$store.state.app.dict, '1052');
            },
        },
        mounted() {
            this.getCarType();
            this.getBanJinList();
            this.getCarList();
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
            //计数函数---------------
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
            //根据汽车id获取项目分类参数--------
            getCarData(name){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/getItemType',
                    method: 'post',
                    data: {
                        page: 1,
                        limit: 25,
                        cartype: name,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.carItemType=res.data;
                        this.test2='';
                    }
              })
            },
            //获取列表数据--------
            getList(){
                // if(this.$store.state.user.userInfo.tenant.businessType=="10331003"||this.$store.state.user.userInfo.tenant.businessType=="10331004"){
                //      this.axios.request({
                //             url: '/tenant/basedata/repairiteminfo/infolist11',
                //             method: 'post',
                //             data: {
                //                 cartype_eq: this.test1||'',
                //                 KEYWORD: this.test5||'',
                //                 page: this.page,
                //                 limit: this.limit,
                //                 access_token: this.$store.state.user.token
                //             }
                //         }).then(res => {
                //             if (res.success === true) {
                //                 console.log("得到列表数据",res);
                //                 this.tableData= res.data
                //                 this.total= res.total

                //             }
                //     })
                // }else{
                     this.axios.request({
                            url: '/tenant/basedata/repairiteminfo/infolist11',
                            method: 'post',
                            data: {
                                flag:this.flagData,
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
                // }

            },
            //获取汽车类型-----
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
            //获取发送机维修类型-------
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
            //获取汽车排量参数问题--------
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


                this.carListData=[];
                this.banJinListData=[];
                if(val){

                    let carType='';

                    for(let i in this.getCarTypeData){
                        if(this.getCarTypeData[i]['cartype']==val){
                            carType=this.getCarTypeData[i]['CARNAME'];
                            break;
                        }
                    }

                    for(let i in this.getCarListData){

                        if(this.getCarListData[i]['CLASS_NAME'].indexOf(carType)!=-1){
                            this.carListData.push(this.getCarListData[i]);
                        }
                    }

                    if(!this.initSearch){

                        this.test4=this.carListData[0]['CLASS_TYPE'];
                    }


                    if(val==3){
                        this.banJinListData=[{ENGINE_TYPE: 1, ENGINE_TYPE_NAME: "化油器"},{ENGINE_TYPE: 2, ENGINE_TYPE_NAME: "电喷"}];
                        this.test3=2;
                    }else if(val==4){
                        this.banJinListData=[{ENGINE_TYPE: 1, ENGINE_TYPE_NAME: "化油器"},{ENGINE_TYPE: 2, ENGINE_TYPE_NAME: "电喷"}];
                        this.test3=2;
                    }else if(val==5){
                        this.banJinListData=[];
                        this.banJinListData=[{ENGINE_TYPE: 0, ENGINE_TYPE_NAME: "其他"}];
                        this.test3=0;
                    }
                    this.getCarData(this.test1);
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
                this.flagData=2;
                this.getList();
            },
            resetVehicle(){
                this.test2="";
                this.test5="";
            },
            //新增项目--------
            addItemFun(){

                if(this.test5){
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"确认新增吗?",
                        onOk:this.addCheckItem,
                    })

                }else{
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"请在搜索框中添加你需要添加的项目名称",

                    })
                }
            },
            addCheckItem(){
                this.axios.request({
                            url: '/tenant/basedata/repairadditem/check_item',
                            method: 'post',
                            data: {
                                CAR_TYPE:this.test1,
                                access_token: this.$store.state.user.token
                            }
                        }).then(res => {
                            if (res.success === true) {

                                this.addFun();



                            }
                    })
            },
            addFun(){
                this.axios.request({
                    url: '/tenant/basedata/repairadditem/add_item',
                    method: 'post',
                    data: {
                        ITEM_NAME:this.test5,
                        CAR_TYPE:this.test1,
                        CLASS_TYPE:this.test4,
                        ENGINE_TYPE:this.test3,
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

</style>
