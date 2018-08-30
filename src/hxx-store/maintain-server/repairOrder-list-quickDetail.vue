<!--预约单管理详情-->
<template>
  <Modal
    v-model="showModal"
    title="快速开单"
    width="90"
    @on-visible-change="visibleChange"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">{{titleMsg}}</div>
    <Collapse v-model="collapse">
      <Panel name="1">查询
       <Form ref="listSearch" :rules="ruleValidate"  :model="listSearch" slot="content" :label-width="80" inline class="detail-form">
          <FormItem label="车牌号码:" prop="PLATE_NUM">
              <Input @on-focus="showoff=Math.random();"	type="text" v-model="listSearch.PLATE_NUM" placeholder="请输入车牌号" style="min-width: 250px;" >
                  <Icon type="ios-search" slot="suffix"/>
              </Input>
          </FormItem>
          <FormItem label="车型:">
              <Input type="text" disabled v-model="listSearch.VEHICLE_MODEL" placeholder="请输入车型" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车架号:">
              <Input type="text" disabled v-model="listSearch.VIN_NO" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="车主名称:">
              <Input type="text" disabled v-model="listSearch.CUSTOMER_NAME" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="送修人:">
              <Input type="text" v-model="listSearch.GIVE_REPAIR_PERSON" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="联系电话:">
              <Input type="text" v-model="listSearch.TELPHONE" placeholder="" style="min-width: 250px;"> </Input>
          </FormItem>
          <FormItem label="维修类型:" >
              <Select v-model="listSearch.REPAIR_TYPE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in repairTypeArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="送修里程:" prop="MILEAGE">
              <InputNumber :min="1" v-model="listSearch.MILEAGE" style="min-width: 250px;" placeholder="最大不超过八位数"></InputNumber>
          </FormItem>
          <FormItem label="主修人:" >
              <Select v-model="listSearch.REPAIR_PERSON" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in repairPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="车辆类型:" >
              <Select v-model="listSearch.VEHICLE_TYPE" placeholder="" style="min-width: 250px;" @on-change="selectCarInitFun">
                <Option v-for="(item, index) in vehicleTypeArr"
                  :key="index" :value="item.code">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="车辆分类代号:" >
              <Select v-model="listSearch.VEHICLE_TYPE_CODE" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in vehicleNumberArr"
                  :key="item.code" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="服务顾问:" >
              <Select v-model="listSearch.FOLLOW_PERSON" placeholder="" style="min-width: 250px;">
                <Option v-for="(item, index) in serverPersonArr"
                  :key="index" :value="item.code">{{item.code}}</Option>
              </Select>
          </FormItem>
          <FormItem label="进厂日期:">
              <DatePicker v-model="listSearch.COME_DATE" type="datetime" placeholder="Select date and time" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="计划完工日期:">
              <DatePicker v-model="listSearch.PLAN_END_DATE" type="datetime" placeholder="Select date and time" style="width: 200px"></DatePicker>
          </FormItem>
          
       </Form>
       <Form ref="formInline"  slot="content" :label-width="80">
          <FormItem label="故障描述:">
              <Input type="textarea" v-model="listSearch.FAULT_DESC" placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem label="客诉内容:">
              <Input type="textarea" v-model="listSearch.CUSTOMER_INFO" placeholder="请输入客诉内容"> </Input>
          </FormItem>
          <FormItem label="维修建议:">
              <Input type="textarea" v-model="listSearch.REPAIR_INFO" placeholder="请输入建议内容"> </Input>
          </FormItem>
       </Form>
      </Panel>
    </Collapse>
    <!--//维修项目-->
    <div>
        <h2 style="border-bottom: 1px solid #ccc; margin: 10px 0;padding: 5px 0;">服务项目</h2>
        <div class="itemBox">
            <div class="item" v-for="site in getItem" v-bind:class="{ itemClass: singleItem }">
                <Checkbox v-model="singleItem" @on-change="sTenanceItem">
                    <span>{{site.NAME}}</span>
                </Checkbox>
            </div>
        </div>
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
          <InputNumber @on-change="computedMoney" :disabled="!isOrderSuccess" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" :min="0">
          </InputNumber> = 合计应收金额：
          <span class="r-list-money-reset">{{listSearch.SUM_MONEY}}元</span>
      </p>
    </div>
      <!--底部按钮组-->
      <div slot="footer" style="text-align: center; font-size: 18px;">
          <Button :disabled="buttonStateArr.save" @click="handleSubmit('listSearch')" size="large" type="primary"  style="margin-right: 10px; padding: 0 10px;"><Icon type="md-checkmark" size="24"/>保存</Button>
          <Button :disabled="buttonStateArr.doaccount" @click="handleCommit" type="primary"  style="margin-right: 10px; padding: 0 10px;">结算</Button>
          <Button :disabled="buttonStateArr.printAccount" type="primary"  style="margin-right: 10px; padding: 0 10px;">打印结算单</Button>
          <Button :disabled="buttonStateArr.shoukuan" @click="shoukuanFun" type="primary"  style="margin-right: 10px; padding: 0 10px;">收款</Button>
      </div>
      
      <!--选择车型-->
      <select-vehicle :showoff="showoff" @selectCar="selectCar">
      </select-vehicle>

      <!--收款框弹出-->
        <Modal v-model="showShouKuan"
            title="维修工单结算"
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
                            <Button type="primary">更换</Button>
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
                    <Form slot="content" :label-width="120" inline class="detail-form">
                        <FormItem label="支付宝:">
                            <Button  type="primary" >支付宝</Button>
                        </FormItem>
                        <FormItem label="微信支付:">
                            
                            <Button  type="primary" >微信支付</Button>
                        </FormItem>
                        <FormItem label="短信账单收款:">
                            <Button  type="primary" >短信账单收款</Button>
                        </FormItem>
                        <FormItem label="其他方式:">
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
                    <Form slot="content" :label-width="120" inline class="detail-form">
                        <FormItem label="发票编号:">
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
            <div slot="footer" style="text-align: center; font-size: 18px;">
                <Button type="primary" @click="savePay" style="margin-right: 10px; padding: 0 10px;">收款</Button>
                <Button type="error" @click="showShouKuan=false;" style="margin-right: 10px; padding: 0 10px;">取消</Button>
            </div>
        </Modal>
    <!--结算框弹出-->
    <Modal
        v-model="showAccount"
        title="维修工单结算"
        width="50"
        @on-visible-change=""
        :scrollable="true"
        :transfer= "false"
        :footer-hide="false"
        :transition-names="['', '']">
        <Collapse v-model="collapse2">
            <Panel name="1">结算信息
                <Form slot="content" :label-width="120" inline class="detail-form">
                    <FormItem label="项目合计费用:">
                        <span>{{listSearch.REPAIR_ITEM_MONEY}}元</span>
                    </FormItem>
                    <FormItem label="优惠金额:">
                        <InputNumber :min="0" v-model="listSearch.REPAIR_ITEM_DERATE_MONEY" @on-change="accountChange"></InputNumber>
                    </FormItem>
                    <FormItem label="合计应收金额:">
                        <span>{{listSearch.SUM_MONEY}}元</span>
                    </FormItem>
                </Form>
                </Panel>
        </Collapse>
        <div slot="footer" style="text-align: center; font-size: 18px;">
            <Button type="primary" @click="commitdata" style="margin-right: 10px; padding: 0 10px;">结算</Button>
            <Button type="error" @click="showAccount=false;" style="margin-right: 10px; padding: 0 10px;">取消</Button>
        </div>
    </Modal>

  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import selectVehicle from '@/hxx-components/select-vehicle.vue'

export default {
	name: "repairOrder-list-quickDetail",
    components: {selectVehicle,},
    data(){
      return{
        single:false,//是否选择开发票
        singleItem:false,//是否选择项目
        showoff:null,//选择车辆
        showModal: false,//本界面是否显示判断
        showAccount:false,//结算界面弹出
        showShouKuan:false,//收款界面弹出
        cardStateArr:[],//储存卡状态值
        payModeData:[],//支付方式数组
        getItem:[],//获取项目数组
        collapse: '1',
        collapse1:'1',
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
        shoukuanData:{
            MEMBER_CARD_STATUS:'',
            MEMBER_CARD_NO:'',
        },//提交收款工单数据-----------
        shoukuanSearch:{
            "CUSTOMER_ID":"",
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

        ruleValidate: {
            PLATE_NUM: [
                { required: true, type: 'string', message: '请选择车型', trigger: 'change' }
            ],
            MILEAGE: [
                { required: true, type: 'number', message: '请选择里程', trigger: 'change' ,min: 1,}
            ]
        },
        titleMsg:'新建未派工',
        isOrderSuccess:true,//判断是否是派工状态状态---
        //统计费用参数
        columns3:[
          {title: '项目合计费用', key: 'REPAIR_ITEM_MONEY', sortable: true, minWidth: 200,
          },
          {title: '优惠金额', key: 'REPAIR_ITEM_DERATE_MONEY', sortable: true, minWidth: 150,
          },
          {title: '合计应收金额', key: 'SUM_MONEY', sortable: true, minWidth: 200,
          },
        ],
        computedMoneyData:[],
       
        commitItem:[],//提交选择项目
        repairTypeArr:[],//维修类型数组
        repairPersonArr:[],//主修人数组
        serverPersonArr:[],//服务顾问数组
        vehicleTypeArr:[],//车辆类型数组
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
        vehicleTeamArr:[],//机车班组数组-------
        buttonStateArr:{
          save:false,//保存
          doaccount:true,//结算
          shoukuan:true,//收款
          printAccount:true,//打印结算单
        },//按钮状态组数据
        newDatacommit:{
            "REPAIR_ITEM_MONEY":'',
            "REPAIR_ITEM_DERATE_MONEY":'',
            "SUM_MONEY":'',
            "REPAIR_ID":'',
        },//结算提交数据----------

        returnData:null,//记录返回数据的引用
      }
    },
    props:['showQuickDetail', 'detailData'],
    watch:{
      showQuickDetail(){
        console.log('进来的参数：',this.detailData,this.returnData);
        this.showModal=true
        //获取项目组数据---------------
        this.getItemFun();
        //清空公共数据值------
        this.getItem=[];
        this.commitItem=[];
        this.getShopClassList();
        this.getEmployeeList();
        this.returnData=this.detailData;//赋值返回数据
        //判断进来的参数是否存在---------------------
        if(this.detailData){
          //初始化车辆数据----------------
          this.selectCarInitFun(this.detailData.VEHICLE_TYPE,this.detailData.VEHICLE_TYPE_CODE);
          this.singleItem=true;//选择项目按钮----------
          for(let key in this.listSearch){
            if(this.detailData.hasOwnProperty(key)){
              this.listSearch[key]= this.detailData[key];
            }
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
              //重置结算按钮提交的数据-------------------
              for(let i in this.newDatacommit){
                if(this.detailData.hasOwnProperty(i)){
                    this.newDatacommit[i]=this.detailData[i];
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
            this.singleItem=false;
            this.single=false;//是否选择开发票
            this.isOrderSuccess=true;
            this.returnData=null;
        }

        
      }
    },
    mounted () {
      this.repairTypeArr= getDictGroup(this.$store.state.app.dict, '1019');
      this.vehicleTypeArr= getDictGroup(this.$store.state.app.dict, '1052');
      this.cardStateArr=getDictGroup(this.$store.state.app.dict, '1049');
      this.payModeData=getDictGroup(this.$store.state.app.dict, '1010');
    },
    methods:{
        //得到机修班组数据
        getShopClassList(){
            this.vehicleTeamArr=[];
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getShopClassList',
                method: 'post',
                data: {
                    node: 0,
                    access_token: this.$store.state.user.token
                }
                }).then(res => {
                if (res.success === true) {
                    for(let i in res.data){
                        var obj={code:'',itemId:''};
                        obj.code=res.data[i].text;
                        obj.itemId=res.data[i].itemId;
                        this.vehicleTeamArr.push(obj);
                    }
                    console.log("this.vehicleTeamArr",this.vehicleTeamArr);
                }
            })
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
                    console.log("this.vehicleTeamArr",this.serverPersonArr,this.repairPersonArr);
                }
            })
        },
        //选择车辆类型初始化
        selectCarInitFun(val,key){
            this.listSearch.VEHICLE_TYPE_CODE=key||"";
            this.vehicleNumberArr=[];
            // this.listSearch.VEHICLE_TYPE_CODE="";
            for(let i in this.vehicleNumberArr1){
                if(this.vehicleNumberArr1[i].type==val){
                    this.vehicleNumberArr.push(this.vehicleNumberArr1[i]);
                }
            }

        },
        
        visibleChange(status){
            console.log(status);
            if(status === false){
            this.$emit('closeDetail');
            this.handleReset("listSearch");
            }
        },
        //保存按钮-----------
        handleSubmit (name) {
            if(this.singleItem){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                            this.$Modal.confirm({
                                title:"系统提示!",
                                content:"确定要保存吗？",
                                onOk:this.saveData,
                                
                            })
                    } else {

                    }
                });
            }else{
                this.$Message.info('至少选择一个服务项目')
            }
            
        },
        saveData(){
            //提交维修项目套餐
            console.log('this.listSearch',this.listSearch);
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/saveOrSubmit',
                method: 'post',
                data: {
                data: JSON.stringify(this.listSearch),
                items:JSON.stringify(this.commitItem),
                access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('successful')
                    for(let i in this.buttonStateArr){
                        switch(i){
                        case 'save':
                        case 'doaccount': this.buttonStateArr[i]= false; break
                        default : this.buttonStateArr[i]= true;
                        }
                    }
                    for(let i in res.data){
                        this.newDatacommit[i]=res.data[i];
                    }
                    this.returnData=res.data;
                }
            })
        },
        //结算按钮----------------
        handleCommit(){
            this.showAccount=true;
        },
        commitdata(){
            this.showAccount=false;
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/saveAccount',
                method: 'post',
                data: {
                    data: JSON.stringify(this.newDatacommit),
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.$Message.info('successful');
                    this.titleMsg="已结算待收款";
                    this.isOrderSuccess=false;

                    for(let i in this.buttonStateArr){
                        switch(i){
                        case 'printAccount':
                        case 'shoukuan': this.buttonStateArr[i]= false; break
                        default : this.buttonStateArr[i]= true;
                        }
                    }
                    this.getAccountData(this.returnData["REPAIR_ID"]);
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
                    this.$Message.info('successful');
                    this.computedMoneyData=res.data;
                }
            })
        },
        //收款按钮-------------------
        shoukuanFun(){
           this.showShouKuan=true;
           this.shoukuanSearch['REPAIR_ITEM_MONEY']=this.returnData['REPAIR_ITEM_MONEY']||0;
           this.shoukuanSearch['REPAIR_ITEM_DERATE_MONEY']=this.returnData['REPAIR_ITEM_DERATE_MONEY']||0;
           this.shoukuanSearch['SUM_MONEY']=this.returnData['SUM_MONEY']||0;
           this.shoukuanSearch['REPAIR_ID']=this.returnData['REPAIR_ID'];
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
                    
                    console.log(this.shoukuanSearch);
                }
            })
        },
        savePay(){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/savePay',
                method: 'post',
                data: {
                    data: JSON.stringify(this.shoukuanSearch),
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
                }
            })
        },
        

        getNewDate(val,currentVal){
            console.log("val",val,currentVal);
            this.listSearch.ORDER_DATE=val;
        },
        getOnlyNumber(val){
            this.listSearch.TELPHONE=this.listSearch.TELPHONE.replace(/[^\d]/g,'');
        },
      
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        //获取维修项目内容
        getItemFun(){
            this.axios.request({
                url: '/tenant/repair/ttrepairworkorder/getQuickItems',
                method: 'post',
                data: {
                    repairId: '',
                    page: 1,
                    start: 0,
                    limit: 25,
                    access_token: this.$store.state.user.token
                }
            }).then(res => {
                if (res.success === true) {
                    this.getItem=res.data;
                    this.commitItem=res.data;
                }
            })
        },

        //监听选择车辆----
        selectCar(val){
            this.listSearch["VEHICLE_MODEL"]=val["VEHICLE_MODEL"];
            this.listSearch["PLATE_NUM"]=val["PLATE_NUM"];
            this.listSearch["ORDER_PERSON"]=val["CUSTOMER_NAME"];
            this.listSearch["CUSTOMER_NAME"]=val["CUSTOMER_NAME"];
            this.listSearch["GIVE_REPAIR_PERSON"]=val["CUSTOMER_NAME"];
            this.listSearch["TELPHONE"]=val["MOBILE_PHONE"];
            this.listSearch["VIN_NO"]=val["VIN_NO"];
            this.listSearch["VEHICLE_ID"]=val["VEHICLE_ID"];
            console.log("selectCar",val,this.listSearch);
        },
        //获取维修项目数据-------
        sTenanceItem(val){
            if(val){
                    this.commitItem=[];
                    for(let j in this.getItem){
                        var listItemsModel={
                            "DETAIL_ID":"",
                            "ITEM_ID":"",
                            "TENANT_ID":"",
                            "CREATE_TIME":"",
                            "NAME":"",
                            "ITEM_NO":"",
                            "TYPE_ID":"",
                            "STATUS":"",
                            "CHARGE_TYPE":"",
                            "REPAIR_TIME":0,
                            "REPAIR_MONEY":0,
                            "PAINT_NUM":0,
                            "IS_PREINSTALL":"",
                            "CLASS_NAME":"",
                            "CLASS_TYPE":"",
                            "ENGINE_TYPE_NAME":"",
                            "ENGINE_TYPE":"",
                            "SORT":"",
                            "TYPE_NAME":"",
                            "cartype":"",
                            "BUSINESS_TYPE":"",
                            "UPDATE_TIME":null,
                            "id":"",
                            "ITEM_MONEY":0,
                            "ITEM_DERATE_MONEY":0,
                            "ITEM_LAST_MONEY":0,
                            "SUM_MONEY":0,
                            "COME_DATE":null,
                            "PLAN_END_DATE":null,
                            "REPAIR_ITEM_MONEY":0,
                            "REPAIR_PART_MONEY":0,
                            "REPAIR_ITEM_DERATE_MONEY":0,
                            "REPAIR_PART_DERATE_MONEY":0,
                            "ACCOUNT_TIME":null,
                            "ORDER_DATE":null,
                            "IS_SEL":true,
                            "REMARK":"",
                        }
                        for(let i in listItemsModel){
                            if(this.getItem[j][i]){
                                listItemsModel[i]=this.getItem[j][i];
                            }else if(i=="ITEM_MONEY"){
                                
                                listItemsModel[i]=this.getItem[j]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+this.getItem[j]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
                            }else if(i=="ITEM_LAST_MONEY"){
                                listItemsModel[i]=parseInt(this.getItem[j]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001'))+parseInt(this.getItem[j]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002'));
                            }
                        
                        }
                        this.commitItem.push(listItemsModel);
                    }
                    this.computItemMoney();
            }else{
                    this.listSearch["REPAIR_ITEM_MONEY"]=0;
                    this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=0;
                    this.listSearch["SUM_MONEY"]=0;
                    this.listSearch["REPAIR_PART_MONEY"]=0;
                    this.listSearch["REPAIR_PART_DERATE_MONEY"]=0;
            }
            
        },
      
        //计算维修项目类的金额-----------
        computItemMoney(){
            this.listSearch["REPAIR_ITEM_MONEY"]=0;
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=0;
            this.listSearch["SUM_MONEY"]=0;
            this.listSearch["REPAIR_PART_MONEY"]=0;
            this.listSearch["REPAIR_PART_DERATE_MONEY"]=0;
            for(let i in this.commitItem){
            this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItem[i]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+this.commitItem[i]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"]+=this.commitItem[i]["ITEM_DERATE_MONEY"];
            }
            for(let i in this.commitItemGroup){
            this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItemGroup[i]["SALES_PRICE"];
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"]+=this.commitItemGroup[i]["ITEM_DERATE_MONEY"];
            }
            for(let i in this.commitParts){
            this.listSearch["REPAIR_PART_MONEY"]+=this.commitParts[i]["SALES_PRICE"]*(this.commitParts[i]["PART_NUM"]||1);
            this.listSearch["REPAIR_PART_DERATE_MONEY"]+=this.commitParts[i]["PART_DERATE_MONEY"];
            }
            this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-this.listSearch["REPAIR_ITEM_DERATE_MONEY"]-this.listSearch["REPAIR_PART_DERATE_MONEY"];
        },
        //手动金额计算值---------------
        computedMoney(val){
            console.log('手动金额计算值',val);
            this.listSearch["REPAIR_ITEM_MONEY"]=0;
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=0;
            this.listSearch["SUM_MONEY"]=0;
            for(let i in this.commitItem){
            this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItem[i]["REPAIR_TIME"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1001')+this.commitItem[i]["PAINT_NUM"]*getUserInfo(this.$store.state.user.userInfo.params, 'P1002');
            }
            for(let i in this.commitItemGroup){
            this.listSearch["REPAIR_ITEM_MONEY"]+=this.commitItemGroup[i]["SALES_PRICE"];
            }
            this.listSearch["REPAIR_ITEM_DERATE_MONEY"]=val;
            this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-val-this.listSearch["REPAIR_PART_DERATE_MONEY"];
        },
        computedMoney1(val){
            console.log('手动金额计算值',val);
            this.listSearch["SUM_MONEY"]=0;
            this.listSearch["REPAIR_PART_MONEY"]=0;
            this.listSearch["REPAIR_PART_DERATE_MONEY"]=0;
            for(let i in this.commitParts){
            this.listSearch["REPAIR_PART_MONEY"]+=this.commitParts[i]["SALES_PRICE"]*(this.commitParts[i]["PART_NUM"]||1);
            }
            this.listSearch["REPAIR_PART_DERATE_MONEY"]=val;
            this.listSearch["SUM_MONEY"]=this.listSearch["REPAIR_ITEM_MONEY"]+this.listSearch["REPAIR_PART_MONEY"]-this.listSearch["REPAIR_ITEM_DERATE_MONEY"]-val;
        },
        //结算金额改变
        accountChange(val){
            this.listSearch.SUM_MONEY=this.listSearch.REPAIR_ITEM_MONEY-val;
        },
        //是否开发票-------
        isGiveInvoiceFun(val){
            console.log(val);
            if(val){
                this.shoukuanSearch['IS_GIVE_INVOICE']="10041001";
            }else{
                this.shoukuanSearch['IS_GIVE_INVOICE']="10041002";
            }
        }
      

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
    font-size: 18px;
    text-align: center;

    span{
      color:red;

    }
    .r-list-money-reset{
      font-size: 22px;
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
