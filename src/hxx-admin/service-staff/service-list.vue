<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/姓名" v-model="search.name"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="datetimerange" format="yyyy-MM-dd" placeholder="" style="width:100%;" @on-change="onChange"></DatePicker>
      </div>
      <div class="search-block">
        <Select v-model="search.status" placeholder="请选择接单状态">
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
          {title: '申请服务门店', key: 'C', width: 140},
          {title: '申请时间', key: 'D', width: 140},
          {title: '开始服务时间', key: 'E', width: 140},
          {title: '完成服务时间', key: 'F', width: 140},
          {title: '服务状态', key: 'G', minWidth: 140},
          {title: '撤销时间', key: 'H', width: 140},
          {title: '异常时间', key: 'I', width: 140},
          {title:'异常类型',key:'J',minWidth:140}
        ],
        total: 0,
        page: 1,
        limit: 25,
        loading: false,
        showTable: false,
        search: {
          name: '',
          status: 0,
        },
        statusList: [
          {id: 0, name: '请选择服务单状态'},
          {id: 1, name: '待服务'},
          {id: 2, name: '服务中'},
          {id: 3, name: '已完成'},
          {id:4,name:'已撤销'},
          {id:5,name:'任务异常'}
        ],
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.tableData = [
        {A: "1", B: "2", C: "3", D: "4", E: "5", F: "6",G:"7",H:"8","I":9,"J":10},
      ]
    },
    methods: {
      onChange(value){
        console.log(value);
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
