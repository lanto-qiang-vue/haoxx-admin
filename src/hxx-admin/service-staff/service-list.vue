<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="value" :options="option" format="yyyy-MM-dd" placeholder=""
                    style="width:100%;" @on-change="onChange"></DatePicker>
      </div>
      <div class="search-block">
        <Select v-model="status" placeholder="请选择接单状态">
          <Option v-for="(item, index) in statusList"
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
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import {find} from "../../libs/util";

  export default {
    name: "service-list",
    components: {commonTable},
    data() {
      return {
        tableData: [],
        active: false,
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },
        KEYWORD: "",
        startTime: "",
        clickStartTime: "",
        clickEndTime: "",
        status:"",
        endTime: "",
        columns: [
          {
            title: '序号', width: 70,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号', key: 'user_account', width: 140},
          {title: '姓名', key: 'user_name', width: 100},
          {title: '申请服务门店', key: 'store_name', minWidth: 300},
          {title: '申请时间', key: 'apply_date', width: 160},
          {title: '开始服务时间', key: 'start_date', width: 160},
          {title: '完成服务时间', key: 'finish_date', width: 160},
          {
            title: '服务状态', key: 'status', minWidth: 80,
            render: (h, params) => h('span', find(this.statusList, ['id', 'name', params.row.status]))
          },
          {title: '撤销时间', key: 'cancel_date', width: 160},
          {title: '异常时间', key: 'error_date', width: 160},
          {title: '异常类型', key: 'error_detail', minWidth: 140}
        ],
        total: 0,
        value: [],
        page: 1,
        limit: 25,
        loading: false,
        showTable: false,
        search: {
          name: '',
          status: "请选择服务单状态",
        },
        statusList: [
          {id: '请选择服务单状态', name: '请选择服务单状态'},
          {id: 0, name: '已申请'},
          {id: 1, name: '已撤销'},
          {id: 2, name: '已开始'},
          {id: 3, name: '已完成'},
          {id: 4, name: '任务异常'},
        ],
      }
    },
    activated() {
      if(this.$route.query.key){
        if(this.active) this.activeAfter();
        else this.active = true;
      }
    },
    mounted() {
      if(this.$route.query.key){
        this.activeAfter();
        this.active = false;
      }else{
        this.status = "请选择服务单状态";
        this.getList();
        this.active = true;
      }
      this.showTable = Math.random();
    },
    methods: {
      activeAfter() {
        let key = this.$route.query.key || '';
        switch (key) {
          case 'apply':
            this.status = "请选择服务单状态";
            break;
          case 'finish':
            this.status = 3;
            break;
          case 'cancel':
            this.status = 1;
            break;
          case 'error':
            this.status = 4;
            break;
        }
        this.KEYWORD = this.$route.query.KEYWORD || "";
        this.startTime = this.$route.query.startTime || "";
        this.endTime = this.$route.query.endTime || "";
        this.value = [this.startTime, this.endTime]
        this.getList();
      },
      onChange(value) {
        if (value.length == 2) {
          this.startTime = value[0];
          this.endTime = value[1];
        }
      },
      getList() {
        this.clickStartTime = this.startTime;
        this.clickEndTime = this.endTime;
        this.axios.request({
          url: '/manage/service/detail',
          method: 'get',
          params: {
            access_token: this.$store.state.user.token,
            limit: this.limit,
            page: this.page,
            KEYWORD: this.KEYWORD,
            startTime: this.startTime,
            endTime: this.endTime,
            status: this.status == "请选择服务单状态" ? "" : this.status,
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
