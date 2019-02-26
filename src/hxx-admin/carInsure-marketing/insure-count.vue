<template>
  <div style="width:100%;height:100%;position:relative;">
    <div ref="countApp" class="countApp">

    </div>
    <div style="position:absolute;right:10%;top:40px;" v-show="showType">
      <Form>
        <FormItem  :label-width="0" style="margin-right:20px;">
          <DatePicker type="month" v-model="month" :options="options" placeholder="请选择月份" :editable="false" :clearable="false" @on-change="changMonth"></DatePicker>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
      name: "insure-count",
      data() {
        return {
          EApp: null,
          month:'',
          monthList:[],
          showType:false,
          options: {
            disabledDate(date) {
              let now = new Date();
              let d1 = new Date(now.getFullYear(), now.getMonth());
              let d2 = new Date(now.getFullYear(),0);
              return date > d1 || date < d2;
            }
          }
        }
      },
      mounted() {
        let time = new Date();
        this.month = new Date(time.getFullYear(),time.getMonth());
        let month = time.getMonth() + 1;
        for(let i =1;i<=month;i++){
          this.monthList.push({code:i,name:i+"月份"});
        }
        let self = this;
        window.onresize = function () {
          if (window.innerWidth != self.windowInnerWidth) {
            if (self.EApp) {
              self.EApp.resize();
            }
          }
        };
        this.getList();
      },
      methods:{
        changMonth(){
         this.getList();
        },
        getList(){
          this.axios.request({
            baseURL: '/poxy-next',
            url: '/manage/statistic/list',
            method: 'post',
            data: {
              access_token: this.$store.state.user.token,
              STATISTIC_TIME:this.month.getFullYear() + "-" + (this.month.getMonth() + 1)
            },
          }).then(res => {
             if(res.success === true){
               let data = res.data.monthArray.reverse();
               let obj = {};
               for(let i in data){
                 obj[data[i]] = {a:0,b:0,c:0,d:0}
               }
               //扫车牌数
               let scanPlate = res.data.scanPlate;
               for(let i in scanPlate){
                 obj[scanPlate[i].yearMonth].a = scanPlate[i].count;
               }
               //认领数
               let claim = res.data.claim;
               for(let i in claim){
                 obj[claim[i].yearMonth].b = claim[i].count;
               }
               //精准报价数
               let quotation = res.data.quotation;
               for(let i in quotation){
                 obj[quotation[i].yearMonth].c = quotation[i].count;
               }
               //购买数
               let purchase = res.data.purchase;
               for(let i in purchase){
                 obj[purchase[i].yearMonth].d = purchase[i].count;
               }
               this.getEApp(obj);
             }
          })
        },
        getEApp(data){
          this.EApp = echarts.init(this.$refs.countApp);
          let x = [];
          let y1 = [];
          let y2 = [];
          let y3 = [];
          let y4 = [];
          for(let i in data){
            x.push(i);
            y1.push(data[i].a);
            y2.push(data[i].b);
            y3.push(data[i].c);
            y4.push(data[i].d);
          }
          this.EApp = echarts.init(this.$refs.countApp);
          let option = {
            title:{
              show:true,
              text:'车险运营情况',
              x:'center',
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(params) {
                let index;
                if(params[0].seriesType == 'line'){
                  index = x[params[0].dataIndex];
                }else{
                  index = params[0].axisValue;
                }
                console.log(params);
                let str = "";
                str += '<div style="background-color:#3C6AC1" class="eclass"></div>扫码牌数:' + data[index].a + '<br/>';
                str += '<div style="background-color:#FF8137" class="eclass"></div>认领数:' + data[index].b + '<br/>';
                str += '<div style="background-color:#A5A5A5" class="eclass"></div>精准报价数:' + data[index].c + '<br/>';
                str += '<div style="background-color:#FFC52D" class="eclass"></div>车险购买数:' + data[index].d + '<br/>';
                return str;
              },
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                label: { show: false }
              }
            },
            legend: {
              data: ['扫车牌数', '认领数','精准报价数','车险购买数'],
              bottom:0,
            },
            xAxis: [{
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月'],
              axisPointer: {
                type: 'shadow'
              }
            }, ],
            yAxis: [{
              type: 'value',
              min: 0,
            },
              // {
              //   type: 'value',
              //   name: '温度',
              //   position: 'right',
              //   min: 0,
              //   max: 50,
              //   axisLabel: {
              //     formatter: '{value} °C'
              //   }
              // }
            ],
            series: [{
              name: '扫车牌数',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#3C6AC1'
                }
              },
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2],
              z: 3
            },
              {
                name: '认领数',
                type: 'bar',
                itemStyle: {
                  normal: {
                    color: '#FF8137'
                  }
                },
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2],
                z: 3
              },
              {
                name: '精准报价数',
                type: 'bar',
                itemStyle: {
                  normal: {
                    color: '#A5A5A5'
                  }
                },
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2],
                z: 3
              },
              {
                name: '车险购买数',
                type: 'bar',
                itemStyle: {
                  normal: {
                    color: '#FFC52D'
                  }
                },
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2],
                z: 3
              },
              {
                xAxisIndex: 1,
                name: '线1',
                type: 'line',
                // yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: '#3C6AC1'
                  }
                },
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2]
              },
              {
                xAxisIndex: 1,
                name: '线2',
                type: 'line',
                // yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: '#FF8137'
                  }
                },
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2]
              },
              {
                xAxisIndex: 1,
                name: '线3',
                type: 'line',
                itemStyle: {
                  normal: {
                    color: '#A5A5A5'
                  }
                },
                // yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2]
              },
              {
                xAxisIndex: 1,
                name: '线4',
                type: 'line',
                itemStyle: {
                  normal: {
                    color: '#FFC52D'
                  }
                },
                // yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2]
              },
            ]
          };

// 增加了一个隐藏的x轴，用来控制线图的点的位置
          option.xAxis[0].data = x;
          option.series[0].data = y1;
          option.series[1].data = y2;
          option.series[2].data = y3;
          option.series[3].data = y4;
          option.series[4].data = y1;
          option.series[5].data = y2;
          option.series[6].data = y3;
          option.series[7].data = y4;
          option.xAxis[1] = {
            type: 'value',
            max: option.xAxis[0].data.length * 100,
            show:false,
          }
          option.series[4].data = option.series[4].data.map((x, i) => [18 + i * 100, x])
          option.series[5].data = option.series[5].data.map((x, i) => [40 + i * 100, x])
          option.series[6].data = option.series[6].data.map((x, i) => [60 + i * 100, x])
          option.series[7].data = option.series[7].data.map((x, i) => [80 + i * 100, x])
          this.EApp.clear();
          this.EApp.setOption(option);
          this.showType = true;
          this.EApp.on('click', (params) => {
            console.log(parseInt(params.name));
          });
        },
      },
    }
</script>

<style>
.eclass{
  display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;
}
</style>
<style scoped lang="less">
  .countApp{
    width: 100%;height: 650px;padding-top:30px;position:relative;
  }
</style>
