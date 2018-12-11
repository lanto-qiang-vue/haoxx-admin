<!-- 维修记录 -->
<template>
  <Modal
    v-model="showModal"
    @on-visible-change="visibleChange"
    width="80"
    class="table-modal-detail"
    :mask-closable="false"
    :scrollable="true"
    :transfer= "true"
    :footer-hide="false"
    :transition-names="['', '']"
  >
    <!--<div style="font-size: 18px;text-align: right;color: red;padding-right: 30px;">{{titleMsg}}</div>-->
      <!--<div style="height: 100%;overflow: auto; padding-bottom: 30px;padding-top:10px;">-->
        <!--<div class="status">({{titleMsg}})</div>-->
    <div slot="header" style="line-height:42px;">
      <span style="color:white;">维修记录</span><span style="color:red;">({{titleMsg}})</span>
    </div>
    <Collapse v-model="collapse">
      <Panel name="1">详情
       <Form ref="listSearch"   slot="content" :label-width="120" inline class="detail-form">
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
       <Form ref="formInline"  slot="content" :label-width="120">
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
      </Panel>
    </Collapse>
    <div v-if="combo.length > 0">
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
    <div v-if="projectcombo.length > 0">
        <div class="r-list-header">
          <h1>维修项目套餐</h1>
        </div>
        <Table
          class="main-table"
          ref="tablesMain"
          :columns="columns2"
          :data="projectcombo"
          @on-row-dblclick="dbclick"
          stripe
          border
        ></Table>
    </div>
    <div v-if="partsobj.length > 0">
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
    <div class="r-list-money">
      <p style="float:left;">
        <span class="bold">合计应收金额：<span>{{base.SUM_MONEY}}元</span></span>=
        维修项目费用：
        <span>{{base.REPAIR_ITEM_MONEY}}元</span>
         + 维修配件费用：
         <span>{{base.REPAIR_PART_MONEY}}元</span>
          - 维修项目优惠金额：
          <span>{{base.REPAIR_ITEM_DERATE_MONEY}}</span>
           - 配件优惠金额：
          <span>{{base.REPAIR_PART_DERATE_MONEY}}</span>
      </p>
    </div>
    <!--</div>-->
    <combo-detail :tshow="tcshow" :tid="tcid"></combo-detail>
    <div slot="footer" style="text-align: center; font-size: 18px;">
    <Button type="primary" @click="showModal = false">返回</Button>
    </div>
  </Modal>

</template>

<script>
  import { getName, getDictGroup ,getUserInfo} from '@/libs/util.js'
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import { formatDate } from '@/libs/tools.js'
  import commonModal6 from '@/hxx-components/common-modal6.vue'
  import comboDetail from '@/hxx-components/combo-detail.vue'
	export default {
		name: "service-record",
    components: {commonModal6,comboDetail,ModalTitle},
    data(){
      return{
        parts:'',
        tcshow:false,
        tcid:'',
        partsobj:[],
        combo:[],
        projectcombo:[],
        serviceId:'',
        base:'',
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
      this.serviceId = this.detailData.REPAIR_ID;
      this.getInfo();
      }
    },
    mounted () {

    },
    methods:{
		  dbclick(row){
        this.tcshow = Math.random();
        this.tcid = row.GROUP_ID;
      },
      isSelf(type){
      if(type){
        return '是';
      }else{
        return '否';
      }
      },
      visibleChange(){
        this.$emit('clearsection');
      },
      getInfo(){
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
  .r-list-money {
    padding-top: 20px;
    margin-bottom: 20px;
    height: 30px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    span {
      color: red;
    }
    .bold{
      font-size: 14px;
      font-weight: 600;
      color: black;
    }
    .r-list-money-reset {
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
