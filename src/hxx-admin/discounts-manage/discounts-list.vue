<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/门店名称/兑换码" v-model="query.keyWord" clearable></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder="创建日期" clearable
                    style="width:100%;" @on-change="queryDateC"></DatePicker>
      </div>
      <div class="search-block">
        <Select placeholder="请选择用途" clearable v-model="query.type">
          <Option v-for="(item, index) in useList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select placeholder="请选择类型" clearable v-model="query.useType">
          <Option v-for="(item, index) in typeList"
                  :key="index" :value="item.code">{{item.name}}
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
      <Button type="info" @click="stage=1;showModal=true;title='优惠券修改'" :disabled="true">修改</Button>
      <Button type="success" @click="" :disabled="true">发放</Button>
      <Button type="error" @click="" :disabled="true">删除</Button>
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
      <Form :label-width="100" class="common-form" v-show="stage == 1" :model="detail" :rules="detailRule"
            ref="detail" style="padding-left: 10px">
        <FormItem label="优惠券名称:" prop="name" style="width:30%">
          <Input v-model="detail.name"/>
        </FormItem>
        <FormItem label="优惠券用途:" prop="userType" style="width:30%">
          <Select placeholder="请选择用途" v-model="detail.userType">
            <Option v-for="(item, index) in useList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem :label-width="0" style="width:50px;">
          <a @click="checkModal=true">添加</a>
        </FormItem>
        <FormItem label="优惠券类型:" prop="type" style="width:30%">
          <Select placeholder="请选择" v-model="detail.type">
            <Option v-for="(item, index) in typeList"
                    :key="index" :value="item.code">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="优惠券使用规则说明:" prop="content" style="width: 90%">
          <Input type="textarea" :rows="15" v-model="detail.content" wrap="hard"/>
        </FormItem>
      </Form>
      <!--发放优惠券-->
      <Form :label-width="120" class="form-3" v-show="stage == 2">
      <FormItem label="优惠券名称:" style="width:30%">
        <Select placeholder="请选择卷类型" filterable value="">
          <Option v-for="(item, index) in typeList"
                  :key="index" :value="item.code">{{item.name}}
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
        <FormItem style="width:100%;">
          <div style="line-height:40px;"><Checkbox v-model="oneModal" style="float:left;">是否门店消核</Checkbox><div style="float:left" v-show="oneModal"><b style="color:red;">*</b>选择适用门店:已选0家<a @click="showType=Math.random()">添加/编辑</a><a>导入门店</a></div></div>
        </FormItem>
      <FormItem style="width:100%;">
    <Checkbox v-model="twoModal" style="float:left;">是否从保险公司导入会员</Checkbox><div style="float:left;" v-show="twoModal"><a style="float:left;padding-left:20px;">导入会员</a><span style="float:left;padding-left:10px;">已导入0人</span>
          <div style="float:left;width:200px;padding-left:20px;">
            <Select placeholder="请选择保险公司名称">
              <Option v-for="(item, index) in typeList"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
          </div>
        </div>
      </FormItem>
        <FormItem style="width:100%;">
          <Checkbox v-model="threeModal" style="float:left;">是否需自行领取</Checkbox>
          <div style="float:left;" v-show="threeModal">
            <div style="float:left;padding-left:20px;"><b style="color:red;">*</b>可领取日期区间:</div>
            <div style="float:left;width:250px;padding-left:20px;">
              <DatePicker type="daterange" style="width:100%;" :options="option" format="yyyy-MM-dd" placeholder="开始日期-结束日期"></DatePicker>
            </div>
          </div>
        </FormItem>
      </Form>
      <!---->
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary" @click="create">提交</Button>
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
       title="添加优惠券用途">
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
import {deepClone, getDictGroup} from "@/libs/util";
export default {
    name: "discounts-list",
    components: {commonTable, ModalTitle,selectStore},
    data() {
      let rule= {required:true,message:'必填项不能为空'}
      return {
        query:{
          keyWord: '',
          startTime_eq: '',
          endTime_eq: '',
          type: '',
          useType: '',
        },
        useList: [],
        oneModal:false,
        checkId:[],
        twoModal:false,
        threeModal:false,
        title:'优惠券详情',
        useData:{
          name:'',
        },
        detail:{
          type:'',
          userType:'',
          name:'',
          discount: 0,
          content: '',
        },
        detailRule: {
          type:[rule],
          userType:[rule],
          name:[rule],
          discount: [],
          content: [rule],
        },
        useRule:{
          name:{required:true,message:'用途必填'},
        },
        stage:1,
        use:'请选择',
        checkModal:false,
        showType:false,
        showModal: false,
        tableData: [],
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },

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
    computed:{
      typeList(){
        return getDictGroup(this.$store.state.app.dict, '1056');
      },
      useObj(){
        let obj= {}
        for(let i in this.useList){
          obj[this.useList[i].id]= this.useList[i].name
        }
        return obj
      },
      typeObj(){
        let obj= {}
        for(let i in this.typeList){
          obj[this.typeList[i].code]= this.typeList[i].name
        }
        return obj
      },
      columns(){
        return [
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
          {title: '券名称', key: 'name', minWidth: 140},
          {title: '用途', key: 'useType', minWidth: 140, render:(h,params) => {
            console.log(' this.useObj[params.row.useType]', this.useObj[params.row.useType])
              return h('div',  this.useObj[params.row.useType]);
            }},
          {title: '类型', key: 'type', minWidth: 140},
          {title: '创建时间', key: 'D', minWidth: 140},
          {title: '创建人', key: 'E', minWidth: 140},
        ]
      } ,
    },
    mounted() {
      this.stage=1;
      this.showTable = Math.random();
      this.getType();
      this.getList();
    },
    watch:{
      checkModal(val){
        if(val){
          this.$refs.useData.resetFields();
        }
      },
    },
    methods: {
      queryDateC(val){
        // console.log(val)
        this.query.startTime_eq= val[0]
        this.query.endTime_eq= val[1]
      },
      getType(){
        this.axios.request({
          baseURL: '/poxy-shqx/',
          url: '/manage/cupon/typeList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
          }
        }).then(res => {
          if (res.success == true) {
            this.useList = res.data;
          }
        })
      },
      addOption(){
        this.$refs.useData.validate(validator=>{
          if(validator){
            this.axios.request({
              baseURL: '/poxy-shqx/',
              url: '/manage/cupon/insertType',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                name:this.useData.name,
              }
            }).then(res => {
              if (res.success == true) {
                this.getType();
                this.checkModal = false;
              }
            })
          }else{
          this.$Message.error("请校对必填字段!");
          }
        });
      },
      create(){
        this.$refs.detail.validate(validator=>{
          if(validator){
            this.axios.post('/manage/cupon/createCoupon', {data: this.detail},{baseURL: '/poxy-shqx/'}).then( (res) => {
               console.log(res)
              if(res.success){
                 this.showModal= false
                  this.getList()
              }
            })
          }
        })
      },
      onRowClick(item) {
        // console.log(item);
        this.detail = item;
      },
      getList() {
        this.axios.post('/manage/cupon/queryProvideCouponList', {
          ...this.query,
          limit:this.limit,
          page:this.page,
        },{baseURL: '/poxy-shqx/'}).then( (res) => {
          console.log(res)
          if(res.success){
            this.total= res.total
            this.tableData= res.data
          }
        })
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
  /*height: ~'calc(100% - 45px)';*/
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

