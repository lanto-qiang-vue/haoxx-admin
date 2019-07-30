<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :clearSelect="clearType" :page="page" @onRowClick="onRowClick">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/门店名称/兑换码" v-model="query.keyWord" clearable></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="优惠券有效期"
                    @on-change="queryDateC" clearable
                    style="width:100%;"></DatePicker>
      </div>
      <div class="search-block">
        <Select placeholder="优惠券用途" clearable v-model="query.type">
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
      <Button type="info" @click="look" :disabled="!detail.type">查看</Button>
    </div>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {deepClone, getDictGroup} from "@/libs/util";
  export default {
    name: "discounts-record",
    components: {commonTable},
    data() {
      return {
        showType:false,
        tableData: [],
        query:{
          keyWord: '',
          startTime_eq: '',
          endTime_eq: '',
          type: '',
          useType: '',
        },
        useList: [],
        columns: [
          {
            title: '序号', width: 60,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '发放人', key: 'userName', minWidth: 160, render:(h,params) => {
              return h('div',  params.row.userName|| params.row.userCode? `${params.row.userName}/${params.row.userCode}`: '');
            }},
          {title: '优惠券名称', key: 'name', minWidth: 140},
          {title: '用途', key: 'useType', minWidth: 90, render:(h,params) => {
              return h('div',  this.useObj[params.row.type]);
            }},
          {title: '类型', key: 'type', minWidth: 90, render:(h,params) => {
              return h('div',  this.typeObj[params.row.useType]);
            }},
          {title: '发放数量', key: 'num', minWidth: 90},
          {title: '发放时间', key: 'createDate', minWidth: 160},],
        detail: {},
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
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
      this.getType()
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
      onRowClick(item) {
        this.detail = item;
      },
      getList() {
        this.detail= {}
        this.axios.post('/manage/cupon/queryProvideDetail', {
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
      look(){
        let {name, type, useType}= this.detail
        this.$router.push({path: '/discounts-record-detail', query:{ type, useType}})
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

</style>
