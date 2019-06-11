<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/门店名称/兑换码"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder="未知时间1"
                    style="width:100%;"></DatePicker>
      </div>
      <div class="search-block">
        <Select placeholder="请选择卷用途">
          <Option v-for="(item, index) in stateList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select placeholder="请选择卷类型">
          <Option v-for="(item, index) in stateList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="primary" @click="stage=1;showModal=true;title='优惠券生成'">优惠券生成</Button>
      <Button type="info" @click="stage=1;showModal=true;title='优惠券修改'">修改</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height discounts-modal"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="stage==2"
      :transition-names="['', '']">
      <modal-title slot="header" :title="title" @clickBack="showModal=false"></modal-title>
      <Form :label-width="170" class="form-3" v-show="stage == 1">
        <FormItem label="优惠券名称:" prop="PLATE_NUM" style="width:30%">
          <Input/>
        </FormItem>
        <FormItem label="优惠用途:" prop="PLATE_NUM" style="width:30%">
          <Select placeholder="请选择卷用途" v-model="detail.use">
            <Option v-for="(item, index) in useList"
                    :key="index" :value="item.name">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem :label-width="0" style="width:50px;">
          <a @click="checkModal=true">&nbsp;添加&nbsp;</a>
        </FormItem>
        <FormItem label="优惠券类型:" prop="PLATE_NUM" style="width:30%">
          <Select placeholder="请选择卷用途">
            <Option v-for="(item, index) in stateList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="优惠券使用规则说明:"  style="width:calc(90% + 50px)">
          <Input type="textarea" :rows="15"/>
        </FormItem>
      </Form>
      <!--发放优惠券-->
      <Form :label-width="120" class="form-3" v-show="stage == 2">
      <FormItem label="优惠券名称:" style="width:30%">
        <Select placeholder="请选择卷类型" filterable value="">
          <Option v-for="(item, index) in stateList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="发放数量:"  style="width:30%">
       <InputNumber style="width:100%"/>
      </FormItem>
      <FormItem label="使用有效期:"  style="width:30%">
          <DatePicker type="daterange"  format="yyyy-MM-dd" placeholder="未知时间2"
                      style="width:100%;"></DatePicker>
      </FormItem>
      </Form>
      <div style="padding-left:30px;font-size:14px;">
        <div style="line-height:40px;"> <Checkbox v-model="oneModal" style="float:left;">是否门店消核</Checkbox><div style="float:left" v-show="oneModal">&nbsp;&nbsp;<b style="color:red;">*</b>选择适用门店:已选0家&nbsp;&nbsp;&nbsp;&nbsp;<a @click="showType=Math.random()">添加/编辑</a>&nbsp;&nbsp;<a>导入门店</a></div></div>
        <!--<div style="clear:both;"></div>-->
        <!--<div><Checkbox :value="twoModal">是否从保险公司导入会员</Checkbox></div>-->
        <!--<div><Checkbox :value="threeModal">是否需自行领取</Checkbox></div>-->
      </div>
      <!---->
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary">提交</Button>
      </div>
    </Modal>

    <!--下拉框添加用途-->
    <Modal
      v-model="checkModal"
      width="400px"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']"
       title="添加优惠券用途"
    >
        <Form :label-width="80" :model="useData" ref="useData" :rules="useRule">
          <FormItem label="用途:" prop="name">
            <Input v-model="useData.name"/>
          </FormItem>
        </Form>
      <div slot="footer">
        <Button @click="checkModal=false">取消</Button>
        <Button type="primary" @click="addOption">提交</Button>
      </div>
    </Modal>
    <!---->
    <select-store :showType="showType" :checkId="checkId"></select-store>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import selectStore from '@/hxx-components/select-store.vue';
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {deepClone} from "../../libs/util";
  let useList = [
    {name:'请选择'},
    {name:'洗车类'},
    {name:'保养类'},
    {name:'油漆类'}
  ]
  export default {
    name: "discounts-list",
    components: {commonTable, ModalTitle,selectStore},
    data() {
      return {
        oneModal:false,
        checkId:[2,3,7],
        twoModal:false,
        threeModal:false,
        title:'优惠券详情',
        useData:{
          name:'',
        },
        detail:{
          use:'请选择',
        },
        useRule:{
          name:{required:true,message:'用途必填'},
        },
        stage:1,
        use:'请选择',
        useList:[
          {name:'请选择'},
          {name:'洗车类'},
          {name:'保养类'},
          {name:'油漆类'}
        ],
        checkModal:false,
        showType:false,
        showModal: false,
        tableData: [],
        stateList: [
          {id: 1, name: '这是？'}
        ],
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '操作', key: 'name', minWidth: 120,
          render:(h,params) => {
             return h('div',{style:{textAlign:'center'},
             },[h('a',{style:{marginRight:'10px'},on:{click:()=>{
                    this.stage = 2;
                   this.title = "发放优惠券";
                   this.showModal = true;
                   // alert("发放");
                 }
               }},'发放'),h('a',{on:{click:()=>{
                 alert("删除");
                 }}},'删除')]);
          }
          },
          {title: '优惠卷名称', key: 'A', minWidth: 140},
          {title: '卷用途', key: 'B', minWidth: 140},
          {title: '卷类型', key: 'C', minWidth: 140},
          {title: '生成时间', key: 'D', minWidth: 140},
          {title: '生成操作人', key: 'E', minWidth: 140},
        ],
        rules: {
          name: {required: true, message: '产品名称必填'},
        },
        total: 0,
        showTable: false,
        clearType: false,
        page: 1,
        limit: 25,
      }
    },
    mounted() {
      this.stage = 2;
      this.title = "发放优惠券";
      this.showModal = true;
      this.showTable = Math.random();
      this.getList();
    },
    watch:{
      checkModal(val){
        if(val){
          this.$refs.useData.resetFields();
        }
      },
      showModal(val){
        if(val){
          this.useList = deepClone(useList);
        }
      }
    },
    methods: {
      addOption(){
        this.$refs.useData.validate(validator=>{
          if(validator){
            this.useList.push({name:this.useData.name});
             this.detail.use = this.useData.name;
             this.checkModal = false;
          }else{
          this.$Message.error("请校对必填字段!");
          }
        });
      },
      onRowClick(list) {
        console.log(list);
        this.list = list;
      },
      getList() {
         this.tableData.push({A:'A',B:'B',C:'C',D:'D',E:'E'});
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        console.log("changePage");
        this.page = page;
        this.getList();
      }
    },
  }
</script>
<style lang="less">
  .discounts-modal .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body {
    height: ~'calc(100% - 45px)';
  }

  .discounts-modal .form-3 {
    padding-top: 20px;
  }

  .discounts-modal .form-3 .ivu-form-item {
    width: 30%;
    display: inline-block;
    margin-bottom: 15px;
  }
</style>

