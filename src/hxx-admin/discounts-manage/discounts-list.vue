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
      <Button type="info" @click="clickEdit" :disabled="!detail.id">查看/编辑</Button>
      <Button type="success" @click="clickGive" :disabled="!detail.id">发放</Button>
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
      <modal-title slot="header" title="优惠券详情" @clickBack="closeDetail"></modal-title>
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
        <FormItem label="优惠券类型:" prop="useType">
          <Select placeholder="请选择" v-model="detailuseType">
            <Option v-for="(item, index) in typeList"
                    :key="index" :value="item.code">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="detail.useType &&discountObj[detail.useType]"
                  :label="discountObj[detail.useType].name" prop="discount">
          <!--<Input v-model="detail.discount" type="number"/>-->
          <InputNumber v-model="detail.discount" class="detail-discount"></InputNumber>
          <span class="unit">{{discountObj[detail.useType].unit}}</span>
        </FormItem>
        <FormItem label="优惠券使用规则说明:" prop="content" style="width: 90%">
          <Input type="textarea" :rows="15" v-model="detail.content" wrap="hard"/>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="closeDetail">取消</Button>
        <Button v-show="!detail.id" type="primary" @click="create">提交</Button>
        <Button v-show="detail.id" type="primary" @click="edit" :disabled="isGive">修改</Button>
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
      <Form :label-width="120" ref="give" :model="give" :rules="giveRule" style="padding: 10px">
        <FormItem label="优惠券:">
          <span>{{detail.name}}</span>
        </FormItem>
        <FormItem label="发放数量:" prop="num">
          <InputNumber  v-model="give.num"/>
        </FormItem>
        <FormItem label="使用有效期:" prop="daterange">
          <DatePicker type="daterange"  format="yyyy-MM-dd" placeholder="请选择" v-model="give.daterange"
                      @on-change="changeGiveValidDate" style="width: 200px"
                      ></DatePicker>
        </FormItem>
        <FormItem label="是否门店核销:" prop="iswriteoff">
          <i-switch size="large" v-model="give.iswriteoff">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="选择适用门店:" v-show="give.iswriteoff" class="others" prop="storeUp">
          <Button type="success" @click="$refs.store.open()">添加</Button>
          <Button type="info" @click="$refs.upStore.open()">导入门店</Button>
          <span>已选{{(giveOthers.storeUpNum||0) + (giveOthers.storeSelNum||0)}}家</span>
        </FormItem>
        <FormItem label="是否从保险公司导入会员:" prop="isleadinuser">
          <i-switch size="large" v-model="give.isleadinuser">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="选择保险公司:" v-show="give.isleadinuser" prop="insuranceId" class="others">
          <Select placeholder="选择保险公司" v-model="give.insuranceId" style="width: 200px">
            <Option v-for="(item, index) in insuranceComs"
                    :key="index" :value="item.id">{{item.name}}
            </Option>
          </Select>
          <Button type="info" @click="clickUpUser">导入会员</Button>
          <span>已导入{{giveOthers.userNum}}人</span>
        </FormItem>
        <FormItem label="是否需自行领取:" prop="way">
          <i-switch size="large" v-model="give.way" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="可领取日期:" v-show="give.way" class="others" prop="getrange">
          <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="请选择日期" transfer
                      v-model="give.getrange" @on-change="changeGetDate"
                      style="width: 200px"></DatePicker>
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
    <select-store :selection="true" primaryKey="license" ref="store" v-model="checkedStore"
          @ok="selStoreOk"
    ></select-store>

    <upload-modal ref="upStore" title="导入门店" @template="getStoreTep" @ok="upStoreOk"></upload-modal>
    <upload-modal ref="upUser" title="导入会员" @template="getUserTep" @ok="upUserOk"></upload-modal>

  </common-table>
</template>
<script>
import commonTable from '@/hxx-components/common-table.vue'
import selectStore from '@/hxx-components/select-store.vue';
import UploadModal from '@/hxx-components/upload-modal.vue'
// import UploadExcel from '@/hxx-components/upload-excel.vue'
import ModalTitle from '@/hxx-components/modal-title.vue'
import {deepClone, getDictGroup} from "@/libs/util";
let detailInit={
    type:'',
    useType:'',
    name:'',
    discount: null,
    content: '',
    isGive: true
}
let giveInit={
    id: '',
    num: null,
    beginTime: '',
    endTime: '',
    way: 0,
    iswriteoff: false,
    isleadinuser: false,
    insuranceId: '',
    batch: '',
    daterange: [],
    getrange: [],
    wayBegintime: '',
    wayEndtime: '',
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
        insuranceComs:[],
        useList: [],
        showGive:false,

        useData:{
          name:'',
        },
        detail: deepClone(detailInit),
        give: deepClone(giveInit),
        giveOthers:{
          storeSelNum: 0,
          storeUpNum: 0,
          userNum: 0,
        },
        useRule:{
          name: rule,
        },
        showAddUse:false,
        showModal: false,
        checkedStore:[],
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
      isGive(){
        return this.detail.isGive
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
          useType:[rule],
          name:[rule],
          discount: { validator:(rule, value, callback) => {
             if(this.discountObj[this.detail.useType] && !value){
               callback(new Error('必填项不能为空'));
             }else{
               callback();
             }
            }
          },
          content: [rule],
        }
      },
      giveRule(){
        let rule= {required:true,message:'必填项不能为空'}
        return {
          num: rule,
          daterange: [rule, {
            validator:(rule, value, callback) => {
              if(!this.give.beginTime || !this.give.endTime){
                callback(new Error('必填项不能为空'));
              }else{
                callback();
              }
            }}],
          storeUp: {
            validator:(rule, value, callback) => {
              if(this.give.iswriteoff && !this.giveOthers.storeUpNum && !this.giveOthers.storeSelNum){
                callback(new Error('请选择或导入门店'));
              }else{
                callback();
              }
            }},
          insuranceId: {
            validator:(rule, value, callback) => {
              if(this.give.isleadinuser && !this.giveOthers.userNum){
                callback(new Error('请导入会员'));
              }else{
                callback();
              }
            }},
          getrange: {
            validator:(rule, value, callback) => {
              if(this.give.way && (!this.give.wayBegintime || !this.give.wayEndtime )){
                callback(new Error('请选择领取日期'));
              }else{
                if(new Date(this.give.wayEndtime) > new Date(this.give.endTime)){
                  callback(new Error('领取日期必须小于使用日期'));
                }else{
                  callback();
                }
              }
            }},
        }
      },
      detailuseType: {
        get(){
          return this.detail.useType? this.detail.useType.toString(): ''
        },
        set(val){
          // console.log(' set(val)', val)
          this.detail.useType= val
        },
      },
      columns(){
        return [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '券名称', key: 'name', minWidth: 140},
          {title: '用途', key: 'useType', minWidth: 100, render:(h,params) => {
              return h('div',  this.useObj[params.row.type]);
            }},
          {title: '类型', key: 'type', minWidth: 100, render:(h,params) => {
              return h('div',  this.typeObj[params.row.useType]);
            }},
          {title: '创建时间', key: 'createDate', minWidth: 200},
          {title: '创建人', key: 'userCode', minWidth: 100},
        ]
      } ,
    },
    watch:{
      showAddUse(val){
        if(val){
          this.$refs.useData.resetFields();
        }
      },
    },
    mounted() {
      this.showTable = Math.random();
      this.getType();
      this.getList();
      this.getInsuranceComs();
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
      getInsuranceComs(){
        this.axios.get('/common/method/getInsuranceList', {baseURL: '/poxy-shqx/'}).then( (res) => {
          // console.log(res)
          if(res.success){
            this.insuranceComs= res.data
          }
        })
      },
      clickCreate(){
        this.$refs.table.clearCurrentRow()
        this.detail= deepClone(detailInit)
        this.$refs.detail.resetFields()
        this.showModal= true
      },
      clickEdit(){
        this.showModal=true;
        this.axios.post('/manage/cupon/queryProvideStatus', this.detail,{baseURL: '/poxy-shqx/'}).then( (res) => {
          // console.log(res)
          if(res.success){
            this.detail.isGive= !res.data.proStatus
          }
        })
      },
      clickGive(){
        this.give= deepClone(giveInit),
        this.showGive= true
        this.axios.get('/manage/excel/getBatchId').then( (res) => {
          // console.log(res)
          if(res.success){
            this.give.batch= res.data.batch
            this.give.id= this.detail.id
          }
        })
      },
      closeDetail(){
        this.$refs.detail.resetFields()
        this.showModal= false
      },
      changeGiveValidDate(val){
        // console.log('changeGiveValidDate', val)
        this.give.beginTime= val[0]
        this.give.endTime= val[1]
      },
      changeGetDate(val){
        // console.log('changeGiveValidDate', val)
        this.give.wayBegintime= val[0]
        this.give.wayEndtime= val[1]
      },
      clickUpUser(){
        if(this.give.insuranceId){
          this.$refs.upUser.open()
        }else{
          this.$Message.error("请选择保险公司");
        }

      },
      upStoreOk(file){
        let formdata = new FormData();
        formdata.append('uploadFile' , file);
        formdata.append('batch' , this.give.batch);
        formdata.append('access_token' ,  this.$store.state.user.token);
        this.axios.post('/manage/excel/tenantImport', formdata,{
          headers: {'Content-Type': 'multipart/form-data'},
        }).then( (res) => {
          // console.log(res)
          if(res.success){
            this.giveOthers.storeUpNum= res.data.num
            this.$refs.upStore.close()
          }
        })
      },
      upUserOk(file){
        let formdata = new FormData();
        formdata.append('uploadFile' , file);
        formdata.append('batch' , this.give.batch);
        formdata.append('INSURANCE_ID' , this.give.insuranceId);
        formdata.append('access_token' ,  this.$store.state.user.token);
        this.axios.post('/manage/excel/memberImport', formdata,{
          headers: {'Content-Type': 'multipart/form-data'},
        }).then( (res) => {
          // console.log(res)
          if(res.success){
            this.giveOthers.userNum= res.data.sum
            this.$refs.upUser.close()
          }
        })
      },
      selStoreOk(arr){
        this.giveOthers.storeSelNum= arr.length
        let data= []
        for(let i in arr){
          data.push({
            roadLicense: arr[i].license
          })
        }
        this.axios.post('/manage/excel/tenantDetail', {
          tenantStr: data,
          batch: this.give.batch
        }).then( (res) => {
          // console.log(res)
          if(res.success){}
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
              this.detail.discount= this.detail.discount/10
            }
            this.detail.discount= this.detail.discount|| 0
            this.axios.post('/manage/cupon/createCoupon', {data: this.detail},{baseURL: '/poxy-shqx/'}).then( (res) => {
               // console.log(res)
              if(res.success){
                 this.closeDetail()
                  this.getList()
              }
            })
          }
        })
      },
      edit(){
        this.$refs.detail.validate(validator=>{
          if(validator){
            if(parseInt(this.detail.useType) ==10561003 && this.detail.discount>1){
              this.detail.discount= this.detail.discount/10
            }
            this.detail.discount= this.detail.discount|| 0
            this.axios.post('/manage/cupon/updateCreateCoupon', {
              data: {...this.detail, 'USE_TYPE': this.detail.useType}
              },{baseURL: '/poxy-shqx/'}).then( (res) => {
              // console.log(res)
              if(res.success){
                this.closeDetail()
                this.getList()
              }
            })
          }
        })
      },
      del(){
        this.$Modal.confirm({
          title: '确定删除？',
          onOk:()=>{
            this.axios.post('/manage/cupon/deleteProvideCoupon', this.detail,{baseURL: '/poxy-shqx/'}).then( (res) => {
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
        this.$refs.give.validate(validator=>{
          if(validator){
            this.axios.post('/manage/cupon/provideCoupon', {data: this.give},{baseURL: '/poxy-shqx/'}).then( (res) => {
              // console.log(res)
              if(res.success){
                this.$Message.success("发放成功");
                this.getList()
                this.showGive= false
              }
            })
          }
        })
      },
      onRowClick(item) {
        // console.log(item);
        item.isGive= true
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
        window.location.href = '/api/common/basedata/carlive/tenantTemple?access_token='+this.$store.state.user.token
      },
      getUserTep(){
        window.location.href = '/api/common/basedata/carlive/memberTemple?access_token='+this.$store.state.user.token
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        // console.log("changePage");
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
  .others{
    .ivu-form-item-content>*{
      margin-right: 10px;
    }
  }
}
</style>

