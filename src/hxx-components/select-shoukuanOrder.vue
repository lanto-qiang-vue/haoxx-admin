<!--维修工单结算收款 2018-09-06-->
<template>
    <!--收款框弹出-->
        <Modal v-model="showShouKuan"
            title="维修工单结算收款"
            width="90"
            @on-visible-change=""
            :scrollable="true"
            :transfer= "false"
            :footer-hide="false"
            :mask-closable="false"
            class="table-modal-detail"
            :transition-names="['', '']">
            <div style="height: 100%;overflow: auto; padding-bottom: 30px;">
                    <Collapse v-model="collapse1">
                <Panel name="1">客户信息
                    <Form slot="content" :label-width="120" inline class="detail-form">
                        <FormItem label="客户姓名:">
                            <span>{{shoukuanSearch.CUSTOMER_NAME}}</span>
                        </FormItem>
                        <FormItem label="储值卡号:">
                            <span>{{shoukuanData.MEMBER_CARD_NO}}</span>
                            
                        </FormItem>
                        <FormItem label="更换储值卡:">
                            <Button type="primary" @click="showCard=Math.random();">更换</Button>
                        </FormItem>
                        <FormItem label="余额:">
                            <span>{{shoukuanSearch.SURPLUS_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="储值卡状态:">
                            <span>{{shoukuanData.MEMBER_CARD_STATUS}}</span>
                        </FormItem>
                    </Form>
                </Panel>
                <Panel name="2">结算信息
                    <Form slot="content" :label-width="120" inline class="detail-form" ref="shoukuanSearch" :rules="ruleValidate1" :model="shoukuanSearch">
                        <FormItem label="维修项目费用:">
                            <span>{{shoukuanSearch.REPAIR_ITEM_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="维修配件费用:">
                            <span>{{shoukuanSearch.REPAIR_PART_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="项目优惠金额:">
                            <span>{{shoukuanSearch.REPAIR_ITEM_DERATE_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="配件优惠金额:">
                            <span>{{shoukuanSearch.REPAIR_PART_DERATE_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="合计优惠金额:">
                            <span>{{shoukuanSearch.LESS_MONEY}}元</span>
                            
                        </FormItem>
                        <FormItem label="合计应收金额:">
                            <span>{{shoukuanSearch.SUM_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="收款人:" prop="FOLLOW_PERSON">
                            <Select v-model="shoukuanSearch.FOLLOW_PERSON" placeholder="" style="min-width: 250px;">
                                <Option v-for="(item, index) in repairPersonArr"
                                :key="index" :value="item.code">{{item.code}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Panel>
                <Panel name="3">支付方式
                    <Form slot="content" :label-width="120" inline class="detail-form" ref="shoukuanSearch" :rules="ruleValidate1" :model="shoukuanSearch">
                        <FormItem label="支付宝:">
                            <Button  type="primary" @click="zfbPay">支付宝</Button>
                        </FormItem>
                        <FormItem label="微信支付:">
                            <Tooltip content="功能正在完善中" placement="top">
                                <Button  type="primary" >微信支付</Button>
                            </Tooltip>
                            
                        </FormItem>
                        <FormItem label="短信账单收款:">
                            <Tooltip content="功能正在完善中" placement="top">
                                <Button  type="primary" >短信账单收款</Button>
                            </Tooltip>
                            
                        </FormItem>
                        <FormItem label="其他方式:" prop="PAYMENT1">
                            <Select v-model="shoukuanSearch.PAYMENT1" placeholder="" style="min-width: 250px;">
                                <Option v-for="(item, index) in payModeData"
                                :key="index" :value="item.code">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Panel>
                <Panel name="4">是否开据发票
                    <Form slot="content" :label-width="120" class="detail-form" >
                        <FormItem label="">
                            <Checkbox v-model="single" @on-change="isGiveInvoiceFun">是否开据发票</Checkbox>
                        </FormItem>
                    </Form>
                    <Form slot="content" :label-width="120" inline class="detail-form" ref="isInvoice" :rules="ruleValidate" :model="isInvoice">
                        <FormItem label="发票编号:" prop="INVOICE_NO">
                            <Input type="text"  v-model="isInvoice.INVOICE_NO" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                        <FormItem label="发票抬头:">
                            <Input type="text"  v-model="isInvoice.CORP_NAME" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                        <FormItem label="税号:">
                            <Input type="text"  v-model="isInvoice.TAX_NO" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                        <FormItem label="备注:">
                            <Input type="text"  v-model="isInvoice.REMARK" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                    </Form>
                </Panel>
            </Collapse>
            <select-valueCard :showoff="showCard" :showTransfer=false @selectCard="selectCard" :showCardData="showCardData"></select-valueCard>
            </div>
            
            <div slot="footer">
                <Button type="primary" @click="savePay('shoukuanSearch')" style="margin-right: 10px;">收款</Button>
                <Button @click="showShouKuan=false;" style="margin-right: 10px;">取消</Button>
            </div>
            
        </Modal>
</template>

<script>
import { getName, getDictGroup } from '@/libs/util.js'
import selectValueCard from '@/hxx-components/select-valueCard.vue'
export default {
    name: "select-shoukuanOrder",
    props:['showSelectAccount','listSearch','repairPersonArr'],
    components: {selectValueCard},
    data(){
         const validatePass = (rule, value, callback) => {
             console.log(this.shoukuanSearch['IS_GIVE_INVOICE']);
             if(this.shoukuanSearch['IS_GIVE_INVOICE']=="10041001"){
                    if (value) {
                        callback();
                    }else{
                            
                        callback(new Error('必选'));
                    }
             }else{
                    
                    if (!value) {
                        callback();
                    }else{
                        callback(new Error('请选择是否开具发票'));
                    }
             }
            
        };
        return{
            single:false,//是否选择开发票
            isInvoice:{
                "INVOICE_NO":'',
                "CORP_NAME":'',
                "TAX_NO":'',
                "REMARK":'',
            },
            showShouKuan:false,//弹出层是否显隐
            collapse1:['1','2','3'],
            showCard:false,//选择储值卡
            showCardData:{
                MEMBER_TYPE:'',
                MEMBER_CARD_STATUS:'',
            },//传入进去的收款数据-----
            shoukuanData:{
                MEMBER_CARD_STATUS:'',
                MEMBER_CARD_NO:'',
            },//提交收款工单数据-----------
            shoukuanSearch:{
                "CUSTOMER_ID":"",
                "CUSTOMER_NAME":'',
                "SURPLUS_MONEY":0,
                "LESS_MONEY":0,
                "SUM_MONEY":0,
                "REPAIR_ITEM_MONEY":0,
                'REPAIR_ITEM_DERATE_MONEY':0,
                "REPAIR_PART_MONEY":0,
                "REPAIR_PART_DERATE_MONEY":0,
                "FOLLOW_PERSON":"管理员",
                "PAYMENT1":"",
                "IS_GIVE_INVOICE":"10041002",
                "REPAIR_ID":"",
            },//提交收款工单数据-----------
            ruleValidate1: {
                PAYMENT1: [
                    { required: true, message: '必填',}
                ],
                FOLLOW_PERSON: [
                    { required: true, message: '必填',}
                ],
            },
            ruleValidate: {
                INVOICE_NO: [
                    { required: true, message: '必填',},
                    { validator: validatePass, trigger: 'change'},
                ],
                
            },
            
            payModeData:[],
            timer:null,
        }
    },
    watch:{
        showSelectAccount(){
            this.showShouKuan=true;
            this.handleReset("shoukuanSearch");
            this.handleReset("isInvoice");
            //取付款方式的值集合-------
            this.payModeData=getDictGroup(this.$store.state.app.dict, '1010');
            var arr=[];
            for(let i in this.payModeData){
                if(this.payModeData[i].order==7||this.payModeData[i].order==8){
                    
                }else{
                    arr.push(this.payModeData[i]);
                }
            }
            this.payModeData=arr;

            //进来重置参数-----------
            for(let i in this.shoukuanSearch){
                switch(i){
                    case "SURPLUS_MONEY":
                    case "REPAIR_ITEM_MONEY":
                    case "REPAIR_ITEM_DERATE_MONEY":
                    case "REPAIR_PART_MONEY":
                    case "REPAIR_PART_DERATE_MONEY":
                    case "SUM_MONEY":
                    case "LESS_MONEY":
                        this.shoukuanSearch[i]=0;
                    break;
                    case "FOLLOW_PERSON":
                        this.shoukuanSearch[i]="管理员";
                    break;
                    case "IS_GIVE_INVOICE":
                        this.shoukuanSearch[i]="10041002";
                    break;
                    default : this.shoukuanSearch[i]= ''
                }
            }

            for(let i in this.listSearch){
                this.shoukuanSearch[i]=this.listSearch[i];
            }
            this.shoukuanSearch["LESS_MONEY"]=(this.listSearch['REPAIR_ITEM_DERATE_MONEY']+this.listSearch['REPAIR_PART_DERATE_MONEY'])||0;

            this.shoukuanFun();
        }
    },
    mounted() {
       
        
    },
    computed:{
        cardStateArr(){
            return getDictGroup(this.$store.state.app.dict, '1049');
        }
    },
    methods:{
        shoukuanFun(){
            this.axios.request({
                    url: '/tenant/repair/ttrepairworkorder/getCustomerInfo',
                    method: 'post',
                    data: {
                    vehicleId: this.listSearch.VEHICLE_ID,
                    access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        
                        for(let i in res.data){
                            if(this.shoukuanSearch.hasOwnProperty(i)){
                                this.shoukuanSearch[i]=res.data[i];
                            }
                        }
                        this.shoukuanData['MEMBER_CARD_STATUS']=getName(this.cardStateArr,res.data['MEMBER_CARD_STATUS']);
                        this.shoukuanData['MEMBER_CARD_NO']=res.data['MEMBER_CARD_NO']||'无';

                        this.showCardData.MEMBER_TYPE=res.data['MEMBER_TYPE'];
                        this.showCardData.MEMBER_CARD_STATUS=res.data['MEMBER_CARD_STATUS'];
                        
                    }
                })
        },
        //保存数据
        savePay(name){
            if(this.shoukuanSearch['IS_GIVE_INVOICE']=="10041001"){
                
                this.$refs[name].validate((valid) => {
                    if (valid) {
                            this.$refs["isInvoice"].validate((valid) => {
                                if (valid) {
                                        var commitData={
                                            "CUSTOMER_ID":"",
                                            "CUSTOMER_NAME":'',
                                            "SURPLUS_MONEY":0,
                                            "LESS_MONEY":0,
                                            "SUM_MONEY":0,
                                            "REPAIR_ITEM_MONEY":0,
                                            'REPAIR_ITEM_DERATE_MONEY':0,
                                            "REPAIR_PART_MONEY":0,
                                            "REPAIR_PART_DERATE_MONEY":0,
                                            "FOLLOW_PERSON":"管理员",
                                            "PAYMENT1":"",
                                            "IS_GIVE_INVOICE":"10041002",
                                            "REPAIR_ID":"",
                                        }

                                        for(let key in commitData){
                                            commitData[key]=this.shoukuanSearch[key];
                                        }
                                        for(let i in this.isInvoice){
                                            commitData[i]=this.isInvoice[i];
                                        }
                                        
                                        this.axios.request({
                                            url: '/tenant/repair/ttrepairworkorder/savePay',
                                            method: 'post',
                                            data: {
                                                data: JSON.stringify(commitData),
                                                CUSTOMER_ID: commitData['CUSTOMER_ID'],
                                                access_token: this.$store.state.user.token
                                            }
                                        }).then(res => {
                                            if (res.success === true) {
                                                this.$Message.info('收款成功');
                                                this.showShouKuan=false;//收款界面弹出

                                                this.getAccountData(this.shoukuanSearch["REPAIR_ID"]);
                                                this.$emit('closeGetList');
                                            }else{
                                                if(res.Exception){
                                                    this.$Modal.confirm({
                                                        title:"系统提示!",
                                                        content:res.Exception.message,
                                                        
                                                    })
                                                }   
                                                
                                            }
                                        })
                                }
                            });
                            
                    }
                });
            }else{
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var commitData={
                            "CUSTOMER_ID":"",
                            "CUSTOMER_NAME":'',
                            "SURPLUS_MONEY":0,
                            "LESS_MONEY":0,
                            "SUM_MONEY":0,
                            "REPAIR_ITEM_MONEY":0,
                            'REPAIR_ITEM_DERATE_MONEY':0,
                            "REPAIR_PART_MONEY":0,
                            "REPAIR_PART_DERATE_MONEY":0,
                            "FOLLOW_PERSON":"管理员",
                            "PAYMENT1":"",
                            "IS_GIVE_INVOICE":"10041002",
                            "REPAIR_ID":"",
                        }

                        for(let key in commitData){
                            commitData[key]=this.shoukuanSearch[key];
                        }
                        
                        
                        this.axios.request({
                            url: '/tenant/repair/ttrepairworkorder/savePay',
                            method: 'post',
                            data: {
                                data: JSON.stringify(commitData),
                                CUSTOMER_ID: commitData['CUSTOMER_ID'],
                                access_token: this.$store.state.user.token
                            }
                        }).then(res => {
                            if (res.success === true) {
                                this.$Message.info('收款成功');
                                this.showShouKuan=false;//收款界面弹出
                                
                                this.getAccountData(this.shoukuanSearch["REPAIR_ID"]);
                                this.$emit('closeGetList');
                            }else{
                                if(res.Exception){
                                    this.$Modal.confirm({
                                        title:"系统提示!",
                                        content:res.Exception.message,
                                        
                                    })
                                }   
                            }
                        }) 
                    }
                });
                
            }
            
        },
        getAccountData(val){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getAccounts',
                method: 'post',
                data: {
                    repairId: val,
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
                                this.shoukuanSearch[j]=res.data[i][j];
                            }
                        }
                    }
                }
            })
        },
        //选择储值卡------
        selectCard(val){
            console.log('选择储值卡',val);
            this.shoukuanData.MEMBER_CARD_NO=val.MEMBER_CARD_NO;
            this.shoukuanData['MEMBER_CARD_STATUS']=getName(this.cardStateArr,val.MEMBER_CARD_STATUS);

            this.shoukuanSearch.CUSTOMER_NAME=val.NAME;
            this.shoukuanSearch.MEMBER_CARD_NO=val.MEMBER_CARD_NO;
            this.shoukuanSearch.SURPLUS_MONEY=val.SURPLUS_MONEY||0;
            this.shoukuanSearch.CUSTOMER_ID=val.CUSTOMER_ID;
            this.shoukuanSearch.PAYMENT1="10101004";
        },
        //是否开发票-------
        isGiveInvoiceFun(val){
            console.log(val);
            if(val){
                this.shoukuanSearch['IS_GIVE_INVOICE']="10041001";
            }else{
                this.shoukuanSearch['IS_GIVE_INVOICE']="10041002";
                this.handleReset("isInvoice");
            }
        },
        //重置规则验证数据--------
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        //支付宝支付--------
        zfbPay(){
            if(this.shoukuanSearch.SUM_MONEY>0&&this.shoukuanSearch.SUM_MONEY<=99999999){
                this.axios.request({
                    url: '/tenant/repair/ttrepairworkorder/pay',
                    method: 'post',
                    data: {
                        out_trade_no: this.listSearch.REPAIR_NO,
                        TENANT_ID: this.listSearch.TENANT_ID,
                        total_amount: this.listSearch.SUM_MONEY,
                        body: 100001,
                        access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        console.log(res.data);
                        var returnData = res.data;
                        var strHtml = returnData.zfHtml;//获取接口返回的代码
                        var code = res.success;
                        var s = ' target="_blank" ';//定义一个属性，让其在打开支付界面时，重新打开一个浏览器窗口
                        var first = strHtml.substring(0,6);
                        var last = strHtml.substring(6,strHtml.length);
                        var newStr = first + s + last; 
                        if(strHtml.indexOf('商家未签约') >= 0){
                            this.$Modal.confirm({
                                title:"系统提示!",
                                content:"系统提示','商家未签约，暂不支持支付宝付款！",
                            })
                        }else{
                            console.log(newStr)
                            
                            //将接口返回的html代码直接添加到页面上
                            var bodyobj=document.body;
                            var oDiv = document.createElement("div");
                            oDiv.id="xxx"
                            oDiv.innerHTML=newStr;
                            var first=document.body.firstChild;

                            document.body.insertBefore(oDiv,first);
                            document.forms[0].submit();
                            setTimeout(function(){
                                var obj=document.getElementById('xxx');
                                document.body.removeChild(obj);
                            },500);
                            
                            this.insertData();
                        }
                    }
                }) 
            }else{
                this.$Modal.confirm({
                    title:"系统提示!",
                    content:'使用支付宝支付金额不能小于或等于0元且长度不超过八位,请重新确认支付金额是否正确！',
                    
                })
            }

        },
        //请求参数----
        insertData(){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/insert_data',
                method: 'post',
                data: {
                    EPAIR_NO: this.listSearch.REPAIR_NO,
                    CUSTOMER_ID: 5648,
                    REPAIR_ITEM_MONEY: this.listSearch.REPAIR_ITEM_MONEY,
                    REPAIR_PART_MONEY: this.listSearch.REPAIR_PART_MONEY,
                    LESS_MONEY: this.listSearch.LESS_MONEY,
                    SUM_MONEY: this.listSearch.SUM_MONEY,
                    FOLLOW_PERSON: this.listSearch.FOLLOW_PERSON,
                    PAYMENT1: this.listSearch.PAYMENT1,
                    IS_GIVE_INVOICE: this.listSearch.IS_GIVE_INVOICE,
                    INVOICE_NO: '',
                    CORP_NAME: '',
                    TAX_NO: '',
                    REMARK: '',
                    REPAIR_ID: this.listSearch.REPAIR_ID,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    if(res.data){
                        var self=this;
                        this.timer=setInterval(function(){
                            self.getStatus();
                        },2000);
                    }
                }
            }) 
        },
        //请求状态--------
        getStatus(){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/get_status',
                method: 'post',
                data: {
                    REPAIR_NO: "GD1201809190016",
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    if(res.data){

                        var repairStatus = res.data[0].STATUS;
                        
                        if(repairStatus == '10201005' || repairStatus == 10201005){
                            window.clearInterval(this.timer);
                            this.showShouKuan=false;
                            this.$emit('closeGetList');
                        }
                    }
                }
            }) 
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


