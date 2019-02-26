<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page">
    <div slot="search">
      <div class="search-block" style="width:100%;">
        <Form :label-width="60" inline class="common-form" style="height:40px;">
          <FormItem :label-width="0">
            <Input placeholder="关键件搜索"/>
          </FormItem>
          <FormItem label="月份:">
            <DatePicker type="month" :options="options" placeholder="请选择月份" :editable="false"></DatePicker>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" @click="page=1;getList()">
              <Icon type="ios-search" size="24"/>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </common-table>
</template>

<script>
  import commonTable from '@/hxx-components/common-table.vue'

  export default {
    name: "company-reports",
    components: {commonTable},
    data() {
      return {
        options: {
          disabledDate(date) {
            let now = new Date();
            let d1 = new Date(now.getFullYear(), now.getMonth());
            let d2 = new Date(now.getFullYear() - 1, 7);
            return date > d1 || date < d2;
          }
        },
        tableData: [],
        search: {
          month: 0,
        },
        columns: [
          {
            title: '序号', width: 70, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.size + params.index + 1)
          },
          {title: '门店名称', minWidth: 140, key: 'A'},
          {title: '认领次数', minWidth: 140, key: 'B'},
          {title: '培训次数', minWidth: 140, key: 'C'},
          {title: '扫车牌数', minWidth: 140, key: 'D'},
          {title: '精准报价数', minWidth: 140, key: 'E'},
          {title: '成功购买数', minWidth: 140, key: 'F'},
          {title: '精准报价转换率', minWidth: 140, key: 'G'},
          {title: '购买转换率', minWidth: 140, key: 'H'},
        ],
        monthList: [{code: 0, name: '请选择月份'}],
        total: 0,
        page: 1,
        size: 15,
        showTable: false,
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      getList() {
        this.tableData = [{A: '上海三狮汽车修理有限公司', B: '100', C: 1, D: 20, E: 10, F: 5, G: '50%', H: '25%'},
          {A: '上海优坊贸易有限公司', B: '90', C: '5', D: '15', E: '10', F: '5', G: '66.7%', H: '33.3%'}
        ];
      },
      changePageSize(size) {
        this.size = size;
        this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      }
    },
  }
</script>

<style scoped>

</style>
