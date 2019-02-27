<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page">
    <div slot="search">
      <div class="search-block" style="width:100%;">
        <Form :label-width="60" inline class="common-form" style="height:40px;">
          <FormItem :label-width="0">
            <Input placeholder="关键件搜索" v-model="search.KEY_WORD"/>
          </FormItem>
          <FormItem label="月份:">
            <DatePicker type="month" v-model="month" :options="options" placeholder="请选择月份" :editable="false" :clearable="false"></DatePicker>
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
        month:'',
        search:{
          KEY_WORD:'',
        },
        columns: [
          {
            title: '序号', width: 70, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.size + params.index + 1)
          },
          {title: '门店名称', minWidth: 140, key: 'tenantName'},
          {title: '认领次数', minWidth: 140, key: 'claimNo'},
          {title: '培训次数', minWidth: 140, key: 'trainNo'},
          {title: '扫车牌数', minWidth: 140, key: 'scanNo'},
          {title: '精准报价数', minWidth: 140, key: 'preciseNo'},
          {title: '成功购买数', minWidth: 140, key: 'purchaseNo'},
          {title: '精准报价转换率', minWidth: 140, key: 'preciseConversion',
            render: (h, params) => h('span',params.row.preciseConversion * 100 + "%")
          },
          {title: '购买转换率', minWidth: 140, key: 'purchaseConversion',
            render: (h, params) => h('span',params.row.purchaseConversion * 100 + "%")
          },
        ],
        monthList: [{code: 0, name: '请选择月份'}],
        total: 0,
        page: 1,
        size: 25,
        showTable: false,
        activated: false
      }
    },
    mounted() {
      if(this.$route.query.time){
        let arr = this.$route.query.time.split('-');
        this.month = new Date(arr[0],parseInt(arr[1])-1);
      }else{
        let date = new Date();
        this.month = new Date(date.getFullYear(),date.getMonth()-1);
      }
      this.showTable = Math.random();
      this.getList();
    },
    activated(){
        if (this.$route.query.time && this.activated) {
          let arr = this.$route.query.time.split('-');
          this.month = new Date(arr[0], parseInt(arr[1]) - 1);
          this.getList();
        }
        this.activated = true;
    },
    // deactivated(){
    //   this.activated= false
    // },
    methods: {
      fill(val){
     if(val <10) return "0"+val;
     else return val;
      },
      getList() {
        this.axios.request({
          baseURL: '/poxy-next',
          url: '/manage/tenanttable/list',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit:this.size,
            page:this.page,
            month:this.month.getFullYear() + "-" + this.fill((this.month.getMonth() + 1)),
            KEY_WORD:this.search.KEY_WORD,
          },
        }).then(res => {
          if (res.success === true) {
            this.showModal = false;
            this.total = res.total;
            this.tableData = res.data;
          }
        })
        // this.tableData = [{A: '上海三狮汽车修理有限公司', B: '100', C: 1, D: 20, E: 10, F: 5, G: '50%', H: '25%'},
        //   {A: '上海优坊贸易有限公司', B: '90', C: '5', D: '15', E: '10', F: '5', G: '66.7%', H: '33.3%'}
        // ];
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
