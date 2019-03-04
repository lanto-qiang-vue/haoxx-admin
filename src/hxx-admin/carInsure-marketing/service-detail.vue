<template>
  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" @onRowClick="rowClick">
    <div slot="search">
      <div class="search-block" style="width:100%;">
        <Form :label-width="60" inline class="common-form" style="margin-bottom:-10px;">
          <FormItem :label-width="0">
            <Input placeholder="客服账号搜索" v-model="account"/>
          </FormItem>
          <FormItem :label-width="20" style="width:150px;">
            <RadioGroup v-model="spacing">
              <Radio label="月"></Radio>
              <Radio label="周"></Radio>
              <Radio label="日"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem  :label-width="0" v-show="spacing =='月'" class="w200">
            <DatePicker type="month" v-model="month" :options="options" placeholder="请选择月份" :editable="false" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem :label-width="0"   v-show="spacing == '周'" style="position:relative;" class="w200">
            <DatePicker type="date" v-model="week" :options="option1" placeholder="请选择日期获取周" :editable="false" :clearable="false"></DatePicker>
            <span style="position:absolute;top:30px;left:0px;" v-show="start != '' && end != ''">{{start}}—{{end}}</span>
          </FormItem>
          <FormItem :label-width="0"   v-show="spacing == '日'" class="w200">
            <DatePicker type="date" v-model="day" :options="option1" placeholder="请选择日" :editable="false" :clearable="false"></DatePicker>
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
    name: "service-reports",
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
            // let now = new Date();
            // return date > now;
            let now = new Date();
            let d1 = new Date(now.getFullYear(), now.getMonth(),now.getDate());
            let d2 = new Date(now.getFullYear() - 1, 7,1);
            return date > d1 || date < d2;
          }
        },
        tableData: [],
        columns: [
          {
            title: '序号', width: 70, align: 'center',
            render: (h, params) => h('span', (this.page - 1) * this.size + params.index + 1)
          },
          {title: '运营人员账号',key:'userCode', minWidth: 140},
          {title: '门店',key:'tenantName', minWidth: 140},
          {title: '车牌号',key:'licenseNo', minWidth: 140},
          {title: '认领时间',key:'claimTime', minWidth: 140},
          {title: '培训结果',key:'trainResult', minWidth: 140,
            render: (h, params) => h('span',this.result(params.row.trainResult))
          },
          {title: '是否精准报价',key:'precise', minWidth: 140,
            render: (h, params) => h('span',params.row.precise >= 2 ? '是' : '否')
          },
        ],
        monthList: [{code: 0, name: '请选择月份'}],
        spacing:'日',
        total: 0,
        page: 1,
        account:'',
        size: 25,
        showTable: false,
        start:'',
        end:'',
        activated: false,
      }
    },
    mounted() {
      if(this.$route.query.spacing) {
        this.spacing = this.$route.query.spacing;
        let arr = this.$route.query.time.split('-');
        this.account = this.$route.query.userCode || '';
        let date = new Date();
        switch(this.spacing){
          case '月':
            this.month = new Date(arr[0],(parseInt(arr[1])-1));
            this.week = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            this.day = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            break;
          case '周':
            this.week = new Date(arr[0],(parseInt(arr[1])-1),arr[2]);
            this.month = new Date(date.getFullYear(),date.getMonth());
            this.day = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            break;
          case '日':
            this.day = new Date(arr[0],(parseInt(arr[1])-1),arr[2]);
            this.month = new Date(date.getFullYear(),date.getMonth());
            this.week = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            break;
        }
      }else{
        let date = new Date();
        this.month = new Date(date.getFullYear(),date.getMonth());
        this.week = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        this.day = new Date(date.getFullYear(),date.getMonth(),date.getDate());
      }
      this.showTable = Math.random();
      this.getList();
    },
    activated(){
      if(this.$route.query.spacing && this.activated) {
        this.spacing = this.$route.query.spacing;
        let arr = this.$route.query.time.split('-');
        this.account = this.$route.query.userCode || ''
        let date = new Date();
        switch(this.spacing){
          case '月':
            this.month = new Date(arr[0],(parseInt(arr[1])-1));
            this.week = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            this.day = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            break;
          case '周':
            this.week = new Date(arr[0],(parseInt(arr[1])-1),arr[2]);
            this.month = new Date(date.getFullYear(),date.getMonth());
            this.day = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            break;
          case '日':
            this.day = new Date(arr[0],(parseInt(arr[1])-1),arr[2]);
            this.month = new Date(date.getFullYear(),date.getMonth());
            this.week = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            break;
        }
        this.getList();
      }
      this.activated = true;
    },
    methods: {
      result(code){
        let number = parseInt(code);
        switch(number){
          case 1:
            return '未联系';
          case 2:
            return '电话不通';
          case 3:
            return '不买车险';
          case 4:
            return '买其他渠道车险';
          case 5:
            return '下次联系';
          case 6:
            return '已完成联系';
          default:
            return '';
        }
      },
      rowClick(row){
        // alert("要跳转");
      },
      fill(val){
        if(val <10) return "0"+val;
        else return val;
      },
      getList() {
        let time = [];
        switch(this.spacing){
          case "月":
            let date = new Date(this.month.getFullYear(),this.month.getMonth()+1,0);
            let day = this.fill(date.getDate());
            time.push(this.month.getFullYear()+"-"+this.fill((this.month.getMonth()+1))+"-01 00:00:00");
            time.push(this.month.getFullYear()+"-"+this.fill((this.month.getMonth()+1))+ "-" + day + " 23:59:59");
            console.log(JSON.stringify(time));
            break;
          case "周":
            time.push(this.start+" 00:00:00");
            time.push(this.end + " 23:59:59");
            console.log(JSON.stringify(time));
            break;
          case "日":
            time.push(this.day.getFullYear()+"-"+this.fill((this.day.getMonth()+1))+"-"+this.fill(this.day.getDate())+" 00:00:00");
            time.push(this.day.getFullYear()+"-"+this.fill((this.day.getMonth()+1))+"-"+this.fill(this.day.getDate())+" 23:59:59");
            console.log(JSON.stringify(time));
            break;
        }
        this.axios.request({
          baseURL: '/poxy-next',
          url: '/manage/market/customServiceList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            limit:this.size,
            page:this.page,
            KEY_WORD:this.account,
            START_DATE:time[0],
            END_DATE:time[1],
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
          this.start = start.getFullYear() + "-" + this.fill((start.getMonth()+1)) + "-" + this.fill(start.getDate());
          this.end = end.getFullYear() + "-" + this.fill((end.getMonth()+1)) + "-" + this.fill(end.getDate());
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
