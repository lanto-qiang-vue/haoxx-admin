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
        time:'',
        account:'',
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
          {title: '运营账号',key:'userCode', minWidth: 140},
          {title: '认领次数',key:'claimSum', minWidth: 140},
          {title: '培训成功次数',key:'trainSum', minWidth: 140},
          {title: '精准报价数',key:'offerSum', minWidth: 140},
        ],
        monthList: [{code: 0, name: '请选择月份'}],
        spacing:'月',
        total: 0,
        page: 1,
        size: 25,
        showTable: false,
        start:'',
        end:'',
      }
    },
    mounted() {
      this.showTable = Math.random();
      let date = new Date();
      this.month = new Date(date.getFullYear(),date.getMonth());
      this.week = new Date(date.getFullYear(),date.getMonth(),date.getDate());
      this.day = new Date(date.getFullYear(),date.getMonth(),date.getDate());
      this.getList();
    },
    methods: {
      rowClick(row){
        this.$router.push({path:'/service-detail',query:{time:this.time,spacing:this.spacing,userCode:row.userCode}});
      },
      fill(val){
        if(val <10) return "0"+val;
        else return val;
      },
      getList() {
        let time = [];
        let trueTime = '';
        switch(this.spacing){
          case "月":
            let date = new Date(this.month.getFullYear(),this.month.getMonth()+1,0);
            let day = this.fill(date.getDate());
            trueTime = this.toymd(this.month);
            time.push(this.month.getFullYear()+"-"+this.fill((this.month.getMonth()+1))+"-01 00:00:00");
            time.push(this.month.getFullYear()+"-"+this.fill((this.month.getMonth()+1))+ "-" + day + " 23:59:59");
            console.log(JSON.stringify(time));
            break;
          case "周":
            time.push(this.start+" 00:00:00");
            time.push(this.end + " 23:59:59");
            trueTime = this.toymd(this.week);
            console.log(JSON.stringify(time));
            break;
          case "日":
            time.push(this.day.getFullYear()+"-"+this.fill((this.day.getMonth()+1))+"-"+this.fill(this.day.getDate())+" 00:00:00");
            time.push(this.day.getFullYear()+"-"+this.fill((this.day.getMonth()+1))+"-"+this.fill(this.day.getDate())+" 23:59:59");
            trueTime = this.toymd(this.day);
            console.log(JSON.stringify(time));
            break;
        }
        this.axios.request({
          baseURL: '/poxy-next',
          url: '/manage/market/customDetail',
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
            this.time = trueTime;
          }
        })
        // this.tableData = [{A: '13983765456', B: 10, C: 8, D: 9},
        //   {A: '18678765456', B: 20, C: 15, D: 10}
        // ];
      },
      changePageSize(size) {
        this.size = size;
        this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      toymd(date){
        return date.getFullYear() + "-"+ this.fill(date.getMonth()+1) + "-" + this.fill(date.getDate());
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
