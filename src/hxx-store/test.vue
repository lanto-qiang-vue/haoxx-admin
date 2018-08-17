<template>
  <div style="height: 100%;">
    <!--<Row :gutter="20">
      <i-col span="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <i-col span="8">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col span="16">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row style="margin-top: 20px;">
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
      <div class="dClass">
        <Table stripe :columns="columns1" :data="data1"></Table>
      </div>
    </Row>-->

        <div class="dClass">
          <!--头部-->
          <div id="dHead">

            <div class="orderSearch">
              <Input v-model="message1" placeholder="预约单号/预约人/联系电话..." />
            </div>

            <div class="orderSearch1">
              <Select v-model="model" placeholder="选择状态...">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>

            <div class="orderDate">
              <span>预约日期:</span>
              <DatePicker type="date" placeholder="开始日期" style="width: 104px"></DatePicker> -
              <DatePicker type="date" placeholder="结束日期" style="width: 104px"></DatePicker>
            </div>
            <div class="buttonSearch">
              <a>
                <ButtonGroup size="small">
                  <Button type="primary"><Icon type="ios-search" size="24"/></Button>
                  <Button type="primary"><Icon type="ios-undo" size="24"/></Button>
                </ButtonGroup>
              </a>
            </div>

          </div>
          <!--内容-->
          <div id="dBody">
            <div class="buttonFater clearfloat">
              <div class="addButton"><Icon type="md-add" size="24"/><span>新增</span></div>

              <div class="addButton1"><Icon type="ios-create-outline" size="24"/><span>编辑/查看</span></div>

              <div class="addButton2"><Icon type="ios-trash" size="24"/><span>作废</span></div>

            </div>

            <Table stripe :columns="columns1" :data="data1" border ref="table" :height="tableHeight"></Table>
          </div>

          <div id="dFoot">
              <div class="firstPage">
                <Icon type="ios-skip-backward-outline" size="24"/>
              </div>

              <div class="firstPage">
                <Icon type="ios-arrow-back" size="24"/>
              </div>

              <div class="oneLine">
                |
              </div>

              <div class="onePage">
                <span>第 </span>
                <!--<input type="text" value="1" v-model="message">-->
                <Input v-model="message1" placeholder="预约单号/预约人/联系电话..."/>
                <span> 页,共 {{message}} 页</span>
              </div>
              <div class="oneLine">
                |
              </div>
              <div class="onePage">
                <span>每页</span>
                <Select v-model="model2" class="selectpage" placeholder="选择状态...">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span>条</span>
              </div>
              <div class="oneLine">
                |
              </div>
              <div class="firstPage">
                <Icon type="ios-arrow-forward" size="24"/>
              </div>

              <div class="firstPage">
                <Icon type="ios-skip-forward-outline" size="24"/>
              </div>
              <div class="oneLine">
                |
              </div>
              <div class="firstPage" title="刷新">
                <Icon type="md-refresh" size="24"/>
              </div>

              <div class="progress" @click="addProgress">
                  <Progress :percent="percent" stroke-width="24" hide-info/>
                  <div class="progressData">
                    <span>显示1-25条，共102条</span>
                  </div>
              </div>

          </div>

        </div>

  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
// import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar
    // Example
  },
  data () {
    return {
      percent: 50,
      model1: 'New York',
      message: 1,
      newh: false,
      newh1: true,
      tableHeight: 450,
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 23432, color: '#19be6b' },
        { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      columns1: [
        {
          title: 'Name',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Age',
          key: 'age',
          ellipsis: true,
          vtooltip: true

        },
        {
          title: 'Address',
          key: 'address',
          ellipsis: true,
          tooltip: true
        }, {
          title: 'Name',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Age',
          key: 'age',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Address',
          key: 'address',
          ellipsis: true,
          tooltip: true
        }, {
          title: 'Name',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Age',
          key: 'age',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Address',
          key: 'address',
          ellipsis: true,
          tooltip: true
        }, {
          title: 'Name',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Age',
          key: 'age',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Address',
          key: 'address',
          ellipsis: true,
          tooltip: true
        }, {
          title: 'Name',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Age',
          key: 'age',
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Address',
          key: 'address',
          ellipsis: true,
          tooltip: true
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      cityList: [
        {
          value: 'New York',
          label: '25'
        },
        {
          value: 'London',
          label: '50'
        },
        {
          value: 'Sydney',
          label: '75'
        },
        {
          value: 'Ottawa',
          label: '100'
        },
        {
          value: 'Paris',
          label: '150'
        },
        {
          value: 'Canberra',
          label: '200'
        }
      ]
    }
  },
  methods: {
    handClick () {
      this.newh = !this.newh
      this.newh1 = !this.newh1
    },
    addProgress () {
      this.percent += 10
      console.log(this.percent)
    }
  },
  mounted () {
    //
    // console.log($("#dHead"));
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 460
    console.log(window.innerHeight, this.$refs.table.$el.offsetTop)
    console.log(this.tableHeight)
  }
}
</script>

<style lang="less">
   /*清除浮动代码*/
   .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
   .clearfloat{zoom:1}

#dHead.act{
  height: 100px;
  transition: 0.5s;
}
#dHead.act1{
  height: 50px;
  transition: 0.5s;
}
.count-style{
  font-size: 50px;
}
.dClass{
  width: 100%;
  height: 100%;
  /*overflow: auto;*/
  position: relative;
  /*border: 2px solid red;*/
}

/*头部数据------------*/
#dHead {
    height:64px;
    line-height:64px;
    width:100%;
    position:absolute;
    z-index:500;
    top:0;
    text-align:center;
    border: 1px solid #ccc;
}
.orderSearch{
  width: 398px;
  height: 64px;
  float: left;
  margin-left: 5px;
}

.orderSearch input{
  width: 398px;
  height: 30px;

}

.orderSearch1{
  width: 116px;
  height: 64px;
  float: left;
  margin-left: 5px;
}

.orderSearch1 input{
  width: 116px;
  height: 30px;

}
.orderDate{
  width: 280px;
  height: 64px;
  float: left;
  margin-left: 5px;
}

.buttonSearch{
  width: 80px;
  height: 64px;
  float: left;
}

.buttonSearch a{
  width: 80px;
  height: 30px;
  display: block;
}

/*内容区域----------------*/
#dBody.dBody{
  top:50px;
  transition: 0.5s;
}
#dBody {
    /*background:#FC0;*/
    width:100%;
    overflow:auto;
    top:64px;
    position:absolute;
    z-index:10;
    bottom:52px;
    transition: 0.5s;
}
.buttonFater{
  margin: 4px 0;
}
.addButton{
  width: 70px;
  height: 32px;
  background: #16a3f4;
  color: #fff;
  font-size:14px;
  line-height: 32px;
  text-align: center;
  float: left;
  margin-left: 5px;
}
.addButton1{
  width: 100px;
  height: 32px;
  background: #16a3f4;
  color: #fff;
  font-size:14px;
  line-height: 32px;
  text-align: center;
  float: left;
  margin-left: 5px;
}
.addButton2{
  width: 70px;
  height: 32px;
  background: #e13345;
  color: #fff;
  font-size:14px;
  line-height: 32px;
  text-align: center;
  float: left;
  margin-left: 5px;
}

/*底部翻页标签-------------*/
#dFoot {
    border: 1px solid #ccc;
    height: 50px;
    width:100%;
    position:absolute;
    z-index:100;
    bottom:0px;
    text-align:center;
    /*overflow: hidden;*/
}
.firstPage{
  width: 30px;
  height: 35px;
  text-align: center;
  margin-top:7.5px;
  /*margin-left: 10px;*/
  padding: 0;
  line-height: 35px;
  float: left;
}
.firstPage:hover{
  background: #ccc;
}
.oneLine{
  width: 20px;
  float: left;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #000;
  font-size: 16px;
}
.onePage{
  height: 50px;
  /*font-size:18px;*/
  float:left;
  line-height: 50px;
}
.onePage span{

  line-height: 50px;
}
.onePage input{
  width: 50px;
  height: 30px;
  text-align: center;
}
.selectpage{
  width: 80px;
  height: 35px;
  font-size:18px;
}

.progress{
  width: 225px;
  height: 50px;
  line-height: 50px;
  float: right;
  position: relative;
  /*background: #ccc;*/
}
.progressData{
  width: 225px;
  height: 50px;
  line-height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  color: #000;
  font-size: 14px;
}

</style>
