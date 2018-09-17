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
            :transition-names="['', '']">
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
                    <Form slot="content" :label-width="120" inline class="detail-form">
                        <FormItem label="项目合计费用:">
                            <span>{{shoukuanSearch.REPAIR_ITEM_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="优惠金额:">
                            <span>{{shoukuanSearch.REPAIR_ITEM_DERATE_MONEY}}元</span>
                            
                        </FormItem>
                        <FormItem label="合计应收金额:">
                            <span>{{shoukuanSearch.SUM_MONEY}}元</span>
                        </FormItem>
                        <FormItem label="收款人:">
                            <Select v-model="shoukuanSearch.FOLLOW_PERSON" placeholder="" style="min-width: 250px;">
                                <Option v-for="(item, index) in repairPersonArr"
                                :key="index" :value="item.code">{{item.code}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Panel>
                <Panel name="3">支付方式
                    <Form slot="content" :label-width="120" inline class="detail-form" ref="shoukuanSearch" :rules="ruleValidate1">
                        <FormItem label="支付宝:">
                            <Button  type="primary" >支付宝</Button>
                        </FormItem>
                        <FormItem label="微信支付:">
                            
                            <Button  type="primary" >微信支付</Button>
                        </FormItem>
                        <FormItem label="短信账单收款:">
                            <Button  type="primary" >短信账单收款</Button>
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
                    <Form slot="content" :label-width="120" class="detail-form">
                        <FormItem label="">
                            <Checkbox v-model="single" @on-change="isGiveInvoiceFun">是否开据发票</Checkbox>
                        </FormItem>
                    </Form>
                    <Form slot="content" :label-width="120" inline class="detail-form" ref="shoukuanSearch" :rules="ruleValidate1"  :model="shoukuanSearch">
                        <FormItem label="发票编号:" prop="INVOICE_NO">
                            <Input type="text"  v-model="shoukuanSearch.INVOICE_NO" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                        <FormItem label="发票抬头:">
                            <Input type="text"  v-model="shoukuanSearch.CORP_NAME" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                        <FormItem label="税号:">
                            <Input type="text"  v-model="shoukuanSearch.TAX_NO" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                        <FormItem label="备注:">
                            <Input type="text"  v-model="shoukuanSearch.REMARK" placeholder="" style="min-width: 250px;"> </Input>
                        </FormItem>
                    </Form>
                </Panel>
            </Collapse>
            <div slot="footer">
                <Button type="primary" @click="savePay('shoukuanSearch')" style="margin-right: 10px;">收款</Button>
                <Button @click="showShouKuan=false;" style="margin-right: 10px;">取消</Button>
            </div>
            <select-valueCard :showoff="showCard" :showTransfer=true @selectCard="selectCard" :showCardData="showCardData"></select-valueCard>
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
            showShouKuan:false,//弹出层是否显隐
            collapse1:['1','2','3','4'],
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
                CUSTOMER_NAME:'',
                SURPLUS_MONEY:'',
                "REPAIR_ITEM_MONEY":0,
                "SUM_MONEY":0,
                'REPAIR_ITEM_DERATE_MONEY':0,
                "FOLLOW_PERSON":"管理员",
                "PAYMENT1":"10101001",
                "IS_GIVE_INVOICE":"10041002",
                "CORP_NAME":"",
                "INVOICE_NO":"",
                "TAX_NO":"",
                "REMARK":"",
                "REPAIR_ID":""
            },//提交收款工单数据-----------
            ruleValidate1: {
                INVOICE_NO: [
                    { validator: validatePass, trigger: 'change'},
                ],
                PAYMENT1: [
                    { required: true, type: 'string', message: '必填',}
                    
                ],
            },
            
            cardStateArr:[],
            payModeData:[],
        }
    },
    watch:{
        showSelectAccount(){
            this.showShouKuan=true;
            this.shoukuanFun();
        }
    },
    mounted() {
       
        this.cardStateArr=getDictGroup(this.$store.state.app.dict, '1049');
        this.payModeData=getDictGroup(this.$store.state.app.dict, '1010');
    },
    methods:{
        shoukuanFun(){
            this.shoukuanReset();
            this.shoukuanSearch['REPAIR_ITEM_MONEY']=this.listSearch['REPAIR_ITEM_MONEY']||0;
            this.shoukuanSearch['REPAIR_ITEM_DERATE_MONEY']=this.listSearch['REPAIR_ITEM_DERATE_MONEY']||0;
            this.shoukuanSearch['SUM_MONEY']=this.listSearch['SUM_MONEY']||0;
            this.shoukuanSearch['REPAIR_ID']=this.listSearch['REPAIR_ID'];
            this.axios.request({
                    url: '/tenant/repair/ttrepairworkorder/getCustomerInfo',
                    method: 'post',
                    data: {
                    vehicleId: this.listSearch.VEHICLE_ID,
                    access_token: this.$store.state.user.token
                    }
                }).then(res => {
                    if (res.success === true) {
                        this.$Message.info('successful');
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
        shoukuanReset(){
            this.shoukuanSearch={
                "CUSTOMER_ID":"",
                CUSTOMER_NAME:'',
                SURPLUS_MONEY:'',
                "REPAIR_ITEM_MONEY":0,
                "SUM_MONEY":0,
                'REPAIR_ITEM_DERATE_MONEY':0,
                "FOLLOW_PERSON":"管理员",
                "PAYMENT1":"10101001",
                "IS_GIVE_INVOICE":"10041002",
                "CORP_NAME":"",
                "INVOICE_NO":"",
                "TAX_NO":"",
                "REMARK":"",
                "REPAIR_ID":""
            }
            this.handleReset('shoukuanSearch');
        },
        //保存数据
        savePay(name){
            if(this.shoukuanSearch['IS_GIVE_INVOICE']=="10041001"){
                
                this.$refs[name].validate((valid) => {
                    if (valid) {
                            var savePayData={
                                "CUSTOMER_ID":"",
                                "REPAIR_ITEM_MONEY":0,
                                "SUM_MONEY":0,
                                "FOLLOW_PERSON":"",
                                "PAYMENT1":"",
                                "IS_GIVE_INVOICE":"",
                                "INVOICE_NO":"",
                                "CORP_NAME":"",
                                "TAX_NO":"",
                                "REMARK":"",
                                "REPAIR_ID":""
                            }
                            for(let key in savePayData){
                                savePayData[key]=this.shoukuanSearch[key];
                            }
                            this.axios.request({
                                url: '/tenant/repair/ttrepairworkorder/savePay',
                                method: 'post',
                                data: {
                                    data: JSON.stringify(savePayData),
                                    access_token: this.$store.state.user.token
                                }
                            }).then(res => {
                                if (res.success === true) {
                                    this.$Message.info('successful');
                                    this.titleMsg="已结清";
                                    this.showShouKuan=false;//收款界面弹出
                                    for(let i in this.buttonStateArr){
                                        switch(i){
                                        case 'printAccount': this.buttonStateArr[i]= false; break
                                        default : this.buttonStateArr[i]= true;
                                        }
                                    }

                                    this.getAccountData(this.shoukuanSearch["REPAIR_ID"]);
                                    this.$emit('closeGetList');
                                }
                            })
                    }
                });
            }else{
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var savePayData={
                            "CUSTOMER_ID":"",
                            "REPAIR_ITEM_MONEY":0,
                            "SUM_MONEY":0,
                            "FOLLOW_PERSON":"",
                            "PAYMENT1":"",
                            "IS_GIVE_INVOICE":"",
                            "INVOICE_NO":"",
                            "CORP_NAME":"",
                            "TAX_NO":"",
                            "REMARK":"",
                            "REPAIR_ID":""
                        }
                        for(let key in savePayData){
                            savePayData[key]=this.shoukuanSearch[key];
                        }
                        this.axios.request({
                            url: '/tenant/repair/ttrepairworkorder/savePay',
                            method: 'post',
                            data: {
                                data: JSON.stringify(savePayData),
                                access_token: this.$store.state.user.token
                            }
                        }).then(res => {
                            if (res.success === true) {
                                this.$Message.info('successful');
                                this.titleMsg="已结清";
                                this.showShouKuan=false;//收款界面弹出
                                for(let i in this.buttonStateArr){
                                    switch(i){
                                    case 'printAccount': this.buttonStateArr[i]= false; break
                                    default : this.buttonStateArr[i]= true;
                                    }
                                }

                                this.getAccountData(this.shoukuanSearch["REPAIR_ID"]);
                                this.$emit('closeGetList');
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
                    this.$Message.info('successful');
                    this.computedMoneyData=res.data;
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
            this.shoukuanSearch.SURPLUS_MONEY=val.SURPLUS_MONEY;
            this.shoukuanSearch.CUSTOMER_ID=val.CUSTOMER_ID;
        },
        //是否开发票-------
        isGiveInvoiceFun(val){
            console.log(val);
            if(val){
                this.shoukuanSearch['IS_GIVE_INVOICE']="10041001";
            }else{
                this.shoukuanSearch['IS_GIVE_INVOICE']="10041002";
            }
        },
        handleReset (name) {
            this.$refs[name].resetFields();
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


