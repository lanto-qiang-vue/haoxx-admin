<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :page="page" @onRowClick="onRowClick" :ellipsis="false"
                ref="table" :loading="loading"
                class="car-inspection-list">
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
      <div >
        <p style="text-align: center;margin-bottom: 10px;color: #999;font-size: 12px">车辆保险到期时间≤2个月才可进行免费车检</p>
        <Input type="text" v-model="licenseNo" placeholder="车牌号"></Input>
      </div>

      <div slot="footer">
        <Button @click="showModal= false">取消</Button>
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
        <Form :label-width="80" :model="checkDetail" ref="checkDetail" :rules="checkRule" class="common-form">
          <FormItem label="车牌:" prop="name">
            <span>AAA</span>
          </FormItem>
          <FormItem :label-width="120" label="保险到期时间:" prop="name">
            <span>2019-1-1</span>
          </FormItem>
          <FormItem label="保险公司:" prop="name">
            <span>太平</span>
          </FormItem>
          <br/>
          <FormItem :label-width="0" prop="name" style="width: auto">
            <RadioGroup>
              <Radio label="车主"></Radio>
              <Radio label="驾驶员"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="姓名:" prop="name">
            <Input v-model="checkDetail.name"/>
          </FormItem>
          <FormItem label="联系电话:" prop="name">
            <Input v-model="checkDetail.name"/>
          </FormItem>
          <FormItem label="车检日期:" prop="name">
            <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" transfer
                        v-model="checkDetail.getrange"
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
                      <li v-for="(url, inde) in item.url" :key="inde">
                        <img :src="url"/><i class="fa fa-times-circle"></i>
                      </li>
                      <i class="fa fa-plus-square-o"></i>
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
        <Button type="primary" @click="check">保存</Button>
        <Button type="success" @click="check">提交</Button>
        <Button @click="showCreate= false">取消</Button>
      </div>
    </Modal>
  </common-table>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
import ModalTitle from '@/hxx-components/modal-title.vue'
import {deepClone, getDictGroup} from "@/libs/util";
export default {
  name: "car-inspection-list",
  components: {commonTable, ModalTitle},
  data() {
    return{
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
      licenseNo: '',
      checkDetail: {},
      checkItems: [],

    }
  },
  computed:{
    columns(){
      return [
        {title: '序号', key: 'id', type:'index' , width: 70, align: 'center'},
        {title: '车主', key: 'id', minWidth: 100},
        {title: '联系电话', key: 'id', minWidth: 100},
        {title: '车牌号', key: 'id', minWidth: 100},
        {title: '车型', key: 'id', minWidth: 200},
        {title: '车检日期', key: 'id', minWidth: 100},
        {title: '保险公司', key: 'id', minWidth: 200},
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
    checkRule(){
      return{
        groupItems0: {required: true}
      }
    },
  },
  mounted(){
    this.getList()
    this.getItems()
  },
  methods:{
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
          this.showCheck= false
          this.initCreat()
        }
      })
      this.showCheck= false
      this.initCreat()
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
    getItems(){
      this.axios.get('/tenant/check/items').then( (res) => {
        if(res.success){

          let data= res.data
          data.map((proj)=>{
            proj.tester= ''
            proj.items.map((item)=>{
              item.description= item.name.indexOf('：')>=0? item.name.split('：')[1]: ''
              item.advise= ''
              item.url= []
            })
          })

          this.checkItems= data
        }
      })
    },
    initCreat(){
      this.checkDetail.groupItems= deepClone(this.checkItems)
      this.$refs.checkDetail.resetFields()
      this.showCreate= true
    },
    onRowClick(item) {
      item.items.map((o)=>{
        o.num= null;
        o.id= o.goodsId;
      })
      this.detail = item;
    },
    closeDetail(){

      this.showModal= false
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
        .ivu-form-item-error .ivu-input {
          border: 1px solid #dcdee2;
        }
      }
    }
  }
}

</style>
