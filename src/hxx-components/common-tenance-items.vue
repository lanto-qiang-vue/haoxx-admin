
<!--选择项目组件 2018-08-23 -->
<template>
    <Modal
        v-model="showOnoff"
        title="选择维修项目"
        width="90"
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
    >

    <common-table v-model="tableData" :columns="columns" :show="showTenanceItems" :total="total" @changePage="changePage" 
        @changePageSize="changePageSize" @onRowClick="onRowClick">
        <div slot="search">
            <Form inline>
                <FormItem>
                    <Select v-model="test1" style="min-width: 250px;" @on-change="changeCarType">
                        <Option v-for="(item, index) in getCarTypeData" :key="index" :value="item.cartype">{{item.CARNAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select :disabled="isdisabled" v-model="test2" style="min-width: 250px;">
                        <Option v-for="(item, index) in carItemType" :key="index" :value="item.TYPE_ID">{{item.TYPE_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select :disabled="isdisabled" v-model="test3" style="min-width: 250px;">
                        <Option v-for="(item, index) in banJinListData" :key="index" :value="item.ENGINE_TYPE">{{item.ENGINE_TYPE_NAME}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select :disabled="isdisabled" v-model="test4" style="min-width: 250px;" >
                        <Option v-for="(item, index) in carListData" :key="index" :value="item.CLASS_TYPE">{{item.CLASS_NAME}}</Option>
                    </Select>
                </FormItem>
           </Form>
           <div class="search-block">
                <Input  placeholder="预约单号/预约人/联系电话..." v-model="test5"></Input>
            </div>
            <ButtonGroup size="small">
                <Button type="primary" title="查询" @click="searchVehicle"><Icon type="ios-search" size="24"/></Button>
                <Button type="primary" title="重置" @click="resetVehicle" style="margin-right:20px; margin-left: 1px;"><Icon type="ios-undo" size="24"/></Button>
            </ButtonGroup>
        </div>

    </common-table>
  </Modal>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
  import { getName, getDictGroup } from '@/libs/util.js'
	export default {
		name: "common-tenance-items",
        props:['showTenanceItems','initGetItem'],
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
                    {title: '序号',  minWidth: 60,
                        render: (h, params) => h('span', (this.page-1)*this.limit+params.index+1 )
                    },
                    {title: '项目编号', key: 'ITEM_NO', sortable: true, minWidth: 200,
                        //render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
                    },
                    {title: '项目名称', key: 'NAME', sortable: true, minWidth: 200,
                        // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.VEHICLE_COLOR))
                    },
                    {title: '项目分类', key: 'TYPE_NAME', sortable: true, minWidth: 200},
                    {title: '计费标准', key: 'CHARGE_TYPE', sortable: true, minWidth: 200,
                        render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.CHARGE_TYPE))
                    },
                    {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 200},
                    {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 200,
                        // render: (h, params) => h('span', params.row.ORDER_DATE.substr(0, 10))
                    },
                    {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 200},
                    {title: '发动机类型', key: 'ENGINE_TYPE_NAME', sortable: true, minWidth: 200},
                    {title: '汽车排量', key: 'CLASS_NAME', sortable: true, minWidth: 200},
                    {title: '操作', key: 'operation', sortable: true, minWidth: 80,
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
                buttonContent:"选择",//自定义按钮内容
                isdisabled:true,//判断下拉框是否下拉

            }
        },
        watch:{
            showTenanceItems(){
                console.log("点击选择项目了");
                this.showOnoff=true;
                // this.resetVehicle();//首次进来数据重置
                this.selectData=this.initGetItem;

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
            getList(){
                this.axios.request({
                    url: '/tenant/basedata/repairiteminfo/infolist1',
                    method: 'post',
                    data: {
                        cartype_eq: this.test1,
                        TYPE_ID_eq: this.test2,
                        ENGINE_TYPE_eq: this.test3,
                        CLASS_TYPE_eq: this.test4,
                        KEYWORD: this.test5,
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
                this.test5="";

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
                console.log("this.test1",this.test1);
                console.log("this.carItemType",this.carItemType)
                console.log("this.carListData",this.carListData)
                console.log("this.banJinListData",this.banJinListData)
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
            

        }
	}
</script>
