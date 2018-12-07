<!--快速开单详情页 2018-09-06-->
<template>
  <Modal
    v-model="showModal"
    title="快速开单"
    width="100"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :mask-closable="false"
    :transition-names="['', '']"
    class="table-modal-detail full-height"
    :closable="false"
  >
    <modal-title slot="header" title="快速开单" :state="titleMsg" @clickBack="showModal=false"></modal-title>
    <div style="height: 100%;overflow: auto;padding-top: 10px;">
    <!--<div class="status">({{titleMsg}})</div>-->
    <!--<Collapse v-model="collapse">
      <Panel name="1">查询-->
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch"  :label-width="110" class="common-form">
          <FormItem label="车牌号码:" prop="PLATE_NUM">
              <Input @on-focus="showoff=Math.random();"	type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" >
                  <Icon type="ios-search" slot="suffix" @click="showoff=Math.random();"/>
              </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型"> </Input>
          </FormItem>
          <FormItem label="车架号:">
              <Input type="text" disabled v-model="listSearch.VIN_NO" placeholder="" > </Input>
          </FormItem>
          <FormItem label="车主名称:">
              <Input type="text" disabled v-model="listSearch.CUSTOMER_NAME" placeholder="" > </Input>
          </FormItem>
          <FormItem label="送修人:">
              <Input type="text" v-model="listSearch.GIVE_REPAIR_PERSON" placeholder="" > </Input>
          </FormItem>
          <FormItem label="联系电话:" prop="TELPHONE">
              <Input type="text" v-model="listSearch.TELPHONE" placeholder="" > </Input>
          </FormItem>
          <FormItem label="维修类型:" >
              <Select v-model="listSearch.REPAIR_TYPE" placeholder="" >
                <Option v-for="(item, index) in repairTypeArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="送修里程:" prop="MILEAGE">
              <InputNumber :min="0" v-model="listSearch.MILEAGE"  placeholder="最大不超过八位数"
                    :formatter="value => `${value}公里`" :parser="value => value.replace('公里', '')"
              ></InputNumber>
          </FormItem>
          <FormItem label="主修人:" >
              <Select v-model="listSearch.REPAIR_PERSON" placeholder="" >
                <Option v-for="(item, index) in repairPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="车辆类型:" >
              <Select v-model="listSearch.VEHICLE_TYPE" placeholder=""  @on-change="selectCarInitFun">
                <Option v-for="(item, index) in vehicleTypeArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="车辆分类代号:" >
              <Select v-model="listSearch.VEHICLE_TYPE_CODE" placeholder="" >
                <Option v-for="(item, index) in vehicleNumberArr"
                  :key="item.code" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="服务顾问:" >
              <Select v-model="listSearch.FOLLOW_PERSON" placeholder="" >
                <Option v-for="(item, index) in serverPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="进厂日期:">
              <DatePicker v-model="listSearch.COME_DATE" type="datetime" placeholder="" format="yyyy-MM-dd HH:mm" :options="startTimeOptions"
                @on-open-change="openStartTime"
              ></DatePicker>
          </FormItem>
          <FormItem label="计划完工日期:">
              <DatePicker v-model="listSearch.PLAN_END_DATE" type="datetime" format="yyyy-MM-dd HH:mm"
                           placeholder="" :options="endTimeOptions"
                           @on-open-change="openEndTime"></DatePicker>
          </FormItem>
          <FormItem label="故障描述:" style="width: 100%">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:" style="width: 100%">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
          <FormItem label="维修建议:" style="width: 100%">
              <Input type="textarea" v-model="listSearch.REPAIR_INFO" placeholder="请输入建议内容"> </Input>
          </FormItem>
          </Form>
       <!--</Form>
       <Form ref="formInline"  slot="content" :label-width="120">
          <FormItem label="故障描述:">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
          <FormItem label="维修建议:">
              <Input type="textarea" v-model="listSearch.REPAIR_INFO" placeholder="请输入建议内容"> </Input>
          </FormItem>
       </Form>-->
      <!--</Panel>
    </Collapse>-->
    <!--//维修项目-->
    <div>
        <h2 style="border-bottom: 1px solid #ccc; margin: 10px 0;padding: 5px 0;">服务项目</h2>
        <Table
            class="main-table"
            ref="tablesMain"
            :columns="columns"
            :data="commitItem"
            :disabled-hover="true"
            stripe
            border
        ></Table>
    </div>

    <!--//结算信息-->
    <div v-if="!isOrderSuccess">
        <h2 style="border-bottom: 1px solid #ccc; margin: 10px 0;padding: 5px 0;">结算信息</h2>
        <Table
        class="main-table"
        ref="tablesMain"
        :columns="columns3"
        :data="computedMoneyData"
        stripe
        border
        ></Table>
    </div>

    <div class="r-list-money" v-if="isOrderSuccess">
      <p>
        项目合计费用：
        <span>{{listSearch.REPAIR_ITEM_MONEY}}元</span>
          - 优惠金额：
          <InputNumber :disabled="!isOrderSuccess" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" @on-change="accountChange" @on-blur="accountBlur" :min="0">
          </InputNumber> = 合计应收金额：
          <span class="r-list-money-reset">{{listSearch.SUM_MONEY}}元</span>
      </p>
    </div>
      
      
    <!--选择车型-->
    <select-vehicle v-if="showFlag" :showoff="showoff" @selectCar="selectCar"></select-vehicle>

    <select-shoukuanOrder v-if="showFlag" :showSelectAccount="showShouKuan" :listSearch="listSearch" :repairPersonArr="repairPersonArr" @closeGetList="closeGetList"></select-shoukuanOrder>
    <!--结算框弹出-->
    <Modal
        v-model="showAccount"
        title="维修工单结算"
        width="50"
        @on-visible-change=""
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :mask-closable="false"
        class="table-modal-detail"
        :styles="{height:'400px'}"
        :transition-names="['', '']">
        <Collapse v-model="collapse2">
            <Panel name="1">结算信息
                <Form slot="content" :label-width="120" class="detail-form">
                    <FormItem label="项目合计费用:" style="width: 100%;">
                        <span>{{listSearch.REPAIR_ITEM_MONEY}}元</span>
                    </FormItem>
                    <FormItem label="项目优惠金额:" style="width: 100%;">
                        <InputNumber  :min="0" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" @on-change="accountChange" @on-blur="accountBlur" style="width: 100px;"></InputNumber>
                    </FormItem>
                    <FormItem label="合计应收金额:" style="width: 100%;">
                        <span>{{listSearch.SUM_MONEY}}元</span>
                    </FormItem>
                </Form>
                </Panel>
        </Collapse>
        <div slot="footer">
            <Button type="primary" @click="commitdata">结算</Button>
            <Button  @click="showAccount=false;">取消</Button>
        </div>
    </Modal>
    </div>
    

    <!--底部按钮组-->
      <div slot="footer">
          <Button v-if="accessBtn('save')" :disabled="buttonStateArr.save" @click="handleSubmit('listSearch')" size="large" type="primary">保存</Button>
          <Button v-if="accessBtn('doaccount')" :disabled="buttonStateArr.doaccount" @click="handleCommit" type="primary">结算</Button>
          <Button v-if="accessBtn('printAccount')" :disabled="buttonStateArr.printAccount" type="primary" @click="printAccountButton">打印结算单</Button>
          <Button v-if="accessBtn('dopay')" :disabled="buttonStateArr.shoukuan" @click="shoukuanFun" type="primary">收款</Button>
          <Button  @click="showModal=false;">返回</Button>
      </div>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import selectVehicle from '@/hxx-components/select-vehicle.vue'
  import mixin from '@/hxx-components/mixin'
  import selectShoukuanOrder from '@/hxx-components/select-shoukuanOrder.vue'
  import {printAccountFun} from '@/hxx-components/repairPrintUtil.js'
  import {getLodop} from '@/hxx-components/LodopFuncs.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'

export default {
	name: "repairOrder-list-quickDetail",
    components: {selectVehicle,selectShoukuanOrder,ModalTitle},
    mixins: [mixin],
    data(){
        // 联系电话验证
      const validatePass = (rule, value, callback) => {
        var p1 = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
        var p2 = /0\d{2,3}-\d{7,8}/;
        if (p2.test(value) || p1.test(value) || !value) {
          callback();
        } else {

          callback(new Error('请输入正确的号码'));
        }
      };
        //校验里程数--------
      const validatePass1 = (rule, value, callback) => {
        var value1 = value + '';
        if (value1.length <= 8) {
          callback();
        } else {
          callback(new Error('最大不超过八位'));
        }
      };
      return{
          showFlag:false,
        showoff:null,//选择车辆
        showModal: false,//本界面是否显示判断
        showAccount:false,//结算界面弹出
        showShouKuan:false,//收款界面弹出-----
        cardStateArr:[],//储存卡状态值
        payModeData:[],//支付方式数组
        getItem:[],//获取项目数组
        collapse: '1',
        
        collapse2:'1',
        listSearch:{
           "TENANT_ID":"1",
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
            "REPAIR_TYPE":"",
            "MILEAGE":0,
            "REPAIR_PERSON":"",
            "VEHICLE_TYPE":"",
            "VEHICLE_TYPE_CODE":"",
            "FOLLOW_PERSON":"",
            "COME_DATE":"",
            "PLAN_END_DATE":"",
            "FAULT_DESC":"",
            "CUSTOMER_INFO":"",
            "REPAIR_INFO":"",
            "IS_ITEM_GROUP":"",
            "REPAIR_ITEM_DERATE_MONEY":0,
            "REPAIR_PART_DERATE_MONEY":0,
            "STATUS":"",
            "REPAIR_ITEM_MONEY":0,
            "REPAIR_PART_MONEY":0,
            "SUM_MONEY":0,
            "GD_TYPE":"10181002"
        },
        listSearchInit:{
            "TENANT_ID":"1",
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
            "REPAIR_PERSON":"管理员",
            "VEHICLE_TYPE":"10521001",
            "VEHICLE_TYPE_CODE":"轿车-排量<1.6升-A",
            "FOLLOW_PERSON":"管理员",
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
            "SUM_MONEY":0,
            "GD_TYPE":"10181002"
        },
        selectData:[],
        //维修项目
        columns: [
          {
            title: '序号', width: 70, type: "index",align:"center"
          },
          {
            title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 170,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {
            title: '备注', key: 'REMARK', sortable: true, minWidth: 150,
          },
          {
            title: '操作', key: '', sortable: true, width: 120, fixed: 'right',
            render: (h, params) => {
              
                let buttonContent= this.state(params.row)? '取消选择':'选择';
                let buttonStatus= this.state(params.row)? 'default':'warning';
                return h('div', [
                    h('Button', {
                        props: {
                            type: buttonStatus,
                            size: 'small',
                            disabled:!this.isOrderSuccess,
                        },
                        style: {
                            width:"80px",
                            textAlign: "center",
                            marginRight: '10px',
                            
                        },
                        on: {
                            click: (index) => {
                                this.select(params.row)
                            }
                        }
                    }, buttonContent),
                ]);
              

            }
          },
        ],

        ruleValidate: {
            PLATE_NUM: [
                { required: true, type: 'string', message: '请选择车型', trigger: 'change' }
            ],
            MILEAGE: [
                { required: true, type: 'number', message: '请选择里程', trigger: 'change'},
                {validator: validatePass1, trigger: 'change'},
            ],
            TELPHONE: [
                {validator: validatePass, trigger: 'change'},
            ],
        },
        
        titleMsg:'新建未派工',
        isOrderSuccess:true,//判断是否是派工状态状态---
        //统计费用参数
        columns3:[
          {title: '项目合计费用', key: 'REPAIR_ITEM_MONEY', sortable: true, minWidth: 200,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.REPAIR_ITEM_MONEY))
          },
          {title: '优惠金额', key: 'REPAIR_ITEM_DERATE_MONEY', sortable: true, minWidth: 150,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.REPAIR_ITEM_DERATE_MONEY))
          },
          {title: '合计应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 200,align:'right',
            render: (h, params) => h('span', this.formatMoney(params.row.SUM_MONEY))
          },
        ],
        computedMoneyData:[],
       
        commitItem:[],//提交选择项目

        repairPersonArr:[],//主修人数组
        serverPersonArr:[],//服务顾问数组
        vehicleNumberArr:[],//车辆代号数组
        vehicleNumberArr1:[
            { code: '轿车-排量<1.6升-A', type: '10521001' },
            { code: '轿车-1.6升≤排量≤1.8升-B', type: '10521001' },
            { code: '轿车-1.8升<排量≤2.3升-C', type: '10521001' },
            { code: '轿车-2.3升<排量≤3升-D', type: '10521001' },
            { code: '轿车-3升<排量≤4升-E', type: '10521001' },
            { code: '客车-车总长≤4米（座位≤7座）-I', type: '10521002' },
            { code: '客车-4米<车总长≤5米（8座≤座位≤19座）-J', type: '10521002' },
            { code: '客车-5米<车总长≤7米（20座≤座位≤32座）-K', type: '10521002' },
            { code: '客车-7米<车总长≤10米（33座≤座位≤44座）-L', type: '10521002' },
            { code: '客车-10米<车总长（45座≤座位）-M', type: '10521002' },
            { code: '货车-载质量≤0.75吨-P', type: '10521003' },
            { code: '货车-汽油(0.75吨<载质量≤3.50吨)-Q', type: '10521003' },
            { code: '货车-柴油(0.75吨<载质量≤3.50吨)-R', type: '10521003' },
            { code: '货车-汽油(0.75吨<载质量≤3.50吨)-S', type: '10521003' },
            { code: '货车-柴油(0.75吨<载质量≤3.50吨)-T', type: '10521003' },
            { code: '货车-载质量≥8吨-U', type: '10521003' }
        ],//未筛选
        buttonStateArr:{
          save:false,//保存
          doaccount:true,//结算
          shoukuan:true,//收款
          printAccount:true,//打印结算单
        },//按钮状态组数据
        wtdData:null,
        startTimeOptions: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - (86400000 * 365);
          }
        }, //开始日期设置
        endTimeOptions: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now() + (86400000 * 365);
          }
        }, //结束日期设置
        timer:null,
        
      }
    },
    props:['showQuickDetail', 'detailData'],
    watch:{
      showQuickDetail(){
        console.log('进来的参数：',this.detailData);
        this.showFlag=true;
        this.showModal=true
        //获取项目组数据---------------
        
        //清空公共数据值------
        this.getItem=[];
        this.commitItem=[];
        this.selectData=[];
        this.getEmployeeList();
        //判断进来的参数是否存在---------------------
        if(this.detailData){
            this.getItemFun(this.detailData.REPAIR_ID);
          //初始化车辆数据----------------
          this.selectCarInitFun(this.detailData.VEHICLE_TYPE,this.detailData.VEHICLE_TYPE_CODE);

          for(let key in this.detailData){
              this.listSearch[key]= this.detailData[key];
          }
          console.log("listSearch进来的",this.listSearch);
          if(this.detailData['STATUS']=='10201001'){
              this.titleMsg="新建未派工";
              this.isOrderSuccess=true;

              for(let i in this.buttonStateArr){
                switch(i){
                  case 'save':
                  case 'doaccount': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }
              
          }else if(this.detailData['STATUS']=='10201004'){
              this.titleMsg="已结算待收款";
              this.isOrderSuccess=false;
              this.getAccountData(this.detailData["REPAIR_ID"]);

              for(let i in this.buttonStateArr){
                switch(i){
                  case 'shoukuan':
                  case 'printAccount': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }
              
          }else if(this.detailData['STATUS']=='10201005'){
              this.titleMsg="已结清";
              this.isOrderSuccess=false;
              this.getAccountData(this.detailData["REPAIR_ID"]);
              for(let i in this.buttonStateArr){
                switch(i){
                  case 'printAccount': this.buttonStateArr[i]= false; break
                  default : this.buttonStateArr[i]= true;
                }
              }
          }

        }else{
            this.getItemFun();
            //搜索框初始化
            for(let key in this.listSearchInit){
                this.listSearch[key]=this.listSearchInit[key];
            }
            //初始化按钮状态-----------
            for(let i in this.buttonStateArr){
                switch(i){
                case 'save': this.buttonStateArr[i]= false; break
                default : this.buttonStateArr[i]= true;
                }
            }
            //选择车辆类型初始化
            this.vehicleNumberArr=[
                { code: '轿车-排量<1.6升-A', type: '10521001' },
                { code: '轿车-1.6升≤排量≤1.8升-B', type: '10521001' },
                { code: '轿车-1.8升<排量≤2.3升-C', type: '10521001' },
                { code: '轿车-2.3升<排量≤3升-D', type: '10521001' },
                { code: '轿车-3升<排量≤4升-E', type: '10521001' },
            ];
            //新建功能表------
            this.titleMsg="新建未派工";

            this.single=false;//是否选择开发票
            this.isOrderSuccess=true;
            
        }

        
      }
    },
    mounted () {
      this.wtdData = this.$store.state.user.userInfo.tenant;
      this.cardStateArr=getDictGroup(this.$store.state.app.dict, '1049');
      this.payModeData=getDictGroup(this.$store.state.app.dict, '1010');
    },
    computed: {
      work_price() {
        return parseFloat(getUserInfo(this.$store.state.user.userInfo.params, 'P1001'));
      },
      paint_price() {
        return parseFloat(getUserInfo(this.$store.state.user.userInfo.params, 'P1002'));
      },
      //车辆颜色------
      carColorData() {
        return getDictGroup(this.$store.state.app.dict, '1013');
      },
      //维修类型-----
      repairTypeArr() {
        return getDictGroup(this.$store.state.app.dict, '1019');
      },
      //车辆类型---
      vehicleTypeArr() {
        return getDictGroup(this.$store.state.app.dict, '1052');
      },
      //配件单位数据-------
      partsUnit() {
        return getDictGroup(this.$store.state.app.dict, '1015');
      },
      //配件品牌-----
      bandTypeFun() {
        return getDictGroup(this.$store.state.app.dict, '1016');
      },
      //配件类型
      partsTypeFun() {
        return getDictGroup(this.$store.state.app.dict, '1017');
      },


    },
    methods:{
        //状态值判断-----
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
            this.computItemMoney();
        },
        //得到主修人数据
        getEmployeeList(){
            this.repairPersonArr=[];
            this.serverPersonArr=[];
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getEmployeeList',
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
                        var obj={code:''};
                        obj.code=res.data[i].USER_NAME;
                        this.repairPersonArr.push(obj);
                        this.serverPersonArr.push(obj);
                    }
                }
            })
        },
        //选择车辆类型初始化
        selectCarInitFun(val,key){
            
            this.vehicleNumberArr=[];
            // this.listSearch.VEHICLE_TYPE_CODE="";
            for(let i in this.vehicleNumberArr1){
                if(this.vehicleNumberArr1[i].type==val){
                    this.vehicleNumberArr.push(this.vehicleNumberArr1[i]);
                }
            }
            if(key){
                this.listSearch.VEHICLE_TYPE_CODE=key;
            }else{
                this.listSearch.VEHICLE_TYPE_CODE=this.vehicleNumberArr[0]['code'];
            }

        },
        
        visibleChange(status){
            console.log(status);
            if(status === false){
            this.$emit('closeDetail');
            this.handleReset("listSearch");
            }
        },
         perfectCarData() {
            this.$router.push({path: '/cart-list'});
        },
        perfectCustomerData(){
            this.$router.push({path:'/customer-list'});
        },
        //保存按钮-----------
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.selectData.length>0){
                        

                                    
              
                  this.$Modal.confirm({
                            title:"系统提示!",
                            content:"确定要保存吗？",
                            onOk:this.saveData,
                            
                        })

              

                    }else{
                        this.$Message.info('至少选择一个服务项目')
                    }
                }
            });
            
            
        },
        saveData(){
            //提交维修项目套餐
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
                method: 'post',
                data: {
                data: JSON.stringify(this.listSearch),
                items:JSON.stringify(this.selectData),
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('保存成功')
                    for(let i in this.buttonStateArr){
                        switch(i){
                        case 'save':
                        case 'doaccount': this.buttonStateArr[i]= false; break
                        default : this.buttonStateArr[i]= true;
                        }
                    }
                    for(let i in res.data){
                        this.listSearch[i]=res.data[i];
                    }
                    
                    this.$emit('closeGetList');
                }
            })
        },
        saveData1(){
            //提交维修项目套餐
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
                method: 'post',
                data: {
                data: JSON.stringify(this.listSearch),
                items:JSON.stringify(this.selectData),
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    
                    
                    for(let i in res.data){
                        this.listSearch[i]=res.data[i];
                    }
                    
                    this.showAccount=true;
                }
            })
        },
        handleSubmit1 (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.selectData.length>0){
                        this.saveData1();
                    }else{
                        this.$Message.info('至少选择一个服务项目')
                    }
                }
            });
        },
        //结算按钮----------------
        handleCommit(){
            this.handleSubmit1('listSearch');
            
        },
        commitdata(){
            this.showAccount=false;
            var newDatacommit={
                "REPAIR_ITEM_MONEY":'',
                "REPAIR_ITEM_DERATE_MONEY":'',
                "SUM_MONEY":'',
                "REPAIR_ID":'',
            };
            for(let key in newDatacommit){
                newDatacommit[key]=this.listSearch[key];
            }
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/saveAccount',
                method: 'post',
                data: {
                    data: JSON.stringify(newDatacommit),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    // this.$Message.info('successful');
                    this.titleMsg="已结算待收款";
                    this.isOrderSuccess=false;

                    for(let i in this.buttonStateArr){
                        switch(i){
                        case 'printAccount':
                        case 'shoukuan': this.buttonStateArr[i]= false; break
                        default : this.buttonStateArr[i]= true;
                        }
                    }
                    this.getAccountData(this.listSearch["REPAIR_ID"]);
                    this.$emit('closeGetList');
                }
            })
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
                    // this.$Message.info('successful');
                    for(let i in res.data[0]){
                        this.listSearch[i]=res.data[0][i];
                    }
                    this.computedMoneyData=res.data;
                }
            })
        },
        
        //收款按钮-------------------
        shoukuanFun(){
           this.showShouKuan=Math.random();
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        //获取维修项目内容
        getItemFun(repairId){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getQuickItems',
                method: 'post',
                data: {
                    repairId: repairId||'',
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.getItem=res.data;
                    this.commitItem=res.data;
                    
                    for(let i in res.data){
                        if(res.data[i]['SEL_ID']){
                            this.selectData.push(res.data[i]);
                        }
                    }
                        this.computItemMoney();
                    
                }
            })
        },

        //监听选择车辆----
        selectCar(val){
            this.listSearch["VEHICLE_MODEL"] = val["VEHICLE_MODEL"];
            this.listSearch["PLATE_NUM"] = val["PLATE_NUM"];
            this.listSearch["ORDER_PERSON"] = val["CUSTOMER_NAME"];
            this.listSearch["CUSTOMER_NAME"] = val["CUSTOMER_NAME"];
            this.listSearch["GIVE_REPAIR_PERSON"] = val["CUSTOMER_NAME"];
            this.listSearch["TELPHONE"] = val["MOBILE_PHONE"];
            this.listSearch["VIN_NO"] = val["VIN_NO"];
            this.listSearch["VEHICLE_ID"] = val["VEHICLE_ID"];
            this.listSearch["VEHICLE_COLOR"] = val["VEHICLE_COLOR"];
            this.listSearch["ENGINE_NO"] = val["ENGINE_NO"];
            console.log("selectCar",val,this.listSearch);
        },
        //计算维修项目类的金额-----------
        computItemMoney(){
            this.listSearch["REPAIR_ITEM_MONEY"]=0;
            this.listSearch["SUM_MONEY"]=0;

            for(let i in this.selectData){
                if(this.selectData[i]['CHARGE_TYPE']=="10141001"){
                    this.listSearch["REPAIR_ITEM_MONEY"]+=this.selectData[i]["REPAIR_MONEY"];
                    this.selectData[i]["ITEM_MONEY"]=this.selectData[i]["REPAIR_MONEY"];
                }else if(this.selectData[i]['CHARGE_TYPE']=="10141002"){
                    this.listSearch["REPAIR_ITEM_MONEY"]+=this.selectData[i]["REPAIR_TIME"]*this.work_price;
                    this.selectData[i]["ITEM_MONEY"]=this.selectData[i]["REPAIR_TIME"]*this.work_price;
                }else if(this.selectData[i]['CHARGE_TYPE']=="10141003"){
                    this.listSearch["REPAIR_ITEM_MONEY"]+=this.selectData[i]["PAINT_NUM"]*this.paint_price;
                    this.selectData[i]["ITEM_MONEY"]=this.selectData[i]["PAINT_NUM"]*this.paint_price;
                }
                
            }
            this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]-this.listSearch["REPAIR_ITEM_DERATE_MONEY"];
        },
        //结算金额改变
        accountChange(val){
            this.listSearch.SUM_MONEY=(this.listSearch.REPAIR_ITEM_MONEY-val).toFixed(2);
            clearTimeout(this.timer);
            this.timer=setTimeout(()=>{
                this.accountBlur();
            },1000)
        },
        accountBlur(){
            if(this.listSearch.REPAIR_ITEM_DERATE_MONEY>this.listSearch.REPAIR_ITEM_MONEY){
                this.listSearch.REPAIR_ITEM_DERATE_MONEY=0;
                this.listSearch.SUM_MONEY=(this.listSearch.REPAIR_ITEM_MONEY-this.listSearch.REPAIR_ITEM_DERATE_MONEY).toFixed(2);
                this.$Modal.confirm({
                    title: "系统提示!",
                    content:"优惠金额过大",

                  })
            }
        },
        closeGetList(){
            for(let i in this.buttonStateArr){
                switch(i){
                
                case 'printAccount': this.buttonStateArr[i]= false; break
                default : this.buttonStateArr[i]= true;
                }
            }
            this.$emit('closeGetList');//重新请求数据
            this.titleMsg = "已结清";
        },
        //打印结算单部分-------------------
      printAccountButton() {


        // clearTimeout(this.printTime);
        console.log('打印结算单部分');
        // if (this.printFlag1 && this.printFlag2 && this.printFlag3 && this.printFlag4) {
          var temp = null;

          var store = this.$store;

          var listSearch = {};
          for (let i in this.listSearch) {
            switch (i) {
              case'COME_DATE':
              case'OUT_DATE':
                listSearch[i] = formatDate(this.listSearch[i]) + ' ' + formatDate(this.listSearch[i], 'hh:mm:ss');
                break;
              case'VEHICLE_TYPE':

                listSearch[i] = getName(this.vehicleTypeArr, this.listSearch[i]);
                break;
              case'REPAIR_TYPE':
                listSearch[i] = getName(this.repairTypeArr, this.listSearch[i]);
                break;
              default :
                listSearch[i] = this.listSearch[i];
            }
            ;

          }
          
          console.log(this.listSearch);
          let commitItemGroup=[];
          let commitParts=[];
          let commitOtherItem=[];
          

          if (this.$store.state.user.userInfo.tenant && this.$store.state.user.userInfo.tenant.businessType == '10331003') {
            console.log('三级维修');
            temp = printAccountFun(this.wtdData, listSearch, this.selectData, commitItemGroup, commitParts, commitOtherItem, store, 'styleFlag');
          } else {
            console.log('不是三级维修');
            temp = printAccountFun(this.wtdData, listSearch, this.selectData, commitItemGroup, commitParts, commitOtherItem, store, 'styleFlag');
          }
          var LODOP = getLodop();
          LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
          LODOP.ADD_PRINT_TABLE(50, 0, "100%", 1000, temp);
          //LODOP.SET_PRINT_STYLEA(0,"Offset2Top",-60); //设置次页偏移把区域向上扩
          LODOP.PREVIEW();

        // } else {
        //   let self = this;
        //   this.printTime = setTimeout(function () {
        //     self.printAccountButton();
        //   }, 300)
        // }
      },
      openStartTime(val){
        if(!val){
          if (new Date(this.listSearch.COME_DATE).getTime() >= new Date(this.listSearch.PLAN_END_DATE).getTime()) {
            this.$Modal.confirm({
              title: "系统提示!",
              content: "进厂日期不可大于计划完工日期",
            })

            this.listSearch.COME_DATE = new Date();
          }
        }
      },
      openEndTime(val){
        console.log(val);
        if(!val){
            if (new Date(this.listSearch.PLAN_END_DATE).getTime() <= new Date(this.listSearch.COME_DATE).getTime()) {
              this.$Modal.confirm({
                title: "系统提示!",
                content: "计划完工日期不可小于进厂日期",
              })
              this.listSearch.PLAN_END_DATE = new Date();
            }
        }
      },
      
    }
	}
</script>

<style scoped lang="less">
  .search-block{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
  .r-list-search{
    width: 100%;
    padding: 20px 0;
    text-align: center;

  }
  .r-list-choose-parts{
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
  .r-list-money{
    width: 100%;
    font-size: 16px;
    text-align: center;
        margin-bottom: 20px;
    height: 40px;
    padding-top: 10px;
    span{
      color:red;

    }
    .r-list-money-reset{
      font-size: 16px;
    }
  }
  .r-list-chekbox{
    width: 100%;
    overflow: hidden;
    font-size: 18px;
    padding: 5px 10px;
    div{
      float:right;
    }
  }
  .itemBox{
    width: 100%;
    overflow: hidden;
    .item{
        width: 200px;
        height:50px;
        border:1px solid #12a6ec;
        float:left;
        margin-left:10px;
        color:#000;
        text-align:center;
        line-height:50px;
    }
    .itemClass{
        background: #12a6ec;
        color: #fff;
    }
  }
</style>
