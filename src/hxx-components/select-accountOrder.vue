<!--维修工单结算-->
<template>
    <Modal
        v-model="showOnoff"
        title="维修工单结算"
        width="90"
        @on-visible-change="visibleChange"
        :scrollable="true"
        :transfer= "true"
        :footer-hide="false"
        class="table-modal-detail"
        :mask-closable="false"
        :transition-names="['', '']"
    >
        <div style="height: 100%;overflow: auto; padding-bottom: 30px;">
             <div class="demo-split">
                <Split v-model="splitNum" :min="0.3" :max="0.7">
                    <div slot="left">
                        <Collapse v-model="collapse1">
                            <Panel name="1">结算信息
                                <Form slot="content" :label-width="120" class="common-form">
                                    <FormItem label="维修项目费用:">
                                        <span>{{shoukuanSearch.REPAIR_ITEM_MONEY}}元</span>
                                    </FormItem>
                                    <FormItem label="维修配件费用:">
                                        <span>{{shoukuanSearch.REPAIR_PART_MONEY}}元</span>
                                        
                                    </FormItem>
                                    <FormItem label="其他项目费用:">
                                        <span>{{shoukuanSearch.OTHER_MONEY}}元</span>
                                        
                                    </FormItem>
                                    <FormItem label="项目优惠金额:">
                                        <InputNumber v-model="shoukuanSearch.REPAIR_ITEM_DERATE_MONEY" @on-change="itemComputedFun" 
                                            :formatter="value => `${value}元`" :parser="value => value.replace('元', '')" :disabled="jiesuanButton"
                                        ></InputNumber>
                                    </FormItem>
                                    <FormItem label="配件优惠金额:">
                                        <InputNumber :min="0" v-model="shoukuanSearch.REPAIR_PART_DERATE_MONEY" @on-change="partComputedFun"
                                            :formatter="value => `${value}元`" :parser="value => value.replace('元', '')" :disabled="jiesuanButton"
                                        ></InputNumber>
                                    </FormItem>
                                    <FormItem label="合计优惠金额:">
                                        <span>{{shoukuanSearch.LESS_MONEY}}元</span>
                                    </FormItem>
                                    <FormItem label="合计应收金额:">
                                        <span>{{shoukuanSearch.SUM_MONEY}}元</span>
                                    </FormItem>
                                </Form>
                            </Panel>
                            <Panel name="2">其他信息
                                <Form slot="content" :label-width="120" class="common-form" ref="shoukuanSearch" :rules="ruleValidate"  :model="shoukuanSearch">
                                    <FormItem label="出厂日期:" prop="OUT_DATE">
                                        <DatePicker v-model="shoukuanSearch.OUT_DATE" type="datetime" placeholder="" :disabled="jiesuanButton"></DatePicker>
                                    </FormItem>
                                   <FormItem label="出厂里程:" prop="OUT_MILEAGE">
                                        
                                        <InputNumber :min="0" v-model="shoukuanSearch.OUT_MILEAGE" @on-change="outMileageFun"
                                            :formatter="value => `${value}公里`" :parser="value => value.replace('公里', '')" :disabled="jiesuanButton"
                                        ></InputNumber>
                                    </FormItem>
                                    <FormItem label="旧件处理结果:">
                                        <Select v-model="shoukuanSearch.OLD_PART_RESULT" :disabled="jiesuanButton">
                                            <Option v-for="(item, index) in partsArr" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="新能源专用部件:">
                                        <Input type="text" v-model="shoukuanSearch.ZY_PART" placeholder="" :disabled="jiesuanButton"> </Input>
                                    </FormItem>
                                    <FormItem label="质量保证期:">
                                        
                                        <InputNumber :min="0" v-model="shoukuanSearch.ZY_PART_BZQ" @on-change="bzqFun" :disabled="jiesuanButton"
                                            :formatter="value => `${value}公里`" :parser="value => value.replace('公里', '')"
                                        ></InputNumber>
                                    </FormItem>
                                </Form>
                            </Panel>
                        </Collapse>

                    </div>
                    <div slot="right">
                        <Collapse v-model="collapse">
                            <Panel name="1">结算单预览
                                <div slot="content" style="width: 700px;" id="ggggg">
                                    
                                </div>
                            </Panel>
                        </Collapse>
                        
                    </div>
                </Split>
            </div>

            <select-shoukuanOrder :showSelectAccount="showShouKuan" :listSearch="listSearch" :repairPersonArr="repairPersonArr" @closeGetList="closeGetList"></select-shoukuanOrder>
            
        </div>
        <!--底部按钮组-->
      <div slot="footer" >
          <Button v-if="accessBtn('doaccount')" @click="saveAccountFun('shoukuanSearch')"  type="warning" :disabled="jiesuanButton" >结算</Button>
          <Button v-if="accessBtn('shoukuan')" @click="shoukuanFun" type="warning" :disabled="shoukuanButton" >收款</Button>
          <Button @click="showOnoff=false;">返回</Button>
      </div>
  </Modal>
</template>

<script>
import { getName, getDictGroup } from '@/libs/util.js'
import mixin from '@/hxx-components/mixin'
import { formatDate } from '@/libs/tools.js'
import selectShoukuanOrder from '@/hxx-components/select-shoukuanOrder.vue'
  import {printAccountFun} from '@/hxx-components/repairPrintUtil.js'

	export default {
		name: "select-accountOrder",
        mixins: [mixin],
        props:['showSelectAccount','showAccountData','showAccountItem','showItemGroup','showAccountParts','showAccountOther','repairPersonArr'],
        components: {selectShoukuanOrder},
        data(){
            return{
                collapse:'1',
                collapse1:['1','2'],
                splitNum:0.3,
                showOnoff:false,
                shoukuanSearch:{
                    "REPAIR_ITEM_MONEY":0,
                    "REPAIR_PART_MONEY":0,
                    "OTHER_MONEY":0,
                    "REPAIR_ITEM_DERATE_MONEY":0,
                    "REPAIR_PART_DERATE_MONEY":0,

                    "LESS_MONEY":0,
                    "SUM_MONEY":0,
                    "OUT_DATE":"",
                    "OUT_MILEAGE":0,
                    "OLD_PART_RESULT":"3",
                    "ZY_PART":"",
                    "ZY_PART_BZQ":0,
                    "REPAIR_ID":""
                },//提交收款工单数据-----------
                showShouKuan:false,//收款弹出----
                ruleValidate: {
                    OUT_DATE: [
                        { required: true, type: 'date', message: '请选择时间', }
                    ],
                    OUT_MILEAGE: [
                        { required: true,  message: '请选择里程', }
                    ]
                },
                partsArr:[
                    {name:'旧配件已确认,由托修方收回',code:'1'},
                    {name:'旧配件已确认,由承修方收回',code:'2'},
                    {name:'无旧配件',code:'3'},
                ],

                jiesuanButton:false,
                shoukuanButton:true,
                carTypeFun:null,//车辆类型
                repairTypeFun:null,//维修类型
                bandTypeFun:null,//品牌类型
                partsType:null,//配件类型
                //初始数据值
                listSearch:{
                    "TENANT_ID":"",
                    "REPAIR_ID":"",
                    "REPAIR_NO":"",
                    "VEHICLE_ID":"",
                    "ENGINE_NO":"",
                    "VEHICLE_COLOR":"",
                    "ORDER_ID":"",
                    "OUT_DATE":"",
                    "OUT_MILEAGE":"",
                    "OLD_PART_RESULT":"",
                    "ZY_PART":"",
                    "ZY_PART_BZQ":"",
                    "PLATE_NUM":"",
                    "VEHICLE_MODEL":"",
                    "VIN_NO":"",
                    "CUSTOMER_NAME":"",
                    "GIVE_REPAIR_PERSON":"",
                    "TELPHONE":"",
                    "REPAIR_TYPE":"10191001",
                    "MILEAGE":0,
                    "REPAIR_PERSON":"",
                    "VEHICLE_TYPE":"10521001",
                    "VEHICLE_TYPE_CODE":"轿车-排量<1.6升-A",
                    "FOLLOW_PERSON":"",
                    "COME_DATE":new Date(),
                    "PLAN_END_DATE":new Date(),
                    "FAULT_DESC":"",
                    "CUSTOMER_INFO":"",
                    "REPAIR_INFO":"",
                    "IS_ITEM_GROUP":"10041002",
                    "REPAIR_ITEM_DERATE_MONEY":0,
                    "REPAIR_PART_DERATE_MONEY":0,
                    "STATUS":"10201001",
                    "REPAIR_ITEM_MONEY":0,
                    "REPAIR_PART_MONEY":0,
                    "OTHER_MONEY":0,
                    "SUM_MONEY":0,
                    "GD_TYPE":""
                },
                itemArr:[],//项目数据
                itemGroup:[],//项目套餐数据
                partArr:[],//配件数据
                otherArr:{},//其他数据


            }
        },
        watch:{
            showSelectAccount(){
                console.log("进来结算单数据",this.showAccountData);
                //数据清空
                for(let key in this.listSearch){
                    switch (key){
                        case 'MILEAGE':
                        case 'OTHER_MONEY':              
                        case 'REPAIR_ITEM_MONEY':
                        case 'REPAIR_PART_MONEY':
                        case 'REPAIR_ITEM_DERATE_MONEY':
                        case 'REPAIR_PART_DERATE_MONEY':
                        case 'OTHER_MONEY':
                        case 'SUM_MONEY': this.listSearch[key]= 0; break
                        case 'STATUS': this.listSearch[key]= "10201001"; break
                        case 'REPAIR_TYPE': this.listSearch[key]= "10191001"; break
                        case 'IS_ITEM_GROUP': this.listSearch[key]= "10041002"; break
                        case 'COME_DATE':this.listSearch[key]= new Date();break
                        case 'PLAN_END_DATE':this.listSearch[key]= new Date();break
                        case 'VEHICLE_TYPE':this.listSearch[key]= "10521001";break
                        case 'VEHICLE_TYPE_CODE':this.listSearch[key]= "轿车-排量<1.6升-A";break
                        default : this.listSearch[key]= ''

                        }
                }
                this.itemArr=[];
                this.itemGroup=[];
                this.partArr=[];
                this.otherArr=[];

                for(let i in this.showAccountData){
                    this.listSearch[i]=this.showAccountData[i];
                }
                this.listSearch["COLLECT_NO"]="##########";
                this.listSearch["OUT_DATE"]='';
                for(let i in this.showAccountItem){
                    this.itemArr.push(this.showAccountItem[i]);
                }
                for(let i in this.showItemGroup){
                    this.itemGroup.push(this.showItemGroup[i]);
                }

                for(let i in this.showAccountParts){
                    this.partArr.push(this.showAccountParts[i]);
                }
                this.otherArr=this.showAccountOther;
                this.showOnoff=true;
                this.readInData();
                this.jiesuanButton=false;
                this.shoukuanButton=true;
            }
        },
        mounted() {
            this.carTypeFun=getDictGroup(this.$store.state.app.dict, '1052');
            this.repairTypeFun=getDictGroup(this.$store.state.app.dict, '1019');
            this.bandTypeFun=getDictGroup(this.$store.state.app.dict, '1016');
            this.partsType=getDictGroup(this.$store.state.app.dict, '1017');

            
        },
        methods:{
            //读取进来的数据
            readInData(){
                for(let i in this.shoukuanSearch){
                    switch(i){
                        case 'LESS_MONEY':
                            this.shoukuanSearch[i]=this.listSearch['REPAIR_ITEM_DERATE_MONEY']+this.listSearch['REPAIR_PART_DERATE_MONEY'];
                        break;
                        case 'OUT_DATE':
                            this.shoukuanSearch[i]=new Date();
                        break;
                        case 'OUT_MILEAGE':
                            this.shoukuanSearch[i]=this.listSearch['MILEAGE']||0;
                        break;
                        case 'OLD_PART_RESULT':
                            this.shoukuanSearch[i]="3";
                            this.listSearch['OLD_PART_RESULT']=this.shoukuanSearch[i];
                        break;
                        case 'REPAIR_ITEM_MONEY':
                        case 'REPAIR_PART_MONEY':
                        case 'REPAIR_ITEM_DERATE_MONEY':
                        case 'REPAIR_PART_DERATE_MONEY':
                        case 'OTHER_MONEY':
                        case 'SUM_MONEY':
                            this.shoukuanSearch[i]=this.listSearch[i]||0;
                        break;
                        case 'ZY_PART_BZQ':
                            this.shoukuanSearch[i]=this.listSearch[i]||0;
                        break;
                        default : this.shoukuanSearch[i]= this.listSearch[i];
                    };
                }
                this.formatDataFun(true);
            
            },
            //保存数据----
            saveAccountFun(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Modal.confirm({
                            title:"系统提示!",
                            content:"确定要结算吗？",
                            onOk:this.saveAccount,
                            
                        })
                    } else {

                    }
                });
            },
            saveAccount(){
                this.shoukuanSearch.OUT_DATE=formatDate(this.shoukuanSearch.OUT_DATE)+ ' '+ formatDate(this.shoukuanSearch.OUT_DATE, 'hh:mm:ss');
                this.axios.request({
                    url: '/tenant/repair/ttrepairworkorder/saveAccount',
                    method: 'post',
                    data: {
                        data: JSON.stringify(this.shoukuanSearch),
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                        this.jiesuanButton=true;
                        this.shoukuanButton=false;
                        this.getAccountFun();
                        

                    }else{
                        this.$Modal.confirm({
                            title:"系统提示!",
                            content:res.Exception.message,
                            
                            
                        })
                    }
                })
           },
           //get结算数据------
           getAccountFun(){
               this.axios.request({
                    url: '/tenant/repair/ttrepairworkorder/getAccounts',
                    method: 'post',
                    data: {
                        repairId: this.listSearch["REPAIR_ID"],
                        page: 1,
                        start: 0,
                        limit: 25,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        if(res.data.length>0){
                            for(let i in res.data){
                                for(let j in res.data[i]){
                                    this.listSearch[j]=res.data[i][j];
                                }
                            }


                            var newArr=['10201004',this.listSearch];
                            this.$emit('emitAccount',newArr);//重新请求数据
                            this.formatDataFun(true);
                        }
                        
                    }
                })
           },
           //收款按钮----------
           shoukuanFun(){
               this.showShouKuan=Math.random();
           },
           closeGetList(){
               this.$emit('emitAccount',['10201005']);//重新请求数据
               this.showOnoff=false;
           },
           //数据格式转化----------
           formatDataFun(flag){
               var temp=null;
               var LODOP=document.getElementById('ggggg');
                    
               if(flag){
                   var listSearch={};
                   
                    for(let i in this.listSearch){
                            switch(i){
                                case'COME_DATE':
                                case'OUT_DATE':
                                    listSearch[i]=formatDate(this.listSearch[i])+ ' '+ formatDate(this.listSearch[i], 'hh:mm:ss');
                                    console.log(this.listSearch[i]);
                                break;
                                case'VEHICLE_TYPE':
                                    console.log(this.listSearch[i],getName(this.carTypeFun,this.listSearch[i]));
                                    listSearch[i]=getName(this.carTypeFun,this.listSearch[i]);
                                break;
                                case'REPAIR_TYPE':
                                    listSearch[i]=getName(this.repairTypeFun,this.listSearch[i]);
                                break;
                                default : listSearch[i]= this.listSearch[i];
                            };
                    }

                    var partArr=[];
                    for(let i in this.partArr){
                        partArr.push(this.partArr[i]);
                    }

                    for(let j in partArr){
                        partArr[j].BRAND=getName(this.bandTypeFun,partArr[j].BRAND)||'';
                        partArr[j].PART_SOURCE=getName(this.partsType,partArr[j].PART_SOURCE)||'';

                        if(partArr[j].IS_SELF=="true"||partArr[j].IS_SELF==true){
                            partArr[j].IS_SELF="是"
                        }else if(partArr[j].IS_SELF=="false"||partArr[j].IS_SELF==false){
                            partArr[j].IS_SELF="否"
                        };
                    }

                    
                    var wtdData=this.$store.state.user.userInfo.tenant;
                    var store=this.$store;
                    if (this.$store.state.user.userInfo.tenant && this.$store.state.user.userInfo.tenant.businessType == ('10331003'||'10331004')) {
                    console.log('三级维修');
                        temp=printAccountFun(wtdData,listSearch,this.itemArr,this.itemGroup,partArr,this.otherArr,store);
                    } else {
                    console.log('不是三级维修');
                        temp=printAccountFun(wtdData,listSearch,this.itemArr,this.itemGroup,partArr,this.otherArr,store);
                    }
                    LODOP.innerHTML=temp;
               }else{
                   temp='';
                   LODOP.innerHTML=temp;
               }
               
           },
           //界面窗口变化
            visibleChange(status){
                if(status === false){
                    this.formatDataFun(false);
                }
            },
            //项目优惠计算----
            itemComputedFun(value){
                if(value>this.shoukuanSearch.REPAIR_ITEM_MONEY){
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"优惠金额过大",
                        onOk:this.itemComputedReset,
                        onCancel:this.itemComputedReset,
                    })
                    
                }

                this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY=parseFloat(value.toFixed(2));
                this.shoukuanSearch.SUM_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_MONEY)+
                parseFloat(this.shoukuanSearch.OTHER_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);

                this.shoukuanSearch.LESS_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);
            },
            itemComputedReset(){
                this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY=0;
                this.shoukuanSearch.SUM_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_MONEY)+
                parseFloat(this.shoukuanSearch.OTHER_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);

                this.shoukuanSearch.LESS_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);
            },
            //配件优惠计算
            partComputedFun(value){
                if(value>this.shoukuanSearch.REPAIR_PART_MONEY){
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"优惠金额过大",
                        onOk:this.partComputedReset,
                        onCancel:this.partComputedReset,
                    })
                }
                this.shoukuanSearch.REPAIR_PART_DERATE_MONEY=parseFloat(value.toFixed(2));
                this.shoukuanSearch.SUM_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_MONEY)+
                parseFloat(this.shoukuanSearch.OTHER_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);

                this.shoukuanSearch.LESS_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);
            },
            partComputedReset(){
                this.shoukuanSearch.REPAIR_PART_DERATE_MONEY=0;
                this.shoukuanSearch.SUM_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_MONEY)+
                parseFloat(this.shoukuanSearch.OTHER_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)-parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);

                this.shoukuanSearch.LESS_MONEY=(parseFloat(this.shoukuanSearch.REPAIR_ITEM_DERATE_MONEY)+parseFloat(this.shoukuanSearch.REPAIR_PART_DERATE_MONEY)).toFixed(2);
            },
            //outMileageFun里程监听
            outMileageFun(value){
                if(value>99999999){
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"里程数最大位数为八位",
                        
                    })
                    this.shoukuanSearch.OUT_MILEAGE=0;
                }
            },
            //质量保证qi----------
            bzqFun(value){
                if(value>99999999){
                    this.$Modal.confirm({
                        title:"系统提示!",
                        content:"质量保证期最大位数为八位",
                        
                    })

                    this.shoukuanSearch.ZY_PART_BZQ=0;
                }
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
/*#print_style table{border:2px #000 solid;border-collapse: collapse; display: block;} 
#print_style th,#print_style td{border: 1px solid #000;} 
#print_style .noBorder th,#print_style .noBorder td{border:none;} 
#print_style .noRTLBorder th,#print_style .noRTLBorder td{border-right:none;border-top:none;border-left:none;} 
#print_style .noRLBorder th,#print_style .noRLBorder td{border-right:none;border-left:none;}
#print_style th,#print_style td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:12px; } 
#print_style td{text-align: left;} 
#print_style .text-center,#print_style .text-center th,#print_style .text-center td{text-align:center;} 
#print_style .text-right,#print_style .text-right th,#print_style .text-right td{text-align:right;}
#print_style .w100{width:100px;} 
#print_style .w110{width:110px;} 
#print_style .w130{width:130px;} 
#print_style .w200{ width:200px;} 
#print_style .h30{ height:30px;line-height:25px;} 
#print_style .w30{width:30px;} 
#print_style .w70{width:70px;} 
#print_style .w80{width:80px;} 
#print_style .w400{width:700px;}
#print_style .text-left{text-align:left;}*/

/*table{border:2px #000 solid;border-collapse: collapse;} 
th,td{border: 1px solid #000;} 
.noBorder th,.noBorder td{border:none;} 
.noRTLBorder th,.noRTLBorder td{border-right:none;border-top:none;border-left:none;} 
.noRLBorder th,.noRLBorder td{border-right:none;border-left:none;}
th,td {padding: 2px; line-height: 16px; text-align: center; vertical-align: middle;font-size:13px; } 
td{text-align: left;} .text-center,.text-center th,.text-center td{text-align:center;} 
.text-right,.text-right th,.text-right td{text-align:right;}
.w100{width:100px;} 
.w110{width:110px;} 
.w130{width:130px;} 
.w200{ width:200px;} 
.h30{ height:30px;line-height:25px;} 
.w30{width:30px;} 
.w70{width:70px;} 
.w80{width:80px;}
.text-left{text-align:left;} */
</style>


