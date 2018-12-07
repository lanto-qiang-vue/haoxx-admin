<!--保单详情编辑 详情 2018 09 05  -->
<template>
  <Modal
    v-model="showModal"
    title="保单详情编辑"
    width="450"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :mask-closable="false"
    :transition-names="['', '']"
  >
    <div >
            <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="120" class="common-form">
                <FormItem label="保单号:" prop="GUAR_NO">
                    <Input type="text"  v-model="listSearch.GUAR_NO" placeholder=""></Input>
                </FormItem>
                <FormItem label="保单类型:">
                    <Select v-model="listSearch.TYPE" placeholder="请选择...">
                        <Option v-for="(item, index) in searchSelectOption"
                            :key="index" :value="item.code">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="保险公司:" prop="INSURER_ID">
                    <Select v-model="listSearch.INSURER_ID" placeholder="请选择...">
                        <Option v-for="(item, index) in companyOption"
                            :key="index" :value="item.code">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="购买日期:" prop="BUY_DATE">
                    <DatePicker type="date" placeholder="" v-model="listSearch.BUY_DATE"></DatePicker>
                </FormItem>
                <FormItem label="生效日期:" prop="START_DATE">
                    <DatePicker type="date" placeholder="" v-model="listSearch.START_DATE"></DatePicker>
                </FormItem>
                <FormItem label="结束日期:" prop="END_DATE">
                    <DatePicker type="date" placeholder="" v-model="listSearch.END_DATE"></DatePicker>
                </FormItem>
                <FormItem label="金额:" prop="MONEY">
                    <Input type="text"  v-model="listSearch.MONEY" placeholder=""> </Input>
                </FormItem>
                <FormItem label="备注:">
                    <Input type="textarea"  v-model="listSearch.REMARK" placeholder=""> </Input>
                </FormItem>
            </Form>
    </div>

    <div slot="footer">
        <Button  @click="saveFun('listSearch')" size="large" type="primary"  style="margin-right: 10px;">保存</Button>
        <Button  size="large" type="default" style="margin-right: 10px;" @click="showModal=false;">取消</Button>
    </div>
  </Modal>
</template>
<script>
    import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
    import { formatDate } from '@/libs/tools.js'
    export default {
		name: "policy-detail-edit",
        components: {},
        data(){
        return{
            listSearch:{
                    "GUAR_NO":"",
                    "TYPE":"10211001",
                    "INSURER_ID":"",
                    "BUY_DATE":"",
                    "START_DATE":"",
                    "END_DATE":"",
                    "MONEY":0,
                    "REMARK":"",
                    "CORP_NAME":"",
            },
            ruleValidate: {
                GUAR_NO:[
                    { required: true, message: '必填', },
                    
                ],
                INSURER_ID: [
                    { required: true,  message: '必填',}
                ],
                BUY_DATE: [
                    { required: true,  message: '必填',}
                ],
                START_DATE: [
                    { required: true,  message: '必填',}
                ],
                END_DATE: [
                    { required: true,  message: '必填',}
                ],
                MONEY: [
                    { required: true,  message: '必填',}
                ]
            },//规则验证
            showModal:false,
            searchSelectOption:[],//保单类型
            companyOption:[],//公司类型

        }
        
    },
    props:['showDetail', 'tableDetailData'],
    watch:{
      showDetail(){
        console.log('进来的参数：',this.tableDetailData,);
        this.showModal=true
        this.handleReset('listSearch');
        if(this.tableDetailData){
            var newdata={
                    "GUAR_NO":"",
                    "TYPE":"10211001",
                    "INSURER_ID":"",
                    "BUY_DATE":"",
                    "START_DATE":"",
                    "END_DATE":"",
                    "MONEY":0,
                    "REMARK":"",
                    "CORP_NAME":"",
            };
            for(let key in newdata){
                newdata[key]=this.tableDetailData[key];
            }
            this.listSearch=newdata;
            this.getInsurer(this.listSearch.INSURER_ID);
        }else{
            this.listSearch={
                    "GUAR_NO":"",
                    "TYPE":"10211001",
                    "INSURER_ID":"",
                    "BUY_DATE":"",
                    "START_DATE":"",
                    "END_DATE":"",
                    "MONEY":0,
                    "REMARK":"",
                    "CORP_NAME":"",
            };
            this.listSearch.BUY_DATE=new Date();
            this.listSearch.START_DATE=new Date();
            var now = new Date();
            now.setFullYear(now.getFullYear()+1);
            this.listSearch.END_DATE=now;
            this.getInsurer();
            console.log(this.listSearch);

        }
        
      }
    },
    mounted () {
      this.searchSelectOption= getDictGroup(this.$store.state.app.dict, '1021');//保单类型
      
    },
    methods:{
        //获取保险公司
       getInsurer(val){
           this.companyOption=[];
           this.axios.request({
            url: '/tenant/repair/tt_guarantee_slip/get_insurer_list',
            method: 'post',
            data: {
                page: 1,
                start: 0,
                limit: 25,
                access_token: this.$store.state.user.token
            }
            }).then(res => {
                if (res.success === true) {
                    for(let i in res.data){
                        var obj={code:'',name:''};
                        obj.name=res.data[i].CORP_NAME;
                        obj.code=res.data[i].INSURER_ID;
                        this.companyOption.push(obj);
                    }
                    //初始化主修人数据
                    if(!val){
                      this.listSearch.INSURER_ID=this.companyOption[0].INSURER_ID;
                    }else{
                        this.listSearch.INSURER_ID=val;
                    }
                }
            })
       },
       //窗口动态监测
       visibleChange(status){
            if(status === false){
                this.$emit('closeStatus');
            }
       },
       //保存数据-----
       saveFun(name){
           this.listSearch.CORP_NAME=getName(this.companyOption,this.listSearch.INSURER_ID);
           console.log(this.listSearch);
           this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$emit('policyFun',this.listSearch);
                    this.showModal=false;
                    
                }
            });
       },
       //重置数据-----
       handleReset (name) {
            this.$refs[name].resetFields();
       },


    }
}
</script>

<style scoped lang="less">

</style>
