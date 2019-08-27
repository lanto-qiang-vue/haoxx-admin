<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :page="page" @onRowClick="onRowClick" :ellipsis="false"
                ref="table" :loading="loading"
                class="car-inspection-list">
    <div slot="search">
      <!--<div class="search-block">-->
      <!--<Input placeholder="会员账号/门店名称/兑换码" v-model="query.keyWord" clearable></Input>-->
      <!--</div>-->
      <div class="search-block">
        <Input placeholder="车主/联系电话" v-model="query.keyWord" clearable></Input>
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
      <Button type="primary" @click="showCheck= true">新增</Button>
    </div>

    <Modal
      v-model="showCheck"
      title="请输入车牌号"
      width="400"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :transition-names="['', '']">
      <div>
        <p style="text-align: center;margin-bottom: 10px;color: #999;font-size: 12px">车辆保险到期时间≤2个月才可进行免费车检</p>
        <Input type="text" v-model="licenseNo" placeholder="车牌号"></Input>
      </div>

      <div slot="footer">
        <Button @click="showCheck= false">取消</Button>
        <Button type="primary" @click="check">提交</Button>
      </div>
    </Modal>

    <Modal
      v-model="showCreate"
      class="table-modal-detail full-height discounts-modal"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :transition-names="['', '']">
      <modal-title slot="header" title="车辆检查" @clickBack="closeDetail"></modal-title>
      <div>
        <Form :label-width="90" :model="checkDetail" ref="checkDetail" :rules="checkRule" class="common-form">
          <FormItem label="车牌:" prop="plate">
            <span>{{checkDetail.plate}}</span>
          </FormItem>
          <FormItem :label-width="120" label="保险到期时间:" prop="insuranceExpireDate">
            <span>{{checkDetail.insuranceExpireDate}}</span>
          </FormItem>
          <FormItem label="保险公司:" prop="insuranceCompany">
            <Select v-model="checkDetail.insuranceCompany" placeholder="请选择">
              <Option v-for="(item, index) in insuranceComs"
                      :key="index" :value="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <br/>
          <FormItem :label-width="0" prop="carDriver" style="width: auto">
            <RadioGroup v-model="checkDetail.carDriver">
              <!--<Radio label="车主" true-value="10591001"></Radio>-->
              <!--<Radio label="驾驶员" true-value="10591002"></Radio>-->
              <Radio label="10591001">车主</Radio>
              <Radio label="10591002">驾驶员</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="姓名:" prop="vehicleOwner">
            <Input v-model="checkDetail.vehicleOwner"/>
          </FormItem>
          <FormItem label="联系电话:" prop="telphone">
            <Input v-model="checkDetail.telphone" :maxlength="11"/>
          </FormItem>
          <FormItem label="车检日期:" prop="inspectDate">
            <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" transfer
                        @on-change="checkDetail.inspectDate= $event"
            ></DatePicker>
          </FormItem>

          <template v-if="checkDetail.groupItems">
            <FormItem :label-width="0" v-for="(proj, key) in checkDetail.groupItems" :key="key"
                      style="width: 100%;margin-bottom: 25px" class="group-items" :prop="'groupItems'+key">
            <div class="check-items ivu-input" >
              <p>{{proj.typeName}}</p>
              <div class="table">
                <table cellspacing="0">
                  <tr>
                    <th width="80">序号</th>
                    <th width="200">项目名称</th>
                    <th width="400"><i>*</i>检测描述</th>
                    <th width="200">上传图片</th>
                    <th width="200">相关建议</th>
                    <th width="100"><i>*</i>检测人</th>
                  </tr>
                  <tr v-for="(item, index) in proj.items" :key="index">
                    <td>{{index+1}}</td>
                    <td>{{item.name}}</td>
                    <td><Input v-model="item.description"/></td>
                    <td>
                      <li v-for="(url, inde) in item.url" :key="inde" class="img">
                        <img :src="url" v-img/><i class="fa fa-times-circle" @click="delImg(key, index, inde)"></i>
                      </li>
                      <i class="fa fa-plus-square-o" @click="upImg(key, index)"></i>
                    </td>
                    <td><Input v-model="item.advise"/></td>
                    <td class="rowspan" rowspan="100" v-if="index==0"><Input v-model="proj.tester"/></td>
                  </tr>
                </table>
              </div>
            </div>
            </FormItem>
          </template>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submit('10571001')">保存</Button>
        <Button type="success" @click="submit('10571002')">提交</Button>
        <Button @click="showCreate= false">取消</Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
import ModalTitle from '@/hxx-components/modal-title.vue'
import {deepClone, upImg} from "@/libs/util"
let initCheckDetail={
  plate: '',
  insuranceExpireDate: '',
  insuranceCompany: '',
  carDriver: '10591001',
  vehicleOwner: '',
  telphone: '',
  inspectDate: '',
  groupItems: [],

}
export default {
  name: "car-inspection-list",
  components: {commonTable, ModalTitle,},
  data() {
    return{
      query:{
        keyWord: '',
        reportStatus: null,
        CREATE_DATE_gte: '',
        CREATE_DATE_lte: '',
      },
      detail: {},
      // columns: [],
      tableData: [
      ],
      total: 0,
      showCheck: false,
      showTable: false,
      showCreate: false,
      loading: true,
      page: 1,
      limit: 25,
      licenseNo: '沪B5J763',
      checkDetail: deepClone(initCheckDetail),
      checkItems: [],
      insuranceComs: [],

    }
  },
  computed:{
    columns(){
      return [
        {title: '序号', key: 'id', type:'index' , width: 70, align: 'center'},
        {title: '车主', key: 'vehicle_owner', minWidth: 100},
        {title: '联系电话', key: 'telphone', minWidth: 100},
        {title: '车牌号', key: 'plate', minWidth: 100},
        // {title: '车型', key: 'id', minWidth: 200},
        {title: '车检日期', key: 'inspect_date', minWidth: 100},
        {title: '保险公司', key: 'insurance_company', minWidth: 200},
        {title: '保险到期时间', key: 'id', minWidth: 200},
        {title: '信息状态', key: 'id', minWidth: 200},
        {title: '车检单号', key: 'id', minWidth: 200},
        {title: '操作', key: 'id', minWidth: 100, align: 'center', render:(h,params) => {
            return h('i',{
              // class: 'fa fa-pencil'
              class: 'fa fa-search',
              style: {
                // color: 'red',
                fontSize: '16px',
                cursor: 'pointer',
              },
            })
          }
        },
      ]
    },
    groupItems(){
      return this.checkDetail.groupItems
    },
    checkRule(){
      let rule= { required: true, message:'必填项不能为空'}
      let rules= {
        vehicleOwner: rule,
        telphone: rule,
        inspectDate: rule,
      }
      if( this.groupItems)
      this.groupItems.map((item, index)=>{
        rules['groupItems'+ index]= { validator: (rule, value, callback) => {
            let thisItem= this.groupItems[index], flag= true
            thisItem.items.map((ite)=>{
              if(!ite.description) flag= false
            })
            if( flag && thisItem.tester){
              callback()
            }else{
              callback(new Error('必填项不能为空'))
            }
          }}
      })

      return rules
    },
  },
  mounted(){
    this.getList()
    this.getItems()
    this.getInsuranceComs()
  },
  methods:{
    upImg(i1, i2){
      upImg(this, (url)=>{
        this.checkDetail.groupItems[i1].items[i2].url.push(url)
      })
    },
    delImg(i1,i2,i3){
      this.checkDetail.groupItems[i1].items[i2].url.splice(i3, 1)
    },
    check(){
      this.axios.get('/insurance/quotation/'+ this.licenseNo,{baseURL: '/poxy-shqx', headers:{'Content-Type': 'application/json; charset=utf-8'}}).then(res => {
          // console.log('res', typeof res)
          let re= typeof res=='string'? eval('('+res+')') : res
        // console.log('re', re)
        let data= re.responseList[0], flag= false
        if(data.header.resultCode== '0000'){
          let date= new Date(data.baseInfo.bizEffectDate)
          let diff = Math.abs(date.getTime() - new Date().getTime())
          let result = parseInt(diff / (1000 * 60 * 60 * 24));
          if(result<= 60) flag= true
        }else{
          // flag= true
        }
        if(flag){
          let expire= data.baseInfo.bizEffectDate
          this.axios.get('/tenant/check/have',{params:{
              plate: this.licenseNo,
              expireDate: expire,
            }}).then(res => {
            if(res.success && res.data){
              this.initCreat({insuranceExpireDate: expire})
            }else{
              this.$Message.error("此车牌不用检测");
            }
            this.showCheck= false
          })
        }else{
          this.$Message.error("此车牌不用检测");
          this.showCheck= false
        }
      })
    },
    getList(){
      this.loading= true
      this.detail= {}
      this.axios.post('/tenant/check/list', {
          limit:this.limit,
          page:this.page,
      }).then( (res) => {
        console.log(res)
        if(res.success){
          this.total= res.total
          this.tableData= res.data
          this.loading= false
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
    getItems(){
      this.axios.get('/tenant/check/items').then( (res) => {
        if(res.success){

          let data= res.data
          data.map((proj)=>{
            proj.tester= 'ma'
            proj.items.map((item, ind)=>{
              item.description= item.name.indexOf('：')>=0? item.name.split('：')[1]: ind+1
              item.advise= ''
              item.url= []
            })
          })

          this.checkItems= data
        }
      })
    },
    initCreat(obj){
      // this.checkDetail= deepClone(initCheckDetail)
      this.checkDetail.groupItems= deepClone(this.checkItems)
      setTimeout(()=>{
        this.$refs.checkDetail.resetFields()
        this.checkDetail.plate= this.licenseNo

        if(obj){
          Object.assign(this.checkDetail,obj)
        }
      }, 100)

      this.showCreate= true
    },
    submit(status){
      this.$refs.checkDetail.validate(validator=>{
        if(validator){
          this.checkDetail.status= status
          this.axios.post('/tenant/check/saveReport', {data: this.checkDetail}).then( (res) => {
            if(res.success && res.data){
              this.showCreate= false
              this.getList()
            }
          })
        }else{
          this.$Message.error("请输入必填项");
        }
      })
    },
    onRowClick(item) {
      item.items.map((o)=>{
        o.num= null;
        o.id= o.goodsId;
      })
      this.detail = item;
    },
    closeDetail(){

      this.showCreate= false
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
  }
}
</script>

<style scoped lang="less">
.car-inspection-list{
  .check-items{
    /*border: 1px solid #dcdee2;*/
    /*margin-bottom: 20px;*/
    height: auto;
    padding: 0;
    p{
      line-height: 40px;
      padding: 0 10px;
      font-size: 14px;
    }
    .table{
      overflow-x:auto;
      table{
        width: 100%;
        min-width: 1180px;
        border-top: 1px solid #dcdee2;
        border-collapse: collapse;
        *{
          border-collapse: collapse;
        }
        tr{
          height: 40px;
          th{
            font-weight: 600;
            font-size: 12px;
            color: #515a6e;
            background-color: #f8f8f9;
            /*border: 1px solid #dcdee2;*/
            border-right: 1px solid #dcdee2;
            border-bottom: 1px solid #dcdee2;
            i{
              color: red;
              font-size: 18px;
              font-style: normal;
              vertical-align: middle;
              font-weight: 400;
            }
          }
          td{
            /*border: 1px solid #dcdee2;*/
            border-right: 1px solid #dcdee2;
            border-bottom: 1px solid #dcdee2;
            padding: 0 10px;
            .fa-plus-square-o{
              font-size: 28px;
              color: #666666;
              cursor: pointer;
              vertical-align: middle;
            }
            &:first-child{
              text-align: center;
            }
            &.rowspan{
              border-bottom: 0;
            }
          }
          *:last-child{
            border-right: 0
          }
        }
        tr:last-child{
          th, td{
            border-bottom: 0;
            &:last-child{
              border-right: 0
            }
          }
        }
      }
      .img{
        display: inline-block;
        width: 30px;
        height: 30px;
        position: relative;
        vertical-align: middle;
        margin-right: 5px;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        i{
          position: absolute;
          top: -2px;
          right: -2px;
          color: #333333;
          cursor: pointer;
          background-color: white;
          border-radius: 100%;
        }
      }
    }
  }
}
</style>
<style lang="less">
.car-inspection-list{
  .group-items{
    .ivu-form-item-content{
      line-height: 0;
      .check-items {
        .ivu-input {
          border: 1px solid #dcdee2;
          &:focus{
            border-color: #46a6ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        }
      }
    }
  }
}

</style>
