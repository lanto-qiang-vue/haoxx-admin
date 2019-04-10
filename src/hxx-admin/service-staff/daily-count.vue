<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="value" :options="option" format="yyyy-MM-dd" placeholder="请选择时间" style="width:100%;"
                    @on-change="onChange"></DatePicker>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'

  export default {
    name: "daily-count",
    components: {commonTable},
    data() {
      return {
        tableData: [],
        KEYWORD: "",
        option:{
          disabledDate(date) {
            return date > new Date();
          }
        },
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号', key: 'user_account', width: 200},
          {title: '姓名', key: 'user_name', width: 180},
          {
            title: '申请服务数(次)', key: 'apply', width: 140,
            render: (h, params) => h('a', {
              attrs:{
                disabled:params.row.apply > 0 ? false : true
              },
              on: {
                click: () => {
                  this.routePush(params.column.key,params.row.user_account);
                }
              },
              style:{
                cursor:params.row.apply > 0 ? "cursor" : "default"
              }
            }, params.row.apply)
          },
          {title: '完成服务数(次)', key: 'finish', width: 140,
            render: (h, params) => h('a', {
              attrs:{
                disabled:params.row.finish > 0 ? false : true
              },
              on: {
                click: () => {
                  this.routePush(params.column.key,params.row.user_account);
                }
              },
              style:{
                cursor:params.row.finish > 0 ? "cursor" : "default"
              }
            }, params.row.finish)
          },
          {title: '撤销总数(次)', key: 'cancel', width: 140,
            render: (h, params) => h('a', {
              attrs:{
                disabled:params.row.cancel > 0 ? false : true
              },
              on: {
                click: () => {
                  this.routePush(params.column.key,params.row.user_account);
                }
              },
              style:{
                cursor:params.row.cancel > 0 ? "cursor" : "default"
              }
            }, params.row.cancel)
          },
          {title: '任务异常数(次)', key: 'error', width: 140,
            render: (h, params) => h('a', {
              attrs:{
                disabled:params.row.error > 0 ? false : true
              },
              on: {
                click: () => {
                  this.routePush(params.column.key,params.row.user_account);
                }
              },
              style:{
                cursor:params.row.error > 0 ? "cursor" : "default"
              }
            }, params.row.error)
          },
          {title: '申请服务门店数(家)', key: 'applytenants', minWidth: 180},
          {title: '服务门店数(家)', key: 'servicetenants', width: 140},
        ],
        total: 0,
        page: 1,
        limit: 25,
        startTime: '',
        endTime: '',
        value: [],
        active:false,
        loading: false,
        showTable: false,
        search: {
          name: '',
          status: 0,
        },
      }
    },
    mounted() {
      if(this.$route.query.id){
        this.activeAfter();
        this.active = false;
      }else{
        this.getList();
        this.active = true;
      }
      this.showTable = Math.random();
    },
    activated() {
      if (this.$route.query.id) {
        if(this.active) this.activeAfter();
        else this.active = true;
      }
    },
    methods: {
      activeAfter(){
        this.KEYWORD = this.$route.query.id;
        this.getList();
      },
      routePush(key,KEYWORD){
        this.$router.push({path:'/service-list',query:{key:key,startTime:this.startTime,endTime:this.endTime,KEYWORD:KEYWORD}});
      },
      onChange(value) {
        if (value.length == 2) {
          this.startTime = value[0];
          this.endTime = value[1];
        }
      },
      getList() {
        this.axios.request({
          url: '/manage/daily/list',
          method: 'get',
          params: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.KEYWORD,
            startTime: this.startTime,
            endTime: this.endTime,
          },
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.total = res.total;
            this.tableData = res.data;
          }
        })
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
