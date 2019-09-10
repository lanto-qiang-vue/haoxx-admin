<template>
<div class="inspection-report-statistics">
  <div class="pie">
    <div id="pie"></div>
    <div class="sum">
      <span>{{allNum}}</span>
      <p>报告总数量</p>
    </div>
  </div>

  <common-table v-model="tableData" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :page="page" :ellipsis="false"
                ref="table" :loading="loading" class="table"></common-table>
  <car-inspection-list :isPage="false" ref="carInspectionList" v-show="false"></car-inspection-list>
</div>
</template>

<script>
import commonTable from '@/hxx-components/common-table.vue'
import CarInspectionList from '@/hxx-store/car-inspection/car-inspection-list.vue'
import echarts from 'echarts'
export default {
  name: "inspection-report-statistics",
  components: {commonTable, CarInspectionList},
  data(){
    return{
      EApp:null,
      columns: [
        {title: '序号', key: 'id', type:'index' , width: 70, align: 'center'},
        {title: '车主', key: 'vehicle_owner', minWidth: 90},
        {title: '联系电话', key: 'telphone', minWidth: 110},
        // {title: '车牌号', key: 'vehicle_owner', minWidth: 100},
        {title: '车检日期', key: 'inspect_date', minWidth: 200},
        {title: '保险到期时间', key: 'insurance_expire_date', minWidth: 200},
        {title: '查看报告', key: 'id', width: 90, align: 'center', fixed: 'right', render:(h,params) => {
            return h('i',{
              class: 'fa fa-search',
              style: {
                fontSize: '16px',
                cursor: 'pointer',
              },
              on: {
                click:()=>{
                  // console.log('click')
                  this.open(params.row.id)
                }
              },
            })
          }
        },
      ],
      tableData: [],
      total: 0,
      loading: true,
      page: 1,
      limit: 25,
      allNum: 0
    }
  },
  mounted(){
    this.getList((obj)=>{
      this.setChart(obj)
    })
  },
  methods:{
    getList( callback){
      this.loading= true
      this.axios.post('/manage/count/all', {
        limit:this.limit,
        page:this.page,
      }).then( (res) => {
        // console.log(res)
        if(res.success){
          this.total= res.total
          this.tableData= res.data.items
          this.loading= false
          if(callback){
            callback(res.data.count[0])
          }
        }
      })
    },
    setChart({num, realnum, truthrate}){
      this.EApp = echarts.init(document.getElementById('pie'));
      this.allNum= num
      let fake= parseInt(num)- parseInt(realnum)
      let option = {
        title: {
          text:'车辆检查报告统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
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
            {value: realnum, name: '真实数量'},
            {value: fake, name: '虚假数量'},
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
    open(id){
      this.$refs.carInspectionList.open(id)
    },
    changePageSize(size) {
      this.limit = size;
      if (this.page == 1)
        this.getList((obj)=>{
          this.setChart(obj)
        });
    },
    changePage(page) {
      // console.log("changePage");
      this.page = page;
      this.getList((obj)=>{
        this.setChart(obj)
      });
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
