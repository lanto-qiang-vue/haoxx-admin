<template>
  <div style="width:100%;height:100%;position:relative;">
    <div class="main-body" v-show="!showModal">
      <!--<div style="width:100%;text-align: center;font-size:24px;padding-top: 20px;"><b>操作指南</b></div>-->
      <div class="box" v-for="item in list">
        <div class="small-box" @click="to(item.imgList,item.button || [],item.paging || [])" :style="{background:item.background}">
          <div>{{item.title}}</div>
        </div>
      </div>
    </div>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height description"
      ref="myBox"
      width="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']">
      <img v-for="item in urlList" :src="'/static/operation/operation-'+item+'.png'" width="100%" style="max-width:1200px;"/>
      <div slot="footer">
        <div class="button-box">
            <div :class="['child',{'mf':item.flag}]" v-for="(item,index) in buttonList" >
              <div :class="['box-1',{'blue':item.id == id}]" @click="urlList=item.url,id=item.id,goTop()">
                <div v-html="item.title">
                </div>
              </div>
              <div v-if="item.arrows" class="box-2">
                <img :src="item.arrows" height="40" style="padding-left:10px;padding-right:10px;"/>
              </div>
              <div v-else  v-show="item.flag != true" class="box-2">
                <img src="/static/operation/bigarrows.png" height="40"/>
              </div>
            </div>
          </div>
        <Button type="primary" v-for="item in pagingList" v-show="id == item.id" @click="id=item.nextId,urlList=item.nextUrl,goTop()">{{item.text}}</Button>
        <Button type="primary" @click="showModal=false">返回操作指南索引</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ModalTitle from '@/hxx-components/modal-title.vue'

  export default {
    name: "operation-description",
    components: {ModalTitle},
    data() {
      return {
        img: '',
        title: '',
        imgList: [],
        id: '',
        urlList: [],
        nextType: false,
        showModal: false,
        pagingList:[],
        buttonList: [

        ],
        list: [
          {
            title: '上线初始化', background: '#72CC6A', imgList: [{id:1,url:[1]}], button: [
              {title: '登录丶注册',id:1,url:[1]},
              {title: '主页面',id:2,url:[2]},
              {title: '门店<br/>员工账号',id:3,url:[3]},
              {title: '门店<br/>维修项目',id:4,url:[4,5]},
              {title: '门店<br/>配件档案',id:6,url:[6]},
              {title: '门店<br/>客户车辆',id:7,url:[7,8]},
              {title: '门店<br/>参数维护',id:9,url:[9],flag:true},
            ]
          },
          {title: 'pc接车', background: '#5FBCF4', imgList: [{id:10,url: [10,11]}],button:[
              {title: '接车录入',id:10,url:[10,11]},
              {title: '派工',id:12,url:[12]},
              {title: '领料',id:13,url:[13]},
              {title: '完工',id:14,url:[14]},
              {title: '结算并自动上传电<br/>子健康档案',id:15,url:[15]},
              {title: '收款',id:16,url:[16],flag:true},
              {title: '反向操作',id:17,url:[17],flag:true},
            ]},
          {title: 'APP接车', background: '#F45F5F', imgList: [{id:18,url: [18,19]}],
          button:[
            {title:'APP下载',id:18,flag:true,url:[18,19]},
            {title:'扫码接车',id:20,url:[20,21]},
            {title:'派工',arrows:'/static/operation/apparrows.png',id:22,url:[22]},
            {title:'完工',id:23,url:[23]},
            {title:'结算并自动上传电<br/>子健康档案',id:24,url:[24]},
            {title:'收款',id:25,flag:true,url:[25]}
            ],
          },
          {
            title: '卖车险(工单入口)', background: '#F2C61C', imgList: [{
              id:26,
              url: [26],
            }],
            paging:[
              {id:26,nextId:27,text:"下一页",nextUrl:[27,28,29,30,31,32,33,34,35,36]},
              {id:27,nextId:26,text:"上一页",nextUrl:[26]}
            ]
          },
          {
            title: '卖车险(首页入口)', background: '#5FBCF4', imgList: [
              {
                id:37,
                url: [37,38]
              }
            ],
            paging:[
              {id:37,nextId:27,text:"下一页",nextUrl:[27,28,29,30,31,32,33,34,35,36]},
              {id:27,nextId:37,text:"上一页",nextUrl:[37,38]}
            ],
          },
          {title: '门店进销存', background: '#9F5FF4', imgList: [{id:39,url: [39]}],button:[
              {title:'供应商丶配件',id:39,url:[39]},
              {title:'仓库',id:40,url:[40]},
              {title:'配件采购',id:41,url:[41,42]},
              {title:'采购退货',id:43,url:[43,44]},
              {title:'配件销售',id:45,url:[45,46]},
              {title:'销售退货',id:47,url:[47,48]},
              {title:'仓库盘点',id:49,url:[49,50]},
              {title:'库存查询',flag:true,id:51,url:[51,52]}
            ]},
          {title: '会员卡充值/消费', background: '#D4D3D0', imgList: [{id:53,url: [53]}],
          button:[
            {title:'储值卡产品管理',id:53,url:[53]},
            {title:'会员发卡',id:54,url:[54]},
            {title:'会员充值',id:55,url:[55,56]},
            {title:'会员储值消费',id:57,url:[57]},
            {title:'储值消费记录',id:58,url:[58],flag:true},
          ],
          },
        ]
      }
    },
    methods: {
      goTop(){
        document.querySelector(".ivu-modal-body").scrollTop=0;
      },
      to(imgList, button,paging) {
        this.urlList = imgList[0].url;
        this.id = imgList[0].id;
        this.pagingList = paging;
        this.buttonList = button;
        this.showModal = true;
      }
    }
  }
</script>
<style>
  .description > .ivu-modal-wrap > .ivu-modal > .ivu-modal-content > .ivu-modal-body {
    top: 0;
  }
</style>
<style scoped lang="less">
  .button-box {
    margin: 0 auto;
    /*background: pink;*/
    img {
      border: none;
    }
    .child {
      float: left;
      height: 40px;
      position: relative;
      .box-1 {
        float: left;
        cursor:pointer;
        background: #404040;
        div {
          padding: 0 20px;
          display: table-cell;
          vertical-align: middle;
          height: 40px;
          text-align: center;
          color: white;
        }
      }
      .blue{
        background:#1890FF;
      }
      .box-2 {
        float: right;
      }
    }
    .mf{
      margin-right:10px;
    }
  }

  .main-body {
    min-width: 1000px;
    min-height: 500px;
    padding-top: -20px;
    width: 80%;
    height: 90%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    .box {
      width: 33%;
      padding: 20px;
      height: 30%;
      float: left;
      .small-box {
        background: green;
        cursor: pointer;
        height: 100%;
        position: relative;
        font-size: 18px;
        color: white;
        font-weight: 500;
        div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }
  }
</style>
