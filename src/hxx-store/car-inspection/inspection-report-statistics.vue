<template>
<div class="inspection-report-statistics">
  <div class="pie">
    <div id="pie"></div>
    <div class="sum">
      <span>1000</span>
      <p>报告总数量</p>
    </div>
  </div>

  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :page="page" :ellipsis="false"
                ref="table" :loading="loading" class="table"></common-table>
</div>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
import echarts from 'echarts'
export default {
  name: "inspection-report-statistics",
  components: {commonTable},
  data(){
    return{
      EApp:null,
      columns: [

      ],
      tableData: [],
      total: 0,
      loading: true,
      page: 1,
      limit: 25,
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading= true
      this.axios.post('/manage/count/all', {
        limit:this.limit,
        page:this.page,
      }).then( (res) => {
        // console.log(res)
        if(res.success){
          this.total= res.total
          this.tableData= res.data
          this.loading= false
          this.setChart()
        }
      })
    },
    setChart(){
      this.EApp = echarts.init(document.getElementById('pie'));
      let option1 = {
        // title : {
        //   text: '某站点用户访问来源',
        //   subtext: '纯属虚构',
        //   x:'center'
        // },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        // },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
              {value:335, name:'真实数量700\n真实率70%'},
              {value:310, name:'邮件营销'},
              {value:234, name:'联盟广告'},
              {value:135, name:'视频广告'},
              {value:1548, name:'搜索引擎'}
            ],
            // itemStyle: {
            //   emphasis: {
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // }
          }
        ]
      };
      let option = {
        title: {
          text:'车辆检查报告统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //   orient: 'vertical',
        //   // x: 'left',
        //   bottom: 0,
        //   data:['真实数量','虚假数量']
        // },
        // markLine:{
        //   label: 'markLine',
        //   show: true
        // },
        color:['#5C8FEF','#E2EBFC'],
        series: [{
          name:'车辆检查报告统计',
          type:'pie',
          radius: ['45%', '65%'],
          // avoidLabelOverlap: false,
          label: {
            fontSize: 13,
            formatter: "{b}\n{c}({d}%)",
            // formatter: (params) => {
            //   console.log(params)
            // },
            // normal: {
            //   show: false,
            //   position: 'center'
            // },
            // emphasis: {
            //   show: false,
            //   textStyle: {
            //     fontSize: '16',
            //     fontWeight: ''
            //   }
            // }
          },
          // labelLine: {
          //   normal: {
          //     show: false
          //   }
          // },
          data:[
            {value:4380, name: '真实数量'},
            {value:1620, name: '虚假数量'},
          ],
          // itemStyle: {
          //   emphasis: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)'
          //   }
          // }
        }]
      };
      this.EApp.setOption(option);
    },
    changePageSize(size) {
      this.limit = size;
      if (this.page == 1) this.getList();
    },
    changePage(page) {
      // console.log("changePage");
      this.page = page;
      this.getList();
    }
  }
}
</script>

<style scoped lang="less">
.inspection-report-statistics{
  background-color: white;
  padding-left: 450px;
  padding-right: 0;
  height: 100%;
  position: relative;
  .pie{
    width: 450px;
    height: 450px;
    position: absolute;
    top: 45%;
    left: 0;
    transform: translateY(-50%);
    #pie{
      width: 100%;
      height: 100%;
    }
    .sum{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      span{
        font-size: 30px;
        font-weight: 600;
      }
      p{
        font-size: 14px;
      }
    }
  }
  .table{
    padding: 0 10px;
  }
}

</style>
