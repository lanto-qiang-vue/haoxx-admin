<template>
  <common-table v-model="tableData" class="mtable" :columns="columns" @changePageSize="changePageSize" @changePage="changePage"
                :total="total" :show="showTable" :page="page" :loading="loading" @sortChange="sortChange">
    <div slot="search">
      <div class="search-block">
        <Input placeholder="会员账号/话题" v-model="KEYWORD"></Input>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="value" :options="option" format="yyyy-MM-dd" placeholder="请选择发布时间"
                    style="width:100%;"
                    @on-change="onChange"></DatePicker>
      </div>
      <div class="search-block">
        <Select v-model="topicId" placeholder="请选择话题圈">
          <Option v-for="(item, index) in topicList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="stick" placeholder="请选择置顶状态">
          <Option v-for="(item, index) in stickList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <Select v-model="typeId" placeholder="请选择状态">
          <Option v-for="(item, index) in typeList"
                  :key="index" :value="item.id">{{item.name}}
          </Option>
        </Select>
      </div>
      <div class="search-block">
        <DatePicker type="daterange" :value="lastValue" :options="option" format="yyyy-MM-dd" placeholder="请选择最后评论/回复时间"
                    style="width:100%;"
                    @on-change="lastChange"></DatePicker>
      </div>
      <ButtonGroup size="small">
        <Button type="primary" @click="page=1;getList()">
          <Icon type="ios-search" size="24"/>
        </Button>
      </ButtonGroup>
    </div>
    <Modal
      v-model="stickModal"
      width="400px"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="false"
      :transition-names="['', '']"
      title="置顶设置"
    >
      <div>
        <Form>
          <Checkbox v-model="top">
            车生活首页置顶
          </Checkbox>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Checkbox v-model="hometop">
            话题圈内置顶
          </Checkbox>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="stickModal=false">取消</Button>
        <Button type="primary" @click="stickSubmit">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="showModal"
      class="table-modal-detail full-height tableOne"
      width="100"
      heigh="100"
      :mask-closable="false"
      :scrollable="true"
      :transfer="false"
      :footer-hide="true"
      :transition-names="['', '']">
      <modal-title slot="header" :title="title" @clickBack="showModal=false"></modal-title>
      <Form :label-width="140" class="form-3">
        <FormItem label="话题发布人:" prop="PLATE_NUM">
          <Input :value="detail.nickname" readonly></Input>
        </FormItem>
        <FormItem label="话题发布时间:" prop="PLATE_NUM">
          <Input :value="detail.createDate" readonly></Input>
        </FormItem>
        <div style="clear:both;"></div>
        <FormItem label="状态:" prop="PLATE_NUM">
          <Input :value="detail.isdelEq" readonly></Input>
        </FormItem>
        <FormItem label="话题评论数:" prop="PLATE_NUM">
          <Input :value="detail.number" readonly></Input>
        </FormItem>
        <div style="clear:both;"></div>
        <FormItem label="话题:" prop="PLATE_NUM" style="width:67%;">
          <div><b>{{detail.title}}</b>&nbsp;&nbsp;&nbsp;<Button :type="detail.isdelEq == '正常' ? 'error' : 'primary'"
                                                                @click="updateType(detail.isdelEq == '正常' ? '关闭' : '恢复',detail.id
          )">{{detail.isdelEq == '正常' ? '关闭' : '恢复'}}
          </Button>
            <Button @click="innerStick">置顶设置</Button>
          </div>
        </FormItem>
        <div style="clear:both;"></div>
        <FormItem prop="PLATE_NUM" style="width:67%;">
          <Input type="textarea" :value="detail.content" readonly></Input>
        </FormItem>
      </Form>
      <!--底部评论搜索-->
      <div>
        <div class="search-block">
          <Input placeholder="账号/昵称" v-model="keyWord"></Input>
        </div>
        <div class="search-block">
          <DatePicker type="daterange" :value="value2" :options="option" format="yyyy-MM-dd" placeholder="请选择时间"
                      style="width:100%;"
                      @on-change="onChange2"></DatePicker>
        </div>
        <ButtonGroup size="small">
          <Button type="primary" @click="page2=1;getComment()">
            <Icon type="ios-search" size="24"/>
          </Button>
        </ButtonGroup>
      </div>
      <!--底部评论列表-->
      <div style="height:20px;"></div>
      <div class="comment" v-for="item in comment" style="border-top:1px solid #e9e9e9;">
        <div style="height: 10px;"></div>
        <div class="title">
          <div class="f200">评论人:{{item.nickname}}</div>
          <div class="f250">评论时间:{{item.createDate}}</div>
          <div class="f250">点赞数:{{item.praise}}</div>
          <div style="clear:both;"></div>
          <div>评论内容: {{item.commentContent}}
          </div>
          <Button class="button" @click="del(item.id,1)">删除</Button>
        </div>
        <div class="content" v-for="a in item.replys">
          <div style="width:100%;">
            <div style="float:left;width:300px;">{{a.replyname}}->{{a.replytousername}}</div>
            <div style="float:left;">{{a.createDate}}</div>
          </div>
          <div style="clear:both;"></div>
          <div>
            回复内容:{{a.content}}
          </div>
          <Button class="button" @click="del(a.id,2)">删除</Button>
        </div>
        <div style="height: 10px;"></div>
        <!--<div style="border-bottom:1px dashed black;"></div>-->
      </div>
      <div class="table-bottom" style="line-height:40px;">
        <Page :current="page2" size="small" :page-size="25" show-sizer show-elevator show-total
              :page-size-opts="[25, 50, 100, 150]"
              placement="top" :total="total2" @on-change="changePage2" @on-page-size-change="changePageSize2"></Page>
        <Button size="small" class="refresh" @click="changePage2(page2)">
          <Icon type="md-refresh" size="20"/>
        </Button>
      </div>
    </Modal>
  </common-table>
</template>
<script>
  import commonTable from '@/hxx-components/common-table.vue'
  import ModalTitle from '@/hxx-components/modal-title.vue'

  export default {
    name: "topic-list",
    components: {commonTable, ModalTitle},
    data() {
      return {
        back:{
          hometop: false,
          top: false,
        },
        key:'lasttime',
        by:'desc',
        lastValue:["",""],
        hometop: false,
        top: false,
        id: 0,
        stickModal: false,
        rules: {},
        stickList: [
          {id: '请选择置顶状态', name: '请选择置顶状态'},
          {id: 1, name: '车生活首页置顶'},
          {id: 2, name: '话题圈内置顶'}
        ],
        stick: "请选择置顶状态",
        page2: 1,
        keyWord: '',
        total2: 0,
        limit2: 25,
        title: '话题详情',
        topicId: '请选择话题圈',
        typeId: '请选择状态',
        detail: {},
        comment: [],
        typeList: [
          {id: '请选择状态', name: '请选择状态'},
          {id: 1, name: '正常'},
          {id: 0, name: '已关闭'},
        ],
        topicList: [
          {id: '请选择话题圈', name: '请选择话题圈'},
        ],
        value: ["", ""],
        value2: ["", ""],
        tableData: [],
        circle: {},
        columns: [
          {
            title: '序号', width: 100,
            render: (h, params) => h('span', (this.page - 1) * this.limit + params.index + 1)
          },
          {
            title: '发布人', key: 'nickname', width: 240,
            render: (h, params) => {
              let name = "";
              if(params.row.nickname){
                name = params.row.username + "/" + params.row.nickname;
              }else{
                name = params.row.username;
              }
            return  h('a', {
                on: {
                  click: () => {
                    this.KEYWORD = "";
                    this.getList(params.row.username,this.key,this.by);
                  }
                }
              }, name)
            }
          },
          {title: '话题', key: 'title', minWidth: 300},
          {
            title: '话题圈', key: 'bbsTopicId', minWidth: 100,
            render: (h, params) => h('span', this.circle[params.row.bbsTopicId])
          },
          {title: '发布时间', key: 'createDate', width: 200,sortable: "custom"},
          {title:'最后评论/回复时间',key:'lasttime',width:200,sortable: "custom"},
          {title: '评论数', key: 'number', width: 150, sortable: "custom"},
          {title: '状态', key: 'isdelEq', width: 100},
          {title: '置顶状态', key: 'zd', width: 200},
          {
            title: '操作', key: 'E', width: 290,
            render: (h, params) => {
              let button = [];
              let buttonName = params.row.isdelEq == "正常" ? "关闭" : "恢复";
              button.push(h('Button', {
                type: 'primary', on: {
                  click: () => {
                    this.updateType(buttonName, params.row.id);
                  }
                }
              }, buttonName));
              button.push(h('Button', {
                style: {marginLeft: '10px'}, on: {
                  click: () => {
                    this.top = params.row.top == 1;
                    this.hometop = params.row.hometop == 1;
                    this.id = params.row.id;
                    this.stickModal = true;
                  }
                }
              }, '置顶设置'));
              button.push(h('Button', {
                type: 'primary', style: {marginLeft: '10px'}, on: {
                  click: () => {
                    this.id = params.row.id;
                    this.back.top = params.row.top == 1;
                    this.back.hometop = params.row.hometop == 1;
                    this.keyWord = "";
                    this.value2 = ["", ""];
                    this.getComment();
                    this.axios.request({
                      baseURL: this.baseUrl,
                      url: '/manage/contentmanage/selectContentDetail',
                      method: 'post',
                      params: {
                        access_token: this.$store.state.user.token,
                        id: params.row.id,
                      },
                    }).then(res => {
                      if (res.success) {
                        this.detail = res.data;
                        this.showModal = true;
                      }
                    })
                  }
                }
              }, '查看详情'));
              return h('div', button);
            }
          },
        ],
        showTable: false,
        loading: false,
        showModal: false,
        baseUrl: '/poxy-shqx/',
        total: 0,
        page: 1,
        limit: 25,
        KEYWORD: '',
        option: {
          disabledDate(date) {
            return date > new Date();
          }
        },
      }
    },
    mounted() {
      this.showTable = Math.random();
      this.getCircle();
    },
    methods: {
      innerStick(){
        this.top = this.back.top;
        this.hometop = this.back.hometop;
       this.stickModal = true;
      },
      stickSubmit() {
        this.$Modal.confirm({
          title: '系统提示!',
          content: '确认保存吗?',
          onOk: () => {
            this.axios.request({
              baseURL: this.baseUrl,
              url: '/manage/contentmanage/updateContentTop',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: this.id,
                top: this.top ? 1 : 0,
                hometop: this.hometop ? 1 : 0,
              },
            }).then(res => {
              if (res.success) {
                this.back.top = this.top;
                this.back.hometop = this.hometop;
                this.stickModal = false;
                this.getList();
              }
            })
          }
        })
      },
      zdToString(params) {
        //置顶转中文
        let str = [];
        if (params.top == 1) str.push("车生活首页置顶");
        if (params.hometop == 1) str.push("话题圈内置顶");
        return str.join(",");
      },
      sortChange(object) {
        this.key = object.key;
        this.by = object.order;
       this.getList("",this.key,this.by);
      },
      del(id, type) {
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认删除吗?',
          onOk: () => {
            this.axios.request({
              baseURL: this.baseUrl,
              url: 'manage/contentmanage/updateCommentsOrReply',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: id,
                type: type
              },
            }).then(res => {
              if (res.success) {
                this.$Message.success("删除成功");
                this.getComment();
              }
            })
          }
        });
      },
      updateType(buttonName, id) {
        this.$Modal.confirm({
          title: '系统提示',
          content: '确认' + buttonName + "吗?",
          onOk: () => {
            this.axios.request({
              baseURL: this.baseUrl,
              url: 'manage/contentmanage/updateContentState',
              method: 'post',
              data: {
                access_token: this.$store.state.user.token,
                id: id,
                isdel: buttonName == '关闭' ? 0 : 1,
              },
            }).then(res => {
              if (res.success) {
                this.getList();
                if (buttonName == '关闭') {
                  this.detail.isdelEq = "已关闭";
                } else {
                  this.detail.isdelEq = "正常";
                }
                this.$Message.success("已" + buttonName);
              }
            })
          }
        });
      },
      getComment() {
        this.axios.request({
          baseURL: this.baseUrl,
          url: 'manage/contentmanage/selectCommentsFuzzy',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            id: this.id,
            limit: this.limit2,
            page: this.page2,
            keyWord: this.keyWord,
            startTime: this.value2[0] == "" ? "" : this.value2[0] + " 00:00:00",
            endTime: this.value2[1] == "" ? "" : this.value2[1] + " 23:59:59",
          },
        }).then(res => {
          this.total2 = res.total;
          this.comment = res.data;
        })
      },
      getCircle() {
        this.axios.request({
          baseURL: this.baseUrl,
          url: 'manage/topicmanage/getTopicList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            keyWord: "",
            limit: 100,
            page: 1,
            state: "",
          },
        }).then(res => {
          if (res.success) {
            let data = res.data;
            for (let i in data) {
              this.topicList.push({id: data[i].id, name: data[i].content});
              this.circle[data[i].id] = data[i].content;
            }
            this.getList();
          }
        })
      },
      getList(account = "",key = 'lasttime',by = 'desc') {
        let top = '';
        let hometop = '';
        if(this.stick != '请选择置顶状态'){
          switch (this.stick) {
            case 1:
              top = 1;
              break;
            case 2:
               hometop = 1;
              break;
          }
        }
        this.loading = true;
        this.list = "";
        this.axios.request({
          baseURL: this.baseUrl,
          url: 'manage/contentmanage/selectContentManageList',
          method: 'post',
          data: {
            access_token: this.$store.state.user.token,
            keyWord: account ? account : this.KEYWORD,
            limit: this.limit,
            page: this.page,
            bbsTopicId: this.topicId == '请选择话题圈' ? "" : this.topicId,
            isdel: this.typeId == '请选择状态' ? "" : this.typeId,
            startTime: this.value[0] == "" ? "" : this.value[0] + " 00:00:00",
            endTime: this.value[1] == "" ? "" : this.value[1] + " 23:59:59",
            top:top,
            hometop:hometop,
            sDate:this.lastValue[0] ? this.lastValue[0] + " 00:00:00" : '',
            eDate:this.lastValue[1] ? this.lastValue[1] + " 23:59:59" : '',
            sort:by,
            sortField:key,
          },
        }).then(res => {
          if (res.success) {
            this.total = res.total;
            let data = res.data;
            for (let i in data) {
              data[i]['zd'] = this.zdToString(data[i]) || "无";
            }
            this.tableData = data;
            this.loading = false;
          }
        })
      },
      onChange(val) {
        this.value = val;
      },
      lastChange(val){
        this.lastValue = val;
      },
      onChange2(val) {
        this.value2 = val;
      },
      changePageSize(size) {
        this.limit = size;
        if (this.page == 1) this.getList();
      },
      changePage(page) {
        this.page = page;
        this.getList();
      },
      changePage2(page) {
        this.page2 = page;
        this.getComment();
      },
      changePageSize2(size) {
        this.limit2 = size;
        this.getComment();
      },
    }
  }
</script>
<style lang="less">
  .tableOne .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body {
    height: ~"calc(100% - 45px)";
  }
  .common-table .main-table .ivu-table-cell .ivu-table-sort{
    display: inline-block;
  }
</style>
<style lang="less" scoped>
  .f200 {
    float: left;
    width: 200px;
  }

  .f250 {
    float: left;
    width: 250px;
  }

  .comment {
    font-size: 14px;
    line-height: 30px;
    .title {
      width: 100%;
      padding-right: 200px;
      position: relative;
    }
    .button {
      position: absolute;
      top: 50%;
      right: 100px;
      transform: translateY(-50%)
    }
    .content {
      width: 100%;
      padding-right: 200px;
      padding-left: 60px;
      position: relative;
      .button {
        position: absolute;
        top: 50%;
        right: 100px;
        transform: translateY(-50%)
      }
    }
  }

  .form-3 {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .form-3 .ivu-form-item {
    width: 33%;
    display: inline-block;
    margin-bottom: 15px;
  }

  .form-3 .ivu-btn {
    margin-right: 10px;
  }

  .tag .ivu-btn {
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
