<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page">
    <div slot="search">
      <div class="search-block" style="width:100%;">
        <Form :label-width="60" inline class="common-form">
          <FormItem :label-width="0">
            <Input placeholder="客服账号搜索"/>
          </FormItem>
          <FormItem :label-width="20" style="width:150px;">
            <RadioGroup v-model="spacing">
              <Radio label="月"></Radio>
              <Radio label="周"></Radio>
              <Radio label="日"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem  :label-width="0" v-show="spacing =='月'" class="w200">
            <DatePicker type="month" v-model="month" :options="options" placeholder="请选择月份" :editable="false"></DatePicker>
          </FormItem>
          <FormItem :label-width="0"   v-show="spacing == '周'" style="position:relative;" class="w200">
            <DatePicker type="date" v-model="week" :options="option1" placeholder="请选择日期获取周" :editable="false"></DatePicker>
            <span style="position:absolute;top:30px;left:0px;" v-show="start != '' && end != ''">{{start}}—{{end}}</span>
          </FormItem>
          <FormItem :label-width="0"   v-show="spacing == '日'" class="w200">
            <DatePicker type="date" v-model="day" :options="option1" placeholder="请选择日" :editable="false"></DatePicker>
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
    name: "service-detail",
    components: {commonTable},
    data() {
      return {
        month:'',
        week:'',
        day:'',
        options: {
          disabledDate(date) {
            let now = new Date();
            let d1 = new Date(now.getFullYear(), now.getMonth());
            let d2 = new Date(now.getFullYear() - 1, 7);
            return date > d1 || date < d2;
          }
        },
        option1:{
          disabledDate(date) {
            let now = new Date();
            return date > now;
          }
        },
        tableData: [],
        columns: [
          {
            title: '序号', width: 70, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.size + params.index + 1)
          },
          {title: '运营人员账号', minWidth: 140, key: 'A'},
          {title: '门店', minWidth: 140, key: 'B'},
          {title: '车牌号', minWidth: 140, key: 'C'},
          {title: '认领时间', minWidth: 140, key: 'D'},
          {title: '培训结果', minWidth: 140, key: 'E'},
          {title: '是否精准报价', minWidth: 140, key: 'F'},
        ],
        monthList: [{code: 0, name: '请选择月份'}],
        total: 0,
        page: 1,
        size: 15,
        showTable: false,
        spacing:'月',
        start:'',
        end:'',
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getList();
    },
    methods: {
      getList() {
        this.tableData = [{A: '13983765456', B: 'A', C: '沪JD7656', D: '2019/02/10 10:00',E:'已完成',F:'是'},
          {A: '13983765456', B: 'B', C: '沪K87670', D: '2019/02/09 18:00',E:'电话不通',F:'否'},
          {A: '13983765456', B: 'B', C: '沪A32456', D: '2019/02/07 09:00',E:'不卖车险',F:'否'},
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
    watch:{
      week(val){
        if(val) {
          let year = val.getFullYear();
          let month = val.getMonth();
          let day = val.getDate();
          let spacing = val.getDay() == 0 ? 7 : val.getDay();
          let startSpacing = spacing - 1;
          let endSpacing = 7 - spacing;
          let start = new Date(year, month, day - startSpacing);
          let end = new Date(year, month, endSpacing + day);
          this.start = start.getFullYear() + "-" + (start.getMonth()+1) + "-" + start.getDate();
          this.end = end.getFullYear() + "-" + (end.getMonth()+1) + "-" + end.getDate();
        }else{
          this.start = this.end = "";
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .w200{width:200px;}
</style>
