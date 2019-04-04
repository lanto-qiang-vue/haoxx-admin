<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名" v-model="search.name"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="value" format="yyyy-MM-dd" placeholder="请选择时间" style="width:100%;" @on-change="onChange"></DatePicker>
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
    name: "service-staff-list",
    components: {commonTable},
    data() {
      return {
        tableData: [],
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {title: '会员账号', key: 'A', width: 200},
          {title: '姓名', key: 'B', width: 180},
          {title: '申请服务数(次)', key: 'C', width: 140},
          {title: '完成服务数(次)', key: 'D', width: 140},
          {title: '撤销总数(次)', key: 'E', width: 140},
          {title: '任务异常数(次)', key: 'F', width: 140},
          {title: '申请服务门店数(次)', key: 'G', minWidth: 140},
          {title: '服务门店数(次)', key: 'H', width: 140},
        ],
        total: 0,
        page: 1,
        limit: 25,
        value:[],
        loading: false,
        showTable: false,
        search: {
          name: '',
          status: 0,
        },
      }
    },
    mounted() {
      this.showTable = Math.random();
      let a = new Date();
      let year = a.getFullYear();
      let month = a.getMonth();
      let b = new Date(year,month,0);
      this.value = [,'2019-01-02'];
    },
    methods: {
      onChange(value){
        console.log(value);
        this.value = value;
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
    }
  }
</script>

<style scoped>

</style>
