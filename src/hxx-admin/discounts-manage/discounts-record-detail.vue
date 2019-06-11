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
        <DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder="未知时间2"
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
      <div class="search-block">
        <Select placeholder="请选择状态">
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
      <Button type="info" @click="showModal=true;title='优惠券详情'">查看</Button>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height discounts-modal"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <modal-title slot="header" :title="title" @clickBack="showModal=false"></modal-title>
      <!--详情部分-->
      <Form :label-width="170" class="form-3">
        <FormItem label="优惠券名称:" style="width:30%">
          <Input value="买保险送洗车券" readonly/>
        </FormItem>
        <FormItem label="优惠用途:"  style="width:30%">
          <Input value="洗车类" readonly/>
        </FormItem>
        <FormItem label="优惠券类型:"  style="width:30%">
          <Input value="免费卷" readonly/>
        </FormItem>
        <!---->
        <FormItem label="优惠券兑换码:"  style="width:30%">
          <Input value="123ERGg" readonly/>
        </FormItem>
        <FormItem label="使用有效期:"  style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <FormItem label="可领取日期:"  style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <!---->
        <FormItem label="适用门店:"  style="width:30%">
          <a @click="showType=Math.random();">100家</a>
        </FormItem>
        <FormItem label="领取时间:"  style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <FormItem label="会员账号/昵称:"  style="width:30%">
          <a @click="goto(1,'18358330864/楚留香传奇')">18358330864/楚留香传奇</a>
        </FormItem>
        <!---->
        <FormItem label="限用车牌号:"  style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <FormItem label="是否保险公司导入名单:"style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <FormItem label="使用门店:"  style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <!---->
        <FormItem label="使用时间:" style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <FormItem label="发卷时间:"  style="width:30%">
          <Input value="2019-06-01 ～2019-06-30" readonly/>
        </FormItem>
        <FormItem>

        </FormItem>
        <!---->
        <FormItem label="发卷人账号/名称:"  style="width:30%">
          <a>15325677659/张三</a>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showModal=false">取消</Button>
        <Button type="primary">提交</Button>
      </div>
    </Modal>
    <select-stroe :showType="showType"></select-stroe>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import selectStroe from '@/hxx-components/select-store.vue';
  import ModalTitle from '@/hxx-components/modal-title.vue'
  import {deepClone} from "../../libs/util";
  let useList = [
    {name:'请选择'},
    {name:'洗车类'},
    {name:'保养类'},
    {name:'油漆类'}
  ]
  export default {
    name: "discounts-record-detail",
    components: {commonTable, ModalTitle,selectStroe},
    data() {
      return {
        title:'优惠券详情',
        showType:false,
        showModal: true,
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
          {title: '会员账号', key: 'name', minWidth: 120},
          {title: '优惠卷名称', key: 'price', minWidth: 140},
          {title: '卷类型', key: 'price', minWidth: 140},
          {title: '兑换码', key: 'price', minWidth: 140},
          {title: '状态', key: 'price', minWidth: 140},
          {title: '领取时间', key: 'price', minWidth: 140},
          {title: '有效时间', key: 'price', minWidth: 140},
          {title: '使用时间', key: 'price', minWidth: 140},
          {title: '使用门店', key: 'price', minWidth: 140},
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
      this.showModal = true;
      this.showTable = Math.random();
      this.getList();
    },
    watch:{
      showModal(val){
        if(val){
          this.useList = deepClone(useList);
        }
      }
    },
    methods: {
      goto(type,string){
        switch(type){
          case 1:
            break;
          case 2:
            break;
        }
      },
      onRowClick(list) {
        console.log(list);
        this.list = list;
      },
      getList() {

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
