<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder="申领时间开始-申领时间结束"
                    style="width:100%;"></DatePicker>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :options="option" format="yyyy-MM-dd" placeholder="分享时间开始-分享时间结束"
                    style="width:100%;"></DatePicker>
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
      <Button type="primary">导入结果</Button>
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
    name: "activity-trace",
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
          {title: '点击申领的会员', key: 'name', minWidth: 120},
          {title: '点击申领时间', key: 'price', minWidth: 140},
          {title: '是否办理成功', key: 'price', minWidth: 140},
          {title: '是否从分享链接申领', key: 'price', minWidth: 140},
          {title: '分享链接所属会员', key: 'price', minWidth: 140},
          {title: '链接被分享时间', key: 'price', minWidth: 140},],
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
