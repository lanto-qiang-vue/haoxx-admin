<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick"
                ref="table"
  class="discounts-list">
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
      <Button type="primary" @click="clickCreate">优惠券生成</Button>
      <Button type="info" @click="showModal=true;" :disabled="!detail.id">查看/编辑</Button>
      <Button type="success" @click="showGive= true" :disabled="!detail.id">发放</Button>
      <Button type="error" @click="del" :disabled="!detail.id">删除</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height discounts-modal"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="优惠券详情" @clickBack="showModal=false"></modal-title>
      <Form :label-width="100" class="common-form" :model="detail" :rules="detailRule"
            ref="detail" style="padding-left: 10px">
        <FormItem label="优惠券名称:" prop="name">
          <Input v-model="detail.name"/>
        </FormItem>

        <FormItem label="优惠券用途:" prop="type">
          <Select placeholder="请选择" v-model="detail.type" style="padding-right: 40px">
            <Option v-for="(item, index) in useList"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
          <a @click="showAddUse=true" style="position: absolute;right: 0">添加</a>
        </FormItem>
        <FormItem label="优惠券类型:" prop="userType">
          <Select placeholder="请选择" v-model="detailuserType">
            <Option v-for="(item, index) in typeList"
                    :key="index" :value="item.code">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="detail.userType &&discountObj[detail.userType]"
                  :label="discountObj[detail.userType].name" prop="discount">
          <!--<Input v-model="detail.discount" type="number"/>-->
          <InputNumber v-model="detail.discount" class="detail-discount"></InputNumber>
          <span class="unit">{{discountObj[detail.userType].unit}}</span>
        </FormItem>
        <FormItem label="优惠券使用规则说明:" prop="content" style="width: 90%">
          <Input type="textarea" :rows="15" v-model="detail.content" wrap="hard"/>
        </FormItem>
      </Form>

      <!---->
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button v-show="!detail.id" type="primary" @click="create">提交</Button>
        <Button v-show="detail.id" type="primary" @click="edit">修改</Button>
      </div>
    </Modal>

    <Modal
      v-model="showGive"
      class="table-modal-detail full-height discounts-modal"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="优惠券发放" @clickBack="showGive=false"></modal-title>
      <Form :label-width="120" class="" >
        <FormItem label="优惠券:">
          <span>{{detail.name}}</span>
        </FormItem>
        <FormItem label="发放数量:">
          <InputNumber  v-model="give.num"/>
        </FormItem>
        <FormItem label="使用有效期:">
          <DatePicker type="daterange"  format="yyyy-MM-dd" placeholder="请选择" v-model="give.daterange"
                      ></DatePicker>
        </FormItem>
        <FormItem >
          <div><Checkbox v-model="give.iswriteoff">是否门店核销</Checkbox><div v-show="give.iswriteoff"><b>*</b>选择适用门店:已选0家<a @click="showStore=Math.random()">添加/编辑</a><a @click="$refs.upStore.open()">导入门店</a></div></div>
        </FormItem>
        <FormItem >
          <Checkbox v-model="give.isleadinuser">是否从保险公司导入会员</Checkbox>
          <div v-show="give.isleadinuser">
            <Select placeholder="选择保险公司" v-model="give.insuranceId" style="width: 200px">
              <Option v-for="(item, index) in typeList"
                      :key="index" :value="item.code">{{item.name}}
              </Option>
            </Select>
            <a @click="$refs.excel.show=true">导入会员</a><span>已导入0人</span>
        </div>
        </FormItem>
        <FormItem >
          <Checkbox v-model="give.way" style="float:left;">是否需自行领取</Checkbox>
          <div v-show="give.way">
            <div><b style="color:red;">*</b>可领取日期区间:</div>
            <div>
              <DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder="开始日期-结束日期"></DatePicker>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showGive=false">取消</Button>
        <Button type="primary" @click="toGive">发放</Button>
      </div>
    </Modal>

    <Modal
      v-model="showAddUse"
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
        <Button @click="showAddUse=false">取消</Button>
        <Button type="primary" @click="addOption">提交</Button>
      </div>
    </Modal>
    <!---->
    <select-store :showType="showStore" :checkId="checkId"></select-store>

    <upload-modal ref="upStore" @template="getStoreTep"></upload-modal>
    <!--<upload-excel ref="excel"></upload-excel>-->

  </common-table>
</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import selectStore from '@/hxx-components/select-store.vue';
import UploadModal from '@/hxx-components/upload-modal.vue'
// import UploadExcel from '@/hxx-components/upload-excel.vue'
import ModalTitle from '@/hxx-components/modal-title.vue'
import {deepClone, getDictGroup} from "@/libs/util";
let detail={
    type:'',
    userType:'',
    name:'',
    discount: null,
    content: '',
}
export default {
    name: "discounts-list",
    components: {commonTable, ModalTitle,selectStore, UploadModal},
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
        showGive:false,
        checkId:[],
        useData:{
          name:'',
        },
        detail: deepClone(detail),
        give:{
          way: false,
          iswriteoff: false,
          isleadinuser: false,
          insuranceId: ''
        },

        useRule:{
          name: rule,
        },
        showAddUse:false,
        showStore:false,
        showModal: false,
        tableData: [],
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },

        rules: {
          name: rule,
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
      discountObj(){
        return {
          "10561002": {
            name: '支付',
            unit: '元',
          },
          "10561003": {
            name: '折扣',
            unit: '折',
          },
          "10561004": {
            name: '抵扣',
            unit: '元',
          },
        }
      },
      detailRule(){
        let rule= {required:true,message:'必填项不能为空'}
        return  {
          type:[rule],
          userType:[rule],
          name:[rule],
          discount: { validator:(rule, value, callback) => {
             if(this.discountObj[this.detail.userType] && !value){
               callback(new Error('必填项不能为空'));
             }else{
               callback();
             }
            }
          },
          content: [rule],
        }
      },
      detailuserType: {
        get(){
          return this.detail.useType? this.detail.useType.toString(): ''
        },
        set(val){
          this.detail.useType= val
        },
      },
      columns(){
        return [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          // {title: '操作', key: 'name', minWidth: 120,
          //   render:(h,params) => {
          //     return h('div',{style:{textAlign:'center'},
          //     },[h('a',{style:{marginRight:'10px'},on:{click:()=>{
          //           this.stage = 2;
          //           this.title = "发放优惠券";
          //           this.showModal = true;
          //           // alert("发放");
          //         }
          //       }},'发放'),h('a',{on:{click:()=>{
          //           alert("删除");
          //         }}},'删除')]);
          //   }
          // },
          {title: '券名称', key: 'name', minWidth: 140},
          {title: '用途', key: 'useType', minWidth: 100, render:(h,params) => {
            // console.log(' this.useObj[params.row.useType]', this.useObj[params.row.type])
              return h('div',  this.useObj[params.row.type]);
            }},
          {title: '类型', key: 'type', minWidth: 100, render:(h,params) => {
              // console.log(' this.typeObj[params.row.useType]', this.typeObj[params.row.useType])
              return h('div',  this.typeObj[params.row.useType]);
            }},
          {title: '创建时间', key: 'createDate', minWidth: 200},
          {title: '创建人', key: 'userCode', minWidth: 100},
        ]
      } ,
    },
    mounted() {
      this.showTable = Math.random();
      this.getType();
      this.getList();
    },
    watch:{
      showAddUse(val){
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
      clickCreate(){
        this.$refs.table.clearCurrentRow()
        this.detail= deepClone(detail)
        this.$refs.detail.resetFields()
        this.showModal= true
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
                this.showAddUse = false;
              }
            })
          }else{
          this.$Message.error("请输入必填项");
          }
        });
      },
      create(){
        this.$refs.detail.validate(validator=>{
          if(validator){
            if(parseInt(this.detail.useType) ==10561003 && this.detail.discount>1){
              this.detail.discount= this.detail.discount/100
            }
            this.axios.post('/manage/cupon/createCoupon', {data: this.detail},{baseURL: '/poxy-shqx/'}).then( (res) => {
               // console.log(res)
              if(res.success){
                 this.showModal= false
                  this.getList()
              }
            })
          }
        })
      },
      edit(){

      },
      del(){
        this.$Modal.confirm({
          title: '确定删除？',
          onOk:()=>{
            this.axios.post('/manage/cupon/deleteProvideCoupon', {data: this.detail},{baseURL: '/poxy-shqx/'}).then( (res) => {
              // console.log(res)
              if(res.success){
                this.$Message.success("删除成功");
                this.getList()
              }
            })
          }
        })
      },
      toGive(){

      },
      onRowClick(item) {
        // console.log(item);
        this.detail = item;
      },
      getList() {
        this.detail= {}
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
      getStoreTep(){
        window.location.href =  '/api/common/basedata/carlive/tenantTemple?access_token='+this.$store.state.user.token
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
.discounts-list{
  .detail-discount{
    input{
      text-align: left;
    }
    .ivu-input-number-handler-wrap{
      display: none;
    }
  }
  .unit{
    position: absolute;
    right: 10px;
  }
}
</style>

