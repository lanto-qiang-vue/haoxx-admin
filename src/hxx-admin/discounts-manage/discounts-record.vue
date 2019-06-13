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
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <div slot="operate">
      <Button type="info">查看</Button>
    </div>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone} from "../../libs/util";
  let useList = [
    {name:'请选择'},
    {name:'洗车类'},
    {name:'保养类'},
    {name:'油漆类'}
  ]
  export default {
    name: "discounts-record",
    components: {commonTable},
    data() {
      return {
        showType:false,
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
          {title: '发放人账号/名称', key: 'name', minWidth: 120},
          {title: '优惠券名称', key: 'price', minWidth: 140},
          {title: '用途', key: 'price', minWidth: 140},
          {title: '类型', key: 'price', minWidth: 140},
          {title: '发放数量', key: 'price', minWidth: 140},
          {title: '发放时间', key: 'price', minWidth: 140},],
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
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      onRowClick(list) {
        this.list = list;
      },
      getList() {

      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
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
