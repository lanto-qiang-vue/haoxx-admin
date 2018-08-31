<template>
  <Modal
    v-model="showModal"
    title="维修记录"
    width="80"
    :scrollable="true"
    :transfer= "false"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">{{titleMsg}}</div>
    <Collapse v-model="collapse">
      <Panel name="1">详情
       <Form ref="listSearch" v-if="tem == 1"   slot="content" :label-width="120" inline class="detail-form">
                <FormItem label="车牌号码:" style="width:30%;">
                <Input type="text" v-model="base.PLATE_NUM" style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                <FormItem label="车型:" style="width:30%;">
                <Input type="text" v-model="base.VEHICLE_MODEL"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车架号:" style="width:30%;">
                <Input type="text" v-model="base.VIN_NO"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车主名称:" style="width:30%;">
                <Input type="text" v-model="base.CUSTOMER_NAME"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="送修人:" style="width:30%;">
                <Input type="text" v-model="base.GIVE_REPAIR_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="联系电话:" style="width:30%;">
                <Input type="text"  v-model="base.TELPHONE" style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="维修类型:" style="width:30%;">
                <Input type="text" v-model="base.REPAIR_TYPE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="送修里程:" style="width:30%;">
                <Input type="text" v-model="base.MILEAGE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="主修人:" style="width:30%;">
                <Input type="text" v-model="base.REPAIR_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车辆类型:" style="width:30%;">
                <Input type="text" v-model="base.VEHICLE_TYPE"   style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="车辆分类代码:" style="width:30%;">
                <Input type="text"  v-model="base.VEHICLE_TYPE_CODE" style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="服务顾问:" style="width:30%;">
                <Input type="text" v-model="base.FOLLOW_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="进场日期:" style="width:30%;">
                <Input type="text" v-model="base.COME_DATE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                                <FormItem label="计划完工日期:" style="width:30%;">
                <Input type="text" v-model="base.PLAN_END_DATE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
       </Form>
       <Form ref="formInline" v-if="tem == 1"  slot="content" :label-width="120">
          <FormItem v-if="base.FAULT_DESC != ''" label="故障描述:">
              <Input type="textarea" v-model="base.FAULT_DESC"  placeholder="请输入故障描述"> </Input>
          </FormItem>
          <FormItem v-if="base.CUSTOMER_INFO != ''" label="客诉内容:">
              <Input type="textarea" v-model="base.CUSTOMER_INFO"  placeholder="请输入客诉内容"> </Input>
          </FormItem>
              <FormItem v-if="base.REPAIR_INFO !=''" label="客诉内容:">
              <Input type="textarea" v-model="base.REPAIR_INFO"  placeholder="请输入客诉内容"> </Input>
          </FormItem>
       </Form>
              <Form v-if="tem == 2"   slot="content" :label-width="120" inline class="detail-form">
                <FormItem label="退货供应商:" style="width:30%;">
                <Input type="text" v-model="retire.SUPPLIER_NAME"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                               <FormItem label="退货日期:" style="width:30%;">
                <Input type="text" v-model="retire.RETURN_DATE"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                               <FormItem label="退货原因:" style="width:30%;">
                <Input type="text" v-model="retire.RETURN_REASON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                               <FormItem label="退货人:" style="width:30%;">
                <Input type="text" v-model="retire.RETURN_PERSON"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
                               <FormItem label="原始采购单:" style="width:30%;">
                <Input type="text" v-model="retire.RETURN_NO"  style="min-width: 100%;" :readonly="true"> </Input>
                </FormItem>
              </Form>
      </Panel>
    </Collapse>
    <div v-if="combo.length > 0 && tem == 1">
    <div class="r-list-header">
      <h1>维修项目</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns"
      :data="combo"
      stripe
      border
    ></Table>
  </div>
    <div v-if="projectcombo.length > 0 && tem == 1">
        <div class="r-list-header">
          <h1>维修项目套餐</h1>
        </div>
        <Table
          class="main-table"
          ref="tablesMain"
          :columns="columns2"
          :data="projectcombo"
          stripe
          border
        ></Table>
    </div>
    <div v-if="partsobj.length > 0 && tem == 1">
    <div class="r-list-header">
      <h1>维修配件</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns1"
      :data="partsobj"
      stripe
      border
    ></Table>
   </div>
   <!-- 其余项目 -->
       <div v-if="other.length > 0 && tem == 1">
    <div class="r-list-header">
      <h1>其他费用</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns3"
      :data="other"
      stripe
      border
    ></Table>
   </div>
   <!-- 其余项目结束 -->
   <!-- 退货维修配件 -->
   <div v-if="tem == 2">
  <div class="r-list-header">
      <h1>采购配件明细</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns4"
      :data="retirepj"
      stripe
      border
    ></Table>
  </div>
  <!-- 退货维修配件 -->
  <!-- 退货收款信息 -->
     <div v-if="tem == 2">
  <div class="r-list-header">
      <h1>收款信息</h1>
    </div>
    <Table
      class="main-table"
      ref="tablesMain"
      :columns="columns5"
      :data="info"
      stripe
      border
    ></Table>
  </div>
  <!-- 退货收款信息结束 -->
    <div class="r-list-money" v-if="tem == 1">
      <p>
        维修项目费用：
        <span>{{base.REPAIR_ITEM_MONEY}}元</span>
         + 维修配件费用：
         <span>{{base.REPAIR_PART_MONEY}}元</span>
          - 维修项目优惠金额：
          <span>{{base.REPAIR_ITEM_DERATE_MONEY}}</span>
           - 配件优惠金额：
          <span>{{base.REPAIR_PART_DERATE_MONEY}}</span>
          </InputNumber>= 合计应收金额：
          <span class="r-list-money-reset">{{base.SUM_MONEY}}元</span>
      </p>
    </div>
        <div class="r-list-money" v-if="tem == 1">
      <p>
        结算单号：
        <span>{{accountType.COLLECTION_NO}}</span>
         结算方式一:
         <span>{{getName(this.paytype,accountType.PAYMENT1)}}</span>
          结算方式二:
          <span>{{getName(this.paytype,accountType.PAYMENT2)}}</span>
          结算时间:
          <span class="r-list-money-reset">{{accountType.OUT_DATE}}元</span>
      </p>
    </div>

    <div slot="footer" style="text-align: center; font-size: 18px;">
    <div v-if="tem == 2" style="float:left;">合计金额:<span style="color:red;"><b>{{retire.RETURN_MONEY}}</b></span></div>
    <Button type="primary" @click="showModal = false">返回</Button>
    </div>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import { formatDate } from '@/libs/tools.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'

	export default {
		name: "finance-bill",
    components: {commonModal6},
    data(){
      return{
        parts:'',
        partsobj:[],
        tem:'',
        combo:[],
        accountType:[],
        projectcombo:[],
        serviceId:'',
        base:'',
        retire:[],//采购退货
        retirepj:[],//采购配件明细
        info:[],//收款信息
        other:[],
        showModal:false,
        columns: [
          {title: '序号',  minWidth: 100,type:"index",
          },
          {title: '维修项目名称', key: 'NAME', sortable: true, minWidth: 200,
            // render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.ORDER_TYPE))
          },
          {title: '标准工时', key: 'REPAIR_TIME', sortable: true, minWidth: 150},
          {title: '标准金额', key: 'REPAIR_MONEY', sortable: true, minWidth: 150},
          {title: '油漆面数', key: 'PAINT_NUM', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'ITEM_MONEY', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150},
          {title: '车间班组', key: 'WORK_CLASS_NAME', sortable: true, minWidth: 150},
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150}
        ],
        columns1: [
          {title: '序号',  minWidth: 100,type:'index',},
          {title: '配件编号', key: 'PART_NO', sortable: true, minWidth: 200,},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 150},
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 150,
            render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))
          },
          {title: '单价', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '小计金额', key: 'PART_MONEY', sortable: true, minWidth: 150,},
          {title: '优惠金额', key: 'PART_DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'PART_LAST_MONEY', sortable: true, minWidth: 150,},
                    {title: '是否为托修方自配部件', key: 'IS_SELF', sortable: true, minWidth: 200,
             render: (h, params) => h('span', this.isSelf(params.row.IS_SELF))
          },
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150},
        ],
        //维修项目套餐
        columns2: [
          {title: '序号',  minWidth: 80,type:'index',},
          {title: '项目套餐名称', key: 'GROUP_NAME', sortable: true, minWidth: 200,},
          {title: '套餐价格', key: 'SALES_PRICE', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'ITEM_DERATE_MONEY', sortable: true, minWidth: 150},
          {title: '优惠后金额', key: 'ITEM_LAST_MONEY', sortable: true, minWidth: 150},
          {title: '车间班组', key: 'WORK_CLASS_NAME', sortable: true, minWidth: 150},
          {title: '备注', key: 'REMARK', sortable: true, minWidth: 150},
        ],
          columns3: [
          {title: '项目1', key: 'REPAIR_ITEM1', sortable: true, minWidth: 200,},
          {title: '金额', key: 'REPAIR_MONEY1', sortable: true, minWidth: 150},
          {title: '项目2', key: 'REPAIR_ITEM2', sortable: true, minWidth: 150},
          {title: '金额', key: 'REPAIR_MONEY2', sortable: true, minWidth: 150},
          {title: '项目3', key: 'REPAIR_ITEM3', sortable: true, minWidth: 150},
          {title: '金额', key: 'REPAIR_MONEY3', sortable: true, minWidth: 150},
          {title: '项目4', key: 'REPAIR_ITEM4', sortable: true, minWidth: 150},
          {title: '金额', key: 'REPAIR_MONEY4', sortable: true, minWidth: 150},
        ],
          columns4: [
          {title: '序号',  minWidth: 80,type:'index'},
          {title: '仓库', key: 'STORE_NAME', sortable: true, minWidth: 150},
          {title: '配件名称', key: 'NAME', sortable: true, minWidth: 150},
          {title: '原厂编号', key: 'FACTORY_NO', sortable: true, minWidth: 150},
          {title: '数量', key: 'PART_NUM', sortable: true, minWidth: 150},
          {title: '单位', key: 'UNIT', sortable: true, minWidth: 150,
          render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.UNIT))},
          {title: '品牌', key: 'BRAND', sortable: true, minWidth: 150,
          render: (h, params) => h('span', getName(this.$store.state.app.dict, params.row.BRAND))
          },
          {title: '退货单价', key: 'PURCHASE_PRICE', sortable: true, minWidth: 150,},
          {title: '退款金额', key: 'SUM_MONEY', sortable: true, minWidth: 150},
        ],
          columns5: [
          {title: '应付金额', key: 'REAL_MONEY', sortable: true, minWidth: 150},
          {title: '优惠金额', key: 'LESS_MONEY', sortable: true, minWidth: 150},
          {title: '结算方式一', key: 'PAYMENT1', sortable: true, minWidth: 150,
          render: (h, params) => h('span', getName(this.paytype, params.row.PAYMENT1))
          },
          {title: '计算方式一金额', key: 'MONEY1', sortable: true, minWidth: 150},
          {title: '结算方式二', key: 'PAYMENT2', sortable: true, minWidth: 150,
          render: (h, params) => h('span', getName(this.paytype, params.row.PAYMENT2))
          },
          {title: '结算方式二金额', key: 'MONEY2', sortable: true, minWidth: 150},
          {title: '收款时间', key: 'CREATE_TIME', sortable: true, minWidth: 150,},
          {title: '收款人', key: 'FOLLOW_PERSON', sortable: true, minWidth: 150},
        ],
        collapse: '1',
        titleMsg:'',
      }
    },
    props:['showDetail', 'detailData'],
    watch:{
      showDetail(){
      this.showModal = true;
      },
      detailData(){
      this.serviceId = this.detailData.RECORD_ID;
      this.getInfo();
      }
    },
    mounted () {

    },
    computed:{
      paytype(){
       return getDictGroup(this.$store.state.app.dict,'1010');
      }
    },
    methods:{
      getName(a,b){
        return getName(a,b);
      },
      isSelf(type){
      if(type){
        return '是';
      }else{
        return '否';
      }
      },
      getInfo(){
        switch(this.detailData.RECORD_TYPE){
          case '10271001':
          this.tem = 1;
          //维修工单
                      // 获取详情头部
          this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/get_info',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 detail_id:this.serviceId
                }
        }).then(res => {
          if (res.success === true) {
          this.base = res.data;
              this.base.REPAIR_TYPE = getName(this.$store.state.app.dict,this.base.REPAIR_TYPE);
              this.base.VEHICLE_TYPE = getName(this.$store.state.app.dict,this.base.VEHICLE_TYPE);
              this.titleMsg = getName(this.$store.state.app.dict,this.base.STATUS);
          }
        })
     // 获取详情维修配件
     // tenant/repair/ttrepairworkorder/getParts
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getParts',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:this.serviceId
                }
        }).then(res => {
          if (res.success === true) {
              this.partsobj = res.data;
          }
        })
    //获取项目
    // /tenant/repair/ttrepairworkorder/getItems
            this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getItems',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:this.serviceId
                }
        }).then(res => {
          if (res.success === true) {
              this.combo = res.data;
              console.log(this.combo);
          }
        })
   //获取项目套餐
   ///tenant/repair/ttrepairworkorder/getItemGroups
               this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getItemGroups',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:this.serviceId
                }
        }).then(res => {
          if (res.success === true) {
          this.projectcombo = res.data;
          }
        })
   //获得其余项目 /tenant/repair/ttrepairworkorder/getOtherItems
        this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getOtherItems',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:this.serviceId
                }
        }).then(res => {
          if (res.success === true) {
          this.other = res.data;
          }
        })
   //结算方式 /tenant/repair/ttrepairworkorder/getAccounts
           this.axios.request({
          url: '/tenant/repair/ttrepairworkorder/getAccounts',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 limit:25,
                 page:1,
                 repairId:this.serviceId
                }
        }).then(res => {
          if (res.success === true) {
          this.accountType = res.data;
          }
        })
          break;
          case '10271004':
          this.tem = 2;
          //获取采购退货详情tenant/part/tt_part_purchase_return/get_info
          this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/get_info',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 detail_id:this.serviceId,
                }
        }).then(res => {
          if (res.success === true) {
          this.retire = res.data;
          }
        })
        //获取退货配件/tenant/part/tt_part_purchase_return/part_info
        this.axios.request({
          url: '/tenant/part/tt_part_purchase_return/part_info',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 return_id:this.serviceId,
                }
        }).then(res => {
          if (res.success === true) {
          this.retirepj = res.data;
          }
        })
       //收款信息/tenant/finance/finance_account/collect_list
         this.axios.request({
          url: '/tenant/finance/finance_account/collect_list',
          method: 'post',
          data: {access_token: this.$store.state.user.token,
                 RECORD_ID_eq:this.serviceId,
                 RECORD_TYPE_eq:this.detailData.RECORD_TYPE,
                 page:1,
                 limit:25,
                }
        }).then(res => {
          if (res.success === true) {
          this.info = res.data;
          }
        })
          break;
          case '10271002':
          //配件销售收入
          this.tem = 3;
          break;
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
</style>
