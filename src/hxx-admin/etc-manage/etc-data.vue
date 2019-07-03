<template>
  <div style="width:100%;height:100%;position:relative;">
    <div style="padding: 30px;">
        <RadioGroup v-model="checkButton" type="button" @on-change="changMonth">
            <Radio label="1001">今日</Radio>
            <Radio label="1002">昨日</Radio>
            <Radio label="1003">最近7日</Radio>
            <Radio label="1004">最近30日</Radio>
        </RadioGroup>
        <div style="display: inline-block;width: 250px;">
            <DatePicker style="width: 100%;" v-model="selectDate" type="daterange" :options="options" placeholder="请选择日期" @on-change="changData"></DatePicker>
        </div>
    </div>
    <div class="title-data">
        <ul>
            <li>
                <p>分享成功数</p>
                <p>{{listData.newuser_etc}}</p>
            </li>
            <li>
                <p>公众号新增</p>
                <p>关注数</p>
                <p>{{listData.newFollows}}</p>
            </li>
            <li>
                <p>车生活新增</p>
                <p>注册用户数</p>
                <p>{{listData.car_register}}</p>
            </li>
            <li>
                <p>点击“下一步”按钮</p>
                <p>用户数</p>
                <p>{{listData.etc_application}}</p>
                <p>(由分享点击{{listData.etc_share}}，自行参与点击{{listData.etc_application-listData.etc_share}})</p>
            </li>
        </ul>
    </div>
    <div id="etdDatas" class="countApp"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
      name: "ETC-data",
      data() {
        return {
            checkButton:"1003",
            EApp:null,
            selectDate:'',
            sendData:{
                timeFlag:'',
                beginTime:'',
                endTime:''
            },
            options: {
                disabledDate (date) {

                    return date && date.valueOf() > Date.now();
                }
            },
            listData:{"newuser_etc":0,"etc_share":0,"etc_application":0,"car_register":0,"newFollows":0}
        }
      },
      mounted() {
        
        let self = this;
        window.onresize = function () {
          if (window.innerWidth != self.windowInnerWidth) {
            if (self.EApp) {
              self.EApp.resize();
            }
          }
        };
        this.sendData['timeFlag']=1003;
        this.getList();
      },
      methods:{
        changMonth(val){
            console.log(val);
            this.sendData['timeFlag']=val;
            this.sendData['beginTime']='';
            this.sendData['endTime']='';
            this.selectDate='';
            this.getList();
        },
        changData(val){
            console.log('val',val);
            if(val.length>0&&val[0]){
                this.checkButton='';
                this.sendData['timeFlag']=1005;
                this.sendData['beginTime']=val[0];
                this.sendData['endTime']=val[1];
            }else{
                this.checkButton="1003";
                console.log('jinru 判断');
                this.sendData['timeFlag']=1003;
                this.sendData['beginTime']='';
                this.sendData['endTime']='';
            }
            this.getList();
            
        },
        getList(){
          this.$fly.request({
            baseURL: '/poxy-shqx',
            url: '/operate/etc/count',
            method: 'post',
            data: this.sendData,
          }).then(res => {
              console.log('res',res);
             if(res.success === true){
               this.listData=res.data;
               let data=[res.data['newuser_etc'],res.data['newFollows'],res.data['car_register'],res.data['etc_share']];
               let data1=['','',''];
               let temData=res.data['etc_application']-res.data['etc_share'];
               data1.push(temData);
               console.log(data,data1);
               this.setBarFun(data,data1);
             }
          })
        },
        setBarFun(resData,resData1){
            this.EApp = echarts.init(document.getElementById('etdDatas'));
            var option = {
                title: {},
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                    label: { show: true }
                    },
                    formatter: function(params) {
                        let company = params[0].axisValue
                        console.log('dataObj',company);
                        let str=company+ '<br/>';
                        switch(company){
                            case '分享成功数':
                                str += '<div style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#2b85e4"></div>分享成功数:' + resData[0] + '<br/>'
                            break;
                            case '公众号新增关注数':
                                str += '<div style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#BA6D15"></div>公众号新增关注数:' + resData[1] + '<br/>'
                            break;
                            case '车生活新增注册用户数':
                            str += '<div style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#808695"></div>车生活新增注册用户数:' + resData[2] + '<br/>'
                            break;
                            case '点击“下一步”按钮用户数':
                            str += '<div style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ed4014"></div>由分享点击:' + resData[3] + '<br/>'
                            str += '<div style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ff9900"></div>自行参与点击:' + resData1[3] + '<br/>'
                            str += '<div style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#c0c0c0"></div>点击“下一步”按钮用户数:' + (resData[3]+resData1[3]) + '<br/>'
                            break;
                        }
                            
                        

                        return str;
                    },
                },
                legend: {
                    data:['ETC数据']
                },
                xAxis: {
                    type : 'category',
                    data: ["分享成功数","公众号新增关注数","车生活新增注册用户数","点击“下一步”按钮用户数"],
                    axisLabel: {
                        interval: 0,
                        rotate: 0,
                        padding: [4, 0]
                    },
                },
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = [
                                    '#2b85e4','#BA6D15','#808695','#ed4014'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                            }
                        },
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        barWidth:70,
                        stack: '用户数',
                        data: resData
                    },
                    {
                        type: 'bar',
                        stack: '用户数',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = [
                                    '#000000','#cccccc','#333333','#ff9900'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                            }
                        },
                        label: {
                            show: true,
                            position: 'inside'
                        },
                        barWidth:70,
                        data: resData1
                    }
                ]
            };
            this.EApp.clear();
            this.EApp.setOption(option);
            this.EApp.resize();
        }
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
    width: 100%;height: 600px;position:relative;
  }
  .title-data{
      padding: 0 30px;
      ul{
         overflow: hidden;
         li{
             list-style: none;
            padding: 0px;
            margin: 0px;
             float: left;
             width: 25%;
             
             p{
                 text-align: center;
                 font-size: 20px;
             }
         } 
      }
  }
</style>
